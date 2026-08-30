import React from "react";
import { formatKeys, formatTextures, type SingleSong } from "@/components/Songs";

// Full rehearsal lyrics: section names, textures, notes, harmony lines and tags.
export const Lyrics: React.FC<{ song: SingleSong }> = ({ song }) => (
	<div>
		{song.sections?.map((section, sectionIndex) => (
			<div key={sectionIndex} className="mt-8">
				<div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
					<h3 className="text-lg font-bold tracking-[0.06em]">
						{section.sectionName}
					</h3>
					{section.textures && section.textures.length > 0 && (
						<span className="text-[11px] font-medium uppercase tracking-[0.14em] text-soft">
							{formatTextures(section.textures)}
						</span>
					)}
				</div>
				{section.extraNotes && (
					<p className="mt-1.5 text-sm font-medium text-soft">
						{section.extraNotes}
					</p>
				)}
				{section.keys && section.keys.length > 0 && (
					<p className="mt-1.5 text-sm font-medium italic text-soft">
						Key: {formatKeys(section.keys)}
					</p>
				)}
				<div className="mt-2.5 text-[17px] leading-[1.8]">
					{Array.isArray(section.text)
						? section.text.map((line, lineIndex) => {
								if (line === null || line === "")
									return <div key={lineIndex} className="h-3.5" />;
								const isArray = Array.isArray(line);
								const text = isArray ? line[0] : (line as string);
								const secondVoice = isArray ? line[1] : null;
								const tag = isArray ? line[2] : null;
								if (!text)
									return <div key={lineIndex} className="h-3.5" />;
								return (
									<div key={lineIndex}>
										<p>
											{text}
											{tag && (
												<span className="ml-2 text-xs font-bold uppercase tracking-[0.1em] text-accent">
													{tag}
												</span>
											)}
										</p>
										{secondVoice && <p className="text-soft">{secondVoice}</p>}
									</div>
								);
							})
						: section.text && <p>{section.text}</p>}
				</div>
			</div>
		))}
	</div>
);
