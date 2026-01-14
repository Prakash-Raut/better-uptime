"use client";

import {
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconDotsVertical,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import type { Monitor } from "@/lib/api";
import { useDeleteMonitor } from "../hooks";

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
		accessorKey: "enabled",
		header: "Status",
		cell: ({ row }) => {
			const enabled = row.original.enabled;
			return (
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{enabled ? (
						<>
							<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
							Active
						</>
					) : (
						<>
							<IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
							Paused
						</>
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "intervalSec",
		header: "Interval",
		cell: ({ row }) => {
			const intervalSec = row.original.intervalSec;
			// Convert seconds to display format (e.g., 300 -> "5m", 600 -> "10m")
			const formatInterval = (seconds: number): string => {
				if (seconds < 60) return `${seconds}s`;
				if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
				return `${Math.floor(seconds / 3600)}h`;
			};

			return formatInterval(intervalSec);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <MonitorActions monitor={row.original} />,
	},
];

function MonitorActions({ monitor }: { monitor: Monitor }) {
	const router = useRouter();
	const deleteMonitor = useDeleteMonitor();

	const handleEdit = () => {
		router.push(`/dashboard/monitors/${monitor.id}/edit`);
	};

	const handleDelete = async () => {
		if (
			confirm(
				`Are you sure you want to delete "${monitor.name}"? This action cannot be undone.`,
			)
		) {
			await deleteMonitor.mutateAsync(monitor.id);
		}
	};

	return (
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
				<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={handleDelete}
					disabled={deleteMonitor.isPending}
				>
					{deleteMonitor.isPending ? "Deleting..." : "Delete"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
