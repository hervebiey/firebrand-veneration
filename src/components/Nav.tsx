"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

function SunIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...props}
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
		</svg>
	);
}

function MoonIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
		</svg>
	);
}

function ThemeToggle() {
	// The icon follows the html.dark class via CSS, so no state is needed and
	// server/client markup always match.
	const toggle = () => {
		const next = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", next);
		try {
			localStorage.setItem("fb-theme", next ? "dark" : "light");
		} catch {}
	};

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle light mode"
			className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/85 transition hover:border-white hover:text-white sm:h-8 sm:w-8"
		>
			<SunIcon className="hidden h-3.5 w-3.5 dark:block" />
			<MoonIcon className="block h-3.5 w-3.5 dark:hidden" />
		</button>
	);
}

const menuLinks = [
	{ label: "HOME", href: "/" },
	{ label: "LISTEN", href: "/#listen" },
	{ label: "LIVE", href: "/#event" },
	{ label: "THE COLLECTIVE", href: "/#collective" },
	{ label: "SONGBOOK", href: "/songbook" },
];

export function Nav() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			<nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-stage/55 to-transparent px-4 py-3 sm:px-14 sm:py-5">
				<Link
					href="/"
					className="py-2 text-sm font-bold tracking-[0.34em] text-white sm:text-base"
				>
					FIREBRAND
				</Link>
				<div className="flex items-center gap-2 sm:gap-8">
					<div className="hidden items-center gap-8 md:flex">
						<Link
							href="/#listen"
							className="text-[11px] font-medium tracking-[0.26em] text-white/85 transition hover:text-white"
						>
							LISTEN
						</Link>
						<Link
							href="/#event"
							className="text-[11px] font-medium tracking-[0.26em] text-white/85 transition hover:text-white"
						>
							LIVE
						</Link>
						<Link
							href="/#collective"
							className="text-[11px] font-medium tracking-[0.26em] text-white/85 transition hover:text-white"
						>
							THE COLLECTIVE
						</Link>
						<Link
							href="/songbook"
							className="text-[11px] font-medium tracking-[0.26em] text-white/85 transition hover:text-white"
						>
							SONGBOOK
						</Link>
					</div>
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setMenuOpen(true)}
						aria-label="Menu"
						className="flex h-10 w-10 flex-col justify-center gap-[5px] p-2.5 md:hidden"
					>
						<span className="block h-[1.5px] bg-white" />
						<span className="block h-[1.5px] bg-white" />
						<span className="block h-[1.5px] w-3/5 bg-white" />
					</button>
				</div>
			</nav>
			{menuOpen && (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-stage/[.97] text-stage-ink">
					<button
						type="button"
						onClick={() => setMenuOpen(false)}
						aria-label="Close menu"
						className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-base transition hover:bg-white/10"
					>
						✕
					</button>
					{menuLinks.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							onClick={() => setMenuOpen(false)}
							className="text-2xl font-bold tracking-[0.24em] text-white/85 transition hover:text-accent"
						>
							{item.label}
						</Link>
					))}
				</div>
			)}
		</>
	);
}
