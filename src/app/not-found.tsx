import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-surface px-8 text-center text-ink">
			<div>
				<p className="text-[11px] font-bold tracking-[0.4em] text-soft">404</p>
				<h1 className="mt-5 text-3xl font-bold tracking-[0.06em]">
					Page not found
				</h1>
				<p className="mt-4 text-[15px] leading-relaxed text-soft">
					Sorry, we couldn&rsquo;t find the page you&rsquo;re looking for.
				</p>
				<Link
					href="/"
					className="mt-8 inline-block border border-strong px-8 py-4 text-[11px] font-bold tracking-[0.3em] transition hover:bg-ink hover:text-surface"
				>
					BACK TO THE SITE
				</Link>
			</div>
		</main>
	);
}
