import Image from "next/image";
import Link from "next/link";
import React from "react";

import posterImage from "@/images/poster.png";
import { singersByParts } from "@/lib/singersByParts";
import { publicSongs } from "@/lib/publicSongs";
import { getTime } from "@/components/Time";
import {
	CirclePlayButton,
	PlayAllButton,
} from "@/components/player/PlayControls";

const tiles = [
	{ title: "LISTEN THE SET", sub: "THREE SONGS", href: "/#listen", position: "center 20%" },
	{ title: "VENERATION LIVE", sub: "THE WORSHIP EVENING", href: "/#event", position: "center 45%" },
	{ title: "THE COLLECTIVE", sub: "TWELVE VOICES", href: "/#collective", position: "center 70%" },
	{ title: "SONGBOOK", sub: "LYRICS, KEYS & PARTS", href: "/songbook", position: "center 95%" },
];

function Hero() {
	return (
		<section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-stage sm:min-h-[92vh]">
			<Image
				src={posterImage}
				alt=""
				aria-hidden
				fill
				priority
				className="object-cover opacity-35 saturate-[0.85]"
			/>
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(75% 75% at 50% 40%, transparent 0%, rgba(10,9,8,0.75) 100%)",
				}}
			/>
			<div className="relative px-8 pb-20 pt-28 text-center sm:pt-32">
				<p className="mb-4 text-[10px] font-medium uppercase tracking-[0.5em] text-white/65 sm:mb-5 sm:text-[11px]">
					VNC Worldwide
				</p>
				<h1 className="text-[37px] font-bold leading-none tracking-[0.2em] text-white sm:text-[100px] sm:tracking-[0.22em]">
					FIREBRAND
				</h1>
			</div>
		</section>
	);
}

function Tiles() {
	return (
		<section className="px-4 py-10 sm:px-14 sm:py-16">
			<div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[18px]">
				{tiles.map((tile) => (
					<Link
						key={tile.title}
						href={tile.href}
						className="group relative block h-[150px] overflow-hidden bg-stage sm:h-[300px]"
					>
						<Image
							src={posterImage}
							alt=""
							aria-hidden
							fill
							className="object-cover opacity-50 saturate-[0.8] transition duration-500 group-hover:scale-105"
							style={{ objectPosition: tile.position }}
						/>
						<span className="absolute inset-0 bg-stage/55 transition group-hover:bg-stage/35" />
						<span className="relative flex h-full flex-col items-center justify-center gap-2 sm:gap-2.5">
							<span className="text-[17px] font-bold tracking-[0.22em] text-white sm:text-[22px]">
								{tile.title}
							</span>
							<span className="text-[10px] font-medium tracking-[0.3em] text-white/65 sm:text-[11px]">
								{tile.sub}
							</span>
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

function Listen() {
	return (
		<section id="listen" className="scroll-mt-16 px-5 py-14 sm:px-14 sm:py-18">
			<div className="mx-auto max-w-[760px]">
				<p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-accent sm:text-[11px]">
					Listen
				</p>
				<h2 className="mb-8 text-center text-2xl font-bold tracking-[0.06em] sm:mb-10 sm:text-[34px]">
					The Veneration Set
				</h2>
				<div className="border-t border-hairline">
					{publicSongs.map((song) => (
						<div
							key={song.id}
							className="flex items-center gap-4 border-b border-hairline py-4 sm:gap-[22px] sm:py-6"
						>
							<CirclePlayButton song={song} />
							<Link href={`/${song.id}`} className="min-w-0 flex-1">
								<span className="block truncate text-[17px] font-medium transition hover:text-accent sm:text-xl">
									{song.title}
								</span>
								<span className="mt-0.5 block truncate text-xs font-normal text-soft sm:text-[13px]">
									{song.artist}
									{song.originalArtist ? ` · Original: ${song.originalArtist}` : ""}
								</span>
							</Link>
							<span className="flex-none text-xs text-soft sm:text-[13px]">
								{getTime(song)}
							</span>
							<Link
								href={`/${song.id}`}
								aria-label={`Open song page for ${song.title}`}
								className="flex-none p-2 text-base text-soft transition hover:text-ink"
							>
								→
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Live() {
	return (
		<section id="event" className="scroll-mt-16 px-6 py-14 sm:px-14 sm:py-20">
			<div className="mx-auto max-w-[760px] text-center">
				<p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-accent sm:text-[11px]">
					Live
				</p>
				<h2 className="mb-7 text-balance text-2xl font-bold tracking-[0.06em] sm:mb-9 sm:text-[34px]">
					Veneration Night with the King
				</h2>
				<Image
					src={posterImage}
					alt="Veneration event poster"
					className="mx-auto w-60 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] sm:w-[340px]"
				/>
				<p className="mx-auto mt-6 max-w-[46ch] text-sm leading-relaxed text-soft sm:mt-8 sm:text-base">
					VNC Firebrand&apos;s worship evening — two sessions of praise led by
					the collective&apos;s voices.
				</p>
				<div className="mt-6 flex justify-center sm:mt-8">
					<PlayAllButton />
				</div>
			</div>
		</section>
	);
}

function Collective() {
	return (
		<section id="collective" className="scroll-mt-16 px-6 py-12 sm:px-14 sm:pb-22 sm:pt-14">
			<div className="mx-auto max-w-[900px] text-center">
				<p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-accent sm:text-[11px]">
					The collective
				</p>
				<h2 className="mb-7 text-2xl font-bold tracking-[0.06em] sm:mb-11 sm:text-[34px]">
					Twelve Voices, Three Parts
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-10">
					{Object.entries(singersByParts).map(([part, singers]) => (
						<div key={part}>
							<p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-soft sm:mb-3.5 sm:text-xs">
								{part}
							</p>
							<p className="text-base font-medium leading-loose sm:text-[17px]">
								{singers.join(" · ")}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	const year = new Date().getFullYear();
	return (
		<div>
			<Hero />
			<section className="px-6 pt-14 sm:px-14 sm:pt-24">
				<p className="mx-auto max-w-[46ch] text-balance text-center text-xl font-normal leading-[1.65] sm:text-[26px]">
					&ldquo;Two sessions of praise — the set, the voices, and everything
					the choir needs to carry the night.&rdquo;
				</p>
			</section>
			<Tiles />
			<Listen />
			<Live />
			<Collective />
			<footer className="flex flex-col items-center justify-between gap-3 border-t border-hairline px-6 py-8 sm:flex-row sm:px-14">
				<p className="text-xs text-soft">
					&copy; {year} VNC Worldwide. All rights reserved.
				</p>
				<Link
					href="/songbook"
					className="text-[11px] font-medium tracking-[0.26em] text-soft transition hover:text-ink"
				>
					THE SONGBOOK →
				</Link>
			</footer>
		</div>
	);
}
