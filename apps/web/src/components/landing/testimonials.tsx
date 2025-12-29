import { Avatar, AvatarImage } from "../ui/avatar";

const testimonial = {
	headline: "Trusted by teams worldwide",
	description: "What Our Customers Are Saying",
	items: [
		{
			id: 1,
			name: "John Doe",
			designation: "Software Engineer",
			company: "TechCorp",
			testimonial:
				"Better Uptime has been a game-changer. We monitor 200+ microservices and the alerting is so reliable that we've eliminated false positives entirely. The status page keeps our customers informed without our team having to manually update anything.",
			avatar: "https://randomuser.me/api/portraits/men/15.jpg",
		},
		{
			id: 2,
			name: "Sophia Lee",
			designation: "CEO",
			company: "InsightTech",
			testimonial:
				"We switched from Better Stack to Better Uptime and haven't looked back. The incident management features are incredibly intuitive, and having monitoring + status pages + on-call in one platform saves us $500/month.",
			avatar: "https://randomuser.me/api/portraits/women/6.jpg",
		},
		{
			id: 3,
			name: "Michael Johnson",
			designation: "CTO",
			company: "DesignPro",
			testimonial:
				"With 50+ engineers on call, managing rotations was a nightmare. Better Uptime's scheduling and escalation policies just work — we've reduced our mean time to acknowledgment by 60%.",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
		},
	],
};

export default function Testimonials() {
	return (
		<section className="w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-6 border-x px-4 py-8 sm:space-y-8 sm:px-6 md:space-y-10 md:px-8 md:py-12">
				<h3 className="scroll-m-20 font-semibold text-green-400 text-lg uppercase tracking-tight sm:text-xl md:text-2xl">
					{testimonial.headline}
				</h3>
				<h2 className="scroll-m-20 text-center font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
					{testimonial.description}
				</h2>
				<div className="mx-auto w-full max-w-7xl">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{testimonial.items.map((t) => (
							<div
								key={t.id}
								className="flex flex-col rounded-xl bg-accent p-4 sm:p-6"
							>
								<p className="mb-6 flex-grow text-sm leading-relaxed sm:text-base">
									{t.testimonial}
								</p>
								<div className="flex items-center gap-3 sm:gap-4">
									<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
										<AvatarImage src={t.avatar} />
									</Avatar>
									<div>
										<p className="font-semibold text-base sm:text-lg">
											{t.name}
										</p>
										<p className="text-gray-500 text-xs sm:text-sm">
											{t.designation} @ {t.company}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
