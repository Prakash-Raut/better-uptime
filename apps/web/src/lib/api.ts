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

type Monitor = {
	url: string;
	frequency: number;
	regionId: string;
};

// export const getMonitors = async (params: MonitorParams) => {
// 	return api.get("/monitors", { params });
// };

export const createMonitor = async (monitor: Monitor) => {
	return api.post("/monitors", monitor);
};
