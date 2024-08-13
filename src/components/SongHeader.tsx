"use client";

import React from "react";
import { type Song } from "@/components/Songs";
import { PlayButton } from "@/components/player/PlayButton";
import { getTime } from "@/components/Time";
import Link from "next/link";

export const SongHeader: React.FC<{ song: Song, size: "mini" | "small" | "medium" | "large" }> = ({ song, size }) => {
	const primaryTrack = song.audioTracks?.find(track => track.isPrimary);
	const primaryTrackIndex = song.audioTracks?.findIndex(track => track.isPrimary) ?? 0;
	
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
				{primaryTrack && (size === "large" || size === "medium") && (
					<PlayButton
						key={`${song.id}-${primaryTrackIndex}-primary`}
						song={song}
						trackIndex={primaryTrackIndex}
						size={size}
						isPrimary={true}
					/>
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
						{song.artist && (
							<span>
								{song.artist}
								{" | "}
							</span>
						)}
						{getTime(song)}
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
				</div>
			</div>
			{(size === "mini" || size === "small") && (
				<div className="mb-2 flex items-center gap-2">
					{primaryTrack && <PlayButton
						key={`${song.id}-${primaryTrackIndex}-primary-mini`}
						song={song}
						trackIndex={primaryTrackIndex}
						size={size}
						isPrimary={true}
					/>
					}
					{size === "small" && (
						<>
							{primaryTrack &&
								<span aria-hidden="true" className="text-sm font-bold text-slate-400">/</span>}
							<Link href={`/${song.id}`}
							      className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
							      aria-label={`Show notes for song ${song.title}`}>
								Show Notes
							</Link>
						</>
					)}
				</div>
			)}
		</>
	);
};