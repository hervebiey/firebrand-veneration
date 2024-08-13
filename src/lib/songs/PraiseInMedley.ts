import { SingleSong } from "@/components/Songs";

export const PraiseInMedley: SingleSong = {
	id: "praise",
	title: "Praise",
	artist: "Elevation Worship",
	lead: ["TBD"],
	language: ["English"],
	keys: [{
		note: "A♭",
	}],
	melody: ["Alto"],
	duration: { minutes: 5 },
	youtube: ["f2oxGYpuLkw"],
	chordify: ["https://chordify.net/chords/praise-medley-live-at-sound-from-zion-24-god-in-this-music"],
	structureNotes: "From 7\'00\" Until the End",
	audioTracks: [
		{
			src: "/song/praise.mp3",
			trackType: "song",
			isPrimary: true,
		},
		{
			src: "/cover/praise.mp3",
			trackType: "cover",
			artist: "The Epoch House",
		},
		{
			src: "/backing/praise.m4a",
			trackType: "backing",
		},
		{
			src: "/alto/praise.m4a",
			trackType: "alto",
		},
	],
	sections: [
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 2,
			}],
			text: [
				["Praise the Lord, oh my soul", null, "Unison"],
				"Praise the Lord, oh my soul",
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
			sectionName: "Verse",
			textures: [
				{
					type: "Solo",
					repetitions: 1,
				},
				{
					type: "Unison",
					repetitions: 1,
				},
				{
					type: "Solo",
					repetitions: 1,
				},
			],
			extraNotes: "Tenor Melody",
			text: [
				"I won't be quiet, my God is alive",
				"How could I keep it inside",
				"I won't be quiet, my God is alive",
				"How could I keep it inside",
			],
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 2,
			}],
			text: [
				["Praise the Lord, oh my soul", null, "Unison"],
				"Praise the Lord, oh my soul",
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
			sectionName: "Outro",
			textures: [{
				type: "Unison",
				repetitions: 1,
			}],
			text: [
				"Hey, Hey",
				"Hey, Hey",
			],
		},
	],
};