"use client";

import React, { useEffect, useState } from "react";
import {
	AudioTrack,
	formatArray,
	formatKeys,
	formatSectionsOverview,
	isMedley, isSourceValid,
	Medley,
	SingleSong,
} from "@/components/Songs";
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
	const [validNonPrimaryTracks, setValidNonPrimaryTracks] = useState<AudioTrack[]>([]);
	
	useEffect(() => {
		async function validateTracks() {
			if (!song.audioTracks) return;
			
			const validTracks = await Promise.all(
				song.audioTracks.map(async (track) => {
					if (!track.isPrimary && track.src) {
						const isValid = await isSourceValid(track.src);
						return isValid ? track : null;
					}
					return null;
				}),
			);
			
			// Filter out null values and update state
			setValidNonPrimaryTracks(validTracks.filter((track) => track !== null) as AudioTrack[]);
		}
		
		validateTracks().catch(console.error);
	}, [song.audioTracks]);
	
	return (
		<div className="my-1 leading-relaxed font-medium text-slate-700">
			{song.originalArtist && <p className="text-sm">
				Original: {song.originalArtist} {song.originalTitle ? ` - ${song.originalTitle}` : ` - ${song.title}`}
			</p>}
			<p className="my-3">Lead: {formatArray(song.lead)} • Language: {formatArray(song.language)}</p>
			<p className="my-3">Key: {formatKeys(song.keys)} •
				Melody: {song.melody ? formatArray(song.melody) : ["TBD"]}</p>
			{song.structureNotes && <p className="my-3">Info: {song.structureNotes}</p>}
			{song.performanceNotes && <p className="my-2">Notes: {song.performanceNotes}</p>}
			{song.sections && <p className="my-1 text-base">{formatSectionsOverview(song.sections)}</p>}
			<div className="mt-4 space-y-2">
				{validNonPrimaryTracks.map(track => {
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