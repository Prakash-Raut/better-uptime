"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Monitor } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	url: z.url("Please enter a valid URL"),
});

type MonitorFormMode = "create" | "edit";

type MonitorFormProps = {
	mode: MonitorFormMode;
	initialValues?: Monitor;
	onSubmit: (payload: {
		name: string;
		url: string;
		enabled?: boolean;
	}) => Promise<void> | void;
};

export function MonitorForm({
	mode,
	initialValues,
	onSubmit,
}: MonitorFormProps) {
	const router = useRouter();
	const isEdit = mode === "edit";

	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			url: initialValues?.url ?? "https://",
		},
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit({
				name: value.name,
				url: value.url,
				enabled: initialValues?.enabled ?? true,
			});
			form.reset();
			router.push("/dashboard/monitors");
		},
	});

	return (
		<div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between mx-10 my-6">
			<div className="space-y-8 lg:w-1/2">
				{!isEdit && (
					<div className="space-y-2">
						<h2 className="font-semibold text-2xl tracking-tight">
							Create monitor
						</h2>
					</div>
				)}

				<div className="space-y-2">
					<h3 className="font-semibold tracking-wide">What to monitor</h3>
					<p className="max-w-prose text-muted-foreground text-sm">
						Configure the target website you want to monitor. You&apos;ll find
						the advanced configuration below, in the advanced settings section.
					</p>
				</div>
			</div>

			<div className="w-full lg:w-1/2">
				<Card className="bg-background/60 border-muted/40 lg:p-8 p-6 shadow-sm">
					<form
						id="create-monitor-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<FieldGroup>
							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Monitor name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
											/>
											<FieldDescription>
												Enter a descriptive name to easily recognize this
												monitor in your dashboard.
											</FieldDescription>
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
											<FieldLabel htmlFor={field.name}>
												URL to monitor
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
											/>
											<FieldDescription>
												Use a publicly accessible URL, including the protocol
												(e.g. https://example.com).
											</FieldDescription>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
						</FieldGroup>

						<div className="flex justify-end pt-4">
							<Button type="submit" form="create-monitor-form">
								{form.state.isSubmitting
									? isEdit
										? "Updating..."
										: "Creating..."
									: isEdit
										? "Update monitor"
										: "Create monitor"}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}
