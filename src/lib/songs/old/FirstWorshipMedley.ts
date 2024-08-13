import {WorthyOfItAllInMedley} from "@/lib/songs/old/WorthyOfItAllInMedley";
import {AlleluiaHosanaInMedley} from "@/lib/songs/old/AlleluiaHosanaInMedley";
import {WayMakerInMedley} from "@/lib/songs/old/WayMakerInMedley";

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