#!/usr/bin/env node
/**
 * Post-build script: renders the app via SSR and writes static index.html
 * to dist/client/ for Cloudflare Pages static deployment.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Import the built Nitro server
const serverPath = join(root, "dist", "server", "index.mjs");
const app = await import(serverPath);

const request = new Request("http://localhost/");
const response = await app.default.fetch(request, {}, { waitUntil: () => {} });

if (!response.ok) {
  console.error(`SSR failed with status ${response.status}`);
  process.exit(1);
}

const html = await response.text();

const outPath = join(root, "dist", "client", "index.html");
writeFileSync(outPath, html);

// SPA fallback for GitHub Pages (Cloudflare Pages uses public/_redirects instead).
writeFileSync(join(root, "dist", "client", "404.html"), html);

console.log(`✓ dist/client/index.html + 404.html generated (${html.length} bytes)`);
