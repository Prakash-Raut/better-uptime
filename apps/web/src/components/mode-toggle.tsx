"use client";

import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<Tabs defaultValue="system">
			<TabsList>
				<TabsTrigger value="system" onClick={() => setTheme("system")}>
					<IconDeviceDesktop />
				</TabsTrigger>
				<TabsTrigger value="light" onClick={() => setTheme("light")}>
					<IconSun />
				</TabsTrigger>
				<TabsTrigger value="dark" onClick={() => setTheme("dark")}>
					<IconMoon />
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
