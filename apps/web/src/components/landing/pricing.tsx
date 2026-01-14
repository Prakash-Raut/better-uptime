"use client";

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
import {
	ArrowUpRightIcon,
	CircleCheckIcon,
	CircleHelpIcon,
} from "lucide-react";
import { useState } from "react";

const tooltipContent = {
	monitors: "Number of URLs or endpoints you can monitor simultaneously.",
	checkInterval: "How frequently we check your monitors for uptime status.",
	statusPages: "Public status pages you can create to inform your users.",
	retention: "How long we store your monitoring history and data.",
};

const YEARLY_DISCOUNT = 20;
const plans = [
	{
		name: "Starter",
		price: 9,
		description:
			"Perfect for small projects and personal websites. Monitor your essential services.",
		features: [
			{ title: "Up to 10 monitors", tooltip: tooltipContent.monitors },
			{
				title: "5-minute check interval",
				tooltip: tooltipContent.checkInterval,
			},
			{ title: "1 status page", tooltip: tooltipContent.statusPages },
			{ title: "30 days data retention", tooltip: tooltipContent.retention },
			{ title: "Email alerts" },
			{ title: "Basic incident management" },
		],
	},
	{
		name: "Professional",
		price: 29,
		isRecommended: true,
		description:
			"Ideal for growing businesses. Monitor multiple services with advanced features.",
		features: [
			{ title: "Up to 50 monitors", tooltip: tooltipContent.monitors },
			{
				title: "1-minute check interval",
				tooltip: tooltipContent.checkInterval,
			},
			{ title: "5 status pages", tooltip: tooltipContent.statusPages },
			{ title: "90 days data retention", tooltip: tooltipContent.retention },
			{ title: "Email, SMS & Slack alerts" },
			{ title: "Advanced incident management" },
			{ title: "Custom status page domains" },
			{ title: "API access" },
		],
		isPopular: true,
	},
	{
		name: "Enterprise",
		price: 99,
		description:
			"Built for teams and organizations. Unlimited monitoring with enterprise-grade features.",
		features: [
			{ title: "Unlimited monitors", tooltip: tooltipContent.monitors },
			{
				title: "30-second check interval",
				tooltip: tooltipContent.checkInterval,
			},
			{ title: "Unlimited status pages", tooltip: tooltipContent.statusPages },
			{ title: "1 year data retention", tooltip: tooltipContent.retention },
			{ title: "All alert channels" },
			{ title: "Advanced analytics & reports" },
			{ title: "Team collaboration tools" },
			{ title: "Priority support" },
			{ title: "SLA guarantee" },
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
