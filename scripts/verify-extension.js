import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

let errors = 0;

function assert(condition, message) {
	if (!condition) {
		console.error(`❌ FAIL: ${message}`);
		errors++;
	} else {
		console.log(`✅ PASS: ${message}`);
	}
}

console.log("--- Verifying Built Extension in dist/ ---");

// 1. Check manifest.json in dist/
const manifestPath = path.join(distDir, "manifest.json");
assert(fs.existsSync(manifestPath), "dist/manifest.json exists");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
assert(manifest.manifest_version === 3, "manifest_version is 3");
assert(manifest.name, "manifest has a name");
assert(manifest.version, "manifest has a version");
assert(
	Array.isArray(manifest.permissions) &&
		manifest.permissions.includes("storage"),
	"permissions include storage",
);
assert(
	Array.isArray(manifest.host_permissions) &&
		manifest.host_permissions.includes("*://*.youtube.com/*"),
	"host_permissions include youtube",
);

// 2. Check Icons in dist/
[16, 48, 128].forEach((size) => {
	const iconRelPath = manifest.icons?.[String(size)];
	assert(iconRelPath, `manifest.icons specifies ${size}px`);
	if (iconRelPath) {
		const iconAbsPath = path.join(distDir, iconRelPath);
		assert(fs.existsSync(iconAbsPath), `Icon exists in dist at ${iconRelPath}`);
		const stat = fs.statSync(iconAbsPath);
		assert(
			stat.size > 0,
			`Icon ${iconRelPath} has valid non-zero size (${stat.size} bytes)`,
		);
	}
});

// 3. Check Action Popup in dist/
const popupPath = manifest.action?.default_popup;
assert(popupPath, "action.default_popup is defined");
if (popupPath) {
	assert(
		fs.existsSync(path.join(distDir, popupPath)),
		`Popup HTML exists at dist/${popupPath}`,
	);
}
assert(
	fs.existsSync(path.join(distDir, "popup/popup.js")),
	"Popup JS exists at dist/popup/popup.js",
);
assert(
	fs.existsSync(path.join(distDir, "popup/popup.css")),
	"Popup CSS exists at dist/popup/popup.css",
);
assert(
	!fs.existsSync(path.join(distDir, "src")),
	"No redundant dist/src folder exists",
);

// 4. Check Content Scripts in dist/
assert(
	Array.isArray(manifest.content_scripts) &&
		manifest.content_scripts.length > 0,
	"content_scripts defined",
);
manifest.content_scripts?.forEach((cs) => {
	cs.css?.forEach((cssFile) => {
		assert(
			fs.existsSync(path.join(distDir, cssFile)),
			`Content CSS exists at dist/${cssFile}`,
		);
	});
	cs.js?.forEach((jsFile) => {
		const contentJsPath = path.join(distDir, jsFile);
		assert(fs.existsSync(contentJsPath), `Content JS exists at dist/${jsFile}`);
		const content = fs.readFileSync(contentJsPath, "utf8");
		assert(
			!content.includes("import "),
			"Content JS is self-contained IIFE with no external ES import statements",
		);
	});
});

if (errors === 0) {
	console.log("\n🎉 ALL DIST EXTENSION VERIFICATION CHECKS PASSED!");
	process.exit(0);
} else {
	console.error(`\n❌ ${errors} check(s) failed.`);
	process.exit(1);
}
