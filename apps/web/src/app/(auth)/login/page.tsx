import { SignInForm } from "@/components/auth/sign-in-form";
import { requireNoAuth } from "@/lib/auth-utils";

export default async function Page() {
	await requireNoAuth();

	return <SignInForm />;
}
