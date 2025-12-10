"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "../ui/sonner";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			<QueryProvider>
				<NuqsAdapter>{children}</NuqsAdapter>
			</QueryProvider>
			<Toaster richColors />
		</ThemeProvider>
	);
}
