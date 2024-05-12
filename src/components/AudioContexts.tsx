import {createContext} from "react";
import {PlayerAPI, TrackType} from '@/components/AudioProvider';

export const AudioContexts = {
	[TrackType.AUDIO]: createContext<PlayerAPI>({} as PlayerAPI),
	[TrackType.SOPRANO]: createContext<PlayerAPI>({} as PlayerAPI),
	[TrackType.ALTO]: createContext<PlayerAPI>({} as PlayerAPI),
	[TrackType.TENOR]: createContext<PlayerAPI>({} as PlayerAPI),
}