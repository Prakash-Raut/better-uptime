import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
};

export function Logo({ className }: Props) {
	return (
		<Image
			src="/uptime-logo-light.svg"
			alt="Uptime"
			width={32}
			height={32}
			className={cn("size-8", className)}
		/>
	);
}
