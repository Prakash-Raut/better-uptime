import { db } from "@better-uptime/db";
import * as schema from "@better-uptime/db/schema/auth";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { type Auth, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { polarClient } from "./lib/payments";

export const auth: Auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
			partitioned: true, // New browser standards will mandate this for foreign cookies
		},
		crossSubDomainCookies: {
			enabled: true,
		},
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "111829a0-42e0-4b09-8945-79a42c29970c",
							slug: "Pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Pro
						},
						{
							productId: "f1b3d3dc-6744-470c-94df-67c96bc99001",
							slug: "Starter", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Starter
						},
						{
							productId: "6f364069-a189-4b1c-b95f-62cd3813e2f6",
							slug: "Free", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Free
						},
					],
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
	],
});
