"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EntityContainer, EntitySearch } from "@/components/entity";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useMonitorParams, useMonitors } from "../hooks";
import { monitorColumn } from "./monitor-column";
import { CreateMonitorForm } from "./monitor-create-dialog";

export const MonitorsHeader = () => {
	return (
		<>
			<h2 className="wrap-break-word font-semibold text-2xl">Monitors</h2>
			<div className="flex items-center gap-2">
				<MonitorSearch />
				<CreateMonitorForm />
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

export const MonitorContainer = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<EntityContainer header={<MonitorsHeader />}>{children}</EntityContainer>
	);
};

export const MonitorLoading = () => {
	return (
		<div className="flex flex-col space-y-3">
			<Skeleton className="h-[125px] w-[250px] rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	);
};

export const MonitorError = () => {
	return null;
};

export const MonitorEmpty = () => {
	return null;
};

export const MonitorView = () => {
	const { data: monitors, isPending } = useMonitors();
	return (
		<MonitorContainer>
			{!isPending && monitors && (
				<DataTable columns={monitorColumn} data={monitors?.items} />
			)}
		</MonitorContainer>
	);
};
