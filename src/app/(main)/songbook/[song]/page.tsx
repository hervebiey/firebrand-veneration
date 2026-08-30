import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { allSongs } from "@/lib/allSongs";
import {
	formatArray,
	formatKeys,
	isMedley,
	type SingleSong,
	type Song,
} from "@/components/Songs";
import { getTime } from "@/components/Time";
import { YouTubeElements } from "@/components/YouTubeElements";
import { Lyrics } from "@/components/Lyrics";
import { CirclePlayButton, TrackChips } from "@/components/player/PlayControls";

interface StaticParam {
	song: string;
}

export function generateStaticParams(): StaticParam[] {
	return allSongs.map((song) => ({ song: song.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<StaticParam>;
}): Promise<Metadata> {
	const { song: id } = await params;
	const song = allSongs.find((entry) => entry.id === id);
	return { title: song?.title ?? "Notes" };
}

function metaLine(song: SingleSong): string {
	return `KEY ${formatKeys(song.keys)}  ·  MELODY ${formatArray(song.melody).toUpperCase()}  ·  LEAD ${formatArray(song.lead).toUpperCase()}  ·  ${formatArray(song.language).toUpperCase()}`;
}

function medleyMetaLine(medley: Song & { songList: SingleSong[] }): string {
	const keys = [
		...new Set(medley.songList.flatMap((song) => formatKeys(song.keys).split(" > "))),
	];
	const melodies = [
		...new Set(medley.songList.flatMap((song) => song.melody)),
	];
	const leads = [...new Set(medley.songList.flatMap((song) => song.lead))];
	const languages = [
		...new Set(medley.songList.flatMap((song) => song.language)),
	];
	return `KEY ${keys.join(" · ")}  ·  MELODY ${melodies.join(", ").toUpperCase()}  ·  LEAD ${leads.join(", ").toUpperCase()}  ·  ${languages.join(", ").toUpperCase()}`;
}

function SongBlock({
	song,
	showHead,
}: {
	song: SingleSong;
	showHead: boolean;
}) {
	const info = [
		song.originalArtist ? `Original: ${song.originalArtist}` : null,
		song.structureNotes ?? null,
		song.performanceNotes ?? null,
	]
		.filter(Boolean)
		.join("  ·  ");

	return (
		<div className="mt-7">
			{showHead && (
				<div className="mb-2.5 mt-11 border-t border-hairline pt-9">
					<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent sm:text-[11px]">
						{song.artist}
						{" · "}
						{getTime(song)}
					</p>
					<h2 className="mt-2 text-[22px] font-bold tracking-[0.04em] sm:text-[28px]">
						{song.title}
					</h2>
					<p className="mt-3 text-[11px] font-normal tracking-[0.06em] text-soft sm:text-[13px]">
						{metaLine(song)}
					</p>
				</div>
			)}
			{info && <p className="mt-3.5 text-sm text-soft">{info}</p>}
			<div className="mt-4.5 flex flex-wrap items-center gap-2.5">
				<TrackChips song={song} />
				{song.chordify?.map((url) => (
					<a
						key={url}
						href={url}
						target="_blank"
						rel="noreferrer"
						className="px-1 py-2.5 text-[11px] font-bold tracking-[0.18em] text-accent transition hover:underline"
					>
						CHORDIFY ↗
					</a>
				))}
			</div>
			{song.youtube && song.youtube.length > 0 && (
				<div className="mt-6">
					<YouTubeElements youtubeIds={song.youtube} />
				</div>
			)}
			<Lyrics song={song} />
		</div>
	);
}

export default async function Page({
	params,
}: {
	params: Promise<StaticParam>;
}) {
	const { song: id } = await params;
	const song = allSongs.find((entry) => entry.id === id);
	if (!song) notFound();

	const medleySong = isMedley(song);
	const overline = medleySong
		? `${song.songList.map((entry) => entry.title).join(" · ")} · ${getTime(song)}`
		: `${song.artist} · ${getTime(song)}`;

	return (
		<div className="mx-auto max-w-[760px] px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
			<Link
				href="/songbook"
				className="text-[10px] font-medium tracking-[0.24em] text-soft transition hover:text-ink sm:text-[11px]"
			>
				← THE SONGBOOK
			</Link>
			<header className="mt-6 flex items-center gap-5 sm:mt-8 sm:gap-[26px]">
				<CirclePlayButton song={song} size="lg" />
				<div className="min-w-0">
					<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent sm:text-[11px]">
						{overline}
					</p>
					<h1 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-[0.04em] sm:text-[42px]">
						{song.title}
					</h1>
				</div>
			</header>
			<p className="mt-5 text-[11px] font-normal tracking-[0.06em] text-soft sm:mt-6 sm:text-[13px]">
				{medleySong ? medleyMetaLine(song) : metaLine(song)}
			</p>
			{medleySong ? (
				<>
					{song.audioTracks && song.audioTracks.length > 0 && (
						<div className="mt-4.5 flex flex-wrap items-center gap-2.5">
							<TrackChips song={song} />
						</div>
					)}
					{song.youtube && song.youtube.length > 0 && (
						<div className="mt-6">
							<YouTubeElements youtubeIds={song.youtube} />
						</div>
					)}
					{song.songList.map((subSong) => (
						<SongBlock key={subSong.id} song={subSong} showHead />
					))}
				</>
			) : (
				<SongBlock song={song} showHead={false} />
			)}
		</div>
	);
}
