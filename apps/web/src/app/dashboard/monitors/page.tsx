import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import {
	MonitorContainer,
	MonitorList,
} from "@/features/monitors/components/monitor";
import { loadMonitorsParams } from "@/features/monitors/params";
import { prefetchMonitors } from "@/features/monitors/prefetch";
import { requireAuth } from "@/lib/auth-utils";

type PageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
	await requireAuth();

	const params = await loadMonitorsParams(searchParams);
	const qc = await prefetchMonitors(params);
	const dehydratedState = dehydrate(qc);

	return (
		<MonitorContainer>
			<HydrationBoundary state={dehydratedState}>
				<MonitorList />
			</HydrationBoundary>
		</MonitorContainer>
	);
}
