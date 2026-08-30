"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import { type Song } from "@/components/Songs";
import { adjacentPlayable, primaryTrackIndex } from "@/lib/publicSongs";

interface PlayerState {
	song: Song | null;
	trackIndex: number | null;
	isPlaying: boolean;
	isMuted: boolean;
	playbackRate: number;
}

interface PublicPlayerActions {
	// Raw actions — always take explicit targets.
	playSong: (song: Song, trackIndex?: number, fraction?: number) => void;
	toggleSong: (song: Song, trackIndex?: number) => void;
	isSongPlaying: (song: Song, trackIndex?: number) => boolean;
	next: () => void;
	previous: () => void;
	pause: () => void;
	skip: (amount: number) => void;
	seek: (time: number) => void;
	seekFraction: (fraction: number) => void;
	cycleRate: () => void;
	mute: () => void;
	setPlaying: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	// The player bar creates the WaveSurfer instance and registers it here.
	attachWavesurfer: (instance: WaveSurfer | null) => void;
}

export type PlayerAPI = PlayerState & PublicPlayerActions;

const enum ActionKind {
	SET_META = "SET_META",
	SET_PLAYING = "SET_PLAYING",
	SET_PAUSING = "SET_PAUSING",
	SET_MUTED = "SET_MUTED",
	SET_RATE = "SET_RATE",
}

type Action =
	| { type: ActionKind.SET_META; payload: { song: Song; trackIndex: number } }
	| { type: ActionKind.SET_PLAYING }
	| { type: ActionKind.SET_PAUSING }
	| { type: ActionKind.SET_MUTED }
	| { type: ActionKind.SET_RATE; payload: number };

export const AudioContext = createContext<PlayerAPI | null>(null);

function audioReducer(state: PlayerState, action: Action): PlayerState {
	switch (action.type) {
		case ActionKind.SET_META:
			return {
				...state,
				song: action.payload.song,
				trackIndex: action.payload.trackIndex,
			};
		case ActionKind.SET_PLAYING:
			return { ...state, isPlaying: true };
		case ActionKind.SET_PAUSING:
			return { ...state, isPlaying: false };
		case ActionKind.SET_MUTED:
			return { ...state, isMuted: !state.isMuted };
		case ActionKind.SET_RATE:
			return { ...state, playbackRate: action.payload };
		default:
			return state;
	}
}

const initialState: PlayerState = {
	song: null,
	trackIndex: null,
	isPlaying: false,
	isMuted: false,
	playbackRate: 1,
};

const PLAYBACK_RATES = [1, 1.5, 2];

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(audioReducer, initialState);
	const waveSurferRef = useRef<WaveSurfer | null>(null);

	// The single WaveSurfer instance is created by the player bar (which is
	// always mounted) and shared through this ref.

	const actions = useMemo<PublicPlayerActions>(() => {
		const startCurrent = () => {
			waveSurferRef.current
				?.play()
				.then(() => dispatch({ type: ActionKind.SET_PLAYING }))
				.catch(console.error);
		};

		const load = (song: Song, trackIndex: number, fraction?: number) => {
			const src = song.audioTracks?.[trackIndex]?.src;
			if (!src || !waveSurferRef.current) return;
			dispatch({ type: ActionKind.SET_META, payload: { song, trackIndex } });
			waveSurferRef.current
				.load(src)
				.then(() => {
					// Loading resets the media element — re-apply the session settings.
					waveSurferRef.current?.setPlaybackRate(state.playbackRate);
					waveSurferRef.current?.setMuted(state.isMuted);
					if (fraction && fraction > 0)
						waveSurferRef.current?.seekTo(Math.min(1, fraction));
					startCurrent();
				})
				.catch((error) => {
					// load() rejects with AbortError when another track interrupts it.
					if ((error as Error)?.name !== "AbortError") console.error(error);
				});
		};

		const playSong = (song: Song, trackIndex?: number, fraction?: number) => {
			const index = trackIndex ?? primaryTrackIndex(song);
			if (state.song?.id === song.id && state.trackIndex === index) {
				if (fraction !== undefined)
					waveSurferRef.current?.seekTo(Math.min(1, Math.max(0, fraction)));
				startCurrent();
			} else {
				// Keep the position when switching between tracks of the same song.
				const keepFraction =
					fraction ??
					(state.song?.id === song.id &&
					(waveSurferRef.current?.getDuration() ?? 0) > 0
						? (waveSurferRef.current!.getCurrentTime() ?? 0) /
							waveSurferRef.current!.getDuration()
						: undefined);
				load(song, index, keepFraction);
			}
		};

		const setPlaying = () => {
			if (!state.isPlaying) startCurrent();
		};

		return {
			playSong,
			toggleSong(song, trackIndex) {
				const index = trackIndex ?? primaryTrackIndex(song);
				if (state.song?.id === song.id && state.trackIndex === index) {
					if (state.isPlaying) {
						waveSurferRef.current?.pause();
						dispatch({ type: ActionKind.SET_PAUSING });
					} else {
						startCurrent();
					}
				} else {
					playSong(song, index);
				}
			},
			isSongPlaying(song, trackIndex) {
				if (!state.isPlaying || state.song?.id !== song.id) return false;
				return trackIndex === undefined || state.trackIndex === trackIndex;
			},
			next() {
				if (!state.song) return;
				const nextSong = adjacentPlayable(state.song, 1);
				playSong(nextSong, primaryTrackIndex(nextSong), 0);
			},
			previous() {
				if (!state.song) return;
				const previousSong = adjacentPlayable(state.song, -1);
				playSong(previousSong, primaryTrackIndex(previousSong), 0);
			},
			pause() {
				waveSurferRef.current?.pause();
				dispatch({ type: ActionKind.SET_PAUSING });
			},
			skip(amount) {
				waveSurferRef.current?.skip(amount);
				setPlaying();
			},
			seek(time) {
				const duration = waveSurferRef.current?.getDuration() ?? 0;
				if (duration > 0) {
					waveSurferRef.current?.seekTo(Math.min(1, Math.max(0, time / duration)));
					setPlaying();
				}
			},
			seekFraction(fraction) {
				waveSurferRef.current?.seekTo(Math.min(1, Math.max(0, fraction)));
				setPlaying();
			},
			cycleRate() {
				const index = PLAYBACK_RATES.indexOf(state.playbackRate);
				const nextRate = PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length];
				waveSurferRef.current?.setPlaybackRate(nextRate);
				dispatch({ type: ActionKind.SET_RATE, payload: nextRate });
			},
			mute() {
				waveSurferRef.current?.setMuted(!state.isMuted);
				dispatch({ type: ActionKind.SET_MUTED });
			},
			setPlaying,
			getCurrentTime() {
				return waveSurferRef.current?.getCurrentTime() ?? 0;
			},
			getDuration() {
				return waveSurferRef.current?.getDuration() ?? 0;
			},
			attachWavesurfer(instance) {
				waveSurferRef.current = instance;
			},
		};
	}, [state.song, state.trackIndex, state.isPlaying, state.isMuted, state.playbackRate]);

	const api = useMemo<PlayerAPI>(
		() => ({ ...state, ...actions }),
		[state, actions],
	);

	return <AudioContext.Provider value={api}>{children}</AudioContext.Provider>;
}

export function useAudioPlayer(): PlayerAPI {
	const audioPlayer = useContext(AudioContext);
	if (!audioPlayer)
		throw new Error("useAudioPlayer must be used within an AudioProvider");
	return audioPlayer;
}

// Polls the playhead while something is playing (or once when paused).
export function usePlayerProgress(intervalMs = 400) {
	const player = useAudioPlayer();
	const [progress, setProgress] = useState({ time: 0, duration: 0, fraction: 0 });

	useEffect(() => {
		const read = () => {
			const time = player.getCurrentTime();
			const duration = player.getDuration();
			setProgress({
				time,
				duration,
				fraction: duration > 0 ? time / duration : 0,
			});
		};
		read();
		if (!player.isPlaying) return;
		const id = setInterval(read, intervalMs);
		return () => clearInterval(id);
	}, [player, intervalMs]);

	return progress;
}
