import { type Song } from "@/components/Songs";

export function getTime(song: Song): string {
	if (!song.duration) {
		return "Duration N/A";
	}
	
	let seconds: string = song.duration.seconds !==
	undefined ? song.duration.seconds.toString().padStart(2, "0") : "00";
	return `${song.duration.minutes}'${seconds}"`;
}