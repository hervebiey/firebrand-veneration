"use client";

import React, { createContext, useContext, useMemo, useReducer, useRef } from "react";

import { type Song } from "@/components/Songs";

// PlayerState interface
interface PlayerState {
	playing: boolean;
	muted: boolean;
	duration: number;
	currentTime: number;
	song: Song | null;
	trackId: string | null;  // Unique identifier for the track
}

// PublicPlayerActions interface
interface PublicPlayerActions {
	play: (song?: Song, trackIndex?: number) => void;
	pause: () => void;
	toggle: (song?: Song, trackIndex?: number) => void;
	seekBy: (amount: number) => void;
	seek: (time: number) => void;
	playbackRate: (rate: number) => void;
	toggleMute: () => void;
	isPlaying: (song?: Song, trackIndex?: number) => boolean;
}

// Combine PlayerState and PublicPlayerActions
export type PlayerAPI = PlayerState & PublicPlayerActions;

// Actions enum
const enum ActionKind {
	SET_META = "SET_META",
	PLAY = "PLAY",
	PAUSE = "PAUSE",
	TOGGLE_MUTE = "TOGGLE_MUTE",
	SET_CURRENT_TIME = "SET_CURRENT_TIME",
	SET_DURATION = "SET_DURATION",
}

// Action type
type Action =
	| { type: ActionKind.SET_META; payload: { song: Song, trackId: string } }
	| { type: ActionKind.PLAY }
	| { type: ActionKind.PAUSE }
	| { type: ActionKind.TOGGLE_MUTE }
	| { type: ActionKind.SET_CURRENT_TIME; payload: number }
	| { type: ActionKind.SET_DURATION; payload: number };

// Create contexts
export const AudioContext = createContext<PlayerAPI | null>(null);

// Reducer function
function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return { ...state, song: action.payload.song, trackId: action.payload.trackId };
		case ActionKind.PLAY:
			return { ...state, playing: true };
		case ActionKind.PAUSE:
			return { ...state, playing: false };
		case ActionKind.TOGGLE_MUTE:
			return { ...state, muted: !state.muted };
		case ActionKind.SET_CURRENT_TIME:
			return { ...state, currentTime: action.payload };
		case ActionKind.SET_DURATION:
			return { ...state, duration: action.payload };
		default:
			return state;
	}
}

// AudioProvider component
export function AudioProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(audioReducer, {
		playing: false,
		muted: false,
		duration: 0,
		currentTime: 0,
		song: null,
		trackId: null,
	});
	
	const playerRef = useRef<HTMLAudioElement>(null);
	
	const actions = useMemo<PublicPlayerActions>(() => ({
		play(song, trackIndex = 0) {
			if (song) {
				const track = song.audioTracks?.[trackIndex];
				const src = track ? track.src : undefined;
				const trackId = `${song.id}-${trackIndex}`;  // Unique track identifier
				
				if (src) {
					if (state.song !== song || state.trackId !== trackId) {
						// If a different song or track is played, set the meta and reset the player
						dispatch({ type: ActionKind.SET_META, payload: { song, trackId } });
						
						if (playerRef.current && playerRef.current.currentSrc !== src) {
							const playbackRate = playerRef.current.playbackRate;
							playerRef.current.src = src;
							playerRef.current.load();
							playerRef.current.pause();
							playerRef.current.playbackRate = playbackRate;
							playerRef.current.currentTime = 0; // start from beginning
						}
					}
				}
			}
			
			if (playerRef.current) {
				playerRef.current.play().then(() => {
					dispatch({ type: ActionKind.PLAY });
				}).catch((error) => {
					console.error("Failed to start playing: ", error);
				});
			}
		},
		
		pause() {
			if (playerRef.current) {
				playerRef.current.pause();
				dispatch({ type: ActionKind.PAUSE });
			}
		},
		
		toggle(song, trackIndex = 0) {
			if (this.isPlaying(song, trackIndex)) {
				this.pause();
			} else {
				this.play(song, trackIndex);
			}
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
			dispatch({ type: ActionKind.TOGGLE_MUTE });
		},
		
		isPlaying(song, trackIndex = 0) {
			const trackId = `${song?.id}-${trackIndex}`;
			return trackId ? state.playing && state.trackId === trackId : state.playing;
		},
	}), [state.playing, state.muted, state.duration, state.currentTime, state.song, state.trackId]);
	
	const api = useMemo<PlayerAPI>(
		() => ({ ...state, ...actions }),
		[state, actions],
	);
	
	return (
		<AudioContext.Provider value={api}>
			{children}
			<audio
				ref={playerRef as React.RefObject<HTMLAudioElement>}
				onPlay={() => dispatch({ type: ActionKind.PLAY })}
				onPause={() => dispatch({ type: ActionKind.PAUSE })}
				onTimeUpdate={(event) => {
					dispatch({
						type: ActionKind.SET_CURRENT_TIME,
						payload: Math.floor(event.currentTarget.currentTime),
					});
				}}
				onDurationChange={(event) => {
					dispatch({
						type: ActionKind.SET_DURATION,
						payload: Math.floor(event.currentTarget.duration),
					});
				}}
				muted={state.muted}
			/>
		</AudioContext.Provider>
	);
}

// Custom hook for using audio player
export function useAudioPlayer(song?: Song, trackIndex: number = 0) {
	const audioPlayer = useContext(AudioContext);
	
	if (!audioPlayer) throw new Error("useAudioPlayer must be used within an AudioProvider");
	
	return useMemo<PlayerAPI>(
		() => ({
			...audioPlayer!,
			play() {
				audioPlayer.play(song, trackIndex);
			},
			toggle() {
				audioPlayer.toggle(song, trackIndex);
			},
			get playing() {
				const trackId = `${song?.id}-${trackIndex}`;
				return trackId ? audioPlayer.trackId === trackId && audioPlayer.playing : audioPlayer.playing;
			},
		}),
		[audioPlayer, song, trackIndex],
	);
}