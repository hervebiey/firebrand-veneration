"use client";

import React, { createContext, useContext, useMemo, useReducer, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { type Song } from "@/components/Songs";

// PlayerState interface
interface PlayerState {
	song: Song | null;
	trackIndex: number | null;  // Track index for the currently playing track
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
	isPlaying: (song?: Song, trackIndex?: number) => boolean;
	isMuted: () => boolean;
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
}

// Action type
type Action =
	| { type: ActionKind.SET_META; payload: { song: Song, trackIndex: number } };

// Create contexts
export const AudioContext = createContext<PlayerAPI | null>(null);

// Reducer function
function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return { ...state, song: action.payload.song, trackIndex: action.payload.trackIndex };
		default:
			return state;
	}
}

// AudioProvider component
export function AudioProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(audioReducer, {
		song: null,
		trackIndex: null,
	});
	
	const wavesurferRef = useRef<WaveSurfer | null>(null);  // Reference to Wavesurfer instance
	
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
						wavesurferRef.current?.play().catch(console.error);
					}).catch(console.error);
				} else {
					// Play the current track
					wavesurferRef.current?.play().catch(console.error);
				}
			}
		},
		
		pause() {
			// Pause via Wavesurfer
			wavesurferRef.current?.pause();
		},
		
		toggle(song, trackIndex) {
			// Use playPause() to toggle play/pause
			if (state.song !== song || state.trackIndex !== trackIndex) {
				this.play(song, trackIndex);
			} else {
				wavesurferRef.current?.playPause();
			}
			// this.isPlaying(song, trackIndex) ? this.pause() : this.play(song, trackIndex);
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
			wavesurferRef.current?.setMuted(!wavesurferRef.current.getMuted());
		},
		
		isPlaying(song, trackIndex) {
			return !!(
				state.song === song &&
				state.trackIndex === trackIndex &&
				wavesurferRef.current?.isPlaying()
			);
		},
		
		isMuted() {
			return !!wavesurferRef.current?.getMuted();
		},
		
		getCurrentTime() {
			return wavesurferRef.current?.getCurrentTime() ?? 0;
		},
		
		getDuration() {
			return wavesurferRef.current?.getDuration() ?? 0;
		},
		
	}), [state.song, state.trackIndex]);
	
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
				audioPlayer.play(song, trackIndex);
			},
			toggle() {
				audioPlayer.toggle(song, trackIndex);
			},
			isPlaying() {
				return audioPlayer.isPlaying(song, trackIndex);
			},
			// getCurrentTime() {
			// 	return audioPlayer.getCurrentTime();
			// },
			getDuration() {
				return audioPlayer.getDuration();
			},
			isMuted() {
				return audioPlayer.isMuted();
			},
		}),
		[audioPlayer, song, trackIndex],
	);
}