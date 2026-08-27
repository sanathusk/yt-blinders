/**
 * YT Blinders - Popup Script (TypeScript)
 * Reads and updates user configuration in chrome.storage.sync.
 */

import {
	DEFAULT_CONFIG,
	type GreyMode,
	STORAGE_KEY,
	type SurfaceConfig,
	type SurfaceKey,
} from "../types";

const surfaces: SurfaceKey[] = [
	"homeFeed",
	"searchResults",
	"relatedVideos",
	"comments",
];

const syncStatusEl = document.getElementById(
	"syncStatus",
) as HTMLElement | null;
let statusTimeout: ReturnType<typeof setTimeout> | null = null;

function showStatus(text: string, isTemporary: boolean = true): void {
	if (!syncStatusEl) return;
	syncStatusEl.textContent = text;
	syncStatusEl.classList.add("saved");

	if (statusTimeout) {
		clearTimeout(statusTimeout);
	}

	if (isTemporary) {
		statusTimeout = setTimeout(() => {
			syncStatusEl.textContent = "Settings synced";
			syncStatusEl.classList.remove("saved");
		}, 1500);
	}
}

/**
 * Load saved config and populate radio controls and toggle switches
 */
async function initPopup(): Promise<void> {
	try {
		const data = await chrome.storage.sync.get(STORAGE_KEY);
		const config: SurfaceConfig = {
			...DEFAULT_CONFIG,
			...(data[STORAGE_KEY] || {}),
		};

		surfaces.forEach((surface) => {
			const value = config[surface] || "none";
			let radio = document.querySelector<HTMLInputElement>(
				`input[name="${surface}"][value="${value}"]`,
			);
			if (!radio) {
				radio = document.querySelector<HTMLInputElement>(
					`input[name="${surface}"][value="none"]`,
				);
			}
			if (radio) {
				radio.checked = true;
			}
		});

		const revealOnHoverCheckbox =
			document.querySelector<HTMLInputElement>("#revealOnHover");
		if (revealOnHoverCheckbox) {
			revealOnHoverCheckbox.checked = Boolean(config.revealOnHover);
		}
	} catch (err) {
		console.error("[YT Blinders] Failed to load preferences:", err);
		showStatus("Error loading settings", false);
	}
}

/**
 * Handle radio input change and sync immediately
 */
async function onConfigChange(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement | null;
	if (target?.type !== "radio") return;

	const surface = target.name as SurfaceKey;
	const value = target.value as GreyMode;

	try {
		const data = await chrome.storage.sync.get(STORAGE_KEY);
		const config: SurfaceConfig = {
			...DEFAULT_CONFIG,
			...(data[STORAGE_KEY] || {}),
		};
		config[surface] = value;

		await chrome.storage.sync.set({ [STORAGE_KEY]: config });
		showStatus("Saved");
	} catch (err) {
		console.error("[YT Blinders] Failed to save preference:", err);
		showStatus("Error saving", true);
	}
}

/**
 * Handle toggle checkbox change (e.g. revealOnHover)
 */
async function onToggleChange(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement | null;
	if (target?.type !== "checkbox") return;

	try {
		const data = await chrome.storage.sync.get(STORAGE_KEY);
		const config: SurfaceConfig = {
			...DEFAULT_CONFIG,
			...(data[STORAGE_KEY] || {}),
		};

		if (target.id === "revealOnHover") {
			config.revealOnHover = target.checked;
		}

		await chrome.storage.sync.set({ [STORAGE_KEY]: config });
		showStatus("Saved");
	} catch (err) {
		console.error("[YT Blinders] Failed to save toggle preference:", err);
		showStatus("Error saving", true);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	initPopup();

	surfaces.forEach((surface) => {
		const radios = document.querySelectorAll<HTMLInputElement>(
			`input[name="${surface}"]`,
		);
		radios.forEach((radio) => {
			radio.addEventListener("change", onConfigChange);
		});
	});

	const revealOnHoverCheckbox =
		document.querySelector<HTMLInputElement>("#revealOnHover");
	if (revealOnHoverCheckbox) {
		revealOnHoverCheckbox.addEventListener("change", onToggleChange);
	}
});
