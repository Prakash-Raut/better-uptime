import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";
import { createMonitor, getMonitors } from "@/lib/api";
import { monitorsParams } from "./params";

// Hook to get monitor params using query states
export const useMonitorParams = () => {
	return useQueryStates(monitorsParams);
};

// Hook to fetch multiple monitors using suspense
export const useMonitors = () => {
	const [params] = useMonitorParams();
	return useQuery({
		queryKey: ["monitors", params],
		queryFn: async () => {
			const { data } = await getMonitors(params);
			return data;
		},
	});
};

// Hook to create a monitor
export const useCreateMonitor = () => {
	const queryClient = useQueryClient();
	const [params] = useMonitorParams();

	return useMutation({
		mutationFn: async (input: any) => {
			const { data } = await createMonitor(input);
			return data;
		},
		onSuccess: (data) => {
			toast.success(`monitor ${data.url} created successfully`);
			// router.push(`/dashboard/monitors/${data.id}`);
			queryClient.invalidateQueries({ queryKey: ["monitors", params] });
		},
		onError: (error) => {
			toast.error(
				`Failed to create monitor. Please try again., ${error.message}`,
			);
		},
	});
};
