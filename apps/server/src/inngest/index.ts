import { and, db, eq, monitor, type TickInsert, tick } from "@better-uptime/db";
import { xAckBulk, xAddBulk, xReadGroup } from "@better-uptime/queues";
import { Inngest, type InngestFunction } from "inngest";

export const inngest = new Inngest({ id: "better-uptime" });

const scheduler = inngest.createFunction(
	{ id: "scheduler" },
	{ cron: "*/5 * * * *" }, // Run every 5 minute
	async () => {
		console.log("Scheduler function called");

		const monitors = await db
			.select()
			.from(monitor)
			.where(and(eq(monitor.enabled, true)));

		const streamPayload = monitors.map((m) => ({
			monitorId: m.id,
			url: m.url,
		}));

		await xAddBulk(streamPayload);

		return { scheduled: monitors.length };
	},
);

const checker = inngest.createFunction(
	{ id: "monitor-checker" },
	{ event: "monitor.check" },
	async ({ step }) => {
		console.log("Checker function called");

		const groupName = "monitor-group";
		const consumerName = "us-east";

		const messageIds: string[] = [];
		const urls: string[] = [];

		const res: any = await xReadGroup(groupName, consumerName);

		if (res) {
			const [, messages] = res[0];

			for (const [id, fields] of messages) {
				// fields = ["https://www.google.com", "something"]
				const url = fields[0]; // first element is URL
				urls.push(url);
				messageIds.push(id);
			}
		}

		console.log("urls", urls);
		console.log("messageIds", messageIds);

		const startTime = Date.now();
		const responses = await Promise.all(
			urls.map(async (url) => {
				return step.fetch(url);
			}),
		);

		const statuses = await Promise.all(responses.map((res) => res.status));
		const endTime = Date.now();
		const responseTime = endTime - startTime;

		const monitorStatusMap = new Map<string, number>();
		for (let i = 0; i < urls.length; i++) {
			monitorStatusMap.set(urls[i]!, statuses[i]!);
		}

		const ticks: TickInsert[] = [
			{
				status: "up",
				responseTime: responseTime,
				monitorId: "f9ab4be9-ce1f-47e1-ba59-908b2b7ec86d",
				regionId: "09cce0be-ee8f-4118-b5e2-8484864996e9",
			},
		];

		await db.insert(tick).values(ticks);
		console.log("Ticks inserted successfully", ticks);

		xAckBulk(groupName, messageIds);
		console.log("Messages acknowledged successfully", messageIds);
	},
);

export const functions: InngestFunction<any, any, any, any, any, any>[] = [
	scheduler,
	checker,
];
