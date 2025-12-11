import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/config/pagination";

//Describe your search params, and reuse this in useQueryStates
export const monitorsParams = {
	page: parseAsInteger
		.withDefault(PAGINATION.DEFAULT_PAGE)
		.withOptions({ clearOnDefault: true }),
	pageSize: parseAsInteger
		.withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
		.withOptions({ clearOnDefault: true }),
	search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const loadMonitorsParams = createLoader(monitorsParams);
