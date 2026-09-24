# Developer & Operations Guide

This guide covers developer onboarding, available npm scripts, coding standards, build configuration, deployment strategies, and troubleshooting for the **VELoop Rewards CAPTCHA Module**.

---

## 🛠️ Developer Prerequisites

- **Node.js**: `v18.0.0` or higher (LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)
- **Modern Browser**: Chrome 100+, Firefox 100+, Safari 16+, Edge 100+ (Web Audio API & CSS Custom Properties support)

---

## ⚙️ NPM Scripts

| Command | Action | Notes |
| :--- | :--- | :--- |
| **`npm run dev`** | Starts the Vite development server | Default port: `http://localhost:5173/` with Hot Module Replacement (HMR). |
| **`npm run build`** | Generates production bundle | Output directory: `dist/`. Compresses assets and generates source maps. |
| **`npm run preview`** | Boots a local HTTP server serving `dist/` | Useful for testing production build performance and routing. |
| **`npm run lint`** | Executes ESLint validation | Validates React hooks rules, unused variables, and JSX syntax. |

---

## 🏗️ Build & Bundler Configuration

The application is built using **Vite 8** with `@vitejs/plugin-react`:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Production Output (`dist/`)
When executing `npm run build`:
- **CSS Inlining & Chunking**: CSS Modules are compiled into optimized, minified CSS bundles.
- **Asset Hashing**: Image assets and fonts receive cache-busting hashes (e.g. `index-Bf9e_1.js`).
- **Tree-Shaking**: Unused Lucide icons or library functions are stripped from the final payload.

---

## 🚀 Deployment Strategies

### Deploying to Vercel
The repository includes a ready-to-use `vercel.json` file handling client-side SPA routing rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

To deploy via Vercel CLI:
```bash
npx vercel --prod
```

### Deploying to Netlify
Create a `public/_redirects` file with the following single rule to support React Router:
```text
/*    /index.html   200
```

### Deploying to Static Storage (Cloudflare Pages, AWS S3 + CloudFront)
1. Run `npm run build`.
2. Upload the contents of the `dist/` directory to your storage bucket or provider.
3. Configure the 404 error document fallback to point to `/index.html`.

---

## 📐 Coding & Separation Guidelines

When extending or maintaining this codebase, adhere to the following architectural rules:

### 1. Scoped CSS Modules Only
- Never write global style rules in `src/index.css` that target component tags (e.g. `button`, `div`).
- Every component must have an accompanying `[ComponentName].module.css` file.
- Use camelCase or kebab-case for CSS class names consistently within module files.

### 2. Zero-Asset Audio Policy
- All auditory feedback must use the centralized `playSound(type)` dispatcher in `src/components/CaptchaPage/utils/audioEffects.js`.
- Never introduce external `.mp3`, `.ogg`, or `.wav` network requests.

### 3. State Co-Location & Single Source of Truth
- State that affects the verification flow (such as `flowState`, `challenge`, and `gems`) must remain in `<CaptchaPage />`.
- Transient animation state (such as 3D card tilt coordinates, countdown intervals, or hover flags) must be co-located inside the relevant view component.

---

## 🔍 Troubleshooting & FAQ

### Q: Why isn't audio playing on my first page visit?
**A**: Modern web browsers enforce strict **Autoplay Policies**. Web Audio contexts cannot emit sound until the user performs at least one physical gesture (a click, tap, or keypress). As soon as the user hovers, clicks an option, or presses **`M`**, the `AudioContext` automatically resumes.

### Q: Why does the Gasoek One font look different or unstyled?
**A**: Ensure your network allows connections to `fonts.googleapis.com` and `fonts.gstatic.com`. If working in an isolated/air-gapped environment, download `GasoekOne-Regular.ttf` into `public/assets/fonts/` and declare a `@font-face` rule in `index.css`.

### Q: Images or SVG files return 404 when embedded under a subpath (e.g. `/my-app/captcha`)?
**A**: Assets in `public/assets/` are referenced with absolute root paths (`/assets/...`). If hosting your application in a nested subdirectory, configure the `base` property in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/my-app/',
  plugins: [react()],
});
```
