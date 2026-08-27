import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "icons");

if (!fs.existsSync(iconsDir)) {
	fs.mkdirSync(iconsDir, { recursive: true });
}

// CRC32 calculation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
	let c = n;
	for (let k = 0; k < 8; k++) {
		if (c & 1) {
			c = 0xedb88320 ^ (c >>> 1);
		} else {
			c = c >>> 1;
		}
	}
	crcTable[n] = c;
}

function crc32(buf) {
	let crc = 0xffffffff;
	for (let i = 0; i < buf.length; i++) {
		crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
	const len = data.length;
	const chunk = Buffer.alloc(8 + len + 4);
	chunk.writeUInt32BE(len, 0);
	chunk.write(type, 4, 4, "ascii");
	data.copy(chunk, 8);
	const crcTarget = chunk.subarray(4, 8 + len);
	chunk.writeUInt32BE(crc32(crcTarget), 8 + len);
	return chunk;
}

function generateIconPNG(size) {
	const scanlineWidth = 1 + size * 4;
	const rawData = Buffer.alloc(scanlineWidth * size);

	const radius = size * 0.22;
	const center = size / 2;

	for (let y = 0; y < size; y++) {
		const rowOffset = y * scanlineWidth;
		rawData[rowOffset] = 0; // Filter type 0 (None)

		for (let x = 0; x < size; x++) {
			const pxOffset = rowOffset + 1 + x * 4;

			// Rounded rectangle badge background
			const dx = Math.max(
				0,
				Math.abs(x - center + 0.5) - (center - radius - 1),
			);
			const dy = Math.max(
				0,
				Math.abs(y - center + 0.5) - (center - radius - 1),
			);
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist > radius) {
				// Transparent outside rounded rect
				rawData[pxOffset] = 0;
				rawData[pxOffset + 1] = 0;
				rawData[pxOffset + 2] = 0;
				rawData[pxOffset + 3] = 0;
				continue;
			}

			// Inside icon background
			let r = 24,
				g = 24,
				b = 27,
				a = 255; // #18181b

			// Blinders Horizontal Slats motif
			const relY = y / size;
			const relX = x / size;

			// Draw horizontal blind slats
			const slat1 = relY >= 0.28 && relY <= 0.38 && relX >= 0.2 && relX <= 0.8;
			const slat2 = relY >= 0.44 && relY <= 0.54 && relX >= 0.2 && relX <= 0.8;
			const slat3 = relY >= 0.6 && relY <= 0.7 && relX >= 0.2 && relX <= 0.8;

			if (slat1 || slat2 || slat3) {
				if (slat2) {
					r = 99;
					g = 102;
					b = 241; // Accent indigo (#6366f1)
				} else {
					r = 161;
					g = 161;
					b = 170; // Zinc (#a1a1aa)
				}
			}

			rawData[pxOffset] = r;
			rawData[pxOffset + 1] = g;
			rawData[pxOffset + 2] = b;
			rawData[pxOffset + 3] = a;
		}
	}

	const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

	// IHDR
	const ihdrData = Buffer.alloc(13);
	ihdrData.writeUInt32BE(size, 0);
	ihdrData.writeUInt32BE(size, 4);
	ihdrData[8] = 8;
	ihdrData[9] = 6;
	ihdrData[10] = 0;
	ihdrData[11] = 0;
	ihdrData[12] = 0;
	const ihdrChunk = makeChunk("IHDR", ihdrData);

	// IDAT
	const compressedData = zlib.deflateSync(rawData);
	const idatChunk = makeChunk("IDAT", compressedData);

	// IEND
	const iendChunk = makeChunk("IEND", Buffer.alloc(0));

	return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

[16, 48, 128].forEach((size) => {
	const buf = generateIconPNG(size);
	const filePath = path.join(iconsDir, `icon-${size}.png`);
	fs.writeFileSync(filePath, buf);
	console.log(`Generated ${filePath} (${buf.length} bytes)`);
});
