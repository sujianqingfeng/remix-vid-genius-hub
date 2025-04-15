// vite.config.ts
import { vitePlugin as remix } from "file:///D:/code-space/remix-translate-video/node_modules/.pnpm/@remix-run+dev@2.16.2_@remix-run+react@2.16.2_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_wytaksby72lppgzrpl5twi2pgi/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///D:/code-space/remix-translate-video/node_modules/.pnpm/vite@5.4.10_@types+node@22.7.5_terser@5.34.1/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///D:/code-space/remix-translate-video/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.6.3_vite@5.4.10_@types+node@22.7.5_terser@5.34.1_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    port: 6173
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true
      }
    }),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlLXNwYWNlXFxcXHJlbWl4LXRyYW5zbGF0ZS12aWRlb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY29kZS1zcGFjZVxcXFxyZW1peC10cmFuc2xhdGUtdmlkZW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NvZGUtc3BhY2UvcmVtaXgtdHJhbnNsYXRlLXZpZGVvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gJ0ByZW1peC1ydW4vZGV2J1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHNlcnZlcjoge1xuXHRcdHBvcnQ6IDYxNzMsXG5cdH0sXG5cdHBsdWdpbnM6IFtcblx0XHRyZW1peCh7XG5cdFx0XHRpZ25vcmVkUm91dGVGaWxlczogWycqKi8qLmNzcyddLFxuXHRcdFx0ZnV0dXJlOiB7XG5cdFx0XHRcdHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxuXHRcdFx0XHR2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcblx0XHRcdFx0djNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcblx0XHRcdFx0djNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxuXHRcdFx0XHR2M19zaW5nbGVGZXRjaDogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdFx0dHNjb25maWdQYXRocygpLFxuXHRdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUyxjQUFjLGFBQWE7QUFDclUsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNMLG1CQUFtQixDQUFDLFVBQVU7QUFBQSxNQUM5QixRQUFRO0FBQUEsUUFDUCxtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxRQUNyQix1QkFBdUI7QUFBQSxRQUN2QixnQkFBZ0I7QUFBQSxNQUNqQjtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2Y7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
