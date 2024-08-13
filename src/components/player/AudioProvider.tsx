"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { type Song } from "@/components/Songs";

// PlayerState interface
interface PlayerState {
	song: Song | null;
	trackIndex: number | null;
	isPlaying: boolean;
	isMuted: boolean;
}

// PublicPlayerActions interface
interface PublicPlayerActions {
	play: (song?: Song, trackIndex?: number) => void;
	pause: () => void;
	toggle: (song?: Song, trackIndex?: number) => void;
	skip: (amount: number) => void;
	seek: (time: number) => void;
	setPlaybackRate: (rate: number) => void;
	mute: () => void;
	playing: (song?: Song, trackIndex?: number) => boolean;
	muted: () => boolean;
	getCurrentTime: () => number;
	getDuration: () => number;
}

// Combine PlayerState, PublicPlayerActions, and the Wavesurfer ref
export type PlayerAPI = PlayerState & PublicPlayerActions & {
	wavesurferRef: React.MutableRefObject<any>;
};

// Actions enum
const enum ActionKind {
	SET_META = "SET_META",
	SET_PLAYING = "SET_PLAYING",
	SET_PAUSING = "SET_PAUSING",
	SET_MUTED = "SET_MUTED",
}

// Action type
type Action =
	| { type: ActionKind.SET_META; payload: { song: Song, trackIndex: number } }
	| { type: ActionKind.SET_PLAYING }
	| { type: ActionKind.SET_PAUSING }
	| { type: ActionKind.SET_MUTED };

// Create contexts
export const AudioContext = createContext<PlayerAPI | null>(null);

// Reducer function
function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return { ...state, song: action.payload.song, trackIndex: action.payload.trackIndex };
		case ActionKind.SET_PLAYING:
			return { ...state, isPlaying: true };
		case ActionKind.SET_PAUSING:
			return { ...state, isPlaying: false };
		case ActionKind.SET_MUTED:
			return { ...state, isMuted: !state.isMuted };
		default:
			return state;
	}
}

// AudioProvider component
export function AudioProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(audioReducer, {
		song: null,
		trackIndex: null,
		isPlaying: false,
		isMuted: false,
	});
	
	const wavesurferRef = useRef<WaveSurfer | null>(null);  // Reference to Wavesurfer instance
	
	// Initialize WaveSurfer when AudioProvider mounts
	useEffect(() => {
		if (!wavesurferRef.current) {
			const container = document.createElement("div");
			container.style.display = "none"; // Hidden container
			
			wavesurferRef.current = WaveSurfer.create({
				container: container,
			});
		}
		
		// Clean up the container on unmount
		return () => {
			wavesurferRef.current?.destroy();
			wavesurferRef.current = null;
		};
	}, []);
	
	const actions = useMemo<PublicPlayerActions>(() => ({
		play(song, trackIndex) {
			if (!song || trackIndex === null || trackIndex === undefined) return;
			
			const track = song.audioTracks?.[trackIndex];
			const src = track ? track.src : undefined;
			
			if (src && wavesurferRef.current) {
				// Only update the state if the song or trackIndex has changed
				if (state.song !== song || state.trackIndex !== trackIndex) {
					// If a different song or track is played, set the meta and reset the player
					dispatch({ type: ActionKind.SET_META, payload: { song, trackIndex } });
					
					// Load new track in Wavesurfer and play it once it's decoded
					wavesurferRef.current.load(src).then(() => {
						wavesurferRef.current?.play().then(() => {
							dispatch({ type: ActionKind.SET_PLAYING });
						}).catch(console.error);
					}).catch(console.error);
				} else {
					// Play the current track
					wavesurferRef.current?.play().then(() => {
						dispatch({ type: ActionKind.SET_PLAYING });
					}).catch(console.error);
				}
			}
		},
		
		pause() {
			// Pause via Wavesurfer
			wavesurferRef.current?.pause();
			dispatch({ type: ActionKind.SET_PAUSING });
		},
		
		toggle(song, trackIndex) {
			// Toggle play/pause
			if (state.song !== song || state.trackIndex !== trackIndex) {
				this.play(song, trackIndex);
			} else {
				wavesurferRef.current?.playPause();
				
				if (wavesurferRef.current?.isPlaying()) {
					dispatch({ type: ActionKind.SET_PLAYING });
				} else {
					dispatch({ type: ActionKind.SET_PAUSING });
				}
			}
		},
		
		skip(amount) {
			wavesurferRef.current?.skip(amount);
		},
		
		seek(time) {
			wavesurferRef.current?.seekTo(time / wavesurferRef.current.getDuration());
		},
		
		setPlaybackRate(rate) {
			wavesurferRef.current?.setPlaybackRate(rate);
		},
		
		mute() {
			wavesurferRef.current?.setMuted(!state.isMuted);
			dispatch({ type: ActionKind.SET_MUTED });
		},
		
		playing(song, trackIndex) {
			return state.song === song && state.trackIndex === trackIndex && state.isPlaying;
		},
		
		muted() {
			return state.isMuted;
		},
		
		getCurrentTime() {
			return wavesurferRef.current?.getCurrentTime() ?? 0;
		},
		
		getDuration() {
			return wavesurferRef.current?.getDuration() ?? 0;
		},
		
	}), [state.song, state.trackIndex, state.isPlaying, state.isMuted]);
	
	const api = useMemo<PlayerAPI>(
		() => ({ ...state, ...actions, wavesurferRef }),
		[state, actions],
	);
	
	return (
		<AudioContext.Provider value={api}>
			{children}
		</AudioContext.Provider>
	);
}

// Custom hook for using audio player
export function useAudioPlayer(song?: Song, trackIndex?: number) {
	const audioPlayer = useContext(AudioContext);
	
	if (!audioPlayer) throw new Error("useAudioPlayer must be used within an AudioProvider");
	
	return useMemo<PlayerAPI>(
		() => ({
			...audioPlayer!,
			play() {
				audioPlayer!.play(song, trackIndex);
			},
			toggle() {
				audioPlayer!.toggle(song, trackIndex);
			},
			playing() {
				return audioPlayer!.playing(song, trackIndex);
			},
			// getCurrentTime() {
			// 	return audioPlayer!.getCurrentTime();
			// },
			getDuration() {
				return audioPlayer!.getDuration();
			},
			muted() {
				return audioPlayer!.muted();
			},
		}),
		[audioPlayer, song, trackIndex],
	);
}
