import Redis from "ioredis";

if (!process.env.REDIS_URL) {
	throw new Error("REDIS_URL is not set");
}

export const redisClient = new Redis(process.env.REDIS_URL, {
	maxRetriesPerRequest: null,
});

redisClient.on("error", (error) => {
	console.error("Redis error", error);
});

redisClient.on("connect", () => {
	console.log("Redis connected");
});
