"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const SignInForm = () => {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	const signInWithGoogle = async () => {
		await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: "/dashboard/monitors",
			},
			{
				onError: (error) => {
					toast.error(error.error.message || error.error.statusText);
				},
			},
		);
	};

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<div>
							<form.Field name="email">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Email</Label>
										<Input
											id={field.name}
											name={field.name}
											type="email"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.errors.map((error) => (
											<p key={error?.message} className="text-red-500">
												{error?.message}
											</p>
										))}
									</div>
								)}
							</form.Field>
						</div>

						<div>
							<form.Field name="password">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Password</Label>
										<Input
											id={field.name}
											name={field.name}
											type="password"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.errors.map((error) => (
											<p key={error?.message} className="text-red-500">
												{error?.message}
											</p>
										))}
									</div>
								)}
							</form.Field>
						</div>

						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									className="w-full"
									disabled={!state.canSubmit || state.isSubmitting}
								>
									{state.isSubmitting ? "Submitting..." : "Login"}
								</Button>
							)}
						</form.Subscribe>
						<Button
							variant="outline"
							type="button"
							className="w-full"
							onClick={signInWithGoogle}
						>
							Login with Google
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="mt-4 text-center">
						Don&apos;t have an account?{" "}
						<Link href="/sign-up" className="text-primary">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
