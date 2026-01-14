"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
	MonitorContainer,
	MonitorList,
} from "@/features/monitors/components/monitor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
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
		<MonitorContainer>
			<Suspense>
				<MonitorList />
			</Suspense>
		</MonitorContainer>
	);
}
