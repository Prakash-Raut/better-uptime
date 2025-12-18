import { db, tick } from "@better-uptime/db";
import { redisClient, Worker } from "@better-uptime/queues";

const worker = new Worker(
	"status-update",
	async () => {
		console.log("Running bulk flush…");

		// Read all buffered status results
		const items = await redisClient.lrange("status-buffer", 0, -1);

		if (items.length === 0) {
			console.log("No items to flush");
			return;
		}

		const parsed = items.map((i) => JSON.parse(i));

		// bulk insert into DB
		await db.insert(tick).values(parsed);

		// clear the buffer
		await redisClient.del("status-buffer");

		console.log(`Flushed ${items.length} items`);
	},
	{ connection: redisClient },
);

worker.on("ready", () => console.log("Bulk writer ready!"));
worker.on("completed", (job) => console.log(`${job.id} completed`));
worker.on("failed", (job, err) => console.log(`Failed job ${job?.id}: ${err}`));
