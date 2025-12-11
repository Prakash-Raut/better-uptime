import { QueryClient } from "@tanstack/react-query";
import { getMonitors } from "./server";

export const prefetchMonitors = async (params: any) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["monitors", params],
		queryFn: () => getMonitors(params),
	});

	return queryClient;
};
