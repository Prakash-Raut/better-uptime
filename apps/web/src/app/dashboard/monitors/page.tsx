"use client";

import { useRouter } from "next/navigation";
import {
	MonitorContainer,
	MonitorList,
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
			<MonitorList />
		</MonitorContainer>
	);
}
