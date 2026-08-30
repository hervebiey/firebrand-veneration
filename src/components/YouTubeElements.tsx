import React from "react";

const YoutubeEmbed: React.FC<{ youtubeId: string }> = ({ youtubeId }) => {
	if (!youtubeId) return null;

	const sanitizedYoutubeId = youtubeId.replace(/[^\w-]/g, "");

	return (
		<div className="relative overflow-hidden bg-stage pt-[56.25%]">
			<iframe
				title="Embedded youtube"
				src={`https://www.youtube.com/embed/${sanitizedYoutubeId}`}
				className="absolute inset-0 h-full w-full border-0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
};

export const YouTubeElements: React.FC<{ youtubeIds?: string[] }> = ({
	youtubeIds,
}) => {
	if (!youtubeIds || youtubeIds.length === 0) return null;

	return (
		<div className="flex flex-col gap-6">
			{youtubeIds.map((youtubeId) => (
				<YoutubeEmbed key={youtubeId} youtubeId={youtubeId} />
			))}
		</div>
	);
};
