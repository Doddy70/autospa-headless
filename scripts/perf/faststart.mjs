/**
 * Remux an MP4 so the `moov` atom comes first ("faststart").
 *
 * A file whose `moov` atom sits behind `mdat` forces the browser to download
 * the whole file before it can play a single frame. For a hero video that is
 * exactly what the LCP metric measures, so the video becomes the largest
 * contentful paint only after the complete download - several seconds on a
 * slow connection.
 *
 * Moving `moov` in front of `mdat` lets the browser start playing after the
 * first few kilobytes. The sample offsets inside `stco`/`co64` are absolute
 * file offsets, so they have to be shifted by the same amount.
 *
 * Usage: node scripts/perf/faststart.mjs <input.mp4> [output.mp4]
 *
 * The remux is byte identical to the original apart from the box order and
 * the patched offsets - no re-encoding happens.
 */

import fs from 'node:fs';

/** Parse the top level box list of an MP4. */
function parseBoxes(buffer) {
	const boxes = [];
	let offset = 0;

	while (offset + 8 <= buffer.length) {
		let size = buffer.readUInt32BE(offset);
		const type = buffer.toString('latin1', offset + 4, offset + 8);
		let headerSize = 8;

		if (size === 1) {
			// 64 bit size
			size = Number(buffer.readBigUInt64BE(offset + 8));
			headerSize = 16;
		} else if (size === 0) {
			// extends to the end of the file
			size = buffer.length - offset;
		}

		if (size < headerSize) throw new Error(`Invalid box size for ${type} at ${offset}`);

		boxes.push({ type, offset, size, headerSize });
		offset += size;
	}

	return boxes;
}

/**
 * Walk the box tree of the `moov` atom and patch every sample offset table
 * (`stco` = 32 bit offsets, `co64` = 64 bit offsets) by `delta`.
 */
function patchSampleOffsets(buffer, moov, delta) {
	const CONTAINERS = new Set([
		'moov',
		'trak',
		'mdia',
		'minf',
		'stbl',
		'edts',
		'udta',
		'mvex',
		'moof',
		'traf',
	]);

	let patched = 0;

	const walk = (start, end) => {
		let offset = start;

		while (offset + 8 <= end) {
			let size = buffer.readUInt32BE(offset);
			const type = buffer.toString('latin1', offset + 4, offset + 8);
			let headerSize = 8;

			if (size === 1) {
				size = Number(buffer.readBigUInt64BE(offset + 8));
				headerSize = 16;
			} else if (size === 0) {
				size = end - offset;
			}

			if (size < headerSize) break;

			if (type === 'stco') {
				const count = buffer.readUInt32BE(offset + headerSize + 4);
				const tableStart = offset + headerSize + 8;
				for (let i = 0; i < count; i += 1) {
					const at = tableStart + i * 4;
					const value = buffer.readUInt32BE(at);
					buffer.writeUInt32BE(value + delta, at);
				}
				patched += count;
			} else if (type === 'co64') {
				const count = buffer.readUInt32BE(offset + headerSize + 4);
				const tableStart = offset + headerSize + 8;
				for (let i = 0; i < count; i += 1) {
					const at = tableStart + i * 8;
					const value = Number(buffer.readBigUInt64BE(at));
					buffer.writeBigUInt64BE(BigInt(value + delta), at);
				}
				patched += count;
			} else if (CONTAINERS.has(type)) {
				walk(offset + headerSize, offset + size);
			}

			offset += size;
		}
	};

	walk(moov.offset, moov.offset + moov.size);

	return patched;
}

const [input, output = input] = process.argv.slice(2);

if (!input) {
	console.error('usage: node scripts/perf/faststart.mjs <input.mp4> [output.mp4]');
	process.exit(1);
}

const buffer = fs.readFileSync(input);
const boxes = parseBoxes(buffer);

const moov = boxes.find((box) => box.type === 'moov');
const mdat = boxes.find((box) => box.type === 'mdat');

if (!moov || !mdat) {
	console.error(`${input}: no moov/mdat atom found`);
	process.exit(1);
}

if (moov.offset < mdat.offset) {
	console.log(`${input}: already faststart`);
	process.exit(0);
}

// New layout: everything up to (but excluding) the first mdat stays, then the
// moov atom, then the rest in its original order.
const head = boxes.filter((box) => box.offset < mdat.offset);
const tail = boxes.filter((box) => box.offset >= mdat.offset && box.type !== 'moov');
const ordered = [...head, moov, ...tail];

// The mdat box moves behind the moov atom, so its data shifts by the size of
// the moov atom.
const delta = moov.size;

// Build the new file.
const parts = ordered.map((box) => buffer.subarray(box.offset, box.offset + box.size));
const outputBuffer = Buffer.concat(parts);

// Patch the sample offsets inside the (moved) moov atom.
const newMoov = parseBoxes(outputBuffer).find((box) => box.type === 'moov');
const patched = patchSampleOffsets(outputBuffer, newMoov, delta);

fs.writeFileSync(output, outputBuffer);

console.log(
	`${input} -> ${output}: moov moved to offset ${newMoov.offset}, mdat shifted by ${delta} bytes, ${patched} sample offsets patched`
);
