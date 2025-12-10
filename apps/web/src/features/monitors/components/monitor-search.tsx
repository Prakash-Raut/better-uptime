"use client";

import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useMonitorParams } from "@/features/monitors/hooks";
import { useEntitySearch } from "@/hooks/use-entity-search";

export function MonitorSearch() {
	const [params, setParams] = useMonitorParams();
	const { searchValue, onSearchChange } = useEntitySearch({
		params,
		setParams,
	});

	return (
		<div className="relative w-full max-w-md">
			<Input
				type="text"
				placeholder="Search monitors"
				className="w-full pl-9"
				value={searchValue}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 text-neutral-400">
				<IconSearch className="size-4" />
			</span>
		</div>
	);
}
