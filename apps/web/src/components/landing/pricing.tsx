"use client";

import {
	ArrowUpRightIcon,
	CircleCheckIcon,
	CircleHelpIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const tooltipContent = {
	styles: "Choose from a variety of styles to suit your preferences.",
	filters: "Choose from a variety of filters to enhance your portraits.",
	credits: "Use these credits to retouch your portraits.",
};

const YEARLY_DISCOUNT = 20;
const plans = [
	{
		name: "Starter",
		price: 20,
		description:
			"Get 20 AI-generated portraits with 2 unique styles and filters.",
		features: [
			{ title: "5 hours turnaround time" },
			{ title: "20 AI portraits" },
			{ title: "Choice of 2 styles", tooltip: tooltipContent.styles },
			{ title: "Choice of 2 filters", tooltip: tooltipContent.filters },
			{ title: "2 retouch credits", tooltip: tooltipContent.credits },
		],
	},
	{
		name: "Advanced",
		price: 40,
		isRecommended: true,
		description:
			"Get 50 AI-generated portraits with 5 unique styles and filters.",
		features: [
			{ title: "3 hours turnaround time" },
			{ title: "50 AI portraits" },
			{ title: "Choice of 5 styles", tooltip: tooltipContent.styles },
			{ title: "Choice of 5 filters", tooltip: tooltipContent.filters },
			{ title: "5 retouch credits", tooltip: tooltipContent.credits },
		],
		isPopular: true,
	},
	{
		name: "Premium",
		price: 80,
		description:
			"Get 100 AI-generated portraits with 10 unique styles and filters.",
		features: [
			{ title: "1-hour turnaround time" },
			{ title: "100 AI portraits" },
			{ title: "Choice of 10 styles", tooltip: tooltipContent.styles },
			{ title: "Choice of 10 filters", tooltip: tooltipContent.filters },
			{ title: "10 retouch credits", tooltip: tooltipContent.credits },
		],
	},
];

export default function Pricing() {
	const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("monthly");

	return (
		<section className="w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-10 border-x px-8 py-5">
				<h3 className="font-semibold text-2xl text-green-400 uppercase tracking-tight">
					Pricing
				</h3>
				<h2 className="text-center font-bold text-3xl tracking-tight md:text-5xl">
					Choose the plan that's right for you
				</h2>
				<div className="flex w-full items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<Tabs
							value={selectedBillingPeriod}
							onValueChange={setSelectedBillingPeriod}
							className="mt-8"
						>
							<TabsList className="h-11 rounded-full border bg-background">
								<TabsTrigger
									value="monthly"
									className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									Monthly
								</TabsTrigger>
								<TabsTrigger
									value="yearly"
									className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									Yearly (Save {YEARLY_DISCOUNT}%)
								</TabsTrigger>
							</TabsList>
						</Tabs>
						<div className="mx-auto mt-12 grid max-w-(--breakpoint-lg) grid-cols-1 items-center gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-0">
							{plans.map((plan) => (
								<div
									key={plan.name}
									className={cn("relative border bg-background p-6 px-8", {
										"lg:-mx-2 z-1 overflow-hidden px-10 py-14 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)]":
											plan.isPopular,
										"dark:bg-neutral-900": plan.isPopular,
									})}
								>
									{plan.isPopular && (
										<Badge className="-translate-y-1/2 absolute top-10 right-10 translate-x-1/2 rotate-45 rounded-none px-10 uppercase">
											Most Popular
										</Badge>
									)}
									<h3 className="font-medium text-lg">{plan.name}</h3>
									<p className="mt-2 font-bold text-4xl">
										$
										{selectedBillingPeriod === "monthly"
											? plan.price
											: plan.price * ((100 - YEARLY_DISCOUNT) / 100)}
										<span className="ml-1.5 font-normal text-muted-foreground text-sm">
											/month
										</span>
									</p>
									<p className="mt-4 font-medium text-muted-foreground">
										{plan.description}
									</p>

									<Button
										variant={plan.isPopular ? "default" : "outline"}
										size="lg"
										className="mt-6 w-full rounded-full text-base"
									>
										Get Started <ArrowUpRightIcon className="h-4 w-4" />
									</Button>
									<Separator className="my-8" />
									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li
												key={feature.title}
												className="flex items-start gap-1.5"
											>
												<CircleCheckIcon className="mt-1 h-4 w-4 text-green-600" />
												{feature.title}
												{feature.tooltip && (
													<Tooltip>
														<TooltipTrigger className="cursor-help">
															<CircleHelpIcon className="mt-1 h-4 w-4 text-gray-500" />
														</TooltipTrigger>
														<TooltipContent>{feature.tooltip}</TooltipContent>
													</Tooltip>
												)}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
