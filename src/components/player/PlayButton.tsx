import {type PlayerAPI, TrackType, useAudioPlayer} from '@/components/AudioProvider';
import {PauseIcon} from '@/components/PauseIcon';
import {PlayIcon} from '@/components/PlayIcon';
import {type Song} from '@/lib/songs';
import React from "react";

export function SongPlayerButton({player, song, trackType, className, divClassName, iconClassName, spanClassName, spanText}: {
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

export function AudioPlayerButton({ player }: { player: PlayerAPI }) {
	let Icon = player.playing ? PauseIcon : PlayIcon
	let song = player?.song;
	let trackType = player?.trackType;
	
	return (
		<button
			type="button"
			className="group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14"
			onClick={() => player.toggle()}
			aria-label={`${player.playing ? 'Pause' : 'Play'} ${trackType} of ${song}`}
		>
			<div className="absolute -inset-3 md:hidden"/>
			<Icon className="h-5 w-5 fill-white group-active:fill-white/80 md:h-7 md:w-7"/>
		</button>
	)
}