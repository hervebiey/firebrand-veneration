import { BigGodInMedley } from "@/lib/songs/BigGodInMedley";
import { PraiseInMedley } from "@/lib/songs/PraiseInMedley";
import { Medley } from "@/components/Songs";

export const PraiseMedley: Medley = {
	id: "praise-medley",
	session: 2,
	order: 2,
	title: "Praise Medley (Sound from Zion)",
	artist: "The Epoch House",
	getDuration: { minutes: 10 },
	youtube: ["wpG1jUnnI7o"],
	/*audio: {
		src: "/songs/praise-medley.mp3",
		type: "audio/mpeg",
	},*/
	songList: [
		BigGodInMedley,
		PraiseInMedley,
	],
};