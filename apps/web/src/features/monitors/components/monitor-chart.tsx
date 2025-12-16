"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
	{
		date: "2024-04-01",
		namelookup: 120,
		connection: 180,
		tlsHandshake: 170,
		dataTransfer: 260,
	},
	{
		date: "2024-04-02",
		namelookup: 130,
		connection: 185,
		tlsHandshake: 175,
		dataTransfer: 270,
	},
	{
		date: "2024-04-03",
		namelookup: 125,
		connection: 178,
		tlsHandshake: 172,
		dataTransfer: 265,
	},
	{
		date: "2024-04-04",
		namelookup: 140,
		connection: 190,
		tlsHandshake: 180,
		dataTransfer: 280,
	},
	{
		date: "2024-04-05",
		namelookup: 150,
		connection: 200,
		tlsHandshake: 190,
		dataTransfer: 295,
	},
	{
		date: "2024-04-06",
		namelookup: 145,
		connection: 195,
		tlsHandshake: 185,
		dataTransfer: 290,
	},
	{
		date: "2024-04-07",
		namelookup: 155,
		connection: 205,
		tlsHandshake: 195,
		dataTransfer: 305,
	},
	{
		date: "2024-04-08",
		namelookup: 160,
		connection: 210,
		tlsHandshake: 200,
		dataTransfer: 315,
	},
	{
		date: "2024-04-09",
		namelookup: 158,
		connection: 208,
		tlsHandshake: 198,
		dataTransfer: 310,
	},
	{
		date: "2024-04-10",
		namelookup: 165,
		connection: 215,
		tlsHandshake: 205,
		dataTransfer: 325,
	},
];

const chartConfig = {
	namelookup: {
		label: "Name Lookup",
		color: "var(--chart-1)",
	},
	connection: {
		label: "Connection",
		color: "var(--chart-2)",
	},
	tlsHandshake: {
		label: "TLS Handshake",
		color: "var(--chart-3)",
	},
	dataTransfer: {
		label: "Data Transfer",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

export function ChartAreaInteractive() {
	const [timeRange, setTimeRange] = useState("90d");

	const filteredData = chartData.filter((item) => {
		const date = new Date(item.date);
		const referenceDate = new Date("2024-06-30");
		let daysToSubtract = 90;
		if (timeRange === "30d") {
			daysToSubtract = 30;
		} else if (timeRange === "7d") {
			daysToSubtract = 7;
		}
		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - daysToSubtract);
		return date >= startDate;
	});

	return (
		<Card className="pt-0">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1">
					<CardTitle>Area Chart - Interactive</CardTitle>
					<CardDescription>
						Showing total visitors for the last 3 months
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Last 3 months" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value="90d" className="rounded-lg">
							Last 3 months
						</SelectItem>
						<SelectItem value="30d" className="rounded-lg">
							Last 30 days
						</SelectItem>
						<SelectItem value="7d" className="rounded-lg">
							Last 7 days
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							{Object.keys(chartConfig).map((key) => (
								<linearGradient
									key={key}
									id={`fill-${key}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={`var(--color-${key})`}
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor={`var(--color-${key})`}
										stopOpacity={0.1}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="namelookup"
							type="natural"
							fill="url(#fill-namelookup)"
							stroke="var(--color-namelookup)"
							stackId="a"
						/>

						<Area
							dataKey="connection"
							type="natural"
							fill="url(#fill-connection)"
							stroke="var(--color-connection)"
							stackId="a"
						/>

						<Area
							dataKey="tlsHandshake"
							type="natural"
							fill="url(#fill-tlsHandshake)"
							stroke="var(--color-tlsHandshake)"
							stackId="a"
						/>

						<Area
							dataKey="dataTransfer"
							type="natural"
							fill="url(#fill-dataTransfer)"
							stroke="var(--color-dataTransfer)"
							stackId="a"
						/>

						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
