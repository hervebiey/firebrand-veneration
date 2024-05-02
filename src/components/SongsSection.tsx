'use client';

import Link from "next/link";
import React from 'react';

import {songList} from "@/lib/songList";
import {TinyWaveFormIcon} from '@/components/TinyWaveFormIcon';

function ordinalSuffix(i: number) {
	const j = i % 10,
		k = i % 100;
	if (j === 1 && k !== 11) {
		return i + "st";
	}
	if (j === 2 && k !== 12) {
		return i + "nd";
	}
	if (j === 3 && k !== 13) {
		return i + "rd";
	}
	return i + "th";
}

function generateSession(sessionNumber: number) {
	const sessionSongs = songList
		.filter(song => song.session === sessionNumber)
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	
	return (
		<React.Fragment>
			<h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
				<TinyWaveFormIcon colors={['fill-violet-300', 'fill-pink-300']}
				                  className="h-2.5 w-2.5"/>
				<span className="ml-2.5">{ordinalSuffix(sessionNumber)} Session</span>
			</h2>
			<ul className="mt-2 mb-5 text-base font-medium leading-8 text-slate-700">
				{sessionSongs.map((song, index) =>
					<li key={index} className="hover:text-slate-400">
						<Link href={song.id}>{`${index + 1}. ${song.title}`}</Link>
					</li>
				)}
			</ul>
		</React.Fragment>
	);
}

export function SongsSection(props: React.ComponentPropsWithoutRef<'section'>) {
	const uniqueSessions = [...new Set(songList.map(song => song.session ?? 0))].filter(number => number > 0);
	
	return (
		<section {...props}>
			<div className="gap-y-5">
				{uniqueSessions.map(session => generateSession(session))}
			</div>
		</section>
	)
}
