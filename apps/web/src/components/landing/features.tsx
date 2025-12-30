"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const feature = {
	headline: "Stay ahead of downtime",
	features: [
		{
			id: 1,
			category: "Real-time Monitoring",
			title:
				"Get complete visibility and control over your infrastructure health",
			imageUrl: "/feature-one.png",
		},
		{
			id: 2,
			category: "Status Pages",
			title: "Create beautiful status pages to keep your users informed",
			imageUrl: "/feature-two.png",
		},
		{
			id: 3,
			category: "Instant Alerts",
			title: "Get notified instantly when something goes down",
			imageUrl: "/feature-three.png",
		},
	],
};

function FeatureCard({
	feature: f,
	index,
}: {
	feature: (typeof feature.features)[0];
	index: number;
}) {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col items-center gap-6 transition-all duration-700 sm:gap-8 md:flex-row md:gap-x-12 md:gap-y-6 md:odd:flex-row-reverse",
				isVisible
					? "animate-fade-in-up opacity-100"
					: "translate-y-8 opacity-0",
			)}
			style={{
				animationDelay: `${index * 150}ms`,
			}}
		>
			<div className="aspect-[4/3] w-full overflow-hidden rounded-xl transition-transform duration-500 hover:scale-[1.02] sm:rounded-2xl">
				<Image
					src={f.imageUrl}
					alt={f.title}
					width={1000}
					height={1000}
					className="h-full w-full rounded-xl object-cover transition-transform duration-500 hover:scale-105 sm:rounded-2xl"
				/>
			</div>

			<div className="w-full shrink-0 text-center md:basis-1/2 md:text-left">
				<h3 className="scroll-m-20 font-semibold text-base text-green-400 uppercase tracking-tight transition-colors duration-200 hover:text-green-500 sm:text-lg md:text-xl lg:text-2xl">
					{f.category}
				</h3>
				<h2 className="my-3 scroll-m-20 font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
					{f.title}
				</h2>
			</div>
		</div>
	);
}

export default function Features() {
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
					Some Features You'll Love
				</h3>
				<h2
					className={cn(
						"text-center font-bold text-2xl tracking-tight transition-all duration-700 sm:text-3xl md:text-4xl lg:text-5xl",
						isVisible
							? "animate-delay-100 animate-fade-in-up opacity-100"
							: "opacity-0",
					)}
				>
					{feature.headline}
				</h2>
				<div className="flex w-full items-center justify-center">
					<div className="mx-auto mt-6 w-full space-y-12 sm:mt-8 sm:space-y-16 md:mt-12 md:space-y-20 lg:mt-16">
						{feature.features.map((f, index) => (
							<FeatureCard key={f.id} feature={f} index={index} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
