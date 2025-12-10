"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient({
		defaultOptions: {},
	});
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
