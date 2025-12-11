"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { monitorsParams } from "./params";
import { getMonitors } from "./server";

// Hook to get monitor params using query states
export const useMonitorParams = () => {
	return useQueryStates(monitorsParams);
};

// Hook to fetch multiple monitors using suspense
export const useMonitors = () => {
	const [params] = useMonitorParams();
	return useSuspenseQuery({
		queryKey: ["monitors", params],
		queryFn: () => getMonitors(params),
	});
};
