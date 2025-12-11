import { SignUpForm } from "@/components/auth/sign-up-form";
import { requireNoAuth } from "@/lib/auth-utils";

export default async function Page() {
	await requireNoAuth();

	return <SignUpForm />;
}
