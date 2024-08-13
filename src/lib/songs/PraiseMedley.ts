import { BigGodInMedley } from "@/lib/songs/BigGodInMedley";
import { PraiseInMedley } from "@/lib/songs/PraiseInMedley";
import { Medley } from "@/components/Songs";

export const PraiseMedley: Medley = {
	id: "praise-medley",
	session: 2,
	order: 2,
	title: "Praise Medley",
	duration: { minutes: 10 },
	youtube: ["wpG1jUnnI7o"],
	audioTracks: [{
		src: "/song/praise-medley.mp3",
		trackType: "song",
		isPrimary: true,
	}],
	songList: [
		BigGodInMedley,
		PraiseInMedley,
	],
};