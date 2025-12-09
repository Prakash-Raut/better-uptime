import type { MiddlewareHandler } from "hono";
import type { AppContext } from "@/types";

export const authGuard: MiddlewareHandler<AppContext> = async (c, next) => {
	const user = c.get("user");

	if (!user) {
		return c.text("Unauthorized", 401);
	}

	await next();
};
