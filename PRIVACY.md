# Privacy Policy for YT Blinders

**Effective Date: October 5, 2026**

YT Blinders greys out YouTube thumbnails or full video and comment cards to reduce visual temptation. Titles and channel names stay readable so you can still find the video you came for.

## 1. Data Collection: None

This extension does not collect, transmit, sell, or share any personal data, browsing history, metrics, or analytics. There are no remote servers, third-party scripts, tracking pixels, or advertising SDKs.

This has been verified in the open-source code: the extension only reads/writes user preferences via `chrome.storage.sync` (`src/popup/popup.ts`, `src/content/content.ts`), detects the YouTube surface from `window.location.pathname` in-memory (`src/content/content.ts:19-31`), and contains no `fetch`, `XMLHttpRequest`, `WebSocket`, beacon, or analytics calls.

## 2. Local Storage Only

The only data stored is your settings object (`yt_blinders_config`: `homeFeed`, `searchResults`, `relatedVideos`, `comments`, `revealOnHover`). It stays on your device and syncs across your own signed-in Chrome instances via Google's `chrome.storage.sync` infrastructure, subject to Google's Privacy Policy. The developer never receives this data.

## 3. Permissions Use

- `storage`: save and load your surface preferences across browser sessions and signed-in devices.
- `host_permissions: *://*.youtube.com/*` + content script (`content/content.js`, `content/content.css`): apply grey-out styles to thumbnails and card containers on YouTube pages only. The page URL pathname is read in-memory to detect Home / Search / Watch surfaces and never leaves the page.

## 4. No Third-Party Sharing

No data is shared with any third party.

## 5. Children

No data is collected from anyone, including children under 13.

## 6. Changes

Any changes to this policy will be posted at https://github.com/sanathusk/yt-blinders with a revised effective date.

## 7. Contact / Source

- Email: sanath.usk@gmail.com
- Issues: https://github.com/sanathusk/yt-blinders/issues
- Source code: https://github.com/sanathusk/yt-blinders
