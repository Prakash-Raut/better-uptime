import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	withCredentials: true,
});

export const getRegions = async () => {
	return api.get("/regions");
};
