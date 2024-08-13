"use client";

import React from "react";
import { useAudioPlayer } from "@/components/player/AudioProvider";
import { capitalizeTrackType, type Song } from "@/components/Songs";
import { PauseIcon } from "@/components/PauseIcon";
import { PlayIcon } from "@/components/PlayIcon";

interface SongPlayButtonProps {
	song: Song;
	trackIndex?: number;
	isPrimary?: boolean;
	size: "mini" | "small" | "medium" | "large" | "grandPlayer" | "miniPlayer";
}

export const PlayButton: React.FC<SongPlayButtonProps> = ({
	                                                          song,
	                                                          trackIndex = 0, // Default to the first track if no index is provided
	                                                          isPrimary,
	                                                          size,
                                                          }) => {
	// Use the custom hook to get the player object
	const player = useAudioPlayer(song, trackIndex);
	
	if (!song || !trackIndex) {
		console.warn("SongPlayButton rendered with undefined song");
		return null;
	}
	
	const sizeToClasses = {
		mini: {
			container: "flex mt-1.5 mb-0.5 items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
			divClassName: undefined,
		},
		small: {
			container: "flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
			divClassName: undefined,
		},
		medium: {
			container: "group relative mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-4 w-4 fill-white group-active:fill-white/80",
			spanClassName: undefined,
			divClassName: undefined,
		},
		large: {
			container: "group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-9 w-9 fill-white group-active:fill-white/80",
			spanClassName: undefined,
			divClassName: undefined,
		},
		grandPlayer: {
			container: "group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14",
			icon: "h-9 w-9 fill-white group-active:fill-white/80",
			spanClassName: undefined,
			divClassName: "absolute -inset-3 md:hidden",
		},
		miniPlayer: {
			container: "group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14",
			icon: "h-5 w-5 fill-white group-active:fill-white/80",
			spanClassName: undefined,
			divClassName: "absolute -inset-3 md:hidden",
		},
	};
	
	const sizeClassName = sizeToClasses[size].container;
	const sizeIconClassName = sizeToClasses[size].icon;
	const sizeSpanClassName = sizeToClasses[size].spanClassName;
	const sizeDivClassName = sizeToClasses[size].divClassName;
	
	// Determine which icon to use based on whether the player is playing the current song and track
	let Icon = player.playing() ? PauseIcon : PlayIcon;
	
	return (
		<div className={`${isPrimary ? "primary-audio-button" : (size === "medium" || size ===
			"mini") ? "flex items-center" : ""}`}>
			<button
				type="button"
				className={sizeClassName}
				onClick={() => player.toggle()} // Toggle play/pause
				aria-label={`${player.playing() ? "Pause" : "Play"} ${song.title} ${trackIndex}`}
			>
				{sizeDivClassName && (
					<div className={sizeDivClassName}/>
				)}
				<Icon className={sizeIconClassName}/> {/* Use the correct icon */}
				{(size === "mini" || size === "small") && (
					<span className={sizeSpanClassName} aria-hidden="true">
                        Listen
                    </span>
				)}
			</button>
			{!isPrimary && size === "medium" && song.audioTracks?.[trackIndex]?.trackType && (
				<span>{capitalizeTrackType(song.audioTracks[trackIndex].trackType)}</span>
			)}
		</div>
	);
};