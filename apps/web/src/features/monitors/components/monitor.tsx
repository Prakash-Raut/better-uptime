"use client";

import { DataTable } from "@/components/data-table/data-table";
import {
	EntityContainer,
	EntityEmptyView,
	EntityErrorView,
	EntityLoadingView,
	EntityPagination,
	EntitySearch,
} from "@/components/entity";
import { Button } from "@/components/ui/button";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useMonitorParams, useMonitors } from "../hooks";
import { monitorColumn } from "./monitor-column";

export const MonitorsHeader = () => {
	const router = useRouter();
	return (
		<>
			<h2 className="wrap-break-word font-semibold text-2xl">Monitors</h2>
			<div className="flex items-center gap-2">
				<MonitorSearch />
				<Button onClick={() => router.push("/dashboard/monitors/new")}>
					Create monitor
				</Button>
			</div>
		</>
	);
};

export const MonitorSearch = () => {
	const [params, setParams] = useMonitorParams();
	const { searchValue, onSearchChange } = useEntitySearch({
		params,
		setParams,
	});
	return (
		<EntitySearch
			value={searchValue}
			onChange={onSearchChange}
			placeholder="Search monitors"
		/>
	);
};

export const MonitorPagination = () => {
	const { data: monitors, isFetching } = useMonitors();
	const [params, setParams] = useMonitorParams();
	return (
		<EntityPagination
			page={monitors?.page ?? 0}
			totalPages={monitors?.totalPages ?? 0}
			onPageChange={(page) => setParams({ ...params, page })}
			disabled={isFetching}
		/>
	);
};

export const MonitorContainer = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<EntityContainer
			header={
				<>
					<Suspense fallback={null}>
						<MonitorsHeader />
					</Suspense>
				</>
			}
		>
			{children}
		</EntityContainer>
	);
};

export const MonitorLoading = () => {
	return <EntityLoadingView message="Loading monitors..." />;
};

export const MonitorError = () => {
	return (
		<EntityErrorView message="An error occurred while loading monitors. Please try again later." />
	);
};

export const MonitorEmpty = () => {
	const handleCreateMonitor = () => {};

	return (
		<EntityEmptyView
			message="You haven't created any monitors yet. Get started by creating your first monitor."
			onNew={handleCreateMonitor}
		/>
	);
};

export const MonitorList = () => {
	const [params, setParams] = useMonitorParams();
	const { data: monitors } = useMonitors();

	const handlePaginationChange = (updater: any) => {
		const next = updater({
			pageIndex: params.page - 1,
			pageSize: params.pageSize,
		});

		setParams({
			...params,
			// Convert back to 1-based page for params/API
			page: next.pageIndex + 1,
			pageSize: next.pageSize,
		});
	};

	return (
		<DataTable
			columns={monitorColumn}
			data={monitors?.items ?? []}
			pageCount={monitors?.totalPages ?? 1}
			// DataTable expects 0-based pageIndex
			pagination={{ pageIndex: params.page - 1, pageSize: params.pageSize }}
			onPaginationChange={handlePaginationChange}
		/>
	);
};
