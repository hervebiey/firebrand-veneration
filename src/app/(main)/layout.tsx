import React from "react";

import { AudioProvider } from "@/components/player/AudioProvider";
import { Nav } from "@/components/Nav";
import { PlayerShell } from "@/components/player/PlayerShell";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AudioProvider>
			<Nav />
			<main className="min-h-screen pb-28">{children}</main>
			<PlayerShell />
		</AudioProvider>
	);
}
