import { type Metadata } from 'next';

import '@/styles/tailwind.css';

export const metadata: Metadata = {
	title: {
		template: '%s - Firebrand Veneration',
		default: 'Firebrand - Veneration Night with the King',
	},
	description: "VNC Firebrand's worship evening.",
};

const themeScript = `
try {
	const stored = localStorage.getItem('fb-theme');
	document.documentElement.classList.toggle('dark', stored ? stored === 'dark' : true);
} catch (e) {
	document.documentElement.classList.add('dark');
}
`;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
			<head>
				<link
					rel="preconnect"
					href="https://cdn.fontshare.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
				/>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="flex min-h-full bg-surface font-sans text-ink transition-colors duration-300">
				<div className="w-full">{children}</div>
			</body>
		</html>
	);
}
