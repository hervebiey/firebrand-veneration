import {WorthyOfItAllInMedley} from "@/lib/songs/WorthyOfItAllInMedley";
import {AlleluiaHosanaInMedley} from "@/lib/songs/AlleluiaHosanaInMedley";
import {WayMakerInMedley} from "@/lib/songs/WayMakerInMedley";

export const FirstWorshipMedley = {
	id: "deeper-medley",
	session: 1,
	order: 5,
	title: "Deeper (Medley)",
	artist: "1st Worship Medley",
	length: {minutes: 12},
	/*audio: {
		src: "/songs/1st-worship-medley.mp3",
		type: "audio/mpeg",
	},*/
	songs: [
		WorthyOfItAllInMedley,
		AlleluiaHosanaInMedley,
		WayMakerInMedley
	]
}