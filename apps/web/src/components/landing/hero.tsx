import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Hero() {
	return (
		<section className="relative w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center space-y-6 border-x px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10 md:space-y-10 md:px-8 md:py-12 lg:min-h-screen lg:py-16">
				<Badge
					variant="outline"
					className="bg-accent px-3 py-1 font-medium text-xs sm:px-4 sm:py-1.5 sm:text-sm"
				>
					Coming soon
				</Badge>
				<h1 className="max-w-4xl text-balance text-center font-bold text-[clamp(1.75rem,5vw+1rem,4.5rem)] leading-tight tracking-tight antialiased sm:text-[clamp(2rem,6vw,4.5rem)]">
					Monitor your uptime <br className="hidden sm:block" />
					<span className="sm:hidden"> </span>
					Track every incident
				</h1>
				<p className="max-w-lg text-center text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
					Monitor your infrastructure, create beautiful status pages, and manage
					incidents seamlessly.
				</p>
				<div className="flex w-full items-center justify-center px-4 sm:w-auto sm:px-0">
					<Button
						size="lg"
						className="w-full transition-all duration-300 sm:w-auto sm:px-8"
					>
						<span className="text-sm sm:text-base">
							Start Monitoring for Free
						</span>
					</Button>
				</div>
			</div>
		</section>
	);
}
