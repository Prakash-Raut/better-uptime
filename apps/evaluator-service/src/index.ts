import { db, eq, monitor } from "@better-uptime/db";
import { alertQueue, redisClient, Worker } from "@better-uptime/queues";
import type {
	CheckResult,
	MonitorState,
	StateTransition,
} from "@better-uptime/shared-types";

/**
 * Evaluator Service
 *
 * Evaluates check results and determines monitor state transitions.
 * Maintains monitor state in Redis and triggers alerts on state changes.
 *
 * State Evaluation Logic (v1):
 * - Monitor marked DOWN if: ≥ N consecutive failures OR majority regions fail
 * - Monitor marked UP after recovery threshold
 *
 * State stored in Redis: `monitor:state:{monitorId}`
 */

const STATE_KEY_PREFIX = "monitor:state:";
const CONSECUTIVE_FAILURE_THRESHOLD = 2; // Mark DOWN after 2 consecutive failures
const RECOVERY_THRESHOLD = 1; // Mark UP after 1 successful check
const MAJORITY_THRESHOLD = 0.5; // If >50% regions fail, mark DOWN

/**
 * Get monitor state from Redis
 */
async function getMonitorState(
	monitorId: string,
): Promise<MonitorState | null> {
	const key = `${STATE_KEY_PREFIX}${monitorId}`;
	const data = await redisClient.get(key);
	if (!data) {
		return null;
	}
	return JSON.parse(data) as MonitorState;
}

/**
 * Set monitor state in Redis
 */
async function setMonitorState(state: MonitorState): Promise<void> {
	const key = `${STATE_KEY_PREFIX}${state.monitorId}`;
	await redisClient.set(key, JSON.stringify(state), "EX", 86400 * 7); // 7 days expiry
}

/**
 * Initialize monitor state if it doesn't exist
 */
async function initializeMonitorState(
	monitorId: string,
): Promise<MonitorState> {
	const now = Math.floor(Date.now() / 1000);
	const state: MonitorState = {
		monitorId,
		currentStatus: "UP",
		consecutiveFailures: 0,
		lastCheckedAt: now,
		lastStateChangeAt: now,
	};
	await setMonitorState(state);
	return state;
}

/**
 * Get recent check results for a monitor (from Redis buffer or DB)
 * For v1, we'll use a simple approach: track recent results in Redis
 */
async function getRecentResults(
	monitorId: string,
	region: string,
	limit = 10,
): Promise<CheckResult[]> {
	const key = `monitor:results:${monitorId}:${region}`;
	const data = await redisClient.lrange(key, 0, limit - 1);
	return data.map((d) => JSON.parse(d) as CheckResult);
}

/**
 * Store check result in Redis for recent history
 */
async function storeRecentResult(result: CheckResult): Promise<void> {
	const key = `monitor:results:${result.monitorId}:${result.region}`;
	await redisClient.lpush(key, JSON.stringify(result));
	await redisClient.ltrim(key, 0, 9); // Keep only last 10 results
	await redisClient.expire(key, 3600); // 1 hour expiry
}

/**
 * Evaluate check result and determine if state transition is needed
 */
async function evaluateCheckResult(
	result: CheckResult,
): Promise<StateTransition | null> {
	let state = await getMonitorState(result.monitorId);

	if (!state) {
		state = await initializeMonitorState(result.monitorId);
	}

	// Store recent result
	await storeRecentResult(result);

	const previousStatus = state.currentStatus;
	let newStatus: "UP" | "DOWN" = state.currentStatus;
	let reason = "";

	// Update consecutive failures counter
	if (result.status === "DOWN") {
		state.consecutiveFailures += 1;
	} else {
		state.consecutiveFailures = 0;
	}

	// Evaluate DOWN condition
	if (result.status === "DOWN") {
		if (state.consecutiveFailures >= CONSECUTIVE_FAILURE_THRESHOLD) {
			if (state.currentStatus === "UP") {
				newStatus = "DOWN";
				reason = `Consecutive failures threshold reached (${state.consecutiveFailures})`;
			}
		}
	}

	// Evaluate UP condition (recovery)
	if (result.status === "UP") {
		if (state.currentStatus === "DOWN" && state.consecutiveFailures === 0) {
			// Check if we've had at least one successful check
			const recentResults = await getRecentResults(
				result.monitorId,
				result.region,
				3,
			);
			const recentSuccesses = recentResults.filter(
				(r) => r.status === "UP",
			).length;

			if (recentSuccesses >= RECOVERY_THRESHOLD) {
				newStatus = "UP";
				reason = "Monitor recovered";
			}
		}
	}

	// Update state
	state.lastCheckedAt = result.timestamp;
	if (newStatus !== previousStatus) {
		state.currentStatus = newStatus;
		state.lastStateChangeAt = result.timestamp;
		state.consecutiveFailures =
			newStatus === "UP" ? 0 : state.consecutiveFailures;

		await setMonitorState(state);

		// Return state transition
		return {
			monitorId: result.monitorId,
			fromStatus: previousStatus,
			toStatus: newStatus,
			timestamp: result.timestamp,
			reason,
		};
	}
	// No transition, but update state
	await setMonitorState(state);
	return null;
}

/**
 * Evaluator Worker
 */
const worker = new Worker(
	"check-results",
	async (job) => {
		const result = job.data as CheckResult;

		console.log(
			`Evaluating check result for monitor ${result.monitorId} from region ${result.region}: ${result.status}`,
		);

		const transition = await evaluateCheckResult(result);

		if (transition) {
			console.log(
				`State transition detected: ${transition.monitorId} ${transition.fromStatus} -> ${transition.toStatus}`,
			);

			// Load monitor to get user info
			const [mon] = await db
				.select()
				.from(monitor)
				.where(eq(monitor.id, transition.monitorId))
				.limit(1);

			if (!mon) {
				console.warn(`Monitor ${transition.monitorId} not found`);
				return;
			}

			// Emit alert event
			await alertQueue.add(
				"sendAlert",
				{
					monitorId: transition.monitorId,
					userId: mon.userId,
					monitorName: mon.name,
					monitorUrl: mon.url,
					status: transition.toStatus,
					timestamp: transition.timestamp,
					reason: transition.reason,
				},
				{
					jobId: `alert:${transition.monitorId}:${transition.timestamp}`, // Idempotency
				},
			);
		}
	},
	{
		connection: redisClient,
		concurrency: 20, // Process up to 20 evaluations concurrently
	},
);

worker.on("completed", (job) => {
	console.log(`Evaluation job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
	console.error(`Evaluation job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
	console.error("Evaluator worker error:", err);
});

console.log("Evaluator service worker started");
