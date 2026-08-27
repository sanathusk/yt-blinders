import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build, defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	base: "",
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				popup: resolve(__dirname, "src/popup/popup.html"),
			},
			output: {
				entryFileNames: "popup/popup.js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith(".css")) {
						return "popup/popup.css";
					}
					return "assets/[name]-[hash][extname]";
				},
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "manifest.json",
					dest: ".",
				},
				{
					src: "icons",
					dest: ".",
				},
				{
					src: "src/content/content.css",
					dest: "content",
				},
			],
		}),
		{
			name: "relocate-popup-html",
			enforce: "post",
			generateBundle(_, bundle) {
				const htmlAsset = bundle["src/popup/popup.html"];
				if (htmlAsset && "source" in htmlAsset) {
					htmlAsset.fileName = "popup/popup.html";
					if (typeof htmlAsset.source === "string") {
						htmlAsset.source = htmlAsset.source.replaceAll(
							"../../popup/",
							"./",
						);
					}
				}
			},
		},
		{
			name: "build-content-script",
			async closeBundle() {
				// Bundle content script as a self-contained IIFE with zero external imports
				await build({
					configFile: false,
					build: {
						emptyOutDir: false,
						outDir: "dist/content",
						lib: {
							entry: resolve(__dirname, "src/content/content.ts"),
							formats: ["iife"],
							name: "YTBlindersContent",
							fileName: () => "content.js",
						},
					},
				});
			},
		},
	],
});
