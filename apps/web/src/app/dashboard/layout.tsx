export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="container mx-auto max-w-6xl border-x px-4 py-4">
			{children}
		</main>
	);
}
