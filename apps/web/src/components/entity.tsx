"use client";

import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

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
	onCreate?: () => void;
	createButtonLabel?: string;
};

export const EntityHeader = ({
	title,
	description,
	onCreate,
	createButtonLabel,
}: EntityHeaderProps) => {
	return (
		<>
			<h2 className="wrap-break-word font-semibold text-2xl">{title}</h2>
			{description && (
				<p className="text-muted-foreground text-sm">{description}</p>
			)}
			<Button onClick={onCreate}>{createButtonLabel ?? "Create New"}</Button>
		</>
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

interface StateViewProps {
	message?: string;
}

export const EntityLoadingView = ({ message }: StateViewProps) => {
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
