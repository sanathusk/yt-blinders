# Installing YT-Blinders

This guide walks you through installing and loading **YT-Blinders** in Google Chrome or any Chromium-based browser (Brave, Edge, Arc, Opera, Vivaldi).

> For the tech geeks: clone the repo and follow [the instructions below](#installation-steps-load-unpacked). For everyone else wondering *"what is a git hub?"*, hang tight—a 1-click **Chrome Web Store release coming soon!**  

---

## Prerequisites

Before building from source, ensure you have:
- A Chromium-based browser (Google Chrome, Brave, Microsoft Edge, Arc, etc.)
- **Node.js** (v18 or higher recommended) and **npm** (or **bun**)
- **Git** (optional, if cloning via command line)

---

## Installation Steps (Load Unpacked)

### 1. Clone or Download the Repository

Clone using Git:
```bash
git clone https://github.com/sanathusk/yt-blinders.git
cd yt-blinders
```

*Alternatively, click **Code > Download ZIP** on GitHub, extract the archive, and open a terminal inside the extracted folder.*

---

### 2. Install Dependencies & Build

Install project dependencies and compile the extension:

```bash
# Using npm
npm install
npm run build
```

*(Or if you use Bun: `bun install && bun run build`)*

This builds the self-contained extension assets into the `dist/` directory.

---

### 3. Load the Extension in Chrome

1. Open your browser and navigate to the Extensions management page:
   - In Chrome / Brave: `chrome://extensions`
   - In Edge: `edge://extensions`
   - Or open your browser menu $\rightarrow$ **Extensions** $\rightarrow$ **Manage Extensions**.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `dist` folder inside the `yt-blinders` project directory (`yt-blinders/dist`).

---

### 4. Verify & Pin Extension

1. You should now see **YT Blinders** listed in your extensions.
2. Click the puzzle icon (Extensions) in your browser toolbar and pin **YT Blinders** for easy access.
3. Navigate to [YouTube](https://www.youtube.com/) and click the YT-Blinders extension icon to configure your focus preferences for:
   - **Home Feed**
   - **Search Results**
   - **Related Videos**
   - **Comments**

---

## Updating the Extension

When new updates are pulled from the repository:

1. Pull the latest code:
   ```bash
   git pull origin main
   ```
2. Rebuild the extension:
   ```bash
   npm install
   npm run build
   ```
3. Return to `chrome://extensions` and click the **Reload** (🔄) icon on the YT-Blinders card.
