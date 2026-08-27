# Brainstorm Session: YT Blinders — YouTube Thumbnail & Card Grey-Out Extension

## Purpose

Build a lightweight, client-only Chrome extension (Manifest V3) that reduces visual temptation and dopamine triggers on YouTube by allowing users to grey out thumbnails or entire video/comment cards across specific surfaces: Home Feed, Search Results, Related Videos, and Comments.

## Context

### Core Principle: Grey-Out Only

The extension does not support complete DOM removal / collapsing (`display: none`). Every masked element is replaced with a theme-aware neutral grey placeholder to preserve YouTube's visual layout, grid spacing, and scrolling behavior while eliminating distracting card contents.

### YouTube Surfaces Covered

1. **Home Feed** (`/`) — Main landing recommendation grid (`ytd-rich-item-renderer`, `ytd-rich-grid-row`).
2. **Search Results** (`/results`) — Vertical list of query-matched video items (`ytd-video-renderer`).
3. **Related Videos** (`/watch`) — Sidebar and end-screen recommended items (`ytd-compact-video-renderer`).
4. **Comments** (`/watch`) — Comment thread items (`ytd-comment-thread-renderer`, `ytd-comment-view-model`).

### User Experience Rationale

- **Thumbnail Grey-Out**: Neutralizes clickbait imagery while allowing users to read titles and channel names intentionally.
- **Card Grey-Out**: Blanks out the full card (thumbnail + title + metadata / full comment) into a solid grey box of matching dimensions, entirely removing recommendation distraction while keeping page structure intact.
- **Interaction Suppression**: When an entire card is greyed out, mouse clicks, hover previews, and video auto-previews are suppressed (`pointer-events: none`) to prevent impulsive opens.

## Domain Modeling

### Surface

| Surface ID | YouTube URL / Location | Target Container |
|---|---|---|
| `home-feed` | `/` | Home grid video items |
| `search-results` | `/results` | Search result video items |
| `related-videos` | `/watch` (sidebar) | Sidebar related video items |
| `comments` | `/watch` (below player) | Top-level comment threads and replies |

### Mode (Per-Surface Grey-Out Level)

```typescript
type GreyMode = 'none' | 'thumbnail' | 'card';
```

- **`none`**: Normal YouTube behavior (no modification).
- **`thumbnail`**: Only the video thumbnail image / channel avatar is replaced with a neutral grey box. Text remains visible and clickable.
- **`card`**: The entire card (thumbnail + text + metadata / comment body) is replaced with a solid grey placeholder maintaining original bounding dimensions; all pointer interactions are disabled.

### Configuration Schema

```typescript
interface SurfaceConfig {
  homeFeed: GreyMode;       // default: 'none'
  searchResults: GreyMode;  // default: 'none'
  relatedVideos: GreyMode;  // default: 'none'
  comments: GreyMode;       // default: 'none'
}
```

Storage Key: `yt_blinders_config` in `chrome.storage.sync`.

### Theme Adaptation

- **Dark Theme** (`html[dark]`): `#282828` / `#383838` placeholder background.
- **Light Theme**: `#e5e5e5` / `#d6d6d6` placeholder background.

## Constraints

### Technical Constraints

- **Platform**: Manifest V3 Chrome Extension.
- **Permissions**: Minimal required — `storage` only; `host_permissions` strictly for `*://*.youtube.com/*`.
- **Runtime**: Client-side pure JavaScript and CSS; no remote script execution, no analytics, no external servers.
- **SPA Resilience**: Must handle YouTube dynamic navigation (`yt-navigate-finish`, DOM mutations) without memory leaks or stale selectors.

### Functional Constraints

- **Grey-out Only**: No option for complete removal / display collapse; layout preservation via grey box is invariant across all surfaces.
- **Interaction Lock on Full Card**: When `card` mode is active, `pointer-events: none` is enforced on the masked card to prevent accidental navigation and hover previews.
- **Non-Destructive**: YouTube video playback, search bar, playback controls, and native settings must remain untouched.

## Guidance

### CSS & DOM Strategy

1. **Declarative CSS via Attributes**:
   - Apply dataset attributes to root or container elements based on active configuration (e.g., `html[data-ytb-home="card"]`).
   - Use CSS pseudo-elements / background masks with YouTube theme CSS variables (e.g., `var(--yt-spec-additive-background)`) or explicit dark/light colors.
2. **Dynamic Content Tagging**:
   - Hook into YouTube custom lifecycle events (`yt-navigate-finish`, `yt-page-data-updated`).
   - Run a debounced `MutationObserver` to ensure newly appended DOM nodes receive styling without flicker.
3. **Storage Sync**:
   - Load config immediately on script start.
   - Listen to `chrome.storage.onChanged` to apply changes in real-time across open tabs without requiring a page refresh.

### Configuration Popup UI

A minimal popup with a 3-option radio group per surface:

```
+-----------------------------------------------+
|                 YT Blinders                   |
+-----------------------------------------------+
| Home Feed                                     |
|   (o) Off    ( ) Grey Thumbnails  ( ) Grey Card|
|                                               |
| Search Results                                |
|   (o) Off    ( ) Grey Thumbnails  ( ) Grey Card|
|                                               |
| Related Videos                                |
|   (o) Off    ( ) Grey Thumbnails  ( ) Grey Card|
|                                               |
| Comments                                      |
|   (o) Off    ( ) Grey Avatars     ( ) Grey Card|
+-----------------------------------------------+
```

## Actions

### Extension Manifest & Permissions

- Create `manifest.json` configured for MV3 with `storage` permission and content script matching `*://*.youtube.com/*`.

### Content Script & Style Engine

- Implement CSS stylesheet defining grey placeholder styles for thumbnails and cards across dark and light YouTube themes.
- Implement selector engine mapping surface rules to YouTube DOM elements.
- Implement storage listener for live config updates.

### Popup User Interface

- Build lightweight HTML/JS popup with radio controls for the 4 surfaces.
- Wire popup inputs to `chrome.storage.sync`.

## Outcomes

### User Control

- User can independently configure each of the 4 surfaces (Home, Search, Related, Comments) to `Off`, `Grey Thumbnail`, or `Grey Card`.
- Settings take effect immediately on active YouTube tabs and persist across browser sessions/devices.

### Visual & Interactive Ergonomics

- YouTube layout does not jitter or collapse; cards retain their grid and list slots but show as neutral grey blocks.
- Greyed-out cards prevent hover previews, click navigation, and video autoplay.
- Colors seamlessly match YouTube's current light or dark theme.

## Decisions

### No Hide/Removal Mode

Eliminated full removal / DOM collapse mode. The extension exclusively offers grey-out styling to maintain layout stability and eliminate visual shifts.

### Interaction Handling

When an entire card is greyed out, pointer interactions and hover preview playback are disabled (`pointer-events: none`).

### Theme Matching

Placeholder colors dynamically match YouTube's dark/light theme state.

### Granularity

Each surface has independent configuration among 3 states: `none` (Off), `thumbnail` (Grey Thumbnails/Avatars), and `card` (Grey Entire Card).

### Storage

`chrome.storage.sync` for cross-device synchronization of preferences.

## Open Questions

- *None remaining for initial requirements.*

## Backlog

- Quick keyboard shortcut (e.g., `Alt+B`) to temporarily toggle/unmask blinders on the current page.
- Whitelist specific subscribed channels to exempt them from greying out.
- Custom grey color / opacity slider in settings.

---

## Alternatives Considered

### Full DOM Removal (`display: none`)

**Consideration:** Allowing users to choose between hiding (removing from layout) vs. greying out.

**Decision:** Rejected. Greying out is the single universal mechanism. It prevents layout collapse, infinite-scroll recalculation loops, and jarring visual shifts.

**Status:** concluded

### Allowing Clicks on Greyed-out Cards

**Consideration:** Leaving clickability intact on full grey cards.

**Decision:** Rejected in favor of `pointer-events: none` to eliminate impulsive navigation.

**Status:** concluded
