import { Queue } from "bullmq";
import { redisClient } from "./redis";

export const monitorEventsQueue = new Queue("monitor-events", {
	connection: redisClient,
});
export const monitorCheckQueue = new Queue("monitor-check", {
	connection: redisClient,
});
export const statusUpdateQueue = new Queue("status-update", {
	connection: redisClient,
});
