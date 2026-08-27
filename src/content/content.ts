/**
 * YT Blinders - Content Script (TypeScript)
 * Synchronizes user preferences from chrome.storage.sync and applies declarative
 * styling attributes to the document root based on the active YouTube surface.
 */

import {
	DEFAULT_CONFIG,
	type PageType,
	STORAGE_KEY,
	type SurfaceConfig,
} from "../types";

let currentConfig: SurfaceConfig = { ...DEFAULT_CONFIG };

/**
 * Determine YouTube surface from pathname
 */
function detectPageType(): PageType {
	const pathname = window.location.pathname;
	if (pathname === "/" || pathname === "") {
		return "home";
	}
	if (pathname.startsWith("/results")) {
		return "search";
	}
	if (pathname.startsWith("/watch") || pathname.startsWith("/shorts")) {
		return "watch";
	}
	return "other";
}

/**
 * Update DOM attributes on document.documentElement
 */
function updateDomAttributes(): void {
	const root = document.documentElement;
	if (!root) return;

	const pageType = detectPageType();
	root.setAttribute("data-ytb-page", pageType);
	root.setAttribute("data-ytb-home", currentConfig.homeFeed || "none");
	root.setAttribute("data-ytb-search", currentConfig.searchResults || "none");
	root.setAttribute("data-ytb-related", currentConfig.relatedVideos || "none");
	root.setAttribute("data-ytb-comments", currentConfig.comments || "none");
	root.setAttribute(
		"data-ytb-reveal-hover",
		currentConfig.revealOnHover ? "true" : "false",
	);
}

/**
 * Load preferences from chrome.storage.sync
 */
async function loadConfig(): Promise<void> {
	try {
		const data = await chrome.storage.sync.get(STORAGE_KEY);
		if (data?.[STORAGE_KEY]) {
			currentConfig = {
				...DEFAULT_CONFIG,
				...(data[STORAGE_KEY] as Partial<SurfaceConfig>),
			};
		} else {
			currentConfig = { ...DEFAULT_CONFIG };
		}
		updateDomAttributes();
	} catch (err) {
		console.error("[YT Blinders] Failed to load config:", err);
		updateDomAttributes();
	}
}

// Listen for storage changes from popup
chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === "sync" && changes[STORAGE_KEY]) {
		const newConfig = changes[STORAGE_KEY].newValue as
			| SurfaceConfig
			| undefined;
		if (newConfig) {
			currentConfig = { ...DEFAULT_CONFIG, ...newConfig };
			updateDomAttributes();
		}
	}
});

// Navigation events in YouTube SPA
window.addEventListener("yt-navigate-finish", updateDomAttributes);
window.addEventListener("yt-page-data-updated", updateDomAttributes);
window.addEventListener("popstate", updateDomAttributes);

// Periodic check for URL change fallback
let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
	if (window.location.href !== lastUrl) {
		lastUrl = window.location.href;
		updateDomAttributes();
	}
});

if (document.body) {
	urlObserver.observe(document.body, { childList: true, subtree: true });
} else {
	document.addEventListener("DOMContentLoaded", () => {
		if (document.body) {
			urlObserver.observe(document.body, { childList: true, subtree: true });
		}
	});
}

// Prevent background/inline video previews from playing when revealOnHover is false
document.addEventListener(
	"play",
	(event) => {
		const target = event.target as HTMLMediaElement;
		if (target?.tagName !== "VIDEO") return;

		// Check if target is inside an inline preview / hover player
		const isInlinePreview = target.closest(
			"ytd-inline-preview-renderer, ytd-video-preview, #inline-preview-player, #video-preview, #mouseover-overlay, ytd-moving-thumbnail-renderer",
		);

		if (isInlinePreview) {
			const pageType = detectPageType();
			const isGreyed =
				(pageType === "home" && currentConfig.homeFeed !== "none") ||
				(pageType === "search" && currentConfig.searchResults !== "none") ||
				(pageType === "watch" && currentConfig.relatedVideos !== "none");

			if (isGreyed && !currentConfig.revealOnHover) {
				target.pause();
				target.currentTime = 0;
			}
		}
	},
	true,
);

// Initialize immediately
loadConfig();
