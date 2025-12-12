import { db, region } from "@better-uptime/db";
import { monitorCheckQueue, redisClient, Worker } from "@better-uptime/queues";

const worker = new Worker(
	"monitor-events",
	async (job) => {
		console.log("Job data", job.data);

		// load available regions from DB
		const regions = await db.select().from(region);

		// add a job to check the monitor for each region
		for (const region of regions) {
			console.log(
				"Adding job to check monitor for region",
				region.id,
				job.data.monitorId,
				job.data.monitorUrl,
			);
			monitorCheckQueue.add(
				"checkMonitor",
				{
					regionId: region.id,
					monitorId: job.data.monitorId,
					monitorUrl: job.data.monitorUrl,
				},
				{ repeat: { every: 60_000 } }, // 1 minutes
			);
		}
	},
	{ connection: redisClient },
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});
