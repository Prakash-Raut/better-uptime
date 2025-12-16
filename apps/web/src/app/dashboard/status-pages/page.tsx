import { IconBroadcast } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export default function Page() {
	return (
		<Empty className="h-full bg-linear-to-b from-30% from-muted/50 to-background">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconBroadcast className="size-10 text-primary" />
				</EmptyMedia>
				<EmptyTitle>Create your first status page</EmptyTitle>
				<EmptyDescription>
					Share your uptime publicly with a branded status page at your own
					subdomain.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button>Create status page</Button>
				</div>
			</EmptyContent>
		</Empty>
	);
}
