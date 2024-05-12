'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';

import {type PlayerAPI, useAudioPlayer} from '@/components/AudioProvider';
import {ForwardButton} from '@/components/player/ForwardButton';
import {MuteButton} from '@/components/player/MuteButton';
import {PlaybackRateButton} from '@/components/player/PlaybackRateButton';
import {PlayButton} from '@/components/player/PlayButton';
import {RewindButton} from '@/components/player/RewindButton';
import {Slider} from '@/components/player/Slider';

function parseTime(seconds: number) {
	let hours = Math.floor(seconds / 3600)
	let minutes = Math.floor((seconds - hours * 3600) / 60)
	seconds = seconds - hours * 3600 - minutes * 60
	return [hours, minutes, seconds]
}

function formatHumanTime(seconds: number) {
	let [h, m, s] = parseTime(seconds)
	return `${h} hour${h === 1 ? '' : 's'}, ${m} minute${
		m === 1 ? '' : 's'
	}, ${s} second${s === 1 ? '' : 's'}`
}

function AudioPlayerButton({player}: { player: PlayerAPI }) {
	return (
		<PlayButton player={player}
		            className="group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14"
		            divClassName="absolute -inset-3 md:hidden"
		            iconClassName="h-5 w-5 fill-white group-active:fill-white/80 md:h-7 md:w-7"/>
	)
}

export function AudioPlayer() {
	let player = useAudioPlayer();
	let wasPlayingRef = useRef(false);
	let [currentTime, setCurrentTime] = useState<number | null>(
		player.currentTime,
	);
	
	useEffect(() => {
		setCurrentTime(null)
	}, [player.currentTime]);
	
	if (!player.song) {
		return null
	}
	
	return (
		<div
			className="flex items-center gap-6 bg-white/90 px-4 py-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
			<div className="hidden md:block">
				<AudioPlayerButton player={player}/>
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
							<AudioPlayerButton player={player}/>
						</div>
						<ForwardButton player={player}/>
					</div>
					<Slider
						label="Current time"
						maxValue={player.duration}
						step={1}
						value={[currentTime ?? player.currentTime]}
						onChange={([value]) => setCurrentTime(value)}
						onChangeEnd={([value]) => {
							player.seek(value);
							if (wasPlayingRef.current) {
								player.play();
							}
						}}
						numberFormatter={{format: formatHumanTime} as Intl.NumberFormat}
						onChangeStart={() => {
							wasPlayingRef.current = player.playing;
							player.pause();
						}}
					/>
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
	)
}
