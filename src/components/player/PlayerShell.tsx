"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import WaveSurfer from "wavesurfer.js";

import posterImage from "@/images/poster.png";
import {
	useAudioPlayer,
	usePlayerProgress,
} from "@/components/player/AudioProvider";
import { TrackChips } from "@/components/player/PlayControls";
import { PlayIcon } from "@/components/PlayIcon";
import { PauseIcon } from "@/components/PauseIcon";
import { formatClock } from "@/components/Time";
import { capitalizeTrackType, type Song } from "@/components/Songs";
import { adjacentPlayable } from "@/lib/publicSongs";
import { timelineForSong } from "@/components/FollowAlongLyrics";

const ACCENT = "#e11d48";

type VisMode = "art" | "video" | "lyrics" | "visual";

function PrevIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M19 6v12L9 12zM7 5h-2v14h2z" />
		</svg>
	);
}

function NextIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M5 6l10 6-10 6zM17 5h2v14h-2z" />
		</svg>
	);
}

function RewindIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M8 5L5 8M5 8L8 11M5 8H13.5C16.5376 8 19 10.4624 19 13.5C19 15.4826 18.148 17.2202 17 18.188" />
			<path d="M5 15V19" />
			<path d="M8 18V16C8 15.4477 8.44772 15 9 15H10C10.5523 15 11 15.4477 11 16V18C11 18.5523 10.5523 19 10 19H9C8.44772 19 8 18.5523 8 18Z" />
		</svg>
	);
}

function ForwardIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M16 5L19 8M19 8L16 11M19 8H10.5C7.46243 8 5 10.4624 5 13.5C5 15.4826 5.85204 17.2202 7 18.188" />
			<path d="M13 15V19" />
			<path d="M16 18V16C16 15.4477 16.4477 15 17 15H18C18.5523 15 19 15.4477 19 16V18C19 18.5523 18.5523 19 18 19H17C16.4477 19 16 18.5523 16 18Z" />
		</svg>
	);
}

function MuteIcon({
	muted,
	...props
}: React.ComponentPropsWithoutRef<"svg"> & { muted: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-[19px] w-[19px] fill-current stroke-current"
			{...props}
		>
			<path d="M12 6L8 10H6C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H8L12 18V6Z" />
			{muted ? (
				<>
					<path d="M16 10L19 13" fill="none" />
					<path d="M19 10L16 13" fill="none" />
				</>
			) : (
				<>
					<path d="M17 7C17 7 19 9 19 12C19 15 17 17 17 17" fill="none" />
					<path d="M15.5 10.5C15.5 10.5 16 10.9998 16 11.9999C16 13 15.5 13.5 15.5 13.5" fill="none" />
				</>
			)}
		</svg>
	);
}

function displayTitle(song: Song, trackIndex: number | null): string {
	const track = song.audioTracks?.[trackIndex ?? 0];
	if (!track || track.trackType === "song") return song.title;
	const suffix =
		track.trackType === "cover" && track.artist
			? `${track.artist} Cover`
			: capitalizeTrackType(track.trackType);
	return `${song.title} — ${suffix}`;
}

function SeekBar({ className }: { className?: string }) {
	const player = useAudioPlayer();
	const progress = usePlayerProgress();

	return (
		<div
			className={clsx("flex h-9 cursor-pointer items-center", className)}
			onClick={(event) => {
				const rect = event.currentTarget.getBoundingClientRect();
				if (rect.width > 0)
					player.seekFraction((event.clientX - rect.left) / rect.width);
			}}
		>
			<div className="h-[3px] w-full bg-white/20">
				<div
					className="h-full bg-accent"
					style={{ width: `${(progress.fraction * 100).toFixed(2)}%` }}
				/>
			</div>
		</div>
	);
}

function NowPlaying({
	mode,
	onMode,
	onClose,
}: {
	mode: VisMode;
	onMode: (mode: VisMode) => void;
	onClose: () => void;
}) {
	const player = useAudioPlayer();
	const progress = usePlayerProgress();
	const lyricsRef = useRef<HTMLDivElement>(null);
	const song = player.song;

	const timeline = song ? timelineForSong(song) : [];
	const activeIndex =
		progress.duration > 0
			? Math.min(
					timeline.length - 1,
					Math.floor(progress.fraction * timeline.length),
				)
			: -1;

	useEffect(() => {
		const container = lyricsRef.current;
		if (!container || activeIndex < 0) return;
		const active = container.querySelector<HTMLElement>('[data-active="true"]');
		if (active) {
			container.scrollTo({
				top:
					active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2,
				behavior: "smooth",
			});
		}
	}, [activeIndex]);

	if (!song) return null;

	const youtubeId = song.youtube?.[0];
	const playing = player.isPlaying;
	const upNext = adjacentPlayable(song, 1);
	const modes: { key: VisMode; label: string }[] = [
		{ key: "art", label: "COVER" },
		{ key: "video", label: "MUSIC VIDEO" },
		{ key: "lyrics", label: "LYRIC VIDEO" },
		{ key: "visual", label: "VISUAL" },
	];
	const currentLine = activeIndex >= 0 ? timeline[activeIndex] : null;

	return (
		<div className="fixed inset-0 z-40 overflow-y-auto bg-stage text-stage-ink">
			<Image
				src={posterImage}
				alt=""
				aria-hidden
				fill
				className="object-cover opacity-[0.14] blur-md saturate-[0.8]"
			/>
			<button
				type="button"
				onClick={onClose}
				aria-label="Close player"
				className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10 sm:right-8 sm:top-6"
			>
				✕
			</button>
			<div className="relative mx-auto grid min-h-full w-full max-w-[1140px] items-center gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] lg:gap-16">
				<div className="flex flex-col items-center">
					<div className="flex flex-wrap justify-center gap-1.5">
						{modes.map((entry) => (
							<button
								key={entry.key}
								type="button"
								onClick={() => onMode(entry.key)}
								className={clsx(
									"border px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition",
									mode === entry.key
										? "border-accent bg-accent text-white"
										: "border-white/30 text-white/70 hover:border-white/60 hover:text-white",
								)}
							>
								{entry.label}
							</button>
						))}
					</div>
					<div className="mt-6">
						{mode === "art" && (
							<Image
								src={posterImage}
								alt=""
								className="w-[200px] shadow-[0_36px_80px_-24px_rgba(0,0,0,0.9)] sm:w-[230px]"
							/>
						)}
						{mode === "video" &&
							(youtubeId ? (
								<div className="relative aspect-video w-[320px] bg-black sm:w-[410px]">
									<iframe
										title="Music video"
										src={`https://www.youtube.com/embed/${youtubeId}`}
										className="absolute inset-0 h-full w-full border-0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							) : (
								<p className="text-xs text-white/50">No video for this song.</p>
							))}
						{mode === "lyrics" && (
							<div
								className="flex h-[190px] w-[320px] flex-col items-center justify-center gap-3.5 px-6 text-center sm:h-[231px] sm:w-[440px]"
								style={{
									background:
										"linear-gradient(160deg, rgba(225,29,72,0.16), rgba(0,0,0,0.3))",
								}}
							>
								<p className="text-sm text-white/40">
									{activeIndex > 0 ? timeline[activeIndex - 1].text : ""}
								</p>
								<p className="text-balance text-xl font-bold leading-snug text-white sm:text-2xl">
									{currentLine?.text ?? song.title}
								</p>
								<p className="text-sm text-white/40">
									{activeIndex >= 0 && activeIndex < timeline.length - 1
										? timeline[activeIndex + 1].text
										: ""}
								</p>
							</div>
						)}
						{mode === "visual" && (
							<div
								className="relative flex h-[190px] w-[320px] items-center justify-center overflow-hidden sm:h-[231px] sm:w-[410px]"
								style={{
									background:
										"radial-gradient(70% 90% at 50% 50%, rgba(225,29,72,0.35), #0a0908 75%)",
								}}
							>
								<div
									className="h-[110px] w-[110px] rounded-full border-[1.5px]"
									style={{
										borderColor: "rgba(225,29,72,0.8)",
										animation: "fb-pulse 2.2s ease-in-out infinite",
									}}
								/>
								<div
									className="absolute h-[180px] w-[180px] rounded-full border"
									style={{
										borderColor: "rgba(225,29,72,0.35)",
										animation: "fb-pulse 2.2s ease-in-out 0.35s infinite",
									}}
								/>
								<div
									className="absolute h-[250px] w-[250px] rounded-full border"
									style={{
										borderColor: "rgba(225,29,72,0.15)",
										animation: "fb-pulse 2.2s ease-in-out 0.7s infinite",
									}}
								/>
							</div>
						)}
					</div>
					<p className="mt-7 text-[10px] font-medium uppercase tracking-[0.4em] text-white/60 sm:text-[11px]">
						{song.artist ?? "VNC Firebrand"}
					</p>
					<h2 className="mt-2 text-center text-[25px] font-bold tracking-[0.08em] sm:text-4xl">
						{displayTitle(song, player.trackIndex)}
					</h2>
					<div className="mt-6 w-full max-w-[640px]">
						<SeekBar />
						<div className="mt-1 flex justify-between text-xs font-medium text-white/55">
							<span>{formatClock(progress.time)}</span>
							<span>{formatClock(progress.duration)}</span>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-6 sm:gap-8">
						<button
							type="button"
							onClick={() => player.previous()}
							aria-label="Previous song"
							className="p-2 text-white/75 transition hover:text-white"
						>
							<PrevIcon className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={() => player.skip(-10)}
							aria-label="Rewind 10 seconds"
							className="p-2 text-white/60 transition hover:text-white"
						>
							<RewindIcon className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={() => player.toggleSong(song, player.trackIndex ?? undefined)}
							aria-label="Play or pause"
							className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white/60 text-white transition hover:bg-white hover:text-stage sm:h-[72px] sm:w-[72px]"
						>
							{playing ? (
								<PauseIcon className="h-6 w-6 fill-current" />
							) : (
								<PlayIcon className="h-6 w-6 fill-current" />
							)}
						</button>
						<button
							type="button"
							onClick={() => player.skip(10)}
							aria-label="Fast-forward 10 seconds"
							className="p-2 text-white/60 transition hover:text-white"
						>
							<ForwardIcon className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={() => player.next()}
							aria-label="Next song"
							className="p-2 text-white/75 transition hover:text-white"
						>
							<NextIcon className="h-6 w-6" />
						</button>
					</div>
					<div className="mt-4 flex items-center gap-4">
						<button
							type="button"
							onClick={() => player.cycleRate()}
							aria-label="Playback rate"
							className="min-w-[42px] border border-white/25 px-2.5 py-1.5 text-[11px] font-bold text-white/70 transition hover:border-white/60 hover:text-white"
						>
							{player.playbackRate}×
						</button>
						<button
							type="button"
							onClick={() => player.mute()}
							aria-label={player.isMuted ? "Unmute" : "Mute"}
							className="p-1 text-white/70 transition hover:text-white"
						>
							<MuteIcon muted={player.isMuted} />
						</button>
					</div>
					<p className="mt-6 text-[11px] font-medium tracking-[0.24em] text-white/50">
						UP NEXT&ensp;·&ensp;{upNext.title.toUpperCase()}
					</p>
				</div>
				<div
					ref={lyricsRef}
					className="box-border h-[42vh] overflow-y-auto border-t border-white/10 pb-[18vh] pt-[16vh] lg:h-[66vh] lg:border-t-0 lg:pb-[30vh] lg:pt-[28vh]"
				>
					{timeline.map((line, index) => {
						const isActive = index === activeIndex;
						return (
							<p
								key={index}
								data-active={isActive}
								onClick={() =>
									player.playSong(
										song,
										player.trackIndex ?? undefined,
										(index + 0.01) / timeline.length,
									)
								}
								className={clsx(
									"mb-4 cursor-pointer text-lg font-bold leading-[1.45] transition-colors duration-300 sm:text-[22px]",
									isActive
										? "text-white"
										: index < activeIndex
											? "text-white/55"
											: "text-white/30",
								)}
							>
								{line.text}
								{line.tag && (
									<span className="ml-2 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
										{line.tag}
									</span>
								)}
							</p>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function PlayerShell() {
	const player = useAudioPlayer();
	const progress = usePlayerProgress();
	const [nowOpen, setNowOpen] = useState(false);
	const [visMode, setVisMode] = useState<VisMode>("art");
	const waveformRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef(player);
	useEffect(() => {
		playerRef.current = player;
	});

	const { song, trackIndex } = player;

	// One WaveSurfer instance for the whole app, drawn inside the bar.
	useEffect(() => {
		if (!waveformRef.current) return;
		const wavesurfer = WaveSurfer.create({
			container: waveformRef.current,
			waveColor: "rgba(255,255,255,0.22)",
			progressColor: ACCENT,
			cursorColor: "rgba(255,255,255,0.4)",
			barWidth: 2,
			barGap: 2,
			barRadius: 2,
			height: 32,
		});
		wavesurfer.on("finish", () => playerRef.current.next());
		wavesurfer.on("interaction", () => playerRef.current.setPlaying());
		playerRef.current.attachWavesurfer(wavesurfer);
		return () => {
			playerRef.current.attachWavesurfer(null);
			wavesurfer.destroy();
		};
	}, []);

	const playing = player.isPlaying;

	return (
		<>
			{nowOpen && song && (
				<NowPlaying
					mode={visMode}
					onMode={setVisMode}
					onClose={() => setNowOpen(false)}
				/>
			)}
			<div
				className={clsx(
					"fixed inset-x-0 bottom-0 z-30 border-t border-white/10 text-stage-ink backdrop-blur-md",
					!song && "hidden",
				)}
				style={{ background: "rgba(12,11,10,0.92)" }}
			>
				<div
					className="h-[2px] md:hidden"
					style={{ background: "rgba(255,255,255,0.12)" }}
				>
					<div
						className="h-full bg-accent"
						style={{ width: `${(progress.fraction * 100).toFixed(2)}%` }}
					/>
				</div>
				<div className="flex items-center gap-3 px-3.5 py-2.5 md:gap-6 md:px-8 md:py-3">
					<button
						type="button"
						onClick={() => setNowOpen(true)}
						className="flex min-w-0 flex-1 items-center gap-3.5 text-left md:w-[250px] md:flex-none"
					>
						<Image
							src={posterImage}
							alt=""
							className="h-10 w-10 flex-none object-cover md:h-[42px] md:w-[42px]"
						/>
						<span className="min-w-0">
							<span className="block truncate text-[13.5px] font-medium md:text-sm">
								{song ? displayTitle(song, trackIndex) : ""}
							</span>
							<span className="mt-px block truncate text-[11px] tracking-[0.08em] text-white/50">
								{song?.artist ?? "VNC Firebrand"}
							</span>
						</span>
					</button>
					<div className="hidden flex-none items-center gap-4 md:flex">
						<button
							type="button"
							onClick={() => player.previous()}
							aria-label="Previous song"
							className="text-white/70 transition hover:text-white"
						>
							<PrevIcon className="h-[18px] w-[18px]" />
						</button>
						<button
							type="button"
							onClick={() => song && player.toggleSong(song, trackIndex ?? undefined)}
							aria-label="Play or pause"
							className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white hover:text-stage"
						>
							{playing ? (
								<PauseIcon className="h-3.5 w-3.5 fill-current" />
							) : (
								<PlayIcon className="h-3.5 w-3.5 fill-current" />
							)}
						</button>
						<button
							type="button"
							onClick={() => player.next()}
							aria-label="Next song"
							className="text-white/70 transition hover:text-white"
						>
							<NextIcon className="h-[18px] w-[18px]" />
						</button>
					</div>
					<span className="hidden flex-none text-[11px] font-medium text-white/50 md:block">
						{formatClock(progress.time)}
					</span>
					<div className="hidden min-w-0 flex-1 md:block">
						<div ref={waveformRef} className="w-full cursor-pointer" />
					</div>
					<span className="hidden flex-none text-[11px] font-medium text-white/50 md:block">
						{formatClock(progress.duration)}
					</span>
					{song && (
						<div className="hidden flex-none items-center gap-2 lg:flex">
							<TrackChips song={song} onStage compact />
						</div>
					)}
					<div className="hidden flex-none items-center gap-3.5 md:flex">
						<button
							type="button"
							onClick={() => {
								setVisMode("lyrics");
								setNowOpen(true);
							}}
							className="border border-white/25 px-2.5 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white/80 transition hover:border-white/60 hover:text-white"
						>
							LYRICS
						</button>
						<button
							type="button"
							onClick={() => player.cycleRate()}
							aria-label="Playback rate"
							className="min-w-[36px] border border-white/25 px-2 py-1 text-[10px] font-bold text-white/70 transition hover:border-white/60 hover:text-white"
						>
							{player.playbackRate}×
						</button>
						<button
							type="button"
							onClick={() => player.mute()}
							aria-label={player.isMuted ? "Unmute" : "Mute"}
							className="text-white/70 transition hover:text-white"
						>
							<MuteIcon muted={player.isMuted} className="h-[18px] w-[18px]" />
						</button>
					</div>
					<div className="flex flex-none items-center gap-1.5 md:hidden">
						<button
							type="button"
							onClick={() => song && player.toggleSong(song, trackIndex ?? undefined)}
							aria-label="Play or pause"
							className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white"
						>
							{playing ? (
								<PauseIcon className="h-3.5 w-3.5 fill-current" />
							) : (
								<PlayIcon className="h-3.5 w-3.5 fill-current" />
							)}
						</button>
						<button
							type="button"
							onClick={() => player.next()}
							aria-label="Next song"
							className="flex h-11 w-11 items-center justify-center text-white/65"
						>
							<NextIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
