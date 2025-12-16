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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRegions } from "@/features/regions/hooks";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	url: z.url("Please enter a valid URL"),
	frequency: z.enum(["5m", "10m", "30m"]),
	regionId: z.string(),
});

type MonitorFormMode = "create" | "edit";

type MonitorFormProps = {
	mode: MonitorFormMode;
	initialValues?: {
		name: string;
		url: string;
		frequency: "1m" | "5m" | "10m" | "30m";
		regionId: string;
	};
	onSubmit: (payload: {
		name: string;
		url: string;
		frequency: number;
		regionId: string;
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

	console.log("initialValues", initialValues);

	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			url: initialValues?.url ?? "https://",
			frequency: initialValues?.frequency ?? "5m",
			regionId: initialValues?.regionId ?? "",
		},
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit({
				name: value.name,
				url: value.url,
				frequency: Number.parseInt(value.frequency, 10),
				regionId: value.regionId,
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
							name="frequency"
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
											{["1m", "5m", "10m"].map((f) => (
												<FieldLabel
													key={f}
													htmlFor={`form-tanstack-radiogroup-${f}`}
												>
													<Field
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<FieldContent>
															<FieldTitle>{f}</FieldTitle>
														</FieldContent>
														<RadioGroupItem
															value={f}
															id={`form-tanstack-radiogroup-${f}`}
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
							name="regionId"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Region</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={(value) => {
												field.handleChange(value as typeof field.state.value);
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Choose region" />
											</SelectTrigger>
											<SelectContent>
												{regions?.map((r) => (
													<SelectItem key={r.id} value={r.id}>
														{r.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
