import { redisClient, Worker } from "@better-uptime/queues";

/**
 * Alert Service
 *
 * Sends alerts on monitor state transitions.
 * Supports: Email, Slack, Webhook
 * Features: Deduplication, rate limiting
 */

interface AlertEvent {
	monitorId: string;
	userId: string;
	monitorName: string;
	monitorUrl: string;
	status: "UP" | "DOWN";
	timestamp: number;
	reason: string;
}

const ALERT_DEDUP_KEY_PREFIX = "alert:dedup:";
const ALERT_RATE_LIMIT_KEY_PREFIX = "alert:ratelimit:";
const RATE_LIMIT_WINDOW_SEC = 300; // 5 minutes
const RATE_LIMIT_MAX_ALERTS = 5; // Max 5 alerts per window per monitor

/**
 * Check if alert should be rate limited
 */
async function isRateLimited(monitorId: string): Promise<boolean> {
	const key = `${ALERT_RATE_LIMIT_KEY_PREFIX}${monitorId}`;
	const count = await redisClient.incr(key);
	await redisClient.expire(key, RATE_LIMIT_WINDOW_SEC);

	return count > RATE_LIMIT_MAX_ALERTS;
}

/**
 * Check if alert is duplicate (same state transition within short window)
 */
async function isDuplicate(
	monitorId: string,
	status: "UP" | "DOWN",
): Promise<boolean> {
	const key = `${ALERT_DEDUP_KEY_PREFIX}${monitorId}:${status}`;
	const exists = await redisClient.exists(key);
	if (exists) {
		return true;
	}
	// Set dedup key with 60 second expiry
	await redisClient.set(key, "1", "EX", 60);
	return false;
}

/**
 * Send email alert (placeholder - integrate with email service)
 */
async function sendEmailAlert(event: AlertEvent): Promise<void> {
	// TODO: Integrate with email service (SendGrid, AWS SES, etc.)
	console.log(`[EMAIL] Monitor ${event.monitorName} is ${event.status}`);
	console.log(`  URL: ${event.monitorUrl}`);
	console.log(`  Reason: ${event.reason}`);
	console.log(`  User: ${event.userId}`);
}

/**
 * Send Slack alert (placeholder - integrate with Slack API)
 */
async function sendSlackAlert(event: AlertEvent): Promise<void> {
	// TODO: Integrate with Slack webhook API
	console.log(`[SLACK] Monitor ${event.monitorName} is ${event.status}`);
	console.log(`  URL: ${event.monitorUrl}`);
	console.log(`  Reason: ${event.reason}`);
}

/**
 * Send webhook alert
 */
async function sendWebhookAlert(
	event: AlertEvent,
	webhookUrl: string,
): Promise<void> {
	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				monitorId: event.monitorId,
				monitorName: event.monitorName,
				monitorUrl: event.monitorUrl,
				status: event.status,
				timestamp: event.timestamp,
				reason: event.reason,
			}),
		});

		if (!response.ok) {
			throw new Error(`Webhook returned ${response.status}`);
		}
	} catch (error) {
		console.error("Failed to send webhook alert:", error);
		throw error;
	}
}

/**
 * Send alert through all configured channels
 */
async function sendAlert(event: AlertEvent): Promise<void> {
	// Check rate limiting
	if (await isRateLimited(event.monitorId)) {
		console.warn(
			`Alert rate limited for monitor ${event.monitorId} - skipping alert`,
		);
		return;
	}

	// Check deduplication
	if (await isDuplicate(event.monitorId, event.status)) {
		console.log(
			`Duplicate alert detected for monitor ${event.monitorId} - skipping`,
		);
		return;
	}

	console.log(`Sending alert for monitor ${event.monitorId}: ${event.status}`);

	// Send through all channels (in parallel)
	const promises: Promise<void>[] = [];

	// Email alerts (if configured)
	if (process.env.ENABLE_EMAIL_ALERTS === "true") {
		promises.push(sendEmailAlert(event));
	}

	// Slack alerts (if configured)
	if (process.env.SLACK_WEBHOOK_URL) {
		promises.push(sendSlackAlert(event));
	}

	// Webhook alerts (if configured)
	if (process.env.WEBHOOK_URL) {
		promises.push(sendWebhookAlert(event, process.env.WEBHOOK_URL));
	}

	// Wait for all alerts to be sent
	await Promise.allSettled(promises);

	console.log(`Alert sent for monitor ${event.monitorId}`);
}

/**
 * Alert Worker
 */
const worker = new Worker(
	"alerts",
	async (job) => {
		const event = job.data as AlertEvent;
		await sendAlert(event);
	},
	{
		connection: redisClient,
		concurrency: 10, // Process up to 10 alerts concurrently
		// attempts: 3, // Retry up to 3 times
		// backoff: {
		// 	type: "exponential",
		// 	delay: 2000,
		// },
	},
);

worker.on("completed", (job) => {
	console.log(`Alert job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
	console.error(`Alert job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
	console.error("Alert worker error:", err);
});

console.log("Alert service worker started");
