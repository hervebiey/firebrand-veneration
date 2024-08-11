"use client";

import React, { createContext, useContext, useMemo, useReducer, useRef } from "react";

import { type Song } from "@/components/Songs";

// PlayerState interface
interface PlayerState {
	song: Song | null;
	trackIndex: string | null;  // Unique identifier for the track
}

// PublicPlayerActions interface
interface PublicPlayerActions {
	play: (song?: Song, trackIndex?: number) => void;
	pause: () => void;
	toggle: (song?: Song, trackIndex?: number) => void;
	skip: (amount: number) => void;
	seek: (time: number) => void;
	setPlaybackRate: (rate: number) => void;
	toggleMute: () => void;
	isPlaying: () => boolean;
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
	| { type: ActionKind.SET_META; payload: { song: Song, trackId: string } };

// Create contexts
export const AudioContext = createContext<PlayerAPI | null>(null);

// Reducer function
function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return { ...state, song: action.payload.song, trackIndex: action.payload.trackId };
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
	
	const playerRef = useRef<HTMLAudioElement>(null);
	const wavesurferRef = useRef<any>(null); // Reference to Wavesurfer instance
	
	const actions = useMemo<PublicPlayerActions>(() => ({
		play(song, trackIndex = 0) {
			if (song) {
				const track = song.audioTracks?.[trackIndex];
				const src = track ? track.src : undefined;
				const trackId = `${song.id}-${trackIndex}`;  // Unique track identifier
				
				if (src) {
					if (state.song !== song || state.trackIndex !== trackId) {
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
						
						// Load new track in Wavesurfer
						wavesurferRef.current?.load(src);
					}
				}
			}
			
			// Play via Wavesurfer
			wavesurferRef.current?.play().catch(console.error);
		},
		
		pause() {
			// Pause via Wavesurfer
			wavesurferRef.current?.pause();
		},
		
		toggle(song, trackIndex = 0) {
			const isPlaying = wavesurferRef.current?.isPlaying();
			isPlaying ? this.pause() : this.play(song, trackIndex);
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
		
		toggleMute() {
			if (wavesurferRef.current) {
				const currentVolume = wavesurferRef.current.getVolume();
				wavesurferRef.current.setVolume(currentVolume > 0 ? 0 : 1);
			}
		},
		
		isPlaying() {
			return wavesurferRef.current?.isPlaying();
		},
		
		isMuted() {
			return wavesurferRef.current?.getVolume() === 0;
		},
		
		getCurrentTime() {
			return wavesurferRef.current?.getCurrentTime();
		},
		
		getDuration() {
			return wavesurferRef.current?.getDuration();
		}
		
	}), [state.song, state.trackIndex]);
	
	const api = useMemo<PlayerAPI>(
		() => ({ ...state, ...actions, wavesurferRef }),
		[state, actions],
	);
	
	return (
		<AudioContext.Provider value={api}>
			{children}
			<audio ref={playerRef as React.RefObject<HTMLAudioElement>} />
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
			isPlaying() {
				return audioPlayer.isPlaying();
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