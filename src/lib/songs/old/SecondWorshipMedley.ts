import {PowerAndMightInMedley} from "@/lib/songs/old/PowerAndMightInMedley";
import {SaintEspritInMedley} from "@/lib/songs/old/SaintEspritInMedley";
import {NothingLikeYourPresence} from "@/lib/songs/NothingLikeYourPresence";

export const SecondWorshipMedley = {
	id: "higher-medley",
	session: 2,
	order: 3,
	title: "Higher (Medley)",
	artist: "2nd Worship Medley",
	length: {minutes: 15},
	/*audio: {
		src: "/songs/2nd-worship-medley.mp3",
		type: "audio/mpeg",
	},*/
	songs: [
		PowerAndMightInMedley,
		SaintEspritInMedley,
		NothingLikeYourPresence
	]
}