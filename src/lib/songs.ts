import {songList} from "@/lib/songList";

interface BaseSong {
	id: string;
	session?: number;
	order?: number;
	title: string;
	artist: string;
	length: {
		minutes: number,
		seconds?: number
	};
	youtube?: string;
	audio?: {
		src: string
		type: string
	};
	soprano?: {
		src: string
		type: string
	};
	alto?: {
		src: string
		type: string
	};
	tenor?: {
		src: string
		type: string
	};
}

export interface SingleSong extends BaseSong {
	original?: string;
	lead: string;
	language: string;
	key: string;
	melody?: string;
	notes?: string;
	chordify?: string;
	lyrics?: SongSection[];
}

export interface Medley extends BaseSong {
	songs: SingleSong[];
}

export type Song = SingleSong | Medley;

interface SongSection {
	section: string;
	notes?: string;
	text?: string;
}

export const isMedley = (song: Song): song is Medley => 'songs' in song;

export async function getAllSongDetails() {
	return songList
}