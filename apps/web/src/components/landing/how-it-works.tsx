import Image from "next/image";

const howItWorks = {
	headline:
		"The only platform you need to maintain reliable services and transparent communication",
};

export default function HowItWorks() {
	return (
		<section className="w-full border-b">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-6 border-x px-4 py-8 sm:space-y-8 sm:px-6 md:space-y-10 md:px-8 md:py-12">
				<h3 className="font-semibold text-green-400 text-lg uppercase tracking-tight sm:text-xl md:text-2xl">
					How It Works
				</h3>
				<h2 className="scroll-m-20 text-center font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
					{howItWorks.headline}
				</h2>
				<div className="flex w-full items-center justify-center">
					<Image
						src="/how-it-works.png"
						alt="How it works"
						width={1000}
						height={1000}
						className="h-auto w-full rounded-xl object-cover"
						priority
					/>
				</div>
			</div>
		</section>
	);
}
