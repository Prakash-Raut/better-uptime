import { authGuard } from "@/middlewares/authGuard";
import type { AppContext } from "@/types";
import {
	and,
	count,
	db,
	desc,
	eq,
	ilike,
	monitor,
	tick,
} from "@better-uptime/db";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	url: z.url("Please enter a valid URL"),
	enabled: z.boolean().default(true),
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

		const { name, url, enabled } = ctx.req.valid("json");

		const [createdMonitor] = await db
			.insert(monitor)
			.values({
				name,
				url,
				intervalSec: 300,
				enabled,
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

monitorRoutes.get("/:id", async (ctx) => {
	const user = ctx.get("user");
	const id = ctx.req.param("id");

	if (!id) {
		return ctx.json({ error: "Monitor ID is required" }, 400);
	}

	if (!user) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	const [singleMonitor] = await db
		.select({
			monitor: monitor,
			tick: tick,
		})
		.from(monitor)
		.leftJoin(tick, eq(monitor.id, tick.monitorId))
		.where(and(eq(monitor.id, id), eq(monitor.userId, user.id)))
		.execute();

	if (!singleMonitor) {
		return ctx.json({ error: "Monitor not found" }, 404);
	}

	return ctx.json(singleMonitor, 200);
});

monitorRoutes.put(
	"/:id",
	validator("json", (value, ctx) => {
		const parsed = schema.partial().safeParse(value);
		if (!parsed.success) {
			return ctx.text(parsed.error.message, 400);
		}
		return parsed.data;
	}),
	async (ctx) => {
		const user = ctx.get("user");
		const id = ctx.req.param("id");

		if (!id) {
			return ctx.json({ error: "Monitor ID is required" }, 400);
		}

		if (!user) {
			return ctx.json({ error: "Unauthorized" }, 401);
		}

		const updateData = ctx.req.valid("json");

		// Verify monitor belongs to user
		const [existing] = await db
			.select()
			.from(monitor)
			.where(and(eq(monitor.id, id), eq(monitor.userId, user.id)))
			.limit(1);

		if (!existing) {
			return ctx.json({ error: "Monitor not found" }, 404);
		}

		const [updatedMonitor] = await db
			.update(monitor)
			.set({
				...updateData,
				updatedAt: new Date(),
			})
			.where(eq(monitor.id, id))
			.returning();

		// Trigger scheduler event

		return ctx.json(updatedMonitor, 200);
	},
);

monitorRoutes.delete("/:id", async (ctx) => {
	const user = ctx.get("user");
	const id = ctx.req.param("id");

	if (!id) {
		return ctx.json({ error: "Monitor ID is required" }, 400);
	}

	if (!user) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	// Verify monitor belongs to user
	const [existing] = await db
		.select()
		.from(monitor)
		.where(and(eq(monitor.id, id), eq(monitor.userId, user.id)))
		.limit(1);

	if (!existing) {
		return ctx.json({ error: "Monitor not found" }, 404);
	}

	await db.delete(monitor).where(eq(monitor.id, id));

	return ctx.json({ message: "Monitor deleted" }, 200);
});

export { monitorRoutes };
