import {type PlayerAPI, TrackType, useAudioPlayer} from '@/components/AudioProvider';
import {PauseIcon} from '@/components/PauseIcon';
import {PlayIcon} from '@/components/PlayIcon';
import {type Song} from '@/lib/songs';
import React from "react";

export function PlayButton({player, song, trackType, className, divClassName, iconClassName, spanClassName, spanText}: {
	player?: PlayerAPI,
	song?: Song,
	trackType?: TrackType,
	className?: string,
	divClassName?: string,
	iconClassName?: string,
	spanClassName?: string,
	spanText?: string
}) {
	let currentPlayer = player || useAudioPlayer(song, trackType);
	let currentTrackType = trackType || player?.trackType;
	let currentSong = song || player?.song;
	
	let Icon = currentPlayer.playing ? PauseIcon : PlayIcon
	
	return (
		<button
			type="button"
			className={className}
			onClick={() => currentPlayer.toggle()}
			aria-label={`${currentPlayer.playing ? 'Pause' : 'Play'} ${currentSong} ${currentTrackType}`}
		>
			<div className={divClassName}/>
			<Icon className={iconClassName}/>
			<span className={spanClassName}
			      aria-hidden="true">{spanText}</span>
		</button>
	)
}