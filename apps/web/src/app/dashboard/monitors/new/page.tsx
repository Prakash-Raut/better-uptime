"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MonitorForm } from "@/features/monitors/components/monitor-form";
import { useCreateMonitor } from "@/features/monitors/hooks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {
	const createMonitor = useCreateMonitor();
	const router = useRouter();
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
			mode="create"
			onSubmit={async (data) => {
				await createMonitor.mutateAsync(data);
			}}
		/>
	);
}
