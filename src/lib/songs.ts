import { songList as songListData } from "@/lib/songList";
import { KeyMap } from "@/components/Keys";

export enum TrackType {
	SONG = "song",
	SOPRANO = "soprano",
	ALTO = "alto",
	TENOR = "tenor",
	BASS = "bass",
	BACKUP = "backup"
}

type MelodyType = "Bass" | "Tenor" | "Alto" | "Soprano" | "TBD";

type TextureType = "Solo" | "Unison" | "Harmony" | "Partly Harmony" | "Instrumental Interlude" | "Bars";

type KeyNote =
	"A"
	| "A#"
	| "B♭"
	| "B"
	| "C"
	| "C#"
	| "D♭"
	| "D"
	| "D#"
	| "E♭"
	| "E"
	| "F"
	| "F#"
	| "G♭"
	| "G"
	| "G#"
	| "A♭"
	| "TBD";

type KeyQuality = "major" | "minor" | "diminished" | "augmented";

interface Duration {
	minutes: number;
	seconds?: number;
}

interface AudioTrack {
	src: string;
	audioType: TrackType;
	isPrimary?: boolean;
}

// Interface for keys, including quality
export interface Key {
	note: KeyNote;
	quality?: KeyQuality;
}

// Interface for textures, including repetitions
export interface Texture {
	type: TextureType;
	repetitions: number;
}

// Interface for song sections
interface SongSection {
	sectionName: string;
	textures?: Texture[];
	extraNotes?: string;
	text?: string;
	keys?: Key[];
}

// Base interface for all songs
interface BaseSong {
	id: string;
	session?: number;
	order?: number;
	title: string;
	artist: string;
	duration: Duration;
	youtube?: string[];
	chordify?: string[];
	audioTracks?: AudioTrack[];
}

// Interface for single songs
export interface SingleSong extends BaseSong {
	original?: string;
	lead: string[];
	language: string[];
	keys: Key[];
	melody: MelodyType[];
	structureNotes?: string;
	performanceNotes?: string;
	sections?: SongSection[];
}

// Interface for medley songs
export interface Medley extends BaseSong {
	songList: SingleSong[];
}

// Union type for a song which can be either single or medley
export type Song = SingleSong | Medley;

// Type guard to differentiate between single song and medley
export const isMedley = (song: Song): song is Medley => "songList" in song;

// Function to retrieve all song details
export async function getAllSongDetails(): Promise<Song[]> {
	return songListData;
}

// Function to format textures
export const formatTextures = (textures: Texture[]): string => {
	return textures.map(texture => `${texture.repetitions}x ${texture.type}`).join(", ");
};

// Function to format keys
export const formatKeys = (keys: Key[]): string => {
	return keys.map(({ note, quality }) =>
		`${note}${quality ? quality : ""} (${KeyMap[note]}${quality ? quality : ""})`,
	).join(" > ");
};

// Function to format arrays with comma separation
export const formatArray = (array: string[]): string => array.join(", ");

// Construct the overview of sections
export const formatSectionsOverview = (sections: SongSection[]): string => {
	return sections.map(section => {
		const repetitions = section.textures?.reduce((sum, texture) => sum + texture.repetitions, 0) || 1;
		return `${section.sectionName} (${repetitions}x)`;
	}).join(", ");
};