import { SingleSong } from "@/components/Songs";

export const GoodnessOfGod: SingleSong = {
	id: "goodness-of-god",
	session: 1,
	order: 1,
	title: "Goodness of God",
	artist: "CeCe Winans",
	original: "Jenn Johnson - Goodness of God",
	lead: ["TBD"],
	language: ["English"],
	keys: [{
		note: "A♭",
	}],
	melody: ["Soprano"],
	duration: { minutes: 5 },
	youtube: ["9sE5kEnitqE"],
	chordify: ["https://chordify.net/chords/cece-winans-songs/goodness-of-god-chords"],
	audioTracks: [
		{
			src: "/songs/goodness-of-god.mp3",
			trackType: "song",
			isPrimary: true,
		},
		{
			src: "/backups/worthy-of-it-all.m4a",
			trackType: "backup",
		},
	],
	sections: [
		{
			sectionName: "Verse 1",
			textures: [{
				type: "Solo",
				repetitions: 1,
			}],
			text: [
				"I love You, Lord",
				"For Your mercy never failed me",
				"All my days",
				"I've been held in Your hands",
				null,
				"From the moment that I wake up",
				"Until I lay my head",
				"I will sing of the goodness of God",
			],
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Solo",
				repetitions: 1,
			}],
			text: [
				"All my life You have been faithful",
				"All my life You have been so, so good",
				"With every breath that I am able",
				"I will sing of the goodness of God",
			],
		},
		{
			sectionName: "Verse 2",
			textures: [{
				type: "Partly Harmony",
				repetitions: 1,
			}],
			text: [
				["I love Your voice", null, "Unison"],
				["You have led me through the fire", null, "Harmony"],
				["In darkest nights", null, "Unison"],
				["You are close like no other", null, "Harmony"],
				null,
				["I've known You as a Father", null, "Unison"],
				["I've known You as a Friend", null, "Harmony"],
				["I have lived in the goodness of God", null, "Harmony"],
			],
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 1,
			}],
			text: [
				"All my life You have been faithful",
				"All my life You have been so, so good",
				"With every breath that I am able",
				["I will sing of the goodness of God", null, "Unison"],
			],
		},
		{
			sectionName: "Bridge",
			textures: [
				{
					type: "Solo",
					repetitions: 1,
				},
				{
					type: "Harmony",
					repetitions: 1,
				},
			],
			text: [
				["Your goodness is running after, it's running after me", null, "x2"],
				"With my life laid down, I'm surrendered now",
				"I give You everything",
				"Your goodness is running after, it's running after me",
			],
		},
		{
			sectionName: "Chorus",
			textures: [
				{
					type: "Solo",
					repetitions: 1,
				},
				{
					type: "Harmony",
					repetitions: 1,
				},
			],
			text: [
				"All my life You have been faithful",
				"All my life You have been so, so good",
				"With every breath that I am able",
				["I will sing of the goodness of God", null, "Unison"],
			],
		},
		{
			sectionName: "Tag",
			textures: [{
				type: "Unison",
				repetitions: 2,
			}],
			text: [
				"I will sing of the goodness of God",
			],
		},
	],
};