# Chrome Web Store Listing: YT Blinders

## Metadata

- **Name:** YT Blinders - Thumbnail & Card Grey-Out
- **Short Name:** YT Blinders
- **Version:** 1.0.0
- **Category:** Productivity / Accessibility
- **Default Language:** English
- **Last Updated:** 2026-08-27

---

## Store Listing Copy

### Short Description (Max 132 chars)
Grey out YouTube thumbnails or entire video and comment cards to reduce visual clutter, dopamine triggers, and impulsive clicks.

### Detailed Description

**Regain focus and intentionality while using YouTube.**

YT Blinders is a lightweight, privacy-friendly Chrome extension designed to neutralize visual bait and dopamine triggers on YouTube without breaking the site's layout or your intentional viewing experience.

### Why Grey-Out Instead of Full Removal?
Traditional blockers collapse video elements, causing jarring layout shifts, infinite-scroll recalculation loops, and visual jumping. **YT Blinders preserves YouTube's grid structure and spacing** by replacing distracting elements with solid, theme-aware neutral grey placeholders.

### Key Features

- **4 Independent Surfaces:**
  - 🏠 **Home Feed (`/`):** Control recommendations on the main page.
  - 🔍 **Search Results (`/results`):** Browse queries without clickbait distractions.
  - 🎬 **Related Videos (`/watch` sidebar):** Stop endless rabbit-hole clicking while watching a video.
  - 💬 **Comments Section (`/watch` comments):** Hide distracting avatars or blank out full comment threads.

- **3 Granular Modes Per Surface:**
  - **Off:** Normal YouTube display.
  - **Grey Thumbnails:** Masks video thumbnails and channel avatars into neutral grey boxes while leaving video titles and channel names readable.
  - **Grey Full Cards:** Blanks out the entire card (thumbnail, title, metadata) into a neutral placeholder box and completely disables pointer clicks/hover previews.

- **Seamless Dark & Light Theme Matching:**
  - Placeholders automatically adapt to YouTube's native dark and light modes.

- **Instant Real-Time Sync:**
  - Preferences synchronize across tabs and devices via `chrome.storage.sync` with immediate real-time effect.

- **Zero Bloat & 100% Client-Side:**
  - No background tracking, no remote scripts, and no analytics.

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
- **Single Purpose Declaration:** The extension serves a single dedicated purpose: allowing users to grey out video thumbnails and recommendation cards on YouTube to reduce visual distractions.

---

## Version History

- **1.0.0** (2026-08-27)
  - Initial release.
  - Configurable grey-out modes (Off, Thumbnails, Full Cards) for Home Feed, Search Results, Related Videos, and Comments.
  - Dark and Light theme adaptation.
  - Real-time cross-tab synchronization with `chrome.storage.sync`.
