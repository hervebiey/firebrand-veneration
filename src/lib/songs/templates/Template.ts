import { SingleSong } from "@/components/Songs";

export const Name: SingleSong = {
	id: "name",
	session: 1,
	order: 1,
	title: "title",
	artist: "artist",
	originalArtist: "original",
	lead: ["TBD"],
	language: ["language"],
	keys: [{
		note: "A♭",
	}],
	melody: ["Alto"],
	duration: { minutes: 5 },
	youtube: ["youtube"],
	chordify: ["chordify"],
	audioTracks: [
		{
			src: "/songs/song.mp3",
			trackType: "song",
			isPrimary: true,
		},
		{
			src: "/soprano/song.m4a",
			trackType: "soprano",
		},
		{
			src: "/alto/song.m4a",
			trackType: "alto",
		},
		{
			src: "/tenor/song.m4a",
			trackType: "tenor",
		},
	],
}