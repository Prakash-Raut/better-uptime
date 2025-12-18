import { db, eq, inArray, monitor, region } from "@better-uptime/db";
import { monitorCheckQueue, redisClient, Worker } from "@better-uptime/queues";
import type { CheckJob } from "@better-uptime/shared-types";

/**
 * Scheduler Service
 *
 * Uses Redis sorted sets (ZSET) for efficient time-bucket scheduling.
 * Each second bucket contains monitor IDs that need to be checked.
 *
 * Key: `scheduler:bucket:{timestamp}` where timestamp is Unix seconds
 * Value: Set of monitor IDs
 *
 * Algorithm:
 * 1. Every second, check the current bucket
 * 2. For each monitor in the bucket, enqueue check jobs for all regions
 * 3. Schedule the next check based on monitor.intervalSec
 */

const SCHEDULER_KEY_PREFIX = "scheduler:bucket:";
const SCHEDULER_LOCK_KEY = "scheduler:lock";
const TICK_INTERVAL_MS = 1000; // 1 second

/**
 * Get the bucket key for a given timestamp (in seconds)
 */
function getBucketKey(timestamp: number): string {
	return `${SCHEDULER_KEY_PREFIX}${timestamp}`;
}

/**
 * Schedule a monitor for checking at a specific timestamp
 */
async function scheduleMonitor(
	monitorId: string,
	timestamp: number,
): Promise<void> {
	const key = getBucketKey(timestamp);
	// Use SET to store monitor IDs for this timestamp bucket
	await redisClient.sadd(key, monitorId);
	// Set expiry on the key (cleanup old buckets)
	await redisClient.expire(key, 3600); // 1 hour expiry
}

/**
 * Get all monitors scheduled for a specific timestamp
 */
async function getScheduledMonitors(timestamp: number): Promise<string[]> {
	const key = getBucketKey(timestamp);
	// Get all members from the set
	const members = await redisClient.smembers(key);
	// Clean up the bucket after reading
	await redisClient.del(key);
	return members;
}

/**
 * Load monitor configuration from DB
 */
async function loadMonitor(monitorId: string) {
	const [mon] = await db
		.select()
		.from(monitor)
		.where(eq(monitor.id, monitorId))
		.limit(1);
	return mon;
}

/**
 * Enqueue check jobs for a monitor across all its regions
 */
async function enqueueCheckJobs(
	mon: typeof monitor.$inferSelect,
): Promise<void> {
	if (!mon.enabled) {
		return;
	}

	// Load regions from DB
	const regions = await db
		.select()
		.from(region)
		.where(inArray(region.code, mon.regions as string[]));

	if (regions.length === 0) {
		console.warn(`Monitor ${mon.id} has no valid regions configured`);
		return;
	}

	const now = Math.floor(Date.now() / 1000);

	// Enqueue check job for each region
	for (const reg of regions) {
		const job: CheckJob = {
			monitorId: mon.id,
			url: mon.url,
			region: reg.code,
			scheduledFor: now,
		};

		await monitorCheckQueue.add("checkMonitor", job, {
			jobId: `${mon.id}:${reg.code}:${now}`, // Ensure idempotency
		});
	}

	// Schedule next check
	const nextCheckTime = now + mon.intervalSec;
	await scheduleMonitor(mon.id, nextCheckTime);
}

/**
 * Process a scheduling tick
 */
async function processTick(timestamp: number): Promise<void> {
	// Acquire lock to prevent concurrent processing
	const lockAcquired = await redisClient.set(
		SCHEDULER_LOCK_KEY,
		"1",
		"EX",
		5, // 5 second expiry
		"NX",
	);

	if (!lockAcquired) {
		console.log(`Tick ${timestamp} skipped - another scheduler is processing`);
		return;
	}

	try {
		const monitorIds = await getScheduledMonitors(timestamp);

		if (monitorIds.length === 0) {
			return;
		}

		console.log(
			`Processing ${monitorIds.length} monitors for tick ${timestamp}`,
		);

		// Load monitors and enqueue jobs
		const monitors = await db
			.select()
			.from(monitor)
			.where(inArray(monitor.id, monitorIds));

		await Promise.all(monitors.map((mon) => enqueueCheckJobs(mon)));
	} finally {
		// Release lock
		await redisClient.del(SCHEDULER_LOCK_KEY);
	}
}

/**
 * Initialize scheduler by loading all enabled monitors
 */
async function initializeScheduler(): Promise<void> {
	console.log("Initializing scheduler...");

	const enabledMonitors = await db
		.select()
		.from(monitor)
		.where(eq(monitor.enabled, true));

	const now = Math.floor(Date.now() / 1000);

	for (const mon of enabledMonitors) {
		// Schedule immediate check
		await scheduleMonitor(mon.id, now);
	}

	console.log(
		`Scheduled ${enabledMonitors.length} monitors for initialization`,
	);
}

/**
 * Handle monitor lifecycle events
 */
const eventWorker = new Worker(
	"monitor-events",
	async (job) => {
		const { event, monitorId } = job.data;

		console.log(`Processing monitor event: ${event} for monitor ${monitorId}`);

		if (event === "created" || event === "updated") {
			const mon = await loadMonitor(monitorId);
			if (mon && mon.enabled) {
				const now = Math.floor(Date.now() / 1000);
				await scheduleMonitor(mon.id, now);
			}
		} else if (event === "deleted") {
			// Remove from all future buckets
			// Note: This is a best-effort cleanup. Old buckets will expire naturally.
			const pattern = `${SCHEDULER_KEY_PREFIX}*`;
			const keys = await redisClient.keys(pattern);
			for (const key of keys) {
				await redisClient.srem(key, monitorId);
			}
		}
	},
	{ connection: redisClient },
);

eventWorker.on("completed", (job) => {
	console.log(`Monitor event ${job.id} completed`);
});

eventWorker.on("failed", (job, err) => {
	console.error(`Monitor event ${job?.id} failed:`, err);
});

// Start scheduler tick loop
async function startScheduler(): Promise<void> {
	await initializeScheduler();

	setInterval(async () => {
		const timestamp = Math.floor(Date.now() / 1000);
		try {
			await processTick(timestamp);
		} catch (error) {
			console.error(`Error processing tick ${timestamp}:`, error);
		}
	}, TICK_INTERVAL_MS);

	console.log("Scheduler started - processing ticks every second");
}

// Start the scheduler
startScheduler().catch((error) => {
	console.error("Failed to start scheduler:", error);
	process.exit(1);
});
