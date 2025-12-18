/**
 * Shared types for the Better Uptime monitoring system
 */

export interface Monitor {
	id: string;
	userId: string;
	url: string;
	intervalSec: number;
	regions: string[];
	enabled: boolean;
	name?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CheckResult {
	monitorId: string;
	region: string;
	status: "UP" | "DOWN";
	responseTimeMs: number;
	statusCode?: number;
	errorMessage?: string;
	timestamp: number;
}

export interface MonitorState {
	monitorId: string;
	currentStatus: "UP" | "DOWN";
	consecutiveFailures: number;
	lastCheckedAt: number;
	lastStateChangeAt: number;
}

export interface CheckJob {
	monitorId: string;
	url: string;
	region: string;
	scheduledFor: number; // Unix timestamp in seconds
}

export interface StateTransition {
	monitorId: string;
	fromStatus: "UP" | "DOWN";
	toStatus: "UP" | "DOWN";
	timestamp: number;
	reason: string;
}

export interface AlertEvent {
	monitorId: string;
	status: "UP" | "DOWN";
	timestamp: number;
	message: string;
}
