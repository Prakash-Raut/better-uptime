import { auth } from "@better-uptime/auth";
import { statusUpdateQueue } from "@better-uptime/queues";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { monitorRoutes } from "./monitor/route";
import { regionRoutes } from "./region/route";
import type { AppContext } from "./types";

const app = new Hono<AppContext>();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		c.set("user", null);
		c.set("session", null);
		await next();
		return;
	}
	c.set("user", session.user);
	c.set("session", session.session);
	await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
	return c.text("Better Uptime API");
});

app.get("/health", (c) => {
	return c.text("Healthy");
});

app.get("/session", (c) => {
	const session = c.get("session");
	const user = c.get("user");

	return c.json({
		session,
		user,
	});
});

app.route("/monitors", monitorRoutes);
app.route("/regions", regionRoutes);

// monitorEventsQueue.add("monitorCreated", {
// 	monitorId: "766911df-4dd7-4d1d-b9eb-2463af7e5725",
// 	monitorUrl: "https://www.google.com",
// });

// console.log("Monitor created job added");

statusUpdateQueue.add("flushStatusBuffer", {}, { repeat: { every: 5000 } });

export default app;
