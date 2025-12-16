"use client";

import {
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconDotsVertical,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Monitor = {
	id: string;
	name: string;
	url: string;
	status: string;
	frequency: number;
};

export const monitorColumn: ColumnDef<Monitor>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "header",
		header: "Name",
		cell: ({ row }) => {
			return (
				<div className="w-32">
					<Link
						href={`/dashboard/monitors/${row.original.id}`}
						className="capitalize"
					>
						{row.original.name}
					</Link>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "url",
		header: "Url",
		cell: ({ row }) => (
			<div className="w-32">
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{row.original.url}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant="outline" className="px-1.5 text-muted-foreground">
				{row.original.status === "Active" ? (
					<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
				) : (
					<IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
				)}
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "frequency",
		header: "Frequency",
		cell: ({ row }) => {
			const frequency = row.original.frequency;
			// Convert seconds to display format (e.g., 300 -> "5m", 600 -> "10m")
			const formatFrequency = (seconds: number): string => {
				if (seconds < 60) return `${seconds}s`;
				if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
				return `${Math.floor(seconds / 3600)}h`;
			};

			if (frequency && frequency > 0) {
				return formatFrequency(frequency);
			}

			return (
				<>
					<Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
						Frequency
					</Label>
					<Select>
						<SelectTrigger
							className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
							size="sm"
							id={`${row.original.id}-frequency`}
						>
							<SelectValue placeholder="Assign frequency" />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem value="5m">5m</SelectItem>
							<SelectItem value="10m">10m</SelectItem>
							<SelectItem value="30m">30m</SelectItem>
						</SelectContent>
					</Select>
				</>
			);
		},
	},
	{
		id: "actions",
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
						size="icon"
					>
						<IconDotsVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
