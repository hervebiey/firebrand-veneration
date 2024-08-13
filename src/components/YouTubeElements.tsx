import React from "react";

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

export const YouTubeElements: React.FC<{ youtubeIds?: string[] }> = ({ youtubeIds }) => {
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