"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { getMonitors } from "@/lib/api";
import { monitorsParams } from "./params";

// Hook to get monitor params using query states
export const useMonitorParams = () => {
	return useQueryStates(monitorsParams);
};

// Hook to fetch multiple monitors
export const useMonitors = () => {
	const [params] = useMonitorParams();
	return useQuery({
		queryKey: ["monitors", params],
		queryFn: () => getMonitors(params),
	});
};
