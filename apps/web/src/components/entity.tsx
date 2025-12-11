"use client";

import {
	IconChevronLeft,
	IconChevronRight,
	IconPackage,
	IconPlus,
	IconSearch,
} from "@tabler/icons-react";
import { AlertTriangleIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type EntitySearchProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export const EntitySearch = ({
	value,
	onChange,
	placeholder = "Search",
}: EntitySearchProps) => {
	return (
		<div className="relative ml-auto">
			<IconSearch className="-translate-y-1/2 absolute top-1/2 left-2 size-4 text-muted-foreground" />
			<Input
				type="text"
				className="max-w-[250px] border bg-background pl-8 shadow-none"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

type EntityHeaderProps = {
	title: string;
	description?: string;
};

export const EntityHeader = ({ title, description }: EntityHeaderProps) => {
	return (
		<>
			<h2 className="wrap-break-word font-semibold text-2xl">{title}</h2>
			{description && (
				<p className="text-muted-foreground text-sm">{description}</p>
			)}
		</>
	);
};

type EntityPaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	disabled?: boolean;
};

export const EntityPagination = ({
	page,
	totalPages,
	onPageChange,
	disabled,
}: EntityPaginationProps) => {
	return (
		<div className="flex flex-row items-center gap-2">
			<div className="flex-1 text-muted-foreground text-sm">
				Page {page} of {totalPages ?? 1}
			</div>
			<div className="flex items-center justify-end space-x-2">
				<Button
					variant="outline"
					size="sm"
					disabled={page === 1 || disabled}
					onClick={() => onPageChange(Math.max(1, page - 1))}
				>
					<IconChevronLeft className="size-4" />
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={page === totalPages || disabled}
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
				>
					<IconChevronRight className="size-4" />
					Next
				</Button>
			</div>
		</div>
	);
};

interface EntityViewProps {
	message?: string;
}

export const EntityLoadingView = ({ message }: EntityViewProps) => {
	return (
		<div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
			<Item variant="muted">
				<ItemMedia>
					<Spinner />
				</ItemMedia>
				<ItemContent>
					{!!message && (
						<ItemTitle className="line-clamp-1">{message}</ItemTitle>
					)}
				</ItemContent>
			</Item>
		</div>
	);
};

export const EntityErrorView = ({ message }: EntityViewProps) => {
	return (
		<div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
			<Item variant="muted">
				<ItemMedia>
					<AlertTriangleIcon className="size-4 animate-pulse text-destructive" />
				</ItemMedia>
				<ItemContent>
					{!!message && (
						<ItemTitle className="line-clamp-1">{message}</ItemTitle>
					)}
				</ItemContent>
			</Item>
		</div>
	);
};

interface EmptyViewProps extends EntityViewProps {
	onNew?: () => void;
}

export const EntityEmptyView = ({ message, onNew }: EmptyViewProps) => {
	return (
		<Empty className="border border-dashed bg-white">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconPackage className="size-4" />
				</EmptyMedia>
			</EmptyHeader>
			<EmptyTitle>No items found</EmptyTitle>
			<EmptyDescription>
				{!!message && <ItemTitle className="line-clamp-1">{message}</ItemTitle>}
			</EmptyDescription>
			{!!onNew && (
				<EmptyContent>
					<Button onClick={onNew}>
						<IconPlus className="size-4" />
						Create New
					</Button>
				</EmptyContent>
			)}
		</Empty>
	);
};

interface EntityListProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	getKey?: (item: T, index: number) => string | number;
	emptyView?: React.ReactNode;
	className?: string;
}

export function EntityList<T>({
	items,
	renderItem,
	getKey,
	emptyView,
	className,
}: EntityListProps<T>) {
	if (items.length === 0 && emptyView) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="mx-auto max-w-sm">{emptyView}</div>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col gap-y-4", className)}>
			{items.map((item, index) => (
				<div key={getKey ? getKey(item, index) : index}>
					{renderItem(item, index)}
				</div>
			))}
		</div>
	);
}

type EntityItemProps = {
	href: string;
	title: string;
	subtitle?: React.ReactNode;
	image?: React.ReactNode;
	actions?: React.ReactNode;
	onRemove?: () => void;
	isRemoving?: boolean;
	className?: string;
};

export const EntityItem = ({
	href,
	title,
	subtitle,
	image,
	actions,
	onRemove,
	isRemoving,
	className,
}: EntityItemProps) => {
	const handleRemove = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (isRemoving) return;
		if (onRemove) {
			await onRemove();
		}
	};

	return (
		<Card
			className={cn(
				"cursor-pointer p-4 shadow-none",
				isRemoving && "cursor-not-allowed opacity-50",
				className,
			)}
		>
			<CardContent className="flex items-center justify-between p-0">
				<div className="flex items-center gap-3">
					{image}
					<div>
						<CardTitle className="font-medium text-base">{title}</CardTitle>
						{!!subtitle && (
							<CardDescription className="text-muted-foreground text-sm">
								{subtitle}
							</CardDescription>
						)}
					</div>
				</div>

				{(actions || onRemove) && (
					<div className="item-center flex gap-x-4">
						{actions}
						{onRemove && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => e.stopPropagation()}
									>
										<MoreVerticalIcon className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									onClick={(e) => e.stopPropagation()}
								>
									<DropdownMenuItem onClick={handleRemove}>
										<Trash2Icon className="size-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

type EntityContainerProps = {
	children: React.ReactNode;
	header?: React.ReactNode;
};

export const EntityContainer = ({ children, header }: EntityContainerProps) => {
	return (
		<section className="flex flex-col gap-4 p-6">
			<div className="flex items-center justify-between">{header}</div>
			<div className="flex flex-col space-y-4">{children}</div>
		</section>
	);
};
