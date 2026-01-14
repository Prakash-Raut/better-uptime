import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

const logo = {
	src: "/uptime-logo.svg",
	alt: "Better Uptime",
	title: "Better Uptime",
	url: "/",
};

const menuItems = [
	{
		id: 1,
		title: "Product",
		links: [
			{ id: 1, text: "Overview", url: "#" },
			{ id: 2, text: "Pricing", url: "#" },
			{ id: 3, text: "Features", url: "#" },
			{ id: 4, text: "Integrations", url: "#" },
		],
	},
	{
		id: 2,
		title: "Company",
		links: [
			{ id: 1, text: "About", url: "#" },
			{ id: 2, text: "Blog", url: "#" },
			{ id: 3, text: "Careers", url: "#" },
			{ id: 4, text: "Contact", url: "#" },
		],
	},
	{
		id: 3,
		title: "Legal",
		links: [
			{ id: 1, text: "Privacy Policy", url: "#" },
			{ id: 2, text: "Terms of Service", url: "#" },
		],
	},
];
const copyright = "© 2025 Better Uptime";

export default function Footer() {
	return (
		<section className="py-6 dark:bg-neutral-900">
			<div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8">
				<footer>
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
						<div className="col-span-2 mb-8 sm:col-span-3 lg:col-span-3 lg:mb-0">
							<div className="flex items-center gap-2 lg:justify-start">
								<Logo>
									<LogoImage
										src={logo.src}
										alt={logo.alt}
										title={logo.title}
										className="h-8 sm:h-10 dark:invert"
									/>
									<LogoText className="text-lg sm:text-xl">
										{logo.title}
									</LogoText>
								</Logo>
							</div>
						</div>
						{menuItems.map((section) => (
							<div key={section.id}>
								<h3 className="mb-3 font-bold text-sm sm:mb-4 sm:text-base">
									{section.title}
								</h3>
								<ul className="space-y-2 text-muted-foreground sm:space-y-3 md:space-y-4">
									{section.links.map((link) => (
										<li
											key={link.id}
											className="font-medium text-xs hover:text-primary sm:text-sm"
										>
											<a href={link.url}>{link.text}</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="mt-12 flex flex-col justify-between gap-4 border-t pt-6 font-medium text-muted-foreground text-xs sm:mt-16 sm:pt-8 md:mt-24 md:flex-row md:items-center md:text-sm">
						<p>{copyright}</p>
						<ul className="flex items-center gap-4">
							<li>
								<ModeToggle />
							</li>
							<li className="hover:text-rose-500">
								<span>Made with ❤️ in India</span>
							</li>
						</ul>
					</div>
				</footer>
			</div>
		</section>
	);
}

function Logo({ children }: { children: React.ReactNode }) {
	return (
		<Link href="/" className="flex items-center gap-2">
			{children}
		</Link>
	);
}

function LogoImage({
	src,
	alt,
	className,
}: {
	src: string;
	alt: string;
	title: string;
	className: string;
}) {
	return (
		<Image src={src} alt={alt} width={40} height={40} className={className} />
	);
}

function LogoText({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) {
	return <p className={cn("", className)}>{children}</p>;
}
