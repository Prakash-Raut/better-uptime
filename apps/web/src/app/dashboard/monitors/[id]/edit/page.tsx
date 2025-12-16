"use client";

import { useParams } from "next/navigation";
import { MonitorForm } from "@/features/monitors/components/monitor-form";
import { useMonitor } from "@/features/monitors/hooks";

export default function Page() {
	const { id } = useParams();
	const { data } = useMonitor(id as string);
	return (
		<MonitorForm
			mode="edit"
			initialValues={data?.monitor}
			onSubmit={(data) => {
				console.log(data);
			}}
		/>
	);
}
