import { Queue } from "bullmq";
import { redisClient } from "./redis";

// Queue for monitor lifecycle events (create, update, delete)
export const monitorEventsQueue = new Queue("monitor-events", {
	connection: redisClient,
});

// Queue for scheduled check jobs
export const monitorCheckQueue = new Queue("monitor-check", {
	connection: redisClient,
});

// Queue for check results to be evaluated
export const checkResultsQueue = new Queue("check-results", {
	connection: redisClient,
});

// Queue for state transitions that need alerts
export const alertQueue = new Queue("alerts", {
	connection: redisClient,
});

// Queue for bulk writing ticks to DB
export const statusUpdateQueue = new Queue("status-update", {
	connection: redisClient,
});
