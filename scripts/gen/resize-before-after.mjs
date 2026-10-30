import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Shrinks the photos of the before/after gallery.
 *
 * The photos are shown in a card of the gallery - at most 640 pixels wide
 * on a wide screen. A source of 1080 pixels makes the optimiser of the
 * server work (and wait) for nothing, and it makes the bundle heavier.
 *
 * The script writes the smaller photo over the old one and keeps the
 * original in `.cache/before-after-original/` (that folder is not part of
 * the repository).
 *
 *   node scripts/gen/resize-before-after.mjs
 */

const dir = 'public/images/before-after';
const backup = '.cache/before-after-original';

/** The width of the smaller photo - twice the size of the card on a retina. */
const SIZE = 900;

fs.mkdirSync(backup, { recursive: true });

const files = fs.readdirSync(dir).filter((name) => name.endsWith('.jpg')).sort();

let before = 0;
let after = 0;

for (const file of files) {
	const source = path.join(dir, file);
	const keep = path.join(backup, file);

	if (!fs.existsSync(keep)) fs.copyFileSync(source, keep);

	const original = fs.statSync(source).size;
	const resized = await sharp(keep)
		.resize(SIZE, SIZE, { fit: 'cover' })
		.jpeg({ quality: 80, progressive: true, mozjpeg: true })
		.toBuffer();

	fs.writeFileSync(source, resized);

	before += original;
	after += resized.length;
	console.log(`${file.padEnd(24)} ${Math.round(original / 1024)} KB -> ${Math.round(resized.length / 1024)} KB`);
}

console.log(
	`\n${files.length} photos: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`,
);
console.log(`the originals are in ${backup}/`);
