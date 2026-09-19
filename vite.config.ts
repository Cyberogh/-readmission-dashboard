// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Public base path of the deployed site.
//   - Root deployments (Cloudflare Pages, custom domain, <user>.github.io repo): "/"  (default)
//   - GitHub Pages project sites (https://<user>.github.io/<repo>/): "/<repo>/"
// The GitHub Actions workflow sets BASE_PATH automatically.
const rawBase = process.env.BASE_PATH || "/";
const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Pin the build output layout so `npm run build` produces dist/client + dist/server
  // everywhere (locally, GitHub Actions, Cloudflare Pages) — not only inside Lovable's sandbox.
  nitro: {
    preset: "cloudflare-module",
    output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" },
    cloudflare: { nodeCompat: true, deployConfig: true },
  },
  vite: { base },
});
