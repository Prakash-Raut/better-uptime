import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	withCredentials: true,
});

export const getRegions = async () => {
	return api.get("/regions");
};

type MonitorParams = {
	page?: number;
	pageSize?: number;
	search?: string;
};

type MonitorInput = {
	name: string;
	url: string;
	intervalSec: number;
	regions: string[];
	enabled?: boolean;
};

export type Monitor = {
	id: string;
	name: string;
	url: string;
	intervalSec: number;
	regions: string[];
	enabled: boolean;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

export type PaginatedMonitorsResponse = {
	items: Monitor[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type SingleMonitorResponse = {
	monitor: Monitor;
	tick: {
		id: string;
		status: "up" | "down" | "unknown";
		responseTime: number;
		errorMessage: string | null;
		monitorId: string;
		regionId: string;
		createdAt: string;
		updatedAt: string;
	} | null;
};

export const getMonitors = async (params: MonitorParams) => {
	return api.get<PaginatedMonitorsResponse>("/monitors", { params });
};

export const createMonitor = async (input: MonitorInput) => {
	return api.post<Monitor>("/monitors", input);
};

export const getMonitor = async (id: string) => {
	return api.get<SingleMonitorResponse>(`/monitors/${id}`);
};

export const updateMonitor = async (
	id: string,
	input: Partial<MonitorInput>,
) => {
	return api.put<Monitor>(`/monitors/${id}`, input);
};

export const deleteMonitor = async (id: string) => {
	return api.delete(`/monitors/${id}`);
};
