"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

import { useAudioPlayer } from "@/components/player/AudioProvider";
import { ForwardButton } from "@/components/player/ForwardButton";
import { MuteButton } from "@/components/player/MuteButton";
import { PlaybackRateButton } from "@/components/player/PlaybackRateButton";
import { RewindButton } from "@/components/player/RewindButton";
import { PlayButton } from "@/components/player/PlayButton";
import { capitalizeTrackType, findMedleyForSong } from "@/components/Songs";

// Color constants
const WAVEFORM_TOP_COLOR = "#655555";
const WAVEFORM_BOTTOM_COLOR = "#B1B1B1";
const WAVEFORM_WHITE_LINE = "#ffffff";
const PROGRESS_TOP_COLOR = "#af4ef6";
const PROGRESS_BOTTOM_COLOR = "#cd96f5";
const PROGRESS_WHITE_LINE = "#ffffff";

function generateGradient(context: CanvasRenderingContext2D, height: number, colorStops: {
	offset: number,
	color: string
}[]) {
	const gradient = context.createLinearGradient(0, 0, 0, height * 1.35);
	colorStops.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
	return gradient;
}

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const secondsRemainder = Math.round(seconds) % 60;
	const paddedSeconds = `0${secondsRemainder}`.slice(-2);
	return `${minutes}:${paddedSeconds}`;
}

export function AudioPlayer() {
	const player = useAudioPlayer();
	const { song, trackIndex, wavesurferRef } = player;
	const waveformContainerRef = useRef<HTMLDivElement>(null);
	
	// Attach the Wavesurfer instance to the DOM container when available
	useEffect(() => {
		if (!waveformContainerRef.current) return;
		
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		if (!context) return;
		
		const waveformGradient = generateGradient(context, canvas.height, [
			{ offset: 0, color: WAVEFORM_TOP_COLOR },
			{ offset: 0.7, color: WAVEFORM_TOP_COLOR },
			{ offset: 0.7 + 0.01, color: WAVEFORM_WHITE_LINE },
			{ offset: 0.7 + 0.02, color: WAVEFORM_WHITE_LINE },
			{ offset: 0.7 + 0.03, color: WAVEFORM_BOTTOM_COLOR },
			{ offset: 1, color: WAVEFORM_BOTTOM_COLOR },
		]);
		
		const progressGradient = generateGradient(context, canvas.height, [
			{ offset: 0, color: PROGRESS_TOP_COLOR },
			{ offset: 0.7, color: PROGRESS_TOP_COLOR },
			{ offset: 0.7 + 0.01, color: PROGRESS_WHITE_LINE },
			{ offset: 0.7 + 0.02, color: PROGRESS_WHITE_LINE },
			{ offset: 0.7 + 0.03, color: PROGRESS_BOTTOM_COLOR },
			{ offset: 1, color: PROGRESS_BOTTOM_COLOR },
		]);
		
		// Create the WaveSurfer instance
		wavesurferRef.current = WaveSurfer.create({
			container: waveformContainerRef.current,
			waveColor: waveformGradient,
			progressColor: progressGradient,
			barWidth: 2,
			url: song?.audioTracks?.[trackIndex ?? 0]?.src || "",
			plugins: [
				Hover.create({
					lineColor: "#ff0000",
					lineWidth: 2,
					labelBackground: "#555",
					labelColor: "#fff",
					labelSize: "11px",
				}),
			],
		});
		
		const handleDecode = () => {
			wavesurferRef.current?.play().then(() => {
				player.setPlaying();
			}).catch(console.error);
		};
		
		const handleSeeking = () => {
			player.setPlaying();
		};
		
		const handleFinish = () => {
			player.pause();
		};
		
		wavesurferRef.current.on("decode", handleDecode);
		wavesurferRef.current.on("seeking", handleSeeking);
		wavesurferRef.current.on("finish", handleFinish);
		
		const timeEl = document.getElementById("time");
		const durationEl = document.getElementById("duration");
		if (durationEl) {
			durationEl.textContent = "0:00";
			wavesurferRef.current.on("decode", (duration: number) => (durationEl.textContent = formatTime(duration)));
		}
		if (timeEl) {
			timeEl.textContent = "0:00";
			wavesurferRef.current.on("audioprocess", (currentTime: number) => (timeEl.textContent = formatTime(currentTime)));
			wavesurferRef.current.on("seeking", (currentTime: number) => (timeEl.textContent = formatTime(currentTime)));
		}
		
		// Clean up on unmount
		return () => {
			wavesurferRef.current?.destroy();
			wavesurferRef.current = null;
		};
	}, [song, trackIndex, wavesurferRef]);
	
	if (!song) return null;
	
	const medleyDetails = findMedleyForSong(song.id);
	const linkHref = medleyDetails ? `/${medleyDetails.medley.id}` : `/${song.id}`;
	const trackType = song.audioTracks?.[trackIndex ?? 0]?.trackType;
	const trackTypeDisplay = trackType && trackType !== "song" ? ` [${capitalizeTrackType(trackType)}]` : "";
	const displayTitle = medleyDetails
		? `${medleyDetails.song.artist} - ${medleyDetails.medley.title}: ${medleyDetails.song.title}${trackTypeDisplay}`
		: `${song.artist} - ${song.title}${trackTypeDisplay}`;
	
	return (
		<div
			className="flex items-center gap-6 bg-white/90 px-4 py-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
			<div className="hidden md:block">
				<PlayButton song={song} trackIndex={trackIndex ?? 0} size="grandPlayer"/>
			</div>
			<div className="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
				<Link
					href={linkHref}
					className="truncate text-center text-sm font-bold leading-6 md:text-left"
					title={song.title}
				>
					{displayTitle}
				</Link>
				<div className="flex justify-between gap-6">
					<div className="flex items-center md:hidden">
						<MuteButton player={player}/>
					</div>
					<div className="flex flex-none items-center gap-4">
						<RewindButton player={player}/>
						<div className="md:hidden">
							<PlayButton song={song} trackIndex={trackIndex ?? 0} size="miniPlayer"/>
						</div>
						<ForwardButton player={player}/>
						<div className="flex items-center">
							<PlaybackRateButton player={player}/>
						</div>
						<div className="hidden items-center md:flex">
							<MuteButton player={player}/>
						</div>
					</div>
					<div ref={waveformContainerRef} id="waveform" className="relative w-full">
						<div id="time"
						     className="z-10 absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">
							0:00
						</div>
						<div id="duration"
						     className="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">
							0:00
						</div>
						<div id="hover"
						     className="absolute left-0 top-0 h-full w-0 bg-white bg-opacity-50 transition-opacity duration-200 opacity-0"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
