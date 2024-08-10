"use client";

import React from "react";

import { useAudioPlayer } from "@/components/AudioProvider";
import { SongPlayerButton } from "@/components/player/PlayButton";
import { type Song, TrackType } from "@/lib/songs";

interface SongPlayButtonProps {
	song: Song;
	trackType?: TrackType;
	size: "mini" | "small" | "medium" | "large";
}

// Helper function to get the source URL of the track based on trackType
const getTrackSource = (song: Song, trackType: TrackType): string | undefined => {
	return song.audioTracks?.find(track => track.audioType === trackType)?.src;
};

// Helper function to capitalize track types
const capitalizeTrackType = (trackType: string): string => {
	return trackType.charAt(0).toUpperCase() + trackType.slice(1);
};

export const SongPlayButton: React.FC<SongPlayButtonProps> = ({ song, trackType, size }) => {
	if (!song) {
		console.warn("SongPlayButton rendered with undefined song");
		return null;
	} else if (!trackType) {
		console.warn("SongPlayButton rendered with undefined track type");
		return null;
	}
	
	const player = useAudioPlayer(song, trackType);
	
	const trackSource = getTrackSource(song, trackType);
	
	if (!trackSource) {
		console.warn("SongPlayButton rendered with undefined track source");
		return null;
	}
	
	const sizeToClasses = {
		mini: {
			container: "flex mt-1.5 mb-0.5 items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
			spanText: "Listen",
		},
		small: {
			container: "flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current",
			spanClassName: "flex items-center text-sm font-bold leading-6 text-pink-500",
			spanText: "Listen",
		},
		medium: {
			container: "group relative mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-4 w-4 fill-white group-active:fill-white/80",
		},
		large: {
			container: "group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-9 w-9 fill-white group-active:fill-white/80",
		},
	};
	
	const sizeClassName = sizeToClasses[size].container;
	const sizeIconClassName = sizeToClasses[size].icon;
	
	const button = (
		<SongPlayerButton
			player={player}
			buttonClassName={sizeClassName}
			iconClassName={sizeIconClassName}
			spanClassName={(size === "mini" || size ===
				"small") ? "flex items-center text-sm font-bold leading-6 text-pink-500" : undefined}
			spanText={(size === "mini" || size === "small") ? "Listen" : undefined}
		/>
	);
	
	if (size === "small") {
		return (
			<>
				{button}
				<span aria-hidden="true" className="text-sm font-bold text-slate-400">/</span>
			</>
		);
	}
	
	if (size === "medium" &&
		(trackType === TrackType.SOPRANO || trackType === TrackType.ALTO || trackType === TrackType.TENOR ||
			trackType === TrackType.BASS || trackType === TrackType.BACKUP)) {
		const capitalizedTrackType = capitalizeTrackType(trackType.toString());
		
		return (
			<div className="flex items-center">
				{button}
				<p>{capitalizedTrackType}</p>
			</div>
		);
	}
	
	return button;
};