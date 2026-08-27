# Walkthrough: YT Blinders Chrome Extension (Vite + TypeScript)

We have converted the **YT Blinders** Chrome Extension to a modern **TypeScript** and **Vite** bundler setup.

---

## 🏗️ Architecture & Project Structure

```
yt-blinders/
├── dist/                    # Built production-ready unpacked Chrome extension
│   ├── manifest.json
│   ├── icons/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── content/
│       ├── content.css
│       └── content.js       # Self-contained IIFE bundle
├── src/
│   ├── types/
│   │   └── index.ts         # Shared TypeScript interfaces & types
│   └── content/
│       ├── content.ts       # Typed content script
│       └── content.css      # Declarative CSS rules & theme adaptation
├── popup/
│   ├── popup.html           # Popup template loading popup.ts as module
│   ├── popup.ts             # Typed popup controller
│   └── popup.css            # Segmented control popup stylesheet
├── scripts/
│   ├── generate-icons.js    # Node script generating valid PNG icons
│   └── verify-extension.js  # Automated verification suite for dist/
├── manifest.json            # Manifest V3 source
├── tsconfig.json            # Strict TypeScript configuration with @types/chrome
├── vite.config.ts           # Vite build pipeline (static copy + IIFE content script)
└── package.json             # Build, dev, verify scripts & dependencies
```

---

## 🛠️ Build Commands

- **Build**: `npm run build` (runs `tsc` type check, Vite popup bundling, self-contained IIFE content script build, and static assets copying to `dist/`).
- **Dev Watch**: `npm run dev` (runs Vite in watch mode for active development).
- **Verification**: `npm run verify` (runs automated validation checks on `dist/`).
- **Generate Icons**: `npm run generate-icons` (creates 16px, 48px, 128px PNGs).

---

## 🧪 Verification Steps

```bash
$ npm run verify
```

---

## 🚀 How to Load in Chrome

1. Build the extension:
   ```bash
   npm run build
   ```
2. Open Google Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** (top left).
5. Select the `dist/` directory inside this repository:
   `<git_root>/yt-blinders/dist`
6. Open [YouTube](https://www.youtube.com/) and test toggling greying modes on Home Feed, Search Results, Related Videos, and Comments.
