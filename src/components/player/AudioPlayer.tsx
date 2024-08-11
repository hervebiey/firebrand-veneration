"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { useAudioPlayer } from "@/components/AudioProvider";
import { ForwardButton } from "@/components/player/ForwardButton";
import { MuteButton } from "@/components/player/MuteButton";
import { PlaybackRateButton } from "@/components/player/PlaybackRateButton";
import { RewindButton } from "@/components/player/RewindButton";
import { PlayButton } from "@/components/player/PlayButton";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

export function AudioPlayer() {
	const player = useAudioPlayer();
	const waveformRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		if (!player.song || !waveformRef.current) return;
		
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
		
		// Initialize Wavesurfer
		const wavesurfer = WaveSurfer.create({
			container: waveformRef.current as HTMLElement,
			waveColor: gradient,
			progressColor: progressGradient,
			barWidth: 2,
			url: player.song.audioTracks?.[0]?.src || "",
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
		
		player.wavesurferRef.current = wavesurfer; // Attach Wavesurfer instance to player
		
		// Load and synchronize Wavesurfer with player state
		wavesurfer.load(player.song.audioTracks?.[0]?.src || "").catch(console.error);
		
		// Synchronize play/pause between Wavesurfer and player
		if (player.isPlaying()) {
			wavesurfer.play().catch(console.error);
		} else {
			wavesurfer.pause();
		}
		
		// Update player state based on Wavesurfer events
		wavesurfer.on("play", () => player.play());
		wavesurfer.on("pause", () => player.pause());
		
		// Update the current time and duration
		{
			const formatTime = (seconds: number) => {
				const minutes = Math.floor(seconds / 60);
				const secondsRemainder = Math.round(seconds) % 60;
				const paddedSeconds = `0${secondsRemainder}`.slice(-2);
				return `${minutes}:${paddedSeconds}`;
			};
			
			const timeEl = document.querySelector<HTMLDivElement>("#time");
			const durationEl = document.querySelector<HTMLDivElement>("#duration");
			
			// Display the duration after decoding
			if (durationEl) {
				wavesurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration)))
			}
			
			// Update the current time during playback
			if (timeEl) {
				wavesurfer.on('audioprocess', (currentTime) => (timeEl.textContent = formatTime(currentTime)))
			}
		}
		
		// Clean up
		return () => wavesurfer.destroy();
	}, [player.song, player.isPlaying()]);
	
	if (!player.song) {
		return null;
	}
	
	const trackIndex = player.trackIndex ? parseInt(player.trackIndex.split("-").pop() || "0", 10) : 0;
	
	return (
		<div
			className="flex items-center gap-6 bg-white/90 px-4 py-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
			<div className="hidden md:block">
				<PlayButton song={player.song} trackIndex={trackIndex} size="grand"/>
			</div>
			<div className="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
				<Link
					href={`/${player.song.id}`}
					className="truncate text-center text-sm font-bold leading-6 md:text-left"
					title={player.song.title}
				>
					{player.song.title}
				</Link>
				<div className="flex justify-between gap-6">
					<div className="flex items-center md:hidden">
						<MuteButton player={player}/>
					</div>
					<div className="flex flex-none items-center gap-4">
						<RewindButton player={player}/>
						<div className="md:hidden">
							<PlayButton song={player.song} trackIndex={trackIndex} size="grand"/>
						</div>
						<ForwardButton player={player}/>
					</div>
					<div ref={waveformRef} id="waveform" className="w-full h-16 bg-gray-200 relative">
						<div id="time"
						     className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">0:00
						</div>
						<div id="duration"
						     className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5">0:00
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
