"use client";

import { useParams } from "next/navigation";
import { SingleMonitor } from "@/features/monitors/components/single-monitor";

export default function Page() {
	const { id } = useParams();

	return <SingleMonitor id={id as string} />;
}
