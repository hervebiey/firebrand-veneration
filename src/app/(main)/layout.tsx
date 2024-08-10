import Image from "next/image";
import Link from "next/link";

import { SongsSection } from "@/components/SongsSection";
import { AudioProvider } from "@/components/AudioProvider";
import { AudioPlayer } from "@/components/player/AudioPlayer";
import { TinyWaveFormIcon } from "@/components/TinyWaveFormIcon";
import { Waveform } from "@/components/player/Waveform";
import posterImage from "@/images/poster.png";
import React from "react";
import { singersByParts } from "@/lib/singersByParts";

const VocalPart: React.FC<{ part: string, singers: string }> = ({ part, singers }) => (
	<>
		<h2 className="sr-only flex items-center font-mono text-sm font-medium leading-7 text-slate-900 lg:not-sr-only">
			<TinyWaveFormIcon colors={["fill-indigo-300", "fill-blue-300"]}
			                  className="h-2.5 w-2.5"/>
			<span className="ml-2.5">{part}</span>
		</h2>
		<p className="mt-2.5 mb-3 font-medium leading-8 text-slate-700">
			{singers}
		</p>
	</>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const year = new Date().getFullYear();
	return (
		<AudioProvider>
			<header
				className="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
				<div
					className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
					<span className="mt-6 flex gap-6 font-bold text-slate-900">
						Copyright &copy; {year} VNC Worldwide. All rights reserved.
					</span>
				</div>
				<div
					className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
					<Link href="/"
					      className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
					      aria-label="Homepage">
						<Image className="w-full"
						       src={posterImage}
						       alt=""
						       sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
						       priority/>
						<div
							className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl"/>
					</Link>
					<div className="mt-10 text-center lg:mt-12 lg:text-left hidden lg:block">
						<p className="text-xl font-bold text-slate-900">Songs List</p>
					</div>
					<SongsSection className="mt-5 lg:mt-7 hidden lg:block"/>
					<div className="mt-5 lg:mt-7 text-center lg:text-left">
						<p className="text-xl font-bold text-slate-900">Voices</p>
					</div>
					<section className="mt-5 lg:mt-7 text-center lg:text-left">
						{Object.entries(singersByParts).map(([part, singers]) => (
							<VocalPart key={part} part={part} singers={singers.join(", ")}/>
						))}
						<div className="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden"/>
					</section>
				</div>
			</header>
			<main className="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
				<Waveform className="absolute left-0 top-0 h-20 w-full"/>
				<div className="relative">{children}</div>
			</main>
			<div className="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">
				<AudioPlayer/>
			</div>
		</AudioProvider>
	);
}
