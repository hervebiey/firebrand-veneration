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
	setPlaying: () => void;
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

// Initialize WaveSurfer function
const initializeWaveSurfer = (waveSurferRef: React.MutableRefObject<WaveSurfer | null>) => {
	if (!waveSurferRef.current) {
		const container = document.createElement("div");
		container.style.display = "none"; // Hidden container
		waveSurferRef.current = WaveSurfer.create({ container: container });
	}
	
	// Clean up the container on unmount
	return () => {
		waveSurferRef.current?.destroy();
		waveSurferRef.current = null;
	};
};

// Initial state
const initialState: PlayerState = {
	song: null,
	trackIndex: null,
	isPlaying: false,
	isMuted: false,
};

// AudioProvider component
export function AudioProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(audioReducer, initialState);
	const waveSurferRef = useRef<WaveSurfer | null>(null);
	
	// Initialize WaveSurfer when AudioProvider mounts
	useEffect(() => initializeWaveSurfer(waveSurferRef), []);
	
	const actions = useMemo<PublicPlayerActions>(() => ({
		play(song, trackIndex) {
			if (!song || trackIndex === null || trackIndex === undefined) return;
			
			const track = song.audioTracks?.[trackIndex];
			const src = track ? track.src : undefined;
			
			if (src && waveSurferRef.current) {
				// Only update the state if the song or trackIndex has changed
				if (state.song !== song || state.trackIndex !== trackIndex) {
					// If a different song or track is played, set the meta and reset the player
					dispatch({ type: ActionKind.SET_META, payload: { song, trackIndex } });
					
					// Load new track in Wavesurfer and play it once it's decoded
					waveSurferRef.current.load(src).then(() => {
						waveSurferRef.current?.play().then(() => {
							dispatch({ type: ActionKind.SET_PLAYING });
						}).catch(console.error);
					}).catch(console.error);
				} else {
					// Play the current track
					waveSurferRef.current?.play().then(() => {
						dispatch({ type: ActionKind.SET_PLAYING });
					}).catch(console.error);
				}
			}
		},
		pause() {
			// Pause via Wavesurfer
			waveSurferRef.current?.pause();
			dispatch({ type: ActionKind.SET_PAUSING });
		},
		toggle(song, trackIndex) {
			// Toggle play/pause
			if (state.song !== song || state.trackIndex !== trackIndex) {
				this.play(song, trackIndex);
			} else {
				waveSurferRef.current?.playPause();
				
				if (waveSurferRef.current?.isPlaying()) {
					dispatch({ type: ActionKind.SET_PLAYING });
				} else {
					dispatch({ type: ActionKind.SET_PAUSING });
				}
			}
		},
		skip(amount) {
			waveSurferRef.current?.skip(amount);
			this.setPlaying();
		},
		seek(time) {
			waveSurferRef.current?.seekTo(time / waveSurferRef.current.getDuration());
			this.setPlaying();
		},
		setPlaybackRate(rate) {
			waveSurferRef.current?.setPlaybackRate(rate);
		},
		mute() {
			waveSurferRef.current?.setMuted(!state.isMuted);
			dispatch({ type: ActionKind.SET_MUTED });
		},
		playing(song, trackIndex) {
			return state.song === song && state.trackIndex === trackIndex && state.isPlaying;
		},
		setPlaying() {
			// If not playing, start playing
			if (!state.isPlaying) {
				waveSurferRef.current?.play().then(() => {
					dispatch({ type: ActionKind.SET_PLAYING });
				}).catch(console.error);
			}
		},
		muted() {
			return state.isMuted;
		},
		getCurrentTime() {
			return waveSurferRef.current?.getCurrentTime() ?? 0;
		},
		getDuration() {
			return waveSurferRef.current?.getDuration() ?? 0;
		},
	}), [state.song, state.trackIndex, state.isPlaying, state.isMuted]);
	
	const api = useMemo<PlayerAPI>(
		() => ({ ...state, ...actions, wavesurferRef: waveSurferRef }),
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
	
	// Use memoized result for player actions
	return useMemo<PlayerAPI>(() => ({
		...audioPlayer!,
		play() {
			audioPlayer.play(song, trackIndex);
		},
		toggle() {
			audioPlayer.toggle(song, trackIndex);
		},
		playing() {
			return audioPlayer.playing(song, trackIndex);
		},
		muted() {
			return audioPlayer.muted();
		},
	}), [audioPlayer, song, trackIndex]);
}
