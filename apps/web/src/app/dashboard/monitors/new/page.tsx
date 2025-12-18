"use client";

import { MonitorForm } from "@/features/monitors/components/monitor-form";
import { useCreateMonitor } from "@/features/monitors/hooks";

export default function Page() {
	const createMonitor = useCreateMonitor();

	return (
		<MonitorForm
			mode="create"
			onSubmit={async (data) => {
				await createMonitor.mutateAsync(data);
			}}
		/>
	);
}
