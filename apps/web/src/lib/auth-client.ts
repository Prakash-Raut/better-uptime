import type { auth } from "@better-uptime/auth";
import { polarClient } from "@polar-sh/better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	plugins: [polarClient(), inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		credentials: "include",
	},
});
