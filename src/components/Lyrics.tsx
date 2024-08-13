import React from "react";
import { formatKeys, formatTextures, SingleSong } from "@/components/Songs";

export const Lyrics: React.FC<{ song: SingleSong }> = ({ song }) => (
	<div className="prose prose-slate">
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
				<p className="-mt-2 font-medium text-lg">
					{Array.isArray(section.text)
						? section.text.flatMap((sectionLine, sectionLineIndex) => {
							if (Array.isArray(sectionLine)) {
								return (
									<div key={`section-line-${sectionLineIndex}`} className="-mb-3">
										<p>
											{sectionLine[0]}
											{sectionLine[2] && (
												<span className="text-indigo-700 ml-2 uppercase">[{sectionLine[2]}]</span>
											)}
										</p>
										{sectionLine[1] && (
											<p className="-mt-5 text-slate-400">
												{sectionLine[1]}
											</p>
										)}
									</div>
								);
							} else if (sectionLine === null || sectionLine === "") {
								return <div key={`section-line-${sectionLineIndex}-blank`} className="-mb-7"><br/></div>;
							} else {
								return (
									<p key={`section-line-${sectionLineIndex}`} className="-mb-3">
										{sectionLine}
									</p>
								);
							}
						})
						: section.text && (
						<p key={`section-text`} className="">
							{section.text}
						</p>
					)}
				</p>
			</div>
		))}
	</div>
);