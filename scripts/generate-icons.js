import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "icons");
const srcImage = path.join(iconsDir, "yt-blinkers-logo-512.png");

if (!fs.existsSync(iconsDir)) {
	fs.mkdirSync(iconsDir, { recursive: true });
}

if (!fs.existsSync(srcImage)) {
	console.error(`Source image not found: ${srcImage}`);
	process.exit(1);
}

const sizes = [16, 24, 48, 128];

sizes.forEach((size) => {
	const destImage = path.join(iconsDir, `icon-${size}.png`);
	try {
		execSync(`sips -z ${size} ${size} "${srcImage}" --out "${destImage}"`, {
			stdio: "inherit",
		});
		console.log(`Generated ${destImage}`);
	} catch (error) {
		console.error(`Failed to generate icon-${size}.png:`, error);
		process.exit(1);
	}
});

console.log("Icon generation completed successfully!");
