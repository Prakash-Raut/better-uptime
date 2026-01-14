import { db, eq, monitor, region, tick } from "@better-uptime/db";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "better-uptime" });

const scheduler = inngest.createFunction(
	{ id: "scheduler" },
	{ cron: "*/5 * * * *" }, // every 5 minutes
	async () => {
		const monitors = await db
			.select()
			.from(monitor)
			.where(eq(monitor.enabled, true));

		await Promise.all(
			monitors.map((m) =>
				inngest.send({
					name: "monitor.check.requested",
					data: {
						monitorId: m.id,
						url: m.url,
						userId: m.userId,
					},
				}),
			),
		);

		return { scheduled: monitors.length };
	},
);

const checker = inngest.createFunction(
	{
		id: "monitor-checker",
		concurrency: 5, // control load
		retries: 3, // auto retry
	},
	{ event: "monitor.check.requested" },
	async ({ event, step }) => {
		const { monitorId, url, userId } = event.data;

		const regions = await db.select().from(region);

		const start = Date.now();

		let status = "down";
		let errorMessage: any;

		try {
			const res = await step.fetch(url);
			status = res.ok ? "up" : "down";
		} catch (err) {
			errorMessage = err.message;
		}

		const responseTime = Date.now() - start;

		await Promise.all(
			regions.map((r) =>
				inngest.send({
					name: "monitor.check.completed",
					data: {
						monitorId,
						userId,
						status,
						responseTime,
						errorMessage,
						regionId: r.id,
					},
				}),
			),
		);

		return { checked: regions.length };
	},
);

const recordTicks = inngest.createFunction(
	{
		id: "record-ticks",
		batchEvents: {
			maxSize: 5,
			timeout: "5s",
			key: "event.data.userId",
		},
	},
	{ event: "monitor.check.completed" },
	async ({ events, step }) => {
		const rows = events.map((evt) => ({
			monitorId: evt.data.monitorId,
			user_id: evt.data.userId,
			status: evt.data.status,
			responseTime: evt.data.responseTime,
			errorMessage: evt.data.errorMessage,
			regionId: evt.data.regionId,
		}));

		await step.run("insert-ticks", async () => {
			return db.insert(tick).values(rows);
		});

		return { inserted: rows.length };
	},
);

export const functions = [scheduler, checker, recordTicks];
