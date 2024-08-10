import { TrackType } from "@/lib/songs";

console.log("TrackType Test:", TrackType);

if (TrackType) {
	console.log("TrackType.SONG:", TrackType.SONG);
	console.log("TrackType.BACKUP:", TrackType.BACKUP);
} else {
	console.error("TrackType is undefined");
}