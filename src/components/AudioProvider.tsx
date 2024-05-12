'use client';

import React, {createContext, useContext, useMemo, useReducer, useRef, useState} from 'react';

import {type Song} from '@/lib/songs';

export const enum TrackType {
	AUDIO = "audio",
	SOPRANO = "soprano",
	ALTO = "alto",
	TENOR = "tenor"
}

interface PlayerState {
	playing: boolean;
	muted: boolean;
	duration: number;
	currentTime: number;
	song: Song | null;
	trackType: TrackType,
}

interface PublicPlayerActions {
	play: (song?: Song, trackType?: TrackType) => void;
	pause: () => void
	toggle: (song?: Song, trackType?: TrackType) => void;
	seekBy: (amount: number) => void
	seek: (time: number) => void
	playbackRate: (rate: number) => void
	toggleMute: () => void
	isPlaying: (song?: Song, trackType?: TrackType) => boolean
}

export type PlayerAPI = PlayerState & PublicPlayerActions

const enum ActionKind {
	SET_META = 'SET_META',
	SET_TRACK_TYPE = 'SET_TRACK_TYPE',
	PLAY = 'PLAY',
	PAUSE = 'PAUSE',
	TOGGLE_MUTE = 'TOGGLE_MUTE',
	SET_CURRENT_TIME = 'SET_CURRENT_TIME',
	SET_DURATION = 'SET_DURATION',
}

type Action =
	| { type: ActionKind.SET_META; payload: Song }
	| { type: ActionKind.SET_TRACK_TYPE; payload: TrackType }
	| { type: ActionKind.PLAY }
	| { type: ActionKind.PAUSE }
	| { type: ActionKind.TOGGLE_MUTE }
	| { type: ActionKind.SET_CURRENT_TIME; payload: number }
	| { type: ActionKind.SET_DURATION; payload: number }

export const AudioContext = createContext<PlayerAPI | null>(null);
export const SopranoContext = createContext<PlayerAPI | null>(null);
export const AltoContext = createContext<PlayerAPI | null>(null);
export const TenorContext = createContext<PlayerAPI | null>(null);

function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return {...state, song: action.payload};
		case ActionKind.SET_TRACK_TYPE:
			return {...state, trackType: action.payload};
		case ActionKind.PLAY:
			return {...state, playing: true};
		case ActionKind.PAUSE:
			return {...state, playing: false};
		case ActionKind.TOGGLE_MUTE:
			return {...state, muted: !state.muted};
		case ActionKind.SET_CURRENT_TIME:
			return {...state, currentTime: action.payload};
		case ActionKind.SET_DURATION:
			return {...state, duration: action.payload};
		default:
			return state;
	}
}

export function AudioProvider({children}: { children: React.ReactNode }) {
	let [state, dispatch] = useReducer(audioReducer, {
		playing: false,
		muted: false,
		duration: 0,
		currentTime: 0,
		song: null,
		trackType: TrackType.AUDIO,
	});
	
	let playerRef = useRef<React.ElementRef<'audio'>>(null);
	
	let actions = useMemo<PublicPlayerActions>(() => {
		return {
			play(song?: Song, trackType: TrackType = TrackType.AUDIO) {
				if (song) {
					const src = song[trackType]?.src;
					if (src) {
						dispatch({type: ActionKind.SET_META, payload: song});
						dispatch({type: ActionKind.SET_TRACK_TYPE, payload: trackType});
						
						if (playerRef.current && playerRef.current.currentSrc !== src) {
							let playbackRate = playerRef.current.playbackRate;
							playerRef.current.src = src;
							playerRef.current.load();
							playerRef.current.pause();
							playerRef.current.playbackRate = playbackRate;
							playerRef.current.currentTime = 0;
						}
					}
				}
				
				if (playerRef.current) {
					playerRef.current.play().then(() => {
						dispatch({type: ActionKind.PLAY});
					}).catch((error) => {
						console.error("Failed to start playing: ", error);
					});
				}
			},
			pause() {
				playerRef.current?.pause();
			},
			toggle(song?: Song, trackType: TrackType = TrackType.AUDIO) {
				actions.isPlaying(song, trackType) ? actions.pause() : actions.play(song, trackType);
			},
			seekBy(amount) {
				if (playerRef.current) {
					playerRef.current.currentTime += amount;
				}
			},
			seek(time) {
				if (playerRef.current) {
					playerRef.current.currentTime = time;
				}
			},
			playbackRate(rate) {
				if (playerRef.current) {
					playerRef.current.playbackRate = rate;
				}
			},
			toggleMute() {
				dispatch({type: ActionKind.TOGGLE_MUTE});
			},
			isPlaying(song?: Song, trackType: TrackType = TrackType.AUDIO) {
				return song
					? state.playing && playerRef.current?.currentSrc === song[trackType]?.src
					: state.playing;
			},
		}
	}, [state.playing])
	
	let api = useMemo<PlayerAPI>(
		() => ({...state, ...actions}),
		[state, actions],
	)
	
	return (
		<>
			<AudioContext.Provider value={api}>
				<SopranoContext.Provider value={api}>
					<AltoContext.Provider value={api}>
						<TenorContext.Provider value={api}>
							{children}
						</TenorContext.Provider>
					</AltoContext.Provider>
				</SopranoContext.Provider>
			</AudioContext.Provider>
			<audio
				ref={playerRef}
				onPlay={() => dispatch({type: ActionKind.PLAY})}
				onPause={() => dispatch({type: ActionKind.PAUSE})}
				onTimeUpdate={(event) => {
					dispatch({
						type: ActionKind.SET_CURRENT_TIME,
						payload: Math.floor(event.currentTarget.currentTime),
					})
				}}
				onDurationChange={(event) => {
					dispatch({
						type: ActionKind.SET_DURATION,
						payload: Math.floor(event.currentTarget.duration),
					})
				}}
				muted={state.muted}
			/>
		</>
	)
}

export function useAudioPlayer(song?: Song, trackType: TrackType = TrackType.AUDIO) {
	let player;
	switch (trackType) {
		case TrackType.AUDIO:
			player = useContext(AudioContext);
			break;
		case TrackType.SOPRANO:
			player = useContext(SopranoContext);
			break;
		case TrackType.ALTO:
			player = useContext(AltoContext);
			break;
		case TrackType.TENOR:
			player = useContext(TenorContext);
			break;
	}
	
	if (!player) throw new Error("useAudioPlayer must be used within a AudioProvider");
	
	console.log(`useAudioPlayer called with song: ${song} and trackType: ${trackType}`);
	
	const [playing, setPlaying] = useState(false);
	
	return useMemo<PlayerAPI>(
		() => ({
			...player!,
			play() {
				console.log(`play action called with song: ${song} and trackType: ${trackType}`);
				player!.play(song, trackType);
			},
			toggle() {
				console.log(`toggle action called with song: ${song} and trackType: ${trackType}`);
				player!.toggle(song, trackType);
			},
			get playing() {
				return song && trackType
					? player.isPlaying(song, trackType)
					: player.playing;
			},
		}),
		[player, song, trackType],
	)
}