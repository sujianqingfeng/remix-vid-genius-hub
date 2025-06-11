import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Toaster } from './components/ui/toaster'
import tailwindStylesheetUrl from './tailwind.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: tailwindStylesheetUrl },
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
	{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
]

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#3b82f6" />
				<Meta />
				<Links />
			</head>
			<body className="h-full font-sans antialiased">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<Toaster />
			</body>
		</html>
	)
}
