"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old medley links point at /<id>; their pages live in the songbook now.
export function SongbookRedirect({ id }: { id: string }) {
	const router = useRouter();

	useEffect(() => {
		router.replace(`/songbook/${id}`);
	}, [router, id]);

	return (
		<div className="flex min-h-[60vh] items-center justify-center px-8 pt-24 text-center">
			<Link
				href={`/songbook/${id}`}
				className="text-[11px] font-bold tracking-[0.26em] text-soft transition hover:text-ink"
			>
				CONTINUE TO THE SONGBOOK →
			</Link>
		</div>
	);
}
