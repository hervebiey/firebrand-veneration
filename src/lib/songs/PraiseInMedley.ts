import { SingleSong } from "@/components/Songs";

export const PraiseInMedley: SingleSong = {
	id: "praise",
	title: "Praise",
	artist: "The Epoch House",
	original: "Elevation Worship - Praise",
	lead: ["Sharon"],
	language: ["English"],
	keys: [{
		note: "A♭",
	}],
	melody: ["Alto"],
	duration: { minutes: 2, seconds: 45 },
	youtube: ["f2oxGYpuLkw"],
	chordify: ["https://chordify.net/chords/praise-medley-live-at-sound-from-zion-24-god-in-this-music"],
	structureNotes: "From 7\'00\" Until the End",
	audioTracks: [
		{
			src: "/songs/praise.mp3",
			trackType: "song",
			trackIndex: 1,
			isPrimary: true,
		},
		{
			src: "/background/praise.m4a",
			trackType: "backup",
			trackIndex: 2,
		},
		{
			src: "/alto/praise.m4a",
			trackType: "alto",
			trackIndex: 3,
		},
	],
	sections: [
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 2,
			}],
			text: `Praise the Lord, oh my soul [Unison]
			Praise the Lord, oh my soul`,
		},
		{
			sectionName: "Instrumental Interlude",
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
			text: `I won\'t be quiet, my God is alive
			How could I keep it inside
			I won\'t be quiet, my God is alive
			How could I keep it inside`,
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 2,
			}],
			text: `Praise the Lord, oh my soul [Unison]
			Praise the Lord, oh my soul`,
		},
		{
			sectionName: "Instrumental Interlude",
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
			text: `Hey, Hey
			Hey, Hey`,
		},
	],
};