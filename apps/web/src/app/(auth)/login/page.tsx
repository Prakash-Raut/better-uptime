"use client";

import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { authClient } from "@/lib/auth-client";

export default function Page() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	if (session) {
		router.push("/dashboard");
	}

	return <SignInForm />;
}
