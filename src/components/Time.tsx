import { type Song } from "@/components/Songs";

// 83.4 -> "1:23"
export function formatClock(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainder = Math.round(seconds) % 60;
	return `${minutes}:${`0${remainder}`.slice(-2)}`;
}

export function getTime(song: Song): string {
	if (!song.duration) {
		return "Duration N/A";
	}
	
	let seconds: string = song.duration.seconds !==
	undefined ? song.duration.seconds.toString().padStart(2, "0") : "00";
	return `${song.duration.minutes}'${seconds}"`;
}