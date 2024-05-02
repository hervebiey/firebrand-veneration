'use client';

import React from 'react';

import {TrackType, useAudioPlayer} from '@/components/AudioProvider';
import {PauseIcon} from '@/components/PauseIcon';
import {PlayIcon} from '@/components/PlayIcon';
import {type Song} from '@/lib/songs';

function PlayButton({
	                    song,
	                    trackType,
	                    playing,
	                    paused,
	                    ...props
}: React.ComponentPropsWithoutRef<'button'> & {
	song: Song,
	trackType: TrackType,
	playing: React.ReactNode
	paused: React.ReactNode
}) {
	let player = useAudioPlayer(song, trackType);
	
	return (
		<button
			type="button"
			onClick={() => player.toggle()}
			aria-label={`${player.playing ? 'Pause' : 'Play'} ${trackType} of ${song.title}`}
			{...props}
		>
			{player.playing ? playing : paused}
		</button>
	)
}

interface SongPlayButtonProps {
	song: Song;
	trackType?: TrackType;
	size: 'small' | 'medium' | 'large';
}

export const SongPlayButton: React.FC<SongPlayButtonProps> = ({song, trackType= TrackType.AUDIO, size}) => {
	if (!song[trackType]?.src) return null;
	
	const renderIcon = (playerStatus: React.ReactNode, iconSize: string) => {
		const iconClass = `${iconSize} ${size !== 'small' ? 'fill-white group-active:fill-white/80' : ''}`;
		const IconComponent = playerStatus === 'Playing' ? PauseIcon : PlayIcon;
		const IconLabel = size === 'small' ? <span aria-hidden="true">Listen</span> : null;
		
		return (
			<>
				<IconComponent className={iconClass}/>
				{IconLabel}
			</>
		)
	}
	
	const capitalizeTrackType = (trackType: string) => trackType.charAt(0).toUpperCase() + trackType.slice(1);
	
	const sizeToClasses = {
		small: {
			container: "flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900",
			icon: "h-2.5 w-2.5 fill-current"
		},
		medium: {
			container: "group relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-4 w-4"
		},
		large: {
			container: "group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4",
			icon: "h-9 w-9"
		}
	};
	
	const classNames = sizeToClasses[size].container;
	const iconSize = sizeToClasses[size].icon;
	const playingIcon = renderIcon('Playing', iconSize);
	const pausedIcon = renderIcon('Paused', iconSize);
	const captializedTrackType = capitalizeTrackType(trackType.toString())
	
	const button = (
		<PlayButton
			song={song}
			trackType={trackType}
			className={classNames}
			playing={playingIcon}
			paused={pausedIcon}
		/>
	)
	
	if (size === "medium" && (trackType === TrackType.SOPRANO || trackType === TrackType.ALTO || trackType === TrackType.TENOR)) {
		return (
			<div className="flex space-x-2 items-center">
				{button}
				<p>{captializedTrackType}</p>
			</div>
		)
	}
	
	if (size === "small") {
		return (
			<>
				{button}
				<span aria-hidden="true" className="text-sm font-bold text-slate-400">/</span>
			</>
		)
	}
	
	return button;
}