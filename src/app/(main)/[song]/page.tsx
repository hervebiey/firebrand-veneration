import React from "react";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { formatKeys, formatTextures, getAllSongDetails, isMedley, SingleSong, type Song } from "@/lib/songs";
import { MedleyMetaData, SingleSongMetaData, SongHeader } from "@/components/SongMetaData";

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

const YoutubeEmbed: React.FC<{ youtubeId: string }> = ({ youtubeId }) => {
	if (!youtubeId) {
		console.error("YoutubeEmbed: Missing or invalid youtubeId");
		return null;
	}
	
	const sanitizedYoutubeId = youtubeId.replace(/[^\w-]/g, "");
	
	return (
		<div className="video-responsive overflow-hidden relative pt-[56.25%]">
			<iframe
				title="Embedded youtube"
				src={`https://www.youtube.com/embed/${sanitizedYoutubeId}`}
				style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
};

const YoutubeElements: React.FC<{ youtubeIds?: string[] }> = ({ youtubeIds }) => {
	if (!youtubeIds || youtubeIds.length === 0) return null;
	
	return (
		<>
			{youtubeIds.map((youtubeId) => (
				<React.Fragment key={youtubeId}>
					<YoutubeEmbed youtubeId={youtubeId}/>
					<hr key={"hr_" + youtubeId} className="my-10 border-gray-50"/>
				</React.Fragment>
			))}
		</>
	);
};

const Lyrics: React.FC<{ song: SingleSong }> = ({ song }) => (
	<div className="prose prose-slate leading-7">
		{song.sections?.map((section, sectionIndex) => (
			<div key={sectionIndex}>
				<h3 className="font-black">{section.sectionName}</h3>
				{section.textures && section.textures.length > 0 && (
					<p className="-mt-2 font-bold">
						{formatTextures(section.textures)}
					</p>
				)}
				{section.extraNotes && <p className="-mt-4 font-semibold">{section.extraNotes}</p>}
				{section.keys && section.keys.length > 0 && (
					<p className="-mt-4 italic font-semibold">
						Key: {formatKeys(section.keys)}
					</p>
				)}
				<p className="-mt-2 leading-7 font-medium">
					{section.text && section.text.split("\n").flatMap((sectionLine, sectionLineIndex, arr) =>
						sectionLineIndex === arr.length - 1 ? sectionLine : [sectionLine,
							<br key={`section-line-${sectionLineIndex}`}/>],
					)}
				</p>
			</div>
		))}
	</div>
);

const MedleySongContent: React.FC<{ song: SingleSong, isLast: boolean }> = ({ song, isLast }) => (
	<div>
		<SongHeader song={song} size="medium"/>
		<SingleSongMetaData song={song}/>
		<hr className="my-10 border-gray-50"/>
		<YoutubeElements youtubeIds={song.youtube}/>
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
				<YoutubeElements youtubeIds={song.youtube}/>
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