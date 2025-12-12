import { db, tick } from "@better-uptime/db";
import { redisClient, Worker } from "@better-uptime/queues";
import { pingFromRegion } from "./utils";

const worker = new Worker(
	"monitor-check",
	async (job) => {
		console.log("Job data", job.data);

		const { monitorId, monitorUrl, regionId } = job.data;

		const status = await pingFromRegion(monitorUrl);

		console.log(`Monitor ${monitorId} is ${status} in region ${regionId}`);

		db.insert(tick).values({
			monitorId,
			regionId,
			status,
		});

		await redisClient.lpush(
			"status-buffer",
			JSON.stringify({
				monitorId,
				regionId,
				status,
			}),
		);
	},
	{ connection: redisClient },
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});
