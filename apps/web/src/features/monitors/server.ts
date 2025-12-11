"use server";

import { headers } from "next/headers";

export type Monitor = {
	id: string;
	name: string;
	url: string;
	status: string;
	frequency: number;
};

type MonitorResponse = {
	items: Monitor[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export const getMonitors = async (params: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/monitors?${new URLSearchParams(params).toString()}`,
		{
			headers: await headers(),
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch monitors");
	}

	const data: MonitorResponse = await response.json();
	return data;
};
