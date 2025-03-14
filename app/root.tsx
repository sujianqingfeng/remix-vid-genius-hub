import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Toaster } from './components/ui/toaster'
import tailwindStylesheetUrl from './tailwind.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<Toaster />
			</body>
		</html>
	)
}
