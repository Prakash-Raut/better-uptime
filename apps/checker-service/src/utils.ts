import type { CheckResult } from "@better-uptime/shared-types";

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RESPONSE_TIME_MS = 60000; // 60 seconds

/**
 * Execute HTTP check with timeout and error handling
 */
export async function executeCheck(
	url: string,
	region: string,
): Promise<Omit<CheckResult, "monitorId" | "timestamp">> {
	const startTime = Date.now();
	let status: "UP" | "DOWN" = "DOWN";
	let statusCode: number | undefined;
	let errorMessage: string | undefined;
	let responseTimeMs = 0;

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, DEFAULT_TIMEOUT_MS);

		try {
			const response = await fetch(url, {
				method: "GET",
				signal: controller.signal,
				headers: {
					"User-Agent": "Better-Uptime/1.0",
				},
				redirect: "follow",
			});

			statusCode = response.status;
			responseTimeMs = Date.now() - startTime;

			// Consider 2xx and 3xx as UP
			if (response.status >= 200 && response.status < 400) {
				status = "UP";
			} else {
				status = "DOWN";
				errorMessage = `HTTP ${response.status}`;
			}
		} catch (fetchError) {
			responseTimeMs = Date.now() - startTime;

			if (fetchError instanceof Error) {
				if (fetchError.name === "AbortError") {
					errorMessage = "Request timeout";
				} else {
					errorMessage = fetchError.message;
				}
			} else {
				errorMessage = "Unknown error";
			}

			status = "DOWN";
		} finally {
			clearTimeout(timeoutId);
		}

		// Cap response time at max
		if (responseTimeMs > MAX_RESPONSE_TIME_MS) {
			responseTimeMs = MAX_RESPONSE_TIME_MS;
		}
	} catch (error) {
		responseTimeMs = Date.now() - startTime;
		status = "DOWN";
		errorMessage = error instanceof Error ? error.message : "Unknown error";
	}

	return {
		region,
		status,
		responseTimeMs,
		statusCode,
		errorMessage,
	};
}
