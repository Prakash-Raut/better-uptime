"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const howItWorks = {
	headline:
		"The only platform you need to maintain reliable services and transparent communication",
};

export default function HowItWorks() {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

	return (
		<section ref={ref} className="w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-6 border-x px-4 py-8 sm:space-y-8 sm:px-6 md:space-y-10 md:px-8 md:py-12">
				<h3
					className={cn(
						"font-semibold text-green-400 text-lg uppercase tracking-tight transition-all duration-600 sm:text-xl md:text-2xl",
						isVisible ? "animate-fade-in-down opacity-100" : "opacity-0",
					)}
				>
					How It Works
				</h3>
				<h2
					className={cn(
						"scroll-m-20 text-center font-bold text-2xl tracking-tight transition-all duration-700 sm:text-3xl md:text-4xl lg:text-5xl",
						isVisible
							? "animate-delay-100 animate-fade-in-up opacity-100"
							: "opacity-0",
					)}
				>
					{howItWorks.headline}
				</h2>
				<div
					className={cn(
						"flex w-full items-center justify-center transition-all duration-700",
						isVisible
							? "animate-delay-200 animate-scale-in opacity-100"
							: "scale-95 opacity-0",
					)}
				>
					<Image
						src="/how-it-works.png"
						alt="How it works"
						width={1000}
						height={1000}
						className="h-auto w-full rounded-xl object-cover transition-transform duration-500 hover:scale-[1.01]"
						priority
					/>
				</div>
			</div>
		</section>
	);
}
