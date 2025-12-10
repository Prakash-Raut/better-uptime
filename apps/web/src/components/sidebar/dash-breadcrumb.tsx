"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	if (segments.length === 0) {
		// Just show "Dashboard" as the root
		return (
			<Breadcrumb className="list-none">
				<BreadcrumbItem>
					<BreadcrumbLink href="/dashboard" className="capitalize">
						Dashboard
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
		);
	}

	// Always start with the root (Dashboard)
	const items = [
		...segments.map((segment, index) => ({
			label: segment,
			href: `/${segments.slice(0, index + 1).join("/")}`,
		})),
	];

	return (
		<Breadcrumb className="flex list-none items-center gap-1">
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				return (
					<Fragment key={item.href}>
						<BreadcrumbItem>
							<BreadcrumbLink href={item.href} className="capitalize">
								{item.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{!isLast && <BreadcrumbSeparator />}
					</Fragment>
				);
			})}
		</Breadcrumb>
	);
}
