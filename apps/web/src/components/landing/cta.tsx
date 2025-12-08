import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const cta = {
	headline: "Start with a free trial today!",
};

export default function CTA() {
	return (
		<section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-linear-to-br from-green-300 via-green-50 to-green-300 py-12 sm:py-16 md:py-20 lg:min-h-screen lg:py-24">
			<div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-8">
				<h2 className="mb-6 font-bold text-3xl leading-tight sm:mb-8 sm:text-4xl md:mb-10 md:text-5xl lg:text-6xl xl:text-7xl">
					{cta.headline}
				</h2>

				<div className="flex w-full items-center justify-center px-4 sm:w-auto sm:px-0">
					<Button
						asChild
						size="lg"
						className="group w-full rounded-xl text-base shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-8 sm:text-lg"
					>
						<Link
							href="/login"
							className="flex items-center justify-center gap-2"
						>
							Try for free
							<ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
