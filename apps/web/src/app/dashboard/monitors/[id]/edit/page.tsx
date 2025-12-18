"use client";

import { useParams } from "next/navigation";
import { MonitorForm } from "@/features/monitors/components/monitor-form";
import { useMonitor, useUpdateMonitor } from "@/features/monitors/hooks";

export default function Page() {
	const { id } = useParams();
	const { data } = useMonitor(id as string);
	const updateMonitor = useUpdateMonitor();

	return (
		<MonitorForm
			mode="edit"
			initialValues={data?.monitor}
			onSubmit={async (formData) => {
				if (id) {
					await updateMonitor.mutateAsync({
						id: id as string,
						input: formData,
					});
				}
			}}
		/>
	);
}
