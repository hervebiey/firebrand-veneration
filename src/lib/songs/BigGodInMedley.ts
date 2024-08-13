import { SingleSong } from "@/components/Songs";

export const BigGodInMedley: SingleSong = {
	id: "big-god",
	title: "Big God",
	artist: "The Epoch House",
	originalArtist: "Tim Godfrey",
	lead: ["TBD"],
	language: ["English"],
	keys: [{
		note: "A♭",
	}],
	melody: ["Alto"],
	duration: { minutes: 2, seconds: 20 },
	youtube: ["cGkKJuWB_58"],
	chordify: ["https://chordify.net/chords/praise-medley-live-at-sound-from-zion-24-god-in-this-music"],
	structureNotes: "From 1\'40\" Until 4\'00\"",
	audioTracks: [
		{
			src: "/song/big-god.mp3",
			trackType: "song",
			isPrimary: true,
		},
		{
			src: "/original/big-god.mp3",
			trackType: "original",
			artist: "Tim Godfrey & Fearless Community feat. Anderson"
		},
	],
	sections: [
		{
			sectionName: "Chorus",
			textures: [{
				type: "Unison",
				repetitions: 4,
			}],
			text: [
				"I have a very big God",
				"A very big God oh",
				"He no dey fall my hand",
				"He's always on my side",
				"A very big God",
			],
		},
		{
			sectionName: "Interlude",
			textures: [{
				type: "Bars",
				repetitions: 2,
			}],
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Unison",
				repetitions: 4,
			}],
			text: [
				"I have a very big God",
				"A very big God oh",
				"He no dey fall my hand",
				"He's always on my side",
				"A very big God",
			],
		},
	],
};