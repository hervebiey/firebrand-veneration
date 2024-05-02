import React from "react";
import Link from 'next/link';

import {Container} from '@/components/Container';
import {SongPlayButton} from '@/components/SongPlayButton';
import {getAllSongDetails, isMedley, type Song} from '@/lib/songs'
import {getTime} from "@/components/Time";
import {MedleyMetaData, SingleSongMetaData} from "@/components/SongMetaData";

function SongEntry({song}: { song: Song }) {
	return (
		<article aria-labelledby={`episode-${song.id}-title`}
		         className="py-10 sm:py-12">
			<Container>
				<div className="flex flex-col items-start">
					<h2 id={`episode-${song.id}-title`}
					    className="text-lg font-bold text-slate-900 hover:text-slate-500">
						<Link href={`/${song.id}`}>{song.title}</Link>
					</h2>
					<p className="order-first font-mono text-sm leading-7 text-slate-500">{song.artist} | {getTime(song)}</p>
					<div className="mt-1 font-medium leading-8 text-slate-700">
						{isMedley(song) ? <MedleyMetaData song={song}/> :
							<SingleSongMetaData song={song} className="hidden"/>}
					</div>
					<div className="mt-4 flex items-center gap-4">
						<SongPlayButton song={song} size="small"/>
						<Link href={`/${song.id}`}
						      className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
						      aria-label={`Show notes for song ${song.title}`}>
							Show Notes
						</Link>
					</div>
				</div>
			</Container>
		</article>
	)
}

export default async function Home() {
	let songs = await getAllSongDetails()
	
	return (
		<div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
			<Container>
				<h1 className="text-2xl font-bold leading-7 text-slate-900">Songs</h1>
			</Container>
			<div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
				{songs.map((song) => (<SongEntry key={song.id} song={song}/>))}
			</div>
		</div>
	)
}

export const revalidate = 10
