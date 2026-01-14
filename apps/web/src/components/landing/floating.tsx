"use client";

import { Marquee } from "../ui/marquee";
import {
	Logo01,
	Logo02,
	Logo03,
	Logo04,
	Logo05,
	Logo06,
	Logo07,
	Logo08,
} from "./logos";

export default function Floating() {
	return (
		<section className="w-full border-b dark:bg-neutral-950">
			<div className="container mx-auto flex max-w-6xl flex-col items-center space-y-6 border-x px-4 py-8 sm:space-y-8 sm:px-6 md:space-y-10 md:px-8 md:py-12">
				<div className="flex h-[80px] w-full items-center justify-center sm:h-[100px] md:h-[125px]">
					<div className="w-full max-w-full sm:max-w-xl md:max-w-4xl lg:max-w-6xl">
						<Marquee
							pauseOnHover
							className="mask-x-from-70% mask-x-to-90% [--duration:20s] [&_svg]:mr-6 sm:[&_svg]:mr-8 md:[&_svg]:mr-10"
						>
							<Logo01 />
							<Logo02 />
							<Logo03 />
							<Logo04 />
							<Logo05 />
							<Logo06 />
							<Logo07 />
							<Logo08 />
						</Marquee>
					</div>
				</div>
			</div>
		</section>
	);
}
