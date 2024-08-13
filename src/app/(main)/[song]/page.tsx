import React from "react";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { getAllSongDetails, isMedley, SingleSong, type Song } from "@/components/Songs";
import { MedleyMetaData, SingleSongMetaData } from "@/components/MetaData";
import { SongHeader } from "@/components/SongHeader";
import { Lyrics } from "@/components/Lyrics";
import { YouTubeElements } from "@/components/YouTubeElements";

interface StaticParam {
	song: string;
}

export async function generateStaticParams(): Promise<StaticParam[]> {
	try {
		const allSongs: Song[] = await getAllSongDetails();
		return allSongs.map((song: Song) => ({
			song: song.id,
		}));
	} catch (error) {
		console.error("Failed to generate static params:", error);
		return [];
	}
}

const getSongDetails = async (id: string): Promise<Song> => {
	try {
		const allSongs = await getAllSongDetails();
		const song = allSongs.find((song) => song.id === id);
		
		if (!song) {
			notFound();
		}
		
		return song;
	} catch (error) {
		console.error("Error fetching song details:", error);
		throw new Error("Failed to fetch song details");
	}
};

export async function generateMetadata({ params }: { params: { song: string } }): Promise<{ title: string }> {
	try {
		const song = await getSongDetails(params.song);
		return {
			title: song.title,
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		throw new Error("Failed to generate metadata");
	}
}

const MedleySongContent: React.FC<{ song: SingleSong, isLast: boolean }> = ({ song, isLast }) => (
	<div>
		<SongHeader song={song} size="medium"/>
		<SingleSongMetaData song={song}/>
		<hr className="my-10 border-gray-50"/>
		<YouTubeElements youtubeIds={song.youtube}/>
		<Lyrics song={song}/>
		{!isLast && <hr className="my-10 border-gray-200"/>}
	</div>
);

export default async function Page({ params }: { params: { song: string } }) {
	const song = await getSongDetails(params.song);
	const isMedleySong = isMedley(song);
	
	return (
		<article className="py-16 lg:py-36">
			<Container>
				<header className="flex flex-col">
					<SongHeader song={song} size="large"/>
					<div className="text-lg">
						{isMedleySong ? <MedleyMetaData song={song}/> : <SingleSongMetaData song={song}/>}
					</div>
				</header>
				<hr className="my-10 border-gray-200"/>
				<YouTubeElements youtubeIds={song.youtube}/>
				<div className="mt-7">
					{isMedleySong ? song.songList.map((singleSong, singleSongIndex) => (
						<MedleySongContent key={singleSongIndex} song={singleSong}
						                   isLast={singleSongIndex === song.songList.length - 1}/>
					)) : <Lyrics song={song}/>}
				</div>
			</Container>
		</article>
	);
};