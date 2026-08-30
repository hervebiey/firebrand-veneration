"use client";

import React, { useState } from "react";

import { formatArray, type SingleSong } from "@/components/Songs";
import { getTime } from "@/components/Time";
import { transposeChord, transposedKeyLabel } from "@/lib/transpose";

// Key / melody / lead metadata with a transpose stepper, plus tempo & chords.
export function SongKeyPanel({ song }: { song: SingleSong }) {
	const [transpose, setTranspose] = useState(0);

	const keyText = song.keys
		.map((key) => transposedKeyLabel(key, transpose))
		.join(" > ");
	const offsetLabel = transpose
		? ` [${transpose > 0 ? "+" : ""}${transpose}]`
		: "";
	const tempoParts = [
		song.bpm ? `≈ ${song.bpm} BPM` : null,
		song.meter ?? null,
		getTime(song),
	].filter(Boolean);

	return (
		<>
			<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5 sm:mt-11">
				<p className="text-xs font-medium tracking-[0.12em] text-soft">
					KEY {keyText}
					{offsetLabel}&ensp;·&ensp;MELODY {formatArray(song.melody).toUpperCase()}
					&ensp;·&ensp;LEAD {formatArray(song.lead).toUpperCase()}&ensp;·&ensp;
					{formatArray(song.language).toUpperCase()}
				</p>
				<div className="flex items-center gap-2.5">
					<span className="text-[10px] font-bold tracking-[0.24em] text-soft">
						TRANSPOSE
					</span>
					<button
						type="button"
						onClick={() => setTranspose((t) => Math.max(-6, t - 1))}
						aria-label="Transpose down"
						className="h-8 w-8 border border-strong text-sm transition hover:bg-ink hover:text-surface"
					>
						−
					</button>
					<span className="min-w-[76px] text-center text-xs font-bold tracking-[0.08em] text-accent">
						{transposedKeyLabel(song.keys[0], transpose)}
					</span>
					<button
						type="button"
						onClick={() => setTranspose((t) => Math.min(6, t + 1))}
						aria-label="Transpose up"
						className="h-8 w-8 border border-strong text-sm transition hover:bg-ink hover:text-surface"
					>
						+
					</button>
				</div>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-hairline pb-4">
				<span className="text-xs font-medium tracking-[0.12em] text-soft">
					{tempoParts.join("  ·  ")}
				</span>
				{song.chords && song.chords.length > 0 && (
					<span className="text-xs font-medium tracking-[0.12em] text-soft">
						CHORDS&ensp;
						<span className="font-bold text-accent">
							{song.chords
								.map((chord) => transposeChord(chord, transpose))
								.join("  ·  ")}
						</span>
					</span>
				)}
			</div>
		</>
	);
}
