const moreFeatures = {
	headline: "Automatic monitoring",
	description:
		"Catch downtime before your users do. Get instant alerts when something goes wrong.",
};

export default function MoreFeatures() {
	return (
		<section className="w-full border-b">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-10 border-x px-8 py-5">
				<div
					className="justify-left flex h-[350px] w-full items-center rounded-xl bg-gray-100 pl-10"
					style={{
						backgroundImage: "url('/cta.jpg')",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="space-y-4">
						<h3 className="scroll-m-20 font-bold text-3xl tracking-tight md:text-5xl">
							{moreFeatures.headline}
						</h3>
						<p className="max-w-lg text-base leading-relaxed md:text-lg">
							{moreFeatures.description}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
