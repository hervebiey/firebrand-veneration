import {type Song} from "@/lib/songs";

export function getTime(song: Song) {
	let seconds = song.length.seconds?.toString() || "00";
	return song.length.minutes.toString() + "\'" + seconds + "\"";
}