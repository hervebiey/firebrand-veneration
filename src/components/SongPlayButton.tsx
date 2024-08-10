"use client";

import React from "react";

import { useAudioPlayer } from "@/components/AudioProvider";
import { SongPlayerButton } from "@/components/player/PlayButton";
import { type Song, TrackType } from "@/lib/songs";

interface SongPlayButtonProps {
	song: Song;
	trackType?: TrackType;
	isPrimary?: boolean;
	size: "mini" | "small" | "medium" | "large";
}

// Helper function to capitalize track types
const capitalizeTrackType = (trackType: string): string => {
	return trackType.charAt(0).toUpperCase() + trackType.slice(1);
};

export const SongPlayButton: React.FC<SongPlayButtonProps> = ({ song, trackType, isPrimary, size }) => {
	if (!song) {
		console.warn("SongPlayButton rendered with undefined song");
		return null;
	} else if (!trackType) {
		console.warn("SongPlayButton rendered with undefined track type");
		return null;
	}
	
	const player = useAudioPlayer(song, trackType || TrackType.SONG);
	
	const sizeToClasses = {
		mini: {
			container: "flex mt-1.5 mb-0.5 items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
		},
		small: {
			container: "flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
		},
		medium: {
			container: "group relative mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-4 w-4 fill-white group-active:fill-white/80",
			spanClassName: undefined,
		},
		large: {
			container: "group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-9 w-9 fill-white group-active:fill-white/80",
			spanClassName: undefined,
		},
	};
	
	const sizeClassName = sizeToClasses[size].container;
	const sizeIconClassName = sizeToClasses[size].icon;
	const sizeSpanClassName = sizeToClasses[size].spanClassName;
	
	return (
		<div className={`${isPrimary ? "primary-audio-button" : (size === "medium" || size === "mini") ? "flex items-center" : ""}`}>
			<SongPlayerButton
				player={player}
				buttonClassName={sizeClassName}
				iconClassName={sizeIconClassName}
				spanClassName={sizeSpanClassName}
				spanText={(size === "mini" || size === "small") ? "Listen" : undefined}
			/>
			{!isPrimary && size === "medium" && trackType && (
				<p>{capitalizeTrackType(trackType.toString())}</p>
			)}
		</div>
	)
};