"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MonitorForm } from "@/features/monitors/components/monitor-form";
import { useMonitor, useUpdateMonitor } from "@/features/monitors/hooks";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();
	const { id } = useParams();
	const { data } = useMonitor(id as string);
	const updateMonitor = useUpdateMonitor();

	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-full w-full" />;
	}

	if (!session || !session.user) {
		router.replace("/login");
		return null;
	}

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
