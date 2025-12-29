"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";
import {
	createMonitor,
	deleteMonitor,
	getMonitor,
	getMonitors,
	updateMonitor,
} from "@/lib/api";
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
		queryFn: async () => {
			const response = await getMonitors(params);
			return response.data;
		},
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

// Hook to update a monitor
export const useUpdateMonitor = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: Partial<any> }) =>
			updateMonitor(id, input),
		onSuccess: () => {
			toast.success("Monitor updated successfully");
			queryClient.invalidateQueries({ queryKey: ["monitors"] });
			queryClient.invalidateQueries({ queryKey: ["monitor"] });
		},
		onError: () => {
			toast.error("Failed to update monitor. Please try again.");
		},
	});
};

// Hook to delete a monitor
export const useDeleteMonitor = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteMonitor(id),
		onSuccess: () => {
			toast.success("Monitor deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["monitors"] });
		},
		onError: () => {
			toast.error("Failed to delete monitor. Please try again.");
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
