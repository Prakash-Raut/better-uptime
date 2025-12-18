import dotenv from "dotenv";

dotenv.config({
	path: "../../apps/server/.env",
});

import { db, eq, region } from "@better-uptime/db";
import { checkResultsQueue, redisClient, Worker } from "@better-uptime/queues";
import type { CheckJob, CheckResult } from "@better-uptime/shared-types";
import { executeCheck } from "./utils";

/**
 * Checker Service Worker
 *
 * Executes HTTP checks for monitors and emits results to the evaluator.
 * Stateless - no retries, hard timeouts.
 */
const worker = new Worker(
	"monitor-check",
	async (job) => {
		const jobData = job.data as CheckJob;
		const { monitorId, url, region: regionCode, scheduledFor } = jobData;

		console.log(`Checking monitor ${monitorId} from region ${regionCode}`);

		// Execute the check
		const checkResult = await executeCheck(url, regionCode);

		// Get region ID from DB
		const [regionRecord] = await db
			.select()
			.from(region)
			.where(eq(region.code, regionCode))
			.limit(1);

		if (!regionRecord) {
			throw new Error(`Region ${regionCode} not found`);
		}

		// Create full check result
		const result: CheckResult = {
			monitorId,
			region: regionCode,
			status: checkResult.status,
			responseTimeMs: checkResult.responseTimeMs,
			statusCode: checkResult.statusCode,
			errorMessage: checkResult.errorMessage,
			timestamp: scheduledFor || Math.floor(Date.now() / 1000),
		};

		// Buffer tick for bulk insert
		await redisClient.lpush(
			"status-buffer",
			JSON.stringify({
				monitorId,
				regionId: regionRecord.id,
				status: checkResult.status === "UP" ? "up" : "down",
				responseTime: checkResult.responseTimeMs,
				errorMessage: checkResult.errorMessage,
			}),
		);

		// Emit result to evaluator queue
		await checkResultsQueue.add("evaluateResult", result, {
			jobId: `${monitorId}:${regionCode}:${result.timestamp}`, // Idempotency
		});

		console.log(
			`Monitor ${monitorId} check completed: ${checkResult.status} (${checkResult.responseTimeMs}ms)`,
		);
	},
	{
		connection: redisClient,
		concurrency: 50, // Process up to 50 checks concurrently
	},
);

worker.on("completed", (job) => {
	console.log(`Check job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
	console.error(`Check job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
	console.error("Worker error:", err);
});

console.log("Checker service worker started");
