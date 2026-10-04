# Chrome Web Store Listing: YT Blinders

## Metadata

- **Name:** YT Blinders - Grey-out thumbnails on YouTube
- **Short Name:** YT Blinders
- **Version:** 1.0.0
- **Category:** Lifestyle / Well-being
- **Default Language:** English
- **Last Updated:** 2026-08-27

---

## Store Listing Copy

### Short Description (Max 132 chars)
Grey out YouTube thumbnails or full video and comment cards to cut impulse clicks.

### Detailed Description

YT Blinders replaces YouTube thumbnails and channel avatars with grey boxes. Titles and channel names stay readable, so you can still find the video you came for.

### Key Features

- **4 surfaces, set separately:**
  - **Home Feed (`/`):** recommendations on the main page.
  - **Search Results (`/results`):** results for your query.
  - **Related Videos (`/watch` sidebar):** suggestions next to the player.
  - **Comments Section (`/watch` comments):** keep comments readable or grey out full threads.

- **Modes per surface:**
  - **Off:** normal YouTube.
  - **Grey thumbnails:** thumbnails and avatars become grey boxes. Titles and channel names stay readable (Home Feed, Search Results, and Related Videos).
  - **Grey full cards / comments:** the whole card or comment becomes a grey box. Clicks and hover previews are blocked (Home Feed, Related Videos, and Comments only).

- **Matches dark and light mode:**
  - Placeholders use YouTube's native colors.

- **Syncs across tabs and devices:**
  - Settings save to `chrome.storage.sync` and apply right away.

- **Runs only in your browser:**
  - No tracking, no remote scripts, no analytics.

---

## Permissions Justification

| Permission | Scope / Host | Purpose / Justification |
|---|---|---|
| `storage` | Browser sync storage | Used strictly to store and synchronize user surface preferences (`homeFeed`, `searchResults`, `relatedVideos`, `comments`) across browser sessions and signed-in devices. |
| `host_permissions` | `*://*.youtube.com/*` | Required to inject content stylesheet and script onto YouTube pages to apply grey-out styles to thumbnails and card containers. |

---

## Privacy & Data Use Disclosure

- **Does this extension collect user data?** No.
- **Does this extension transmit data to external servers?** No.
- **Single Purpose:** Grey out video thumbnails and recommendation cards on YouTube.

---

## Version History

- **1.0.0** (2026-08-27)
  - Initial release.
  - Grey-out modes (Off, Thumbnails, Full Cards) for Home Feed, Related Videos, and Comments; Search Results supports Off and Thumbnails only.
  - Dark and light theme support.
  - Cross-tab sync with `chrome.storage.sync`.
