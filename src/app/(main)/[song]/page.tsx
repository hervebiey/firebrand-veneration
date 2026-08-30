import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import posterImage from "@/images/poster.png";
import { allSongs } from "@/lib/allSongs";
import {
	getPublicSong,
	nextPublicSong,
	notesIdFor,
	publicSongs,
} from "@/lib/publicSongs";
import { isMedley } from "@/components/Songs";
import { getTime } from "@/components/Time";
import { YouTubeElements } from "@/components/YouTubeElements";
import { SongKeyPanel } from "@/components/SongKeyPanel";
import { FollowAlongLyrics } from "@/components/FollowAlongLyrics";
import { LabelPlayButton, TrackChips } from "@/components/player/PlayControls";
import { SongbookRedirect } from "@/components/SongbookRedirect";

interface StaticParam {
	song: string;
}

export function generateStaticParams(): StaticParam[] {
	const publicIds = publicSongs.map((song) => ({ song: song.id }));
	const medleyIds = allSongs
		.filter(isMedley)
		.map((medley) => ({ song: medley.id }));
	return [...publicIds, ...medleyIds];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<StaticParam>;
}): Promise<Metadata> {
	const { song: id } = await params;
	const song = getPublicSong(id) ?? allSongs.find((entry) => entry.id === id);
	return { title: song?.title ?? "Song" };
}

export default async function Page({
	params,
}: {
	params: Promise<StaticParam>;
}) {
	const { song: id } = await params;

	// A medley's own page lives in the songbook — send old links there.
	const medley = allSongs.filter(isMedley).find((entry) => entry.id === id);
	if (medley) return <SongbookRedirect id={medley.id} />;

	const song = getPublicSong(id);
	if (!song) notFound();

	const upNext = nextPublicSong(song.id);
	const credit = [
		song.originalArtist ? `Original: ${song.originalArtist}` : null,
		song.structureNotes ?? null,
	]
		.filter(Boolean)
		.join("  ·  ");
	const watchUrl = song.youtube?.[0]
		? `https://www.youtube.com/watch?v=${song.youtube[0]}`
		: null;

	return (
		<article>
			<section className="relative overflow-hidden bg-stage px-6 pb-11 pt-24 sm:px-14 sm:pb-18 sm:pt-36">
				<Image
					src={posterImage}
					alt=""
					aria-hidden
					fill
					priority
					className="object-cover opacity-[0.22] saturate-[0.8]"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-stage/30 to-stage/85" />
				<div className="relative mx-auto max-w-[760px] text-center">
					<Link
						href="/#listen"
						className="text-[10px] font-medium tracking-[0.26em] text-white/60 transition hover:text-white sm:text-[11px]"
					>
						← THE VENERATION SET
					</Link>
					<p className="mt-6 text-[10px] font-medium uppercase tracking-[0.4em] text-white/65 sm:mt-10 sm:text-xs">
						{song.artist}
						{" · "}
						{getTime(song)}
					</p>
					<h1 className="mt-3 text-balance text-[34px] font-bold leading-[1.1] tracking-[0.08em] text-white sm:text-[56px] sm:leading-[1.08]">
						{song.title}
					</h1>
					{credit && (
						<p className="mt-3.5 text-xs text-white/60 sm:mt-4.5 sm:text-sm">
							{credit}
						</p>
					)}
					<div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-3.5">
						<LabelPlayButton song={song} />
						{watchUrl && (
							<a
								href={watchUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center border border-white/25 px-8 py-4 text-[11px] font-bold tracking-[0.3em] text-white/75 transition hover:border-white/60 hover:text-white"
							>
								YOUTUBE ↗
							</a>
						)}
					</div>
				</div>
			</section>
			<div className="mx-auto max-w-[860px] px-5 pb-6 pt-7 sm:px-14 sm:pt-14">
				<YouTubeElements youtubeIds={song.youtube} />
				<SongKeyPanel song={song} />
				<div className="mt-6 flex flex-wrap items-center gap-2.5">
					<span className="mr-1 text-[10px] font-bold tracking-[0.24em] text-soft">
						PARTS
					</span>
					<TrackChips song={song} />
					{song.chordify?.map((url) => (
						<a
							key={url}
							href={url}
							target="_blank"
							rel="noreferrer"
							className="px-1 py-2.5 text-[11px] font-bold tracking-[0.16em] text-accent transition hover:underline"
						>
							CHORDIFY ↗
						</a>
					))}
				</div>
				<FollowAlongLyrics song={song} />
				<div className="mt-10 flex flex-col gap-4 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
					<Link
						href={`/songbook/${notesIdFor(song.id)}`}
						className="text-[11px] font-bold tracking-[0.2em] text-soft transition hover:text-accent"
					>
						REHEARSE IT IN THE SONGBOOK →
					</Link>
					<div className="flex items-baseline gap-4">
						<span className="text-[10px] font-bold tracking-[0.24em] text-soft">
							UP NEXT
						</span>
						<Link
							href={`/${upNext.id}`}
							className="text-base font-bold tracking-[0.06em] transition hover:text-accent"
						>
							{upNext.title} →
						</Link>
					</div>
				</div>
			</div>
		</article>
	);
}
