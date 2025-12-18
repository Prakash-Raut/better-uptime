"use client";

import {
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconPlayerPause,
	IconSend,
	IconSettings,
	IconShield,
} from "@tabler/icons-react";
import { formatDistanceToNow, secondsToMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useMonitor } from "../hooks";
import { ChartAreaInteractive } from "./monitor-chart";

export const SingleMonitor = ({ id }: { id: string }) => {
	return (
		<div className="container mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 md:px-8">
			<MonitorHeader id={id} />
			<MonitorActions />
			<MonitorInformation id={id} />
			<ChartAreaInteractive />
			<MonitorStatistics />
		</div>
	);
};

export const MonitorHeader = ({ id }: { id: string }) => {
	const { data } = useMonitor(id);
	const isUp = data?.tick?.status === "up";
	const monitor = data?.monitor;
	return (
		<div>
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					{isUp ? (
						<IconCircleCheckFilled className="size-5 fill-green-500 dark:fill-green-400" />
					) : (
						<IconCircleXFilled className="size-5 fill-red-500 dark:fill-red-400" />
					)}
					<h1 className="font-bold text-3xl">{monitor?.name}</h1>
				</div>
				<p className="mx-10 flex items-center gap-2 text-muted-foreground text-sm">
					<span>
						{isUp ? (
							<Badge>Up</Badge>
						) : (
							<Badge variant="destructive">Down</Badge>
						)}
					</span>
					<span>
						Checked every{" "}
						{monitor?.intervalSec
							? secondsToMinutes(monitor.intervalSec)
							: "N/A"}{" "}
						minutes
					</span>
					{monitor?.regions && monitor.regions.length > 0 && (
						<span className="flex items-center gap-1">
							Regions:{" "}
							{monitor.regions.map((r) => (
								<Badge key={r} variant="outline" className="text-xs">
									{r}
								</Badge>
							))}
						</span>
					)}
				</p>
			</div>
		</div>
	);
};

export const MonitorActions = () => {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<Button variant="ghost" className="text-muted-foreground" size="sm">
				<IconSend className="size-4" />
				Send test alert
			</Button>
			<Button variant="ghost" className="text-muted-foreground" size="sm">
				<IconShield className="size-4" />
				Incidents
			</Button>
			<Button variant="ghost" className="text-muted-foreground" size="sm">
				<IconPlayerPause className="size-4" />
				Pause
			</Button>
			<Button variant="ghost" className="text-muted-foreground" size="sm">
				<IconSettings className="size-4" />
				Configure
			</Button>
		</div>
	);
};

export const MonitorInformation = ({ id }: { id: string }) => {
	const { data } = useMonitor(id);
	const monitor = data?.monitor;
	const tick = data?.tick;

	// Calculate "Currently up for" - time since monitor was created
	const getUptime = () => {
		if (!monitor?.createdAt) return "N/A";
		const createdAt = new Date(monitor.createdAt);
		return formatDistanceToNow(createdAt, { addSuffix: false });
	};

	// Calculate "Last checked at" - time since last tick
	const getLastChecked = () => {
		if (!tick?.createdAt) return "Never";
		const lastChecked = new Date(tick.createdAt);
		return formatDistanceToNow(lastChecked, { addSuffix: true });
	};

	// For now, incidents is 0 since we don't have an incidents API endpoint
	// This could be calculated from tick history in the future
	const incidents = 0;

	return (
		<div className="grid gap-6 sm:grid-cols-3">
			<Card className="shadow-none">
				<CardContent className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm">Currently up for</p>
					<p className="font-bold text-2xl">{getUptime()}</p>
				</CardContent>
			</Card>
			<Card className="shadow-none">
				<CardContent className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm">Last checked at</p>
					<p className="font-bold text-2xl">{getLastChecked()}</p>
				</CardContent>
			</Card>
			<Card className="shadow-none">
				<CardContent className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm">Incidents</p>
					<p className="font-bold text-2xl">{incidents}</p>
				</CardContent>
			</Card>
		</div>
	);
};

interface StatisticsData {
	id: string;
	timePeriod: string;
	availability: string;
	downtime: string;
	incidents: string;
	longestIncident: string;
	avgIncident: string;
}

export const MonitorStatistics = () => {
	const statisticsData: StatisticsData[] = [
		{
			id: "1",
			timePeriod: "Today",
			availability: "100.0000%",
			downtime: "none",
			incidents: "0",
			longestIncident: "none",
			avgIncident: "none",
		},
		{
			id: "2",
			timePeriod: "Last 7 days",
			availability: "100.0000%",
			downtime: "none",
			incidents: "0",
			longestIncident: "none",
			avgIncident: "none",
		},
		{
			id: "3",
			timePeriod: "Last 30 days",
			availability: "100.0000%",
			downtime: "none",
			incidents: "0",
			longestIncident: "none",
			avgIncident: "none",
		},
		{
			id: "4",
			timePeriod: "Last 365 days",
			availability: "100.0000%",
			downtime: "none",
			incidents: "0",
			longestIncident: "none",
			avgIncident: "none",
		},
		{
			id: "5",
			timePeriod: "All time",
			availability: "100.0000%",
			downtime: "none",
			incidents: "0",
			longestIncident: "none",
			avgIncident: "none",
		},
	];

	return (
		<Table className="border">
			<TableHeader className="bg-muted">
				<TableRow className="">
					<TableHead className="p-4 text-left font-medium text-muted-foreground text-sm">
						Time period
					</TableHead>
					<TableHead className="p-4 text-right font-medium text-muted-foreground text-sm">
						Availability
					</TableHead>
					<TableHead className="p-4 text-right font-medium text-muted-foreground text-sm">
						Downtime
					</TableHead>
					<TableHead className="p-4 text-right font-medium text-muted-foreground text-sm">
						Incidents
					</TableHead>
					<TableHead className="p-4 text-right font-medium text-muted-foreground text-sm">
						Longest incident
					</TableHead>
					<TableHead className="p-4 text-right font-medium text-muted-foreground text-sm">
						Avg. incident
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{statisticsData.map((row) => (
					<TableRow
						key={row.id}
						className="border-border border-b last:border-b-0 hover:bg-transparent"
					>
						<TableCell className="p-4 text-foreground text-sm">
							{row.timePeriod}
						</TableCell>
						<TableCell className="p-4 text-right text-foreground text-sm">
							{row.availability}
						</TableCell>
						<TableCell className="p-4 text-right text-foreground text-sm">
							{row.downtime}
						</TableCell>
						<TableCell className="p-4 text-right text-foreground text-sm">
							{row.incidents}
						</TableCell>
						<TableCell className="p-4 text-right text-foreground text-sm">
							{row.longestIncident}
						</TableCell>
						<TableCell className="p-4 text-right text-foreground text-sm">
							{row.avgIncident}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
