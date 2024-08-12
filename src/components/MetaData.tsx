"use client";

import React from "react";
import { formatArray, formatKeys, formatSectionsOverview, isMedley, Medley, SingleSong } from "@/components/Songs";
import { PlayButton } from "@/components/player/PlayButton";

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
	const nonPrimaryTracks = song.audioTracks?.filter(track => !track.isPrimary);
	
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
				{nonPrimaryTracks && nonPrimaryTracks.map(track => {
					// Find the index of this track in the original audioTracks array
					const trackIndex = song.audioTracks!.indexOf(track);
					
					return (
						<PlayButton
							key={`${song.id}-${trackIndex}`}
							song={song}
							trackIndex={trackIndex}
							size="medium"
							isPrimary={false}
						/>
					);
				})}
			</div>
		</div>
	);
};