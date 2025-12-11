"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	pageCount: number;
	pagination: { pageIndex: number; pageSize: number };
	onPaginationChange: (updater: any) => void;
}

export function DataTable<TData, TValue>({
	data,
	columns,
	pageCount,
	pagination,
	onPaginationChange,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		pageCount,
		state: {
			pagination,
		},
		onPaginationChange,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="relative flex flex-col gap-4 overflow-auto">
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="**:data-[slot=table-cell]:first:w-8">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
