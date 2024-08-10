import { SingleSong, TrackType } from "@/lib/songs";

console.log("TrackType:", TrackType);

if (TrackType) {
	console.log("TrackType.SONG:", TrackType.SONG);
	console.log("TrackType.BACKUP:", TrackType.BACKUP);
} else {
	console.error("TrackType is undefined");
}

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
			src: "/songs/worthy-of-it-all.mp3",
			audioType: "song",
			isPrimary: true,
		},
		{
			src: "/backups/worthy-of-it-all.m4a",
			audioType: "backup",
		},
	],
	sections: [
		{
			sectionName: "Verse 1",
			textures: [{
				type: "Solo",
				repetitions: 1,
			}],
			text: `I love You, Lord
			For Your mercy never failed me
			All my days
			I\'ve been held in Your hands
			
			From the moment that I wake up
			Until I lay my head
			I will sing of the goodness of God`,
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Solo",
				repetitions: 1,
			}],
			text: `All my life You have been faithful
			All my life You have been so, so good
			With every breath that I am able
			I will sing of the goodness of God`,
		},
		{
			sectionName: "Verse 2",
			textures: [{
				type: "Partly Harmony",
				repetitions: 1,
			}],
			text: `I love Your voice [Unison]
			You have led me through the fire [Harmony]
			In darkest nights [Unison]
			You are close like no other [Harmony]
			
			I\'ve known You as a Father [Unison]
			I\'ve known You as a Friend [Harmony]
			I have lived in the goodness of God [Harmony]`,
		},
		{
			sectionName: "Chorus",
			textures: [{
				type: "Harmony",
				repetitions: 1,
			}],
			text: `All my life You have been faithful
			All my life You have been so, so good
			With every breath that I am able
			I will sing of the goodness of God [Unison]`,
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
			text: `Your goodness is running after, it\'s running after me (x2)
			With my life laid down, I\'m surrendered now
			I give You everything
			Your goodness is running after, it\'s running after me`,
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
			text: `All my life You have been faithful
			All my life You have been so, so good
			With every breath that I am able
			I will sing of the goodness of God [Unison]`,
		},
		{
			sectionName: "Tag",
			textures: [{
				type: "Unison",
				repetitions: 2,
			}],
			text: `I will sing of the goodness of God`,
		},
	],
};