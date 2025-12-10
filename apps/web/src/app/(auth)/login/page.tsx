import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
	const { session } = await requireAuth();

	if (session) {
		redirect("/dashboard");
	}

	return <SignInForm />;
}
