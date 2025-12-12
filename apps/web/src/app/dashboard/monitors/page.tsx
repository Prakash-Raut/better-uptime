"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import {
	MonitorContainer,
	MonitorList,
	MonitorLoading,
} from "@/features/monitors/components/monitor";
import { authClient } from "@/lib/auth-client";

export default function Page() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	if (!session) {
		router.replace("/login");
	}

	return (
		<MonitorContainer>
			<Suspense fallback={<MonitorLoading />}>
				<MonitorList />
			</Suspense>
		</MonitorContainer>
	);
}
