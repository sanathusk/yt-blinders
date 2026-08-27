export type GreyMode = "none" | "thumbnail" | "card";

export interface SurfaceConfig {
	homeFeed: GreyMode;
	searchResults: GreyMode;
	relatedVideos: GreyMode;
	comments: GreyMode;
	revealOnHover: boolean;
}

export type SurfaceKey = keyof Omit<SurfaceConfig, "revealOnHover">;

export type PageType = "home" | "search" | "watch" | "other";

export const STORAGE_KEY = "yt_blinders_config";

export const DEFAULT_CONFIG: SurfaceConfig = {
	homeFeed: "none",
	searchResults: "none",
	relatedVideos: "none",
	comments: "none",
	revealOnHover: false,
};
