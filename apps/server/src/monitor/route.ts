import { and, count, db, desc, eq, ilike, monitor } from "@better-uptime/db";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { authGuard } from "@/middlewares/authGuard";
import type { AppContext } from "@/types";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	url: z.url("Please enter a valid URL"),
	frequency: z
		.number()
		.positive()
		.min(30, "Frequency must be at least 30 seconds")
		.default(60),
});

const querySchema = z.object({
	page: z.string().min(1, "Page must be at least 1").default("1"),
	pageSize: z.string().min(1, "Page size must be at least 1").default("10"),
	search: z.string().default(""),
});

const monitorRoutes = new Hono<AppContext>();

monitorRoutes.use("*", authGuard);

monitorRoutes.post(
	"/",
	validator("json", (value, ctx) => {
		const parsed = schema.safeParse(value);
		if (!parsed.success) {
			return ctx.text(parsed.error.message, 400);
		}
		return parsed.data;
	}),
	async (ctx) => {
		const user = ctx.get("user");

		if (!user) {
			return ctx.json({ error: "Unauthorized" }, 401);
		}

		const { name, url, frequency } = ctx.req.valid("json");

		const [createdMonitor] = await db
			.insert(monitor)
			.values({
				name,
				url,
				frequency,
				userId: user.id,
			})
			.returning();

		return ctx.json(createdMonitor, 201);
	},
);

monitorRoutes.get(
	"/",
	validator("query", (value, ctx) => {
		const parsed = querySchema.safeParse(value);
		if (!parsed.success) {
			return ctx.text(parsed.error.message, 400);
		}
		return parsed.data;
	}),
	async (ctx) => {
		const user = ctx.get("user");

		if (!user) {
			return ctx.json({ error: "Unauthorized" }, 401);
		}

		const { page, pageSize, search } = ctx.req.valid("query");

		const [items, totalCount] = await Promise.all([
			db
				.select()
				.from(monitor)
				.where(
					and(eq(monitor.userId, user.id), ilike(monitor.name, `%${search}%`)),
				)
				.limit(Number(pageSize))
				.offset((Number(page) - 1) * Number(pageSize))
				.orderBy(desc(monitor.updatedAt))
				.execute(),

			db
				.select({ count: count() })
				.from(monitor)
				.where(
					and(eq(monitor.userId, user.id), ilike(monitor.name, `%${search}%`)),
				)
				.execute(),
		]);

		const parsedTotalCount = Number(totalCount[0]?.count ?? 0);

		const totalPages = Math.ceil(parsedTotalCount / Number(pageSize));
		const hasNextPage = Number(page) < totalPages;
		const hasPreviousPage = Number(page) > 1;

		return ctx.json({
			items,
			page,
			pageSize,
			totalCount: parsedTotalCount,
			totalPages,
			hasNextPage,
			hasPreviousPage,
		});
	},
);

export { monitorRoutes };
