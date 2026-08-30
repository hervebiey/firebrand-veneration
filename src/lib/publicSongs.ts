import { allSongs } from "@/lib/allSongs";
import { isMedley, type SingleSong, type Song } from "@/components/Songs";

// The public set list: every single song, with medleys flattened into their members.
export const publicSongs: SingleSong[] = allSongs.flatMap((song) =>
	isMedley(song) ? song.songList : [song],
);

export function getPublicSong(id: string): SingleSong | undefined {
	return publicSongs.find((song) => song.id === id);
}

export function nextPublicSong(id: string): SingleSong {
	const index = publicSongs.findIndex((song) => song.id === id);
	return publicSongs[(index + 1) % publicSongs.length];
}

export function primaryTrackIndex(song: Song): number {
	const index = song.audioTracks?.findIndex((track) => track.isPrimary) ?? -1;
	return index >= 0 ? index : 0;
}

// Previous/next entry in the set for the player queue. A medley (playing as one
// track) steps from its first/last member.
export function adjacentPlayable(current: Song, direction: 1 | -1): Song {
	const count = publicSongs.length;
	const index = publicSongs.findIndex((song) => song.id === current.id);
	if (index >= 0) return publicSongs[(index + direction + count) % count];
	if (isMedley(current) && current.songList.length > 0) {
		const anchor =
			direction === 1
				? current.songList[current.songList.length - 1]
				: current.songList[0];
		const anchorIndex = publicSongs.findIndex((song) => song.id === anchor.id);
		if (anchorIndex >= 0)
			return publicSongs[(anchorIndex + direction + count) % count];
	}
	return publicSongs[0];
}

// The songbook entry that holds a song's rehearsal notes: the containing medley,
// or the song itself.
export function notesIdFor(songId: string): string {
	for (const song of allSongs) {
		if (song.id === songId) return song.id;
		if (isMedley(song) && song.songList.some((sub) => sub.id === songId))
			return song.id;
	}
	return songId;
}
