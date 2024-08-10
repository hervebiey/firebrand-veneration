import { SingleSong } from "@/lib/songs";

export const BigGodInMedley: SingleSong = {
	id: "big-god",
	title: "Big God",
	artist: "The Epoch House",
	original: "Tim Godfrey - Big God",
	lead: ["Pollet"],
	language: ["English"],
	key: [{
		note: "A♭",
	}],
	melody: ["Alto"],
	duration: { minutes: 2, seconds: 20 },
	youtube: ["cGkKJuWB_58"],
	chordify: ["https://chordify.net/chords/praise-medley-live-at-sound-from-zion-24-god-in-this-music"],
	structureNotes: "From 1\'40\" Until 4\'00\"",
	audioTracks: [
		{
			src: "/songs/big-god.mp3",
			audioType: "song",
			isPrimary: true,
		},
	],
	sections: [
		{
			sectionName: "Chorus",
			textures: [{
				type: "Unison",
				repetitions: 4,
			}],
			text: `I have a very big God
			A very big God oh
			He no dey fall my hand
			He\'s always on my side
			A very big God`,
		},
		{
			sectionName: "Instrumental Interlude",
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
			text: `I have a very big God
			A very big God oh
			He no dey fall my hand
			He\'s always on my side
			A very big God`,
		},
	],
};