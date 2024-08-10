import React from "react";
import Link from "next/link";

import { Container } from "@/components/Container";
import { SongPlayButton } from "@/components/SongPlayButton";
import { getAllSongDetails, isMedley, Medley, type Song } from "@/lib/songs";
import { SingleSongMetaData, SongHeader } from "@/components/SongMetaData";

interface SongProps {
	song: Song;
}

function SongActions({ song }: SongProps) {
	return (
		<div className="mb-2 flex items-center gap-4">
			<SongPlayButton song={song} size="small"/>
			<Link href={`/${song.id}`}
			      className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
			      aria-label={`Show notes for song ${song.title}`}>
				Show Notes
			</Link>
		</div>
	);
}

function MedleySongsMetaData({ song }: { song: Medley }) {
	return (
		<div className="mt-4">
			{song.songList.map((subSong, subSongIndex) => (
				<React.Fragment key={subSong.id}>
					<SongHeader song={subSong} size="mini"/>
					<SingleSongMetaData song={subSong}/>
					{subSongIndex < song.songList.length - 1 && (
						<hr className="my-5 border-gray-50"/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}

function SongEntry({ song }: SongProps) {
	const isMedleySong = isMedley(song);
	return (
		<article aria-labelledby={`song-${song.id}-title`} className="py-10 sm:py-12">
			<Container>
				<SongHeader song={song} size="small"/>
				{isMedleySong ? (
					<>
						<SongActions song={song}/>
						<hr className="my-5 border-gray-50"/>
						<MedleySongsMetaData song={song}/>
					</>
				) : (
					<>
						<SongActions song={song}/>
						<SingleSongMetaData song={song}/>
					</>
				)}
			</Container>
		</article>
	);
}

export default async function Home() {
	let songs = await getAllSongDetails();
	
	return (
		<div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
			<Container>
				<h1 className="text-2xl font-bold leading-7 text-slate-900">Songs</h1>
			</Container>
			<div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
				{songs.map((song) => (<SongEntry key={song.id} song={song}/>))}
			</div>
		</div>
	);
}

export const revalidate = 10;
