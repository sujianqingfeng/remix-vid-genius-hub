import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	server: {
		port: 6173,
	},
	plugins: [
		remix({
			ignoredRouteFiles: ['**/*.css'],
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_lazyRouteDiscovery: true,
				v3_singleFetch: true,
			},
		}),
		tsconfigPaths(),
	],
})
