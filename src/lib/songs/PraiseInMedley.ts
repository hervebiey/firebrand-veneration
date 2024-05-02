export const PraiseInMedley = {
	id: "praise",
	title: "Praise",
	artist: "The Epoch House",
	original: "Elevation Worship - Praise",
	lead: "To Be Determined",
	language: "English",
	key: "A♭",
	melody: "Alto",
	length: {minutes: 2, seconds: 45},
	chordify: "https://chordify.net/chords/praise-medley-live-at-sound-from-zion-24-god-in-this-music",
	notes: "From 7\'00\" Until the End",
	audio: {
		src: "/songs/praise.mp3",
		type: "audio/mpeg",
	},
	soprano: {
		src: "/background/praise.m4a",
		type: "audio/mpeg",
	},
	alto: {
		src: "/alto/praise.m4a",
		type: "audio/mpeg",
	},
	tenor: {
		src: "/background/praise.m4a",
		type: "audio/mpeg",
	},
	lyrics: [
		{
			section: "Chorus",
			notes: "2x Harmony",
			text: `Praise the Lord, oh my soul [Unison]
						Praise the Lord, oh my soul`
		},
		{
			section: "Instrumental Interlude",
			notes: "2x Bars",
		},
		{
			section: "Verse",
			notes: "1x Solo, 1x Unison, 1x Harmony (Melody: Tenor)",
			text: `I won\'t be quiet, my God is alive
						How could I keep it inside
						I won\'t be quiet, my God is alive
						How could I keep it inside`
		},
		{
			section: "Chorus",
			notes: "2x Harmony",
			text: `Praise the Lord, oh my soul [Unison]
						Praise the Lord, oh my soul`
		},
		{
			section: "Instrumental Interlude",
			notes: "2x Bars",
		},
		{
			section: "Outro",
			notes: "1x Unison",
			text: `Hey, Hey
						Hey, Hey`
		},
	]
}