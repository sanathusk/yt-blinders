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
const saveButtonEl = document.getElementById(
	"saveButton",
) as HTMLButtonElement | null;
const saveButtonTextEl = document.getElementById(
	"saveButtonText",
) as HTMLElement | null;

let statusTimeout: ReturnType<typeof setTimeout> | null = null;
let saveButtonTimeout: ReturnType<typeof setTimeout> | null = null;

function showStatus(
	text: string,
	variant: "default" | "saved" | "unsaved" | "error" = "default",
	isTemporary: boolean = false,
): void {
	if (!syncStatusEl) return;
	syncStatusEl.textContent = text;
	syncStatusEl.classList.remove("saved", "unsaved", "error");

	if (variant !== "default") {
		syncStatusEl.classList.add(variant);
	}

	if (statusTimeout) {
		clearTimeout(statusTimeout);
	}

	if (isTemporary) {
		statusTimeout = setTimeout(() => {
			syncStatusEl.textContent = "Settings synced";
			syncStatusEl.classList.remove("saved", "unsaved", "error");
		}, 2000);
	}
}

/**
 * Extract currently selected configuration from form inputs
 */
function getFormConfig(): SurfaceConfig {
	const config: SurfaceConfig = { ...DEFAULT_CONFIG };

	surfaces.forEach((surface) => {
		const checkedRadio = document.querySelector<HTMLInputElement>(
			`input[name="${surface}"]:checked`,
		);
		if (checkedRadio) {
			(config as Record<SurfaceKey, GreyMode>)[surface] =
				checkedRadio.value as GreyMode;
		}
	});

	const revealOnHoverCheckbox =
		document.querySelector<HTMLInputElement>("#revealOnHover");
	if (revealOnHoverCheckbox) {
		config.revealOnHover = revealOnHoverCheckbox.checked;
	}

	return config;
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

		showStatus("Settings synced", "default");
	} catch (err) {
		console.error("[YT Blinders] Failed to load preferences:", err);
		showStatus("Error loading settings", "error");
	}
}

/**
 * Handle save button click: persist settings to chrome.storage.sync
 */
async function onSave(): Promise<void> {
	if (!saveButtonEl) return;

	try {
		saveButtonEl.disabled = true;
		if (saveButtonTextEl) {
			saveButtonTextEl.textContent = "Saving...";
		}

		const config = getFormConfig();
		await chrome.storage.sync.set({ [STORAGE_KEY]: config });

		saveButtonEl.classList.add("saved");
		if (saveButtonTextEl) {
			saveButtonTextEl.textContent = "Saved!";
		}
		showStatus("Settings saved & synced", "saved", true);

		if (saveButtonTimeout) {
			clearTimeout(saveButtonTimeout);
		}

		saveButtonTimeout = setTimeout(() => {
			if (saveButtonEl) {
				saveButtonEl.classList.remove("saved");
				saveButtonEl.disabled = false;
			}
			if (saveButtonTextEl) {
				saveButtonTextEl.textContent = "Save Settings";
			}
		}, 1200);
	} catch (err) {
		console.error("[YT Blinders] Failed to save preferences:", err);
		if (saveButtonEl) {
			saveButtonEl.disabled = false;
			saveButtonEl.classList.remove("saved");
		}
		if (saveButtonTextEl) {
			saveButtonTextEl.textContent = "Save Settings";
		}
		showStatus("Error saving settings", "error");
	}
}

/**
 * Indicate unsaved changes on input change
 */
function onInputChange(): void {
	showStatus("Unsaved changes", "unsaved");
}

document.addEventListener("DOMContentLoaded", () => {
	initPopup();

	if (saveButtonEl) {
		saveButtonEl.addEventListener("click", onSave);
	}

	surfaces.forEach((surface) => {
		const radios = document.querySelectorAll<HTMLInputElement>(
			`input[name="${surface}"]`,
		);
		radios.forEach((radio) => {
			radio.addEventListener("change", onInputChange);
		});
	});

	const revealOnHoverCheckbox =
		document.querySelector<HTMLInputElement>("#revealOnHover");
	if (revealOnHoverCheckbox) {
		revealOnHoverCheckbox.addEventListener("change", onInputChange);
	}
});
