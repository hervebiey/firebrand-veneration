import {OpenTheEyesOfMyHeartInMedley} from "@/lib/songs/OpenTheEyesOfMyHeartInMedley";
import {BigGodInMedley} from "@/lib/songs/BigGodInMedley";
import {AllThingsArePossibleInMedley} from "@/lib/songs/AllThingsArePossibleInMedley";
import {PraiseInMedley} from "@/lib/songs/PraiseInMedley";

export const PraiseMedley = {
	id: "praise-medley",
	session: 2,
	order: 2,
	title: "Praise Medley (Sound from Zion)",
	artist: "The Epoch House",
	length: {minutes: 10},
	youtube: "wpG1jUnnI7o",
	/*audio: {
		src: "/songs/praise-medley.mp3",
		type: "audio/mpeg",
	},*/
	songs: [
		OpenTheEyesOfMyHeartInMedley,
		BigGodInMedley,
		AllThingsArePossibleInMedley,
		PraiseInMedley
	]
}