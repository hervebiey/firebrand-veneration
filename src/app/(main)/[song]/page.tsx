import React, {cache} from 'react';
import {notFound} from 'next/navigation';
import Link from 'next/link';

import {Container} from '@/components/Container';
import {SongPlayButton} from '@/components/SongPlayButton';
import {getAllSongDetails, isMedley, SingleSong, type Song} from '@/lib/songs';
import {getTime} from "@/components/Time";
import {MedleyMetaData, SingleSongMetaData} from "@/components/SongMetaData";

export async function generateStaticParams() {
	const allSongs = await getAllSongDetails();
	return allSongs.map((song: Song) => ({
		song: song.id,
	}));
}

export async function generateMetadata({params}: { params: { song: string } }) {
	let song = await getSongDetails(params.song)
	return {
		title: song.title,
	}
}

const getSongDetails = cache(async (id: string) => {
	let allSongs = await getAllSongDetails()
	let song = allSongs.find((song) => song.id === id)
	
	if (!song) {
		notFound()
	}
	
	return song
});

const YoutubeEmbed: React.FC<{ youtubeId: string }> = ({youtubeId}) => {
	if (!youtubeId) return null;
	
	return (
		<div className="video-responsive overflow-hidden relative"
		     style={{paddingTop: '56.25%'}}>
			<iframe
				style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
				src={`https://www.youtube.com/embed/${youtubeId}`}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="Embedded youtube"
			/>
		</div>
	);
};

const Lyrics: React.FC<{ song: SingleSong }> = ({song}) => (
	<div className="leading-3">
		{song.lyrics?.map((section, index) => (
			<div key={index}>
				<h3 className="font-black">{section.section}</h3>
				{section.notes && <p className="font-bold">{section.notes}</p>}
				<p className="leading-7 font-medium">
					{section.text && section.text.split('\n').flatMap((line, lineIndex, arr) => (
						lineIndex === arr.length - 1 ? line : [line, <br key={lineIndex}/>]
					))}
				</p>
			</div>
		))}
	</div>
);

const SongHeader: React.FC<{ song: Song, size: 'medium' | 'large' }> = ({song, size}) => {
	const sizeToClasses = {
		medium: {
			div: "flex items-start gap-4",
			header: "text-2xl font-bold text-slate-900",
			paragraph: "mt-0.5 mb-2 order-first font-mono text-sm leading-3 text-slate-500",
			link: "text-slate-500 decoration-0 hover:text-slate-900"
		},
		large: {
			div: "flex items-center gap-6",
			header: "mt-2 text-4xl font-bold text-slate-900",
			paragraph: "order-first font-mono text-sm leading-7 text-slate-500",
			link: "hover:text-slate-900"
		}
	};
	
	const divClassName = sizeToClasses[size].div;
	const headerClassName = sizeToClasses[size].header;
	const paragraphClassName = sizeToClasses[size].paragraph;
	const linkClassName = sizeToClasses[size].link;
	
	return (
		<>
			<div className={divClassName}>
				<SongPlayButton song={song} size={size}/>
				<div className="flex flex-col">
					<h1 className={headerClassName}>{song.title}</h1>
					<p className={paragraphClassName}>
						{song.artist} | {getTime(song)}
						{!isMedley(song) && song.chordify && (<>
							{" | "}
							<Link className={linkClassName} href={song.chordify} target="_blank">Chordify</Link>
						</>)}
					</p>
				</div>
			</div>
		</>
	);
};

const MedleySongContent: React.FC<{ song: SingleSong }> = ({song}) => (
	<div>
		<SongHeader song={song} size="medium"/>
		{song.youtube && (<>
			<YoutubeEmbed youtubeId={song.youtube}/>
			<hr className="my-10 border-gray-100"/>
		</>)}
		<div className="-my-2 font-medium leading-3 text-slate-700">
			<SingleSongMetaData song={song} className="-mt-2 -space-y-3"/>
		</div>
		<Lyrics song={song}/>
		<hr className="my-12 border-gray-200"/>
	</div>
);

export default async function Page({params}: { params: { song: string } }) {
	let song = await getSongDetails(params.song)
	
	return (
		<article className="py-16 lg:py-36">
			<Container>
				<header className="flex flex-col">
					<SongHeader song={song} size="large"/>
					<div className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
						{isMedley(song) ? <MedleyMetaData song={song}/> :
							<SingleSongMetaData song={song} className="mt-3 space-y-2"/>}
					</div>
				</header>
				<hr className="my-10 border-gray-200"/>
				{song.youtube && (<>
					<YoutubeEmbed youtubeId={song.youtube}/>
					<hr className="my-10 border-gray-100"/>
				</>)}
				<div className="prose prose-slate mt-7">
					{isMedley(song) ? song.songs.map((singleSong, index) => (
						<MedleySongContent key={index} song={singleSong}/>
					)) : <Lyrics song={song}/>}
				</div>
			</Container>
		</article>
	)
};