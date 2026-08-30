"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import {
	formatTextures,
	isMedley,
	type SingleSong,
	type Song,
} from "@/components/Songs";
import {
	useAudioPlayer,
	usePlayerProgress,
} from "@/components/player/AudioProvider";
import { primaryTrackIndex } from "@/lib/publicSongs";

export interface TimelineLine {
	text: string;
	secondVoice?: string;
	tag?: string;
}

// Flattens a song's sections into one line list, the way the follow-along
// view and the copy-lyrics action read it.
export function buildTimeline(song: SingleSong): TimelineLine[] {
	const out: TimelineLine[] = [];
	for (const section of song.sections ?? []) {
		const lines = (section.text ?? []).filter((line) => {
			if (line === null || line === "") return false;
			return Array.isArray(line) ? Boolean(line[0]) : true;
		});
		if (lines.length === 0) {
			out.push({ text: "· · ·", tag: section.sectionName });
			continue;
		}
		for (const line of lines) {
			if (Array.isArray(line)) {
				out.push({
					text: line[0] ?? "",
					secondVoice: line[1] ?? undefined,
					tag: line[2] ?? undefined,
				});
			} else {
				out.push({ text: line as string });
			}
		}
	}
	if (out.length === 0) out.push({ text: song.title });
	return out;
}

// A medley's timeline is its members' timelines in sequence.
export function timelineForSong(song: Song): TimelineLine[] {
	return isMedley(song)
		? song.songList.flatMap((sub) => buildTimeline(sub))
		: buildTimeline(song);
}

function lyricsAsText(song: SingleSong): string {
	const body = (song.sections ?? [])
		.map((section) => {
			const lines = (section.text ?? [])
				.map((line) => (Array.isArray(line) ? line[0] : line))
				.filter((line): line is string => Boolean(line));
			return `${section.sectionName}\n${lines.join("\n")}`;
		})
		.join("\n\n");
	return `${song.title} — ${song.artist ?? ""}\n\n${body}`;
}

function FullTextModal({
	song,
	fontScale,
	onClose,
}: {
	song: SingleSong;
	fontScale: number;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-40 overflow-y-auto bg-stage/[.96] px-6 py-16 text-stage-ink">
			<div className="mx-auto max-w-[640px]">
				<div className="flex items-baseline justify-between border-b border-white/15 pb-4">
					<div>
						<p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
							Full text
						</p>
						<h2 className="mt-1.5 text-2xl font-bold tracking-[0.04em] sm:text-3xl">
							{song.title}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10"
					>
						✕
					</button>
				</div>
				{(song.sections ?? []).map((section, sectionIndex) => (
					<div key={sectionIndex} className="mt-8">
						<div className="flex items-baseline gap-3.5">
							<h3 className="text-[17px] font-bold tracking-[0.06em]">
								{section.sectionName}
							</h3>
							{section.textures && section.textures.length > 0 && (
								<span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
									{formatTextures(section.textures)}
								</span>
							)}
						</div>
						<div className="mt-2.5">
							{(section.text ?? []).map((line, lineIndex) => {
								if (line === null || line === "")
									return <div key={lineIndex} className="h-3" />;
								const isArray = Array.isArray(line);
								const text = isArray ? line[0] : (line as string);
								const secondVoice = isArray ? line[1] : null;
								const tag = isArray ? line[2] : null;
								if (!text) return <div key={lineIndex} className="h-3" />;
								return (
									<div key={lineIndex}>
										<p
											className="leading-[1.8]"
											style={{ fontSize: Math.round(17 * fontScale) }}
										>
											{text}
											{tag && (
												<span className="ml-2 text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
													{tag}
												</span>
											)}
										</p>
										{secondVoice && (
											<p
												className="leading-[1.8] text-white/45"
												style={{ fontSize: Math.round(17 * fontScale) }}
											>
												{secondVoice}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function FollowAlongLyrics({ song }: { song: SingleSong }) {
	const player = useAudioPlayer();
	const progress = usePlayerProgress();
	const [fontScale, setFontScale] = useState(1);
	const [copied, setCopied] = useState<"" | "copy" | "share">("");
	const [modalOpen, setModalOpen] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const timeline = useMemo(() => buildTimeline(song), [song]);

	const isCurrent = player.song?.id === song.id;
	const activeIndex =
		isCurrent && progress.duration > 0
			? Math.min(
					timeline.length - 1,
					Math.floor(progress.fraction * timeline.length),
				)
			: -1;

	useEffect(() => {
		const container = scrollRef.current;
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

	const flash = (kind: "copy" | "share") => {
		setCopied(kind);
		setTimeout(() => setCopied(""), 1600);
	};

	const toolChip =
		"border border-strong px-4 py-2 text-[10px] font-bold tracking-[0.18em] transition hover:bg-ink hover:text-surface";

	return (
		<>
			<div className="mt-9 flex flex-wrap items-center gap-2.5 border-b border-hairline pb-4">
				<span className="mr-1 text-[10px] font-bold tracking-[0.24em] text-soft">
					LYRICS
				</span>
				<button
					type="button"
					onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
					aria-label="Smaller text"
					className="h-8 w-8 border border-strong text-[11px] font-bold transition hover:bg-ink hover:text-surface"
				>
					A−
				</button>
				<button
					type="button"
					onClick={() => setFontScale((s) => Math.min(1.4, +(s + 0.1).toFixed(2)))}
					aria-label="Larger text"
					className="h-8 w-8 border border-strong text-[13px] font-bold transition hover:bg-ink hover:text-surface"
				>
					A+
				</button>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard?.writeText(lyricsAsText(song)).catch(() => {});
						flash("copy");
					}}
					className={toolChip}
				>
					{copied === "copy" ? "COPIED ✓" : "COPY LYRICS"}
				</button>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard
							?.writeText(window.location.href.split("#")[0])
							.catch(() => {});
						flash("share");
					}}
					className={toolChip}
				>
					{copied === "share" ? "LINK COPIED ✓" : "SHARE"}
				</button>
				<button
					type="button"
					onClick={() => setModalOpen(true)}
					className="border border-accent px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-accent transition hover:bg-accent hover:text-white"
				>
					FULL TEXT
				</button>
				<span className="ml-auto hidden text-[10px] font-medium tracking-[0.14em] text-soft sm:inline">
					FOLLOW-ALONG · TAP A LINE TO PLAY FROM THERE
				</span>
			</div>
			<p className="mt-4 text-[9px] font-medium tracking-[0.16em] text-soft sm:hidden">
				FOLLOW-ALONG · TAP A LINE TO PLAY FROM THERE
			</p>
			<div
				ref={scrollRef}
				className="relative mt-4 box-border h-[54vh] overflow-y-auto px-2 pb-[24vh] pt-[20vh] sm:mt-7"
			>
				{timeline.map((line, index) => {
					const isActive = index === activeIndex;
					return (
						<p
							key={index}
							data-active={isActive}
							onClick={() => {
								const trackIndex = isCurrent
									? (player.trackIndex ?? primaryTrackIndex(song))
									: primaryTrackIndex(song);
								player.playSong(
									song,
									trackIndex,
									(index + 0.01) / timeline.length,
								);
							}}
							className={clsx(
								"cursor-pointer font-bold leading-normal transition-opacity duration-300",
								activeIndex === -1
									? "opacity-75"
									: isActive
										? "opacity-100"
										: index < activeIndex
											? "opacity-50"
											: "opacity-30",
							)}
							style={{
								fontSize: Math.round(19 * fontScale),
								marginBottom: Math.round(12 * fontScale),
							}}
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
			{modalOpen && (
				<FullTextModal
					song={song}
					fontScale={fontScale}
					onClose={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
