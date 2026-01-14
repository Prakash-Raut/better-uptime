"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SingleMonitor } from "@/features/monitors/components/single-monitor";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
	const { id } = useParams();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-full w-full" />;
	}

	if (!session || !session.user) {
		router.replace("/login");
		return null;
	}

	return <SingleMonitor id={id as string} />;
}
