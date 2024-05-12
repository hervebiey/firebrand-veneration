'use client';

import React from "react";
import {isMedley, Medley, SingleSong} from "@/lib/songs";
import {SongPlayButton} from "@/components/SongPlayButton";
import {TrackType} from "@/components/AudioProvider";

export const MedleyMetaData: React.FC<{ song: Medley }> = ({song}) => {
	let leadsArray: string[] = [];
	let languagesArray: string[] = [];
	let keysArray: string[] = [];
	let melodiesArray: string[] = [];
	
	if (isMedley(song)) {
		const leads = new Set(song.songs.map(s => s.lead));
		const languages = new Set(song.songs.map(s => s.language));
		const keys = new Set(song.songs.map(s => s.key));
		const melodies = new Set(song.songs.flatMap(s => s.melody ? [s.melody] : []));
		
		leadsArray = Array.from(leads);
		languagesArray = Array.from(languages);
		keysArray = Array.from(keys);
		melodiesArray = Array.from(melodies);
	}
	
	return (
		<>
			<p>Led By: {leadsArray.join(' • ')}</p>
			<p>Language: {languagesArray.join(' • ')}</p>
			<p>Key: {keysArray.join(' • ')}</p>
			{melodiesArray.length > 0 && <p>Melody: {melodiesArray.join(' • ')}</p>}
		</>
	)
};

export const SingleSongMetaData: React.FC<{ song: SingleSong, className?: string }> = ({song, className}) => {
	const availableTrackTypes: Array<TrackType> = [TrackType.SOPRANO, TrackType.ALTO, TrackType.TENOR].filter(trackType => song[trackType]?.src);
	
	return (
		<>
			{song.original && <p className="my-1 text-sm text-slate-700">Original: {song.original}</p>}
			<p>Led By: {song.lead}</p>
			<p>Language: {song.language}</p>
			<p>Key: {song.key} • Melody: {song.melody}</p>
			{song.notes && <p>Notes: {song.notes}</p>}
			<div className={className}>
				{
					availableTrackTypes.map(trackType =>
						<SongPlayButton key={trackType} song={song} trackType={trackType} size="medium"/>
					)
				}
			</div>
		</>
	)
};