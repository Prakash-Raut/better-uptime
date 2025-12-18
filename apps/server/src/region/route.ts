import { db, region } from "@better-uptime/db";
import { Hono } from "hono";
// import { authGuard } from "@/middlewares/authGuard";
import type { AppContext } from "@/types";

const regionRoutes = new Hono<AppContext>();

// regionRoutes.use("*", authGuard);

regionRoutes.get("/", async (ctx) => {
	const regions = await db.select().from(region);
	return ctx.json(regions);
});

export { regionRoutes };
