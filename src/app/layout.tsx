import {type Metadata} from 'next';

import '@/styles/tailwind.css';

export const metadata: Metadata = {
	title: {
		template: '%s - Firebrand Veneration',
		default:
			'Firebrand - Veneration Night with the King',
	},
	description:
		'VNC Firebrand\'s worship evening.',
}

export default function RootLayout({
	                                   children,
                                   }: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="h-full bg-white antialiased">
		<head>
			<link
				rel="preconnect"
				href="https://cdn.fontshare.com"
				crossOrigin="anonymous"
			/>
			<link
				rel="stylesheet"
				href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
			/>
			<link
				rel="icon"
				href="/src/app/favicon.ico"
				sizes="any"
				type="image/svg+xml"
			/>
		</head>
		<body className="flex min-h-full">
		<div className="w-full">{children}</div>
		</body>
		</html>
	)
}
