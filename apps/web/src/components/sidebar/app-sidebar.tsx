"use client";

import {
	GlobeIcon,
	HomeIcon,
	NotebookIcon,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import type { ComponentProps } from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { UptimeLogo } from "../logo";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Home",
			url: "/dashboard",
			icon: HomeIcon,
		},
		{
			title: "Monitors",
			url: "/dashboard/monitors",
			icon: SquareTerminal,
		},
		{
			title: "Status Pages",
			url: "/dashboard/status-pages",
			icon: GlobeIcon,
		},
		{
			title: "Reports",
			url: "/dashboard/reports",
			icon: NotebookIcon,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-1.5">
						<SidebarMenuButton>
							<UptimeLogo />
							<span className="font-medium text-lg text-white">Uptime</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				{session?.user && <NavUser user={session?.user} />}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
