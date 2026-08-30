import Link from "next/link";
import React from "react";
import { type Metadata } from "next";

import { allSongs } from "@/lib/allSongs";
import { singersByParts } from "@/lib/singersByParts";
import { formatArray, isMedley, type Song } from "@/components/Songs";
import { getTime } from "@/components/Time";
import { CirclePlayButton } from "@/components/player/PlayControls";

export const metadata: Metadata = {
	title: "The Songbook",
};

function ordinalSuffix(i: number) {
	const j = i % 10,
		k = i % 100;
	if (j === 1 && k !== 11) return `${i}st`;
	if (j === 2 && k !== 12) return `${i}nd`;
	if (j === 3 && k !== 13) return `${i}rd`;
	return `${i}th`;
}

function songSummary(song: Song): { sub: string; meta: string } {
	if (isMedley(song)) {
		const sub = song.songList
			.map((entry) =>
				entry.artist ? `${entry.title} (${entry.artist})` : entry.title,
			)
			.join(" · ");
		const first = song.songList[0];
		const meta = first
			? `${first.keys[0]?.note ?? ""} · ${formatArray(first.melody)}`
			: "";
		return { sub, meta };
	}
	const sub = [
		song.artist,
		song.originalArtist ? `Original: ${song.originalArtist}` : null,
	]
		.filter(Boolean)
		.join(" · ");
	return {
		sub,
		meta: `${song.keys[0]?.note ?? ""} · ${formatArray(song.melody)}`,
	};
}

export default function SongbookPage() {
	const sessions = [...new Set(allSongs.map((song) => song.session ?? 0))]
		.filter((session) => session > 0)
		.sort((a, b) => a - b);

	return (
		<div className="mx-auto max-w-[860px] px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
			<div className="flex flex-wrap items-baseline justify-between gap-3">
				<div>
					<p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.4em] text-accent sm:text-[11px]">
						The songbook
					</p>
					<h1 className="text-[28px] font-bold tracking-[0.06em] sm:text-[40px]">
						Songs &amp; Lyrics
					</h1>
				</div>
				<p className="text-[11px] tracking-[0.08em] text-soft sm:text-xs">
					LYRICS · KEYS · VOICE PARTS · PRACTICE TRACKS
				</p>
			</div>
			{sessions.map((sessionNumber) => {
				const sessionSongs = allSongs
					.filter((song) => song.session === sessionNumber)
					.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
				return (
					<div key={sessionNumber} className="mt-8 sm:mt-11">
						<h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.34em] text-soft sm:text-[11px]">
							{ordinalSuffix(sessionNumber)} Session
						</h2>
						<div className="border-t border-hairline">
							{sessionSongs.map((song) => {
								const { sub, meta } = songSummary(song);
								return (
									<div
										key={song.id}
										className="flex items-center gap-3.5 border-b border-hairline py-4 sm:gap-[22px] sm:py-[22px]"
									>
										<CirclePlayButton song={song} />
										<Link
											href={`/songbook/${song.id}`}
											className="min-w-0 flex-1"
										>
											<span className="block text-[17px] font-medium transition hover:text-accent sm:text-xl">
												{song.title}
											</span>
											<span className="mt-0.5 block truncate text-xs text-soft sm:text-[13px]">
												{sub}
											</span>
											<span className="mt-0.5 block text-[11px] tracking-[0.1em] text-soft sm:hidden">
												{meta} · {getTime(song)}
											</span>
										</Link>
										<span className="hidden flex-none text-xs text-soft sm:block">
											{meta}
										</span>
										<span className="hidden flex-none text-[13px] text-soft sm:block">
											{getTime(song)}
										</span>
										<Link
											href={`/songbook/${song.id}`}
											className="flex-none py-2 text-[10px] font-bold tracking-[0.2em] text-accent transition hover:underline sm:text-[11px]"
										>
											NOTES →
										</Link>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
			<div className="mt-10 sm:mt-13">
				<h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.34em] text-soft sm:mb-5 sm:text-[11px]">
					Voices by part
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
					{Object.entries(singersByParts).map(([part, singers]) => (
						<div key={part}>
							<p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent sm:mb-2 sm:text-xs">
								{part}
							</p>
							<p className="text-sm leading-[1.9] sm:text-[15px]">
								{singers.join(", ")}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
