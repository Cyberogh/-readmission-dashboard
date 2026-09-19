# Hospital Readmission Analysis

An editorial data-storytelling experience built with TanStack Start, React, Recharts, and Tailwind CSS. Analyzes 101,766 diabetic patient records to understand what drives 30-day hospital readmission.

## Deploy to Cloudflare Pages

### 1. Push to GitHub

Extract the ZIP and push to a new GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click **Create a project**
3. Select **Connect to Git**
4. Choose your GitHub repository
5. In the build settings:
   - **Build command:** `npm install && npm run build`
   - **Build output directory:** `dist/client`
   - **Node version:** 22 (set in `.nvmrc`)
6. Click **Save and Deploy**

Cloudflare Pages will automatically build and deploy on every push to the main branch.

### 3. Local Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`.

### Alternative: Host directly on GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`).
To use it instead of Cloudflare Pages:

1. Push the repo to GitHub (steps 1 above).
2. On GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. Every push to `main` builds the site and deploys it automatically to `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

No build command or output directory needs to be configured — the workflow handles it.

## Build System

- **Frontend:** Vite + React 19 + Tailwind CSS v4 + TanStack Start
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Build output:** The `npm run build` command runs `vite build` followed by `node scripts/postbuild.mjs`, which renders the app via SSR and writes `dist/client/index.html` for static deployment.

## Project Structure

```
src/
  components/story/StoryPage.tsx   # Main editorial content
  components/ui/                   # shadcn/ui components
  routes/                          # TanStack Start file-based routes
  styles.css                       # Global styles & design tokens
  lib/                             # Utilities
public/
  _redirects                       # Cloudflare Pages SPA routing
scripts/
  postbuild.mjs                    # Static HTML generation for deploy
```
