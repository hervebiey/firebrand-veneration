import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.esm.js";

export const Waveform: React.FC<{ src: string }> = ({ src }) => {
	const waveformRef = useRef<WaveSurfer | null>(null);
	const waveformContainerRef = useRef<HTMLDivElement | null>(null);
	const topTimelineContainerRef = useRef<HTMLDivElement | null>(null);
	const bottomTimelineContainerRef = useRef<HTMLDivElement | null>(null);
	
	useEffect(() => {
		if (waveformRef.current) {
			waveformRef.current.destroy();
		}
		
		waveformRef.current = WaveSurfer.create({
			container: waveformContainerRef.current!,
			waveColor: "rgb(200, 0, 200)",
			progressColor: "rgb(100, 0, 100)",
			url: src,
			minPxPerSec: 100,
			plugins: [
				TimelinePlugin.create({
					container: topTimelineContainerRef.current!,
					height: 20,
					insertPosition: "beforebegin",
					timeInterval: 0.2,
					primaryLabelInterval: 5,
					secondaryLabelInterval: 1,
					style: {
						fontSize: "20px",
						color: "#2D5B88",
					},
				}),
				TimelinePlugin.create({
					container: bottomTimelineContainerRef.current!,
					height: 10,
					timeInterval: 0.1,
					primaryLabelInterval: 1,
					style: {
						fontSize: "10px",
						color: "#6A3274",
					},
				}),
				HoverPlugin.create({
					lineColor: "#ff0000",
					lineWidth: 2,
					labelBackground: "#555",
					labelColor: "#fff",
					labelSize: "11px",
				}),
			],
		});
		
		waveformRef.current.on("interaction", () => {
			waveformRef.current?.play();
		});
		
		return () => {
			if (waveformRef.current) {
				waveformRef.current.destroy();
			}
		};
	}, [src]);
	
	return (
		<div className="waveform-wrapper">
			<div ref={topTimelineContainerRef} id="top-timeline" />
			<div ref={waveformContainerRef} id="waveform" />
			<div ref={bottomTimelineContainerRef} id="bottom-timeline" />
		</div>
	);
};
