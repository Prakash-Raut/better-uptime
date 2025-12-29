import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
	return (
		<div className="w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex max-w-6xl flex-row items-center justify-between border-x px-4 py-4 sm:px-6 md:px-8 md:py-5">
				<nav className="flex items-center gap-1.5 sm:gap-2">
					<Image
						src="/uptime-logo.svg"
						alt="Uptime"
						width={40}
						height={40}
						className="h-8 w-8 sm:h-10 sm:w-10"
					/>
					<span className="font-medium text-lg sm:text-xl md:text-2xl">
						Better Uptime
					</span>
				</nav>
				{/* Desktop Menu */}
				<div className="hidden items-center gap-2 sm:flex">
					<Button variant="outline" asChild size="sm">
						<Link href="/login">Login</Link>
					</Button>
					<Button size="sm">Try for free</Button>
				</div>
				{/* Mobile Menu - Single Button */}
				<div className="flex items-center sm:hidden">
					<Button size="sm">Try for free</Button>
				</div>
			</div>
		</div>
	);
}
