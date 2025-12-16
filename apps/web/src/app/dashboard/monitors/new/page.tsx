"use client";

import { MonitorForm } from "@/features/monitors/components/monitor-form";

export default function Page() {
	return (
		<MonitorForm
			mode="create"
			onSubmit={(data) => {
				console.log(data);
			}}
		/>
	);
}
