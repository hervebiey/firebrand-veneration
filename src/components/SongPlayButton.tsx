'use client';

import React from 'react';

import {TrackType} from '@/components/AudioProvider';
import {PlayButton} from "@/components/player/PlayButton";
import {type Song} from '@/lib/songs';

interface SongPlayButtonProps {
	song: Song;
	trackType?: TrackType;
	size: 'small' | 'medium' | 'large';
}

export const SongPlayButton: React.FC<SongPlayButtonProps> = ({song, trackType = TrackType.AUDIO, size}) => {
	if (!song[trackType]?.src) return null;
	
	const sizeToClasses = {
		small: {
			container: "flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current"
		},
		medium: {
			container: "group relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-4 w-4 fill-white group-active:fill-white/80"
		},
		large: {
			container: "group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-9 w-9 fill-white group-active:fill-white/80"
		}
	};
	
	const sizeClassName = sizeToClasses[size].container;
	const sizeIconClassName = sizeToClasses[size].icon;
	
	const button = (
		<PlayButton
			song={song}
			trackType={trackType}
			className={sizeClassName}
			iconClassName={sizeIconClassName}
		/>
	)
	
	if (size === "medium" && (trackType === TrackType.SOPRANO || trackType === TrackType.ALTO || trackType === TrackType.TENOR)) {
		const capitalizeTrackType = (trackType: string) => trackType.charAt(0).toUpperCase() + trackType.slice(1);
		const capitalizedTrackType = capitalizeTrackType(trackType.toString());
		
		return (
			<div className="flex space-x-2 items-center">
				{button}
				<p>{capitalizedTrackType}</p>
			</div>
		)
	}
	
	if (size === "small") {
		return (
			<>
				<PlayButton
					song={song}
					trackType={trackType}
					className={sizeClassName}
					iconClassName={sizeIconClassName}
					spanClassName="flex items-center text-sm font-bold leading-6 text-pink-500"
					spanText="Listen"
				/>
				<span aria-hidden="true" className="text-sm font-bold text-slate-400">/</span>
			</>
		)
	}
	
	return button;
}