"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";
import { createMonitor, getMonitor, getMonitors } from "@/lib/api";
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

// Hook to create a monitor
export const useCreateMonitor = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: any) => createMonitor(input),
		onSuccess: () => {
			toast.success("Monitor created successfully");
			queryClient.invalidateQueries({ queryKey: ["monitors"] });
			queryClient.invalidateQueries({ queryKey: ["monitor"] });
		},
		onError: () => {
			toast.error("Failed to create monitor. Please try again.");
		},
	});
};

// Hook to fetch a single monitor
export const useMonitor = (id: string) => {
	return useQuery({
		queryKey: ["monitor", id],
		queryFn: async () => {
			const response = await getMonitor(id);
			return response.data;
		},
		enabled: !!id,
	});
};
