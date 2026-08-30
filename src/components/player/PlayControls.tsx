"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { useAudioPlayer } from "@/components/player/AudioProvider";
import { PlayIcon } from "@/components/PlayIcon";
import { PauseIcon } from "@/components/PauseIcon";
import { isSourceValid, type AudioTrack, type Song } from "@/components/Songs";
import { publicSongs, primaryTrackIndex } from "@/lib/publicSongs";

// Circular bordered play/pause button (song rows, songbook headers).
export function CirclePlayButton({
	song,
	trackIndex,
	size = "md",
	onStage = false,
}: {
	song: Song;
	trackIndex?: number;
	size?: "md" | "lg";
	onStage?: boolean;
}) {
	const player = useAudioPlayer();
	const index = trackIndex ?? primaryTrackIndex(song);
	const playing = player.isSongPlaying(song, index);
	const Icon = playing ? PauseIcon : PlayIcon;

	return (
		<button
			type="button"
			onClick={() => player.toggleSong(song, index)}
			aria-label={`${playing ? "Pause" : "Play"} ${song.title}`}
			className={clsx(
				"flex flex-none items-center justify-center rounded-full border transition",
				size === "md" ? "h-11 w-11" : "h-[72px] w-[72px]",
				onStage
					? "border-white/35 text-stage-ink hover:bg-stage-ink hover:text-stage"
					: "border-strong text-ink hover:bg-ink hover:text-surface",
			)}
		>
			<Icon
				className={clsx(
					"fill-current",
					size === "md" ? "h-3 w-3" : "h-[22px] w-[22px]",
				)}
			/>
		</button>
	);
}

// Squared, bordered, uppercase play button with a label (heroes, PLAY ALL).
export function LabelPlayButton({
	song,
	trackIndex,
	label,
	className,
}: {
	song: Song;
	trackIndex?: number;
	label?: string;
	className?: string;
}) {
	const player = useAudioPlayer();
	const index = trackIndex ?? primaryTrackIndex(song);
	const playing = player.isSongPlaying(song, index);
	const Icon = playing ? PauseIcon : PlayIcon;

	return (
		<button
			type="button"
			onClick={() => player.toggleSong(song, index)}
			className={clsx(
				"flex items-center gap-3 border border-white/60 px-8 py-4 text-[11px] font-bold tracking-[0.3em] text-white transition hover:bg-white hover:text-stage",
				className,
			)}
		>
			<Icon className="h-[11px] w-[11px] fill-current" />
			{label ?? (playing ? "PAUSE" : "PLAY")}
		</button>
	);
}

// Plays the whole set from the top.
export function PlayAllButton({ onStage = false }: { onStage?: boolean }) {
	const player = useAudioPlayer();
	const first = publicSongs[0];

	return (
		<button
			type="button"
			onClick={() => player.playSong(first, primaryTrackIndex(first), 0)}
			className={clsx(
				"border px-[34px] py-[15px] text-[11px] font-bold tracking-[0.3em] transition",
				onStage
					? "border-white/60 text-white hover:bg-white hover:text-stage"
					: "border-strong text-ink hover:bg-ink hover:text-surface",
			)}
		>
			PLAY ALL
		</button>
	);
}

// Squared track chips ("SONG", "CHOIR", …) that switch which track plays.
// Tracks whose audio files are missing are hidden after a HEAD check.
export function TrackChips({
	song,
	onStage = false,
	compact = false,
}: {
	song: Song;
	onStage?: boolean;
	compact?: boolean;
}) {
	const player = useAudioPlayer();
	const [validTracks, setValidTracks] = useState<AudioTrack[]>(
		() => song.audioTracks?.filter((track) => track.isPrimary) ?? [],
	);

	useEffect(() => {
		let cancelled = false;
		async function validate() {
			const tracks = song.audioTracks ?? [];
			const checks = await Promise.all(
				tracks.map(async (track) =>
					track.isPrimary || (await isSourceValid(track.src)) ? track : null,
				),
			);
			if (!cancelled)
				setValidTracks(checks.filter((track) => track !== null) as AudioTrack[]);
		}
		validate().catch(console.error);
		return () => {
			cancelled = true;
		};
	}, [song]);

	if (!song.audioTracks?.length) return null;

	return (
		<>
			{validTracks.map((track) => {
				const trackIndex = song.audioTracks!.indexOf(track);
				const active =
					player.song?.id === song.id && player.trackIndex === trackIndex;
				return (
					<button
						key={`${song.id}-${trackIndex}`}
						type="button"
						onClick={() => player.playSong(song, trackIndex)}
						className={clsx(
							"flex items-center gap-2 border font-bold uppercase transition",
							compact
								? "px-3 py-1.5 text-[10px] tracking-[0.14em]"
								: "px-4 py-2.5 text-[11px] tracking-[0.16em]",
							active
								? "border-accent bg-accent text-white"
								: onStage
									? "border-white/35 text-stage-ink hover:bg-stage-ink hover:text-stage"
									: "border-strong text-ink hover:bg-ink hover:text-surface",
						)}
					>
						<PlayIcon className="h-2 w-2 fill-current" />
						{track.trackType === "cover" && track.artist
							? `${track.trackType} · ${track.artist}`
							: track.trackType}
					</button>
				);
			})}
		</>
	);
}
