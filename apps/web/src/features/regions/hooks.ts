"use client";

import { useQuery } from "@tanstack/react-query";
import { getRegions } from "@/lib/api";

type Region = {
	id: string;
	name: string;
	code: string;
};

export const useRegions = () => {
	return useQuery<Region[]>({
		queryKey: ["regions"],
		queryFn: async () => {
			const response = await getRegions();
			return response.data;
		},
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
	});
};
