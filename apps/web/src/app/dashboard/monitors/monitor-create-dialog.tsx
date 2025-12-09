"use client";

import { useForm } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
	url: z.url("Please enter a valid URL"),
	frequency: z.enum(["5m", "10m", "30m"]),
	regionId: z.string(),
});

export function CreateMonitorForm() {
	const { data: regions } = useRegions();
	const form = useForm({
		defaultValues: {
			url: "https://",
			frequency: "5m",
			regionId: "",
		},
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			if (!value.regionId) {
				toast.error("Please select a region");
				return;
			}
			console.log(value);
			// createMonitor.mutate(value.url);
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon className="h-4 w-4" />
					Add Monitor
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Monitor</DialogTitle>
					<DialogDescription>
						Create a new monitor to track the availability of your website.
					</DialogDescription>
				</DialogHeader>
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
											onValueChange={field.handleChange}
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
											onValueChange={field.handleChange}
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
				<Field orientation="horizontal" className="flex justify-end">
					<Button
						type="submit"
						form="create-monitor-form"
						disabled={form.state.isSubmitting}
					>
						{form.state.isSubmitting ? "Creating..." : "Create monitor"}
					</Button>
				</Field>
			</DialogContent>
		</Dialog>
	);
}
