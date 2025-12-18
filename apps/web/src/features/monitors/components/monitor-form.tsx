"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRegions } from "@/features/regions/hooks";
import type { Monitor } from "@/lib/api";

// Helper function to convert frequency string to seconds
const frequencyToSeconds = (freq: string): number => {
	const match = freq.match(/^(\d+)([smh])$/);
	if (!match) return 60; // default to 60 seconds
	const value = Number.parseInt(match[1], 10);
	const unit = match[2];
	switch (unit) {
		case "s":
			return value;
		case "m":
			return value * 60;
		case "h":
			return value * 3600;
		default:
			return 60;
	}
};

// Helper function to convert seconds to frequency string
const secondsToFrequency = (seconds: number): string => {
	if (seconds < 60) return `${seconds}s`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
	return `${Math.floor(seconds / 3600)}h`;
};

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	url: z.url("Please enter a valid URL"),
	intervalSec: z.enum(["60", "300", "600", "1800"]), // 1m, 5m, 10m, 30m
	regions: z.array(z.string()).min(1, "At least one region is required"),
});

type MonitorFormMode = "create" | "edit";

type MonitorFormProps = {
	mode: MonitorFormMode;
	initialValues?: Monitor;
	onSubmit: (payload: {
		name: string;
		url: string;
		intervalSec: number;
		regions: string[];
		enabled?: boolean;
	}) => Promise<void> | void;
};

export function MonitorForm({
	mode,
	initialValues,
	onSubmit,
}: MonitorFormProps) {
	const router = useRouter();
	const { data: regions } = useRegions();

	const isEdit = mode === "edit";

	// Convert initial values to form format
	// Find closest matching interval or default to 300 (5m)
	const getClosestInterval = (
		seconds: number,
	): "60" | "300" | "600" | "1800" => {
		const options = [60, 300, 600, 1800];
		const closest = options.reduce((prev, curr) =>
			Math.abs(curr - seconds) < Math.abs(prev - seconds) ? curr : prev,
		);
		return String(closest) as "60" | "300" | "600" | "1800";
	};

	const defaultIntervalSec = initialValues?.intervalSec
		? getClosestInterval(initialValues.intervalSec)
		: "300"; // default to 5 minutes

	const defaultRegions = initialValues?.regions ?? [];

	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			url: initialValues?.url ?? "https://",
			intervalSec: defaultIntervalSec as "60" | "300" | "600" | "1800",
			regions: defaultRegions,
		},
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit({
				name: value.name,
				url: value.url,
				intervalSec: Number.parseInt(value.intervalSec, 10),
				regions: value.regions,
				enabled: initialValues?.enabled ?? true,
			});
			form.reset();
			router.push("/dashboard/monitors");
		},
	});

	return (
		<Card className="w-full border-none shadow-none">
			<CardHeader>
				<CardTitle className="font-bold text-2xl">
					{isEdit ? "Edit Monitor" : "Create Monitor"}
				</CardTitle>
				<CardDescription className="text-muted-foreground text-sm">
					{isEdit
						? "Update your monitor configuration."
						: "Create a new monitor to track availability."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="create-monitor-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<FieldGroup>
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Monitor Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<FieldGroup>
						<form.Field
							name="url"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Url to monitor</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<FieldGroup>
						<form.Field
							name="intervalSec"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Check Interval</FieldLabel>
										<RadioGroup
											name={field.name}
											value={field.state.value}
											onValueChange={(value) => {
												field.handleChange(value as typeof field.state.value);
											}}
											className="flex items-center gap-2"
										>
											{[
												{ value: "60", label: "1m" },
												{ value: "300", label: "5m" },
												{ value: "600", label: "10m" },
												{ value: "1800", label: "30m" },
											].map((option) => (
												<FieldLabel
													key={option.value}
													htmlFor={`form-tanstack-radiogroup-${option.value}`}
												>
													<Field
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<FieldContent>
															<FieldTitle>{option.label}</FieldTitle>
														</FieldContent>
														<RadioGroupItem
															value={option.value}
															id={`form-tanstack-radiogroup-${option.value}`}
															aria-invalid={isInvalid}
														/>
													</Field>
												</FieldLabel>
											))}
										</RadioGroup>
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<FieldGroup>
						<form.Field
							name="regions"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Regions (select at least one)
										</FieldLabel>
										<div className="space-y-2">
											{regions?.map((region) => {
												const isChecked = field.state.value.includes(
													region.code,
												);
												return (
													<div
														key={region.id}
														className="flex items-center space-x-2"
													>
														<Checkbox
															id={`region-${region.id}`}
															checked={isChecked}
															onCheckedChange={(checked) => {
																const currentRegions = field.state.value;
																if (checked) {
																	field.handleChange([
																		...currentRegions,
																		region.code,
																	]);
																} else {
																	field.handleChange(
																		currentRegions.filter(
																			(r) => r !== region.code,
																		),
																	);
																}
															}}
														/>
														<FieldLabel
															htmlFor={`region-${region.id}`}
															className="cursor-pointer font-normal"
														>
															{region.name} ({region.code})
														</FieldLabel>
													</div>
												);
											})}
										</div>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>
				<Field orientation="horizontal" className="mt-4 flex justify-end">
					<Button type="submit" form="create-monitor-form">
						{form.state.isSubmitting
							? isEdit
								? "Updating..."
								: "Creating..."
							: isEdit
								? "Update monitor"
								: "Create monitor"}
					</Button>
				</Field>
			</CardContent>
		</Card>
	);
}
