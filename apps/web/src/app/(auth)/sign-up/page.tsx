import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
	const { session } = await requireAuth();

	if (session) {
		redirect("/dashboard");
	}

	return <SignUpForm />;
}
