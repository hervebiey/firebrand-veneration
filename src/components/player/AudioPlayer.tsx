"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

import { useAudioPlayer } from "@/components/player/AudioProvider";
import { ForwardButton } from "@/components/player/ForwardButton";
import { MuteButton } from "@/components/player/MuteButton";
import { PlaybackRateButton } from "@/components/player/PlaybackRateButton";
import { RewindButton } from "@/components/player/RewindButton";
import { PlayButton } from "@/components/player/PlayButton";

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const secondsRemainder = Math.round(seconds) % 60;
	const paddedSeconds = `0${secondsRemainder}`.slice(-2);
	return `${minutes}:${paddedSeconds}`;
}

export function AudioPlayer() {
	const player = useAudioPlayer();
	const song = player.song;
	const trackIndex = player.trackIndex ?? 0;
	const wavesurferRef = player.wavesurferRef;
	const waveformContainerRef = useRef<HTMLDivElement>(null);
	
	// Attach the Wavesurfer instance to the DOM container when available
	useEffect(() => {
		if (!waveformContainerRef.current || wavesurferRef.current) return;
		
		// Create the canvas to generate the gradient
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		
		if (!ctx) return; // Handle the case where ctx could be null
		
		// Define the waveform gradient (background)
		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
		gradient.addColorStop(0, "#655555"); // Top color
		gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#655555"); // Top color
		gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff"); // White line
		gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
		gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1"); // Bottom color
		gradient.addColorStop(1, "#B1B1B1"); // Bottom color
		
		// Define the progress gradient
		const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
		progressGradient.addColorStop(0, "#EE772F"); // Top color
		progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, "#EB4926"); // Top color
		progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff"); // White line
		progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
		progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#F6B094"); // Bottom color
		progressGradient.addColorStop(1, "#F6B094"); // Bottom color
		
		const url = song?.audioTracks?.[trackIndex]?.src || "";
		
		// Attach the existing Wavesurfer instance to the actual waveform container
		wavesurferRef.current.init({
			container: waveformContainerRef.current,
			waveColor: gradient,
			progressColor: progressGradient,
			barWidth: 2,
			url: url,
			plugins: [
				Hover.create({
					lineColor: "#ff0000", // Hover line color
					lineWidth: 2, // Hover line width
					labelBackground: "#555", // Hover label background color
					labelColor: "#fff", // Hover label text color
					labelSize: "11px", // Hover label text size
				}),
			],
		});
		
		// Load and play the track when ready
		wavesurferRef.current.load(url).catch(console.error);
		
		// Start playing the track when it's decoded
		wavesurferRef.current.on("decode", () => {
			wavesurferRef.current?.play().catch(console.error);
		});
		
		// Update the current time and duration
		{
			const timeEl = document.querySelector<HTMLDivElement>("#time");
			const durationEl = document.querySelector<HTMLDivElement>("#duration");
			
			// Display the duration after decoding
			if (durationEl) {
				wavesurferRef.current.on("decode", (duration: number) => (durationEl.textContent = formatTime(duration)));
			}
			
			// Update the current time during playback
			if (timeEl) {
				wavesurferRef.current.on("audioprocess", (currentTime: number) => (timeEl.textContent = formatTime(currentTime)));
			}
		}
		
		// Clean up on unmount
		return () => {
			wavesurferRef.current?.destroy();
			wavesurferRef.current = null;
		};
	}, [song, trackIndex, wavesurferRef]);
	
	if (!song) return null;
	
	return (
		<div
			className="flex items-center gap-6 bg-white/90 px-4 py-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
			<div className="hidden md:block">
				<PlayButton song={song} trackIndex={trackIndex} size="grand"/>
			</div>
			<div className="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
				<Link
					href={`/${song.id}`}
					className="truncate text-center text-sm font-bold leading-6 md:text-left"
					title={song.title}
				>
					{song.title}
				</Link>
				<div className="flex justify-between gap-6">
					<div className="flex items-center md:hidden">
						<MuteButton player={player}/>
					</div>
					<div className="flex flex-none items-center gap-4">
						<RewindButton player={player}/>
						<div className="md:hidden">
							<PlayButton song={song} trackIndex={trackIndex} size="grand"/>
						</div>
						<ForwardButton player={player}/>
					</div>
					<div ref={waveformContainerRef} id="waveform" className="w-full h-16 bg-gray-200 relative">
						<div id="time"
						     className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">
							0:00
						</div>
						<div id="duration"
						     className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">
							0:00
						</div>
						<div id="hover"
						     className="absolute left-0 top-0 h-full w-0 bg-white bg-opacity-50 transition-opacity duration-200 opacity-0"></div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center">
							<PlaybackRateButton player={player}/>
						</div>
						<div className="hidden items-center md:flex">
							<MuteButton player={player}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
