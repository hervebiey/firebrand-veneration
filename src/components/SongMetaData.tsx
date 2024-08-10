"use client";

import React from "react";
import {
	formatArray,
	formatKeys,
	formatSectionsOverview,
	isMedley,
	Medley,
	SingleSong,
	type Song,
	TrackType,
} from "@/lib/songs";
import { SongPlayButton } from "@/components/SongPlayButton";
import { getTime } from "@/components/Time";
import Link from "next/link";

export const SongHeader: React.FC<{ song: Song, size: "mini" | "small" | "medium" | "large" }> = ({ song, size }) => {
	const sizeToClasses = {
		mini: {
			mainDiv: "my-2 flex items-start",
			header: "text-lg font-bold text-slate-900",
			paragraph: "order-first font-mono text-sm leading-7 text-slate-500",
			link: "text-slate-500 decoration-0 hover:text-slate-900",
		},
		small: {
			mainDiv: "mb-2 flex items-start",
			header: "text-lg font-bold text-slate-900 hover:text-slate-500",
			paragraph: "order-first font-mono text-sm leading-7 text-slate-500",
			link: "text-slate-500 decoration-0 hover:text-slate-900",
		},
		medium: {
			mainDiv: "mb-2 flex items-start",
			header: "mt-1.5 mb-0.5 text-2xl font-bold text-slate-900",
			paragraph: "order-first font-mono text-sm leading-3 text-slate-500",
			link: "text-slate-500 decoration-0 hover:text-slate-900",
		},
		large: {
			mainDiv: "mb-2 flex items-center gap-6",
			header: "mt-1 text-4xl font-bold text-slate-900",
			paragraph: "order-first font-mono text-sm leading-7 text-slate-500",
			link: "hover:text-slate-900",
		},
	};
	
	const mainDivClassName = sizeToClasses[size].mainDiv;
	const headerClassName = sizeToClasses[size].header;
	const paragraphClassName = sizeToClasses[size].paragraph;
	const linkClassName = sizeToClasses[size].link;
	
	return (
		<>
			<div className={mainDivClassName}>
				{(size === "medium" || size === "large") && (
					<SongPlayButton song={song} size={size}/>
				)}
				<div className="flex flex-col">
					{size === "small" ? (
						<h1 id={`song-${song.id}-title`} className={headerClassName}>
							<Link href={`/${song.id}`}>{song.title}</Link>
						</h1>
					) : (
						<h1 id={`song-${song.id}-title`} className={headerClassName}>{song.title}</h1>
					)}
					<p className={paragraphClassName}>
						{song.artist} | {getTime(song)}
						{song.chordify && song.chordify.length > 0 && (
							<span>
								{" | "}
								{song.chordify?.map((url, urlIndex) => (
									<React.Fragment key={`${song.id}-chordify-${urlIndex}`}>
										<Link className={linkClassName} href={url} target="_blank">
											Chordify
										</Link>
										{urlIndex < song.chordify!.length - 1 && " • "}
									</React.Fragment>
								))}
							</span>
						)}
					</p>
					{size === "mini" && (
						<SongPlayButton song={song} size={size}/>
					)}
				</div>
			</div>
		</>
	);
};

export const MedleyMetaData: React.FC<{ song: Medley }> = ({ song }) => {
	let leadsArray: string[] = [];
	let languagesArray: string[] = [];
	let keysArray: string[] = [];
	let melodiesArray: string[] = [];
	
	if (isMedley(song)) {
		const leads = new Set(song.songList.map(subSong => formatArray(subSong.lead)));
		const languages = new Set(song.songList.map(subSong => formatArray(subSong.language)));
		const keys = new Set(song.songList.flatMap(subSong => formatKeys(subSong.keys).split(" > ")));
		const melodies = new Set(song.songList.flatMap(subSong => subSong.melody ? formatArray(subSong.melody).split(", ") : ["TBD"]));
		
		leadsArray = Array.from(leads);
		languagesArray = Array.from(languages);
		keysArray = Array.from(keys);
		melodiesArray = Array.from(melodies);
	}
	
	return (
		<div className="mt-1 leading-relaxed font-medium text-slate-700">
			<p>Lead: {leadsArray.join(" • ")}</p>
			<p className="my-3">Language: {languagesArray.join(" • ")}</p>
			<p className="my-3">Key: {keysArray.join(" • ")}</p>
			{melodiesArray.length > 0 && <p>Melody: {melodiesArray.join(" • ")}</p>}
		</div>
	);
};

export const SingleSongMetaData: React.FC<{ song: SingleSong }> = ({ song }) => {
	const availableTrackTypes: TrackType[] = Object.values(TrackType).filter(trackType => song.audioTracks?.some(track => track.audioType === trackType));
	
	return (
		<div className="my-1 leading-relaxed font-medium text-slate-700">
			{song.original && <p className="text-sm">Original: {song.original}</p>}
			<p className="my-3">Lead: {formatArray(song.lead)} • Language: {formatArray(song.language)}</p>
			<p className="my-3">Key: {formatKeys(song.keys)} •
				Melody: {song.melody ? formatArray(song.melody) : ["TBD"]}</p>
			{song.structureNotes && <p className="my-3">Info: {song.structureNotes}</p>}
			{song.performanceNotes && <p className="my-2">Notes: {song.performanceNotes}</p>}
			{song.sections && <p className="my-1 text-base">{formatSectionsOverview(song.sections)}</p>}
			<div className="mt-4 space-y-2">
				{
					availableTrackTypes.map(trackType =>
						<SongPlayButton key={`${song.id}-${trackType}`} song={song} trackType={trackType}
						                size="medium"/>,
					)
				}
			</div>
		</div>
	);
};