/**
 * Asset URL normalisation for the service catalogue.
 *
 * WordPress returns absolute upload URLs (`https://autospajakarta.com/
 * wp-content/uploads/...`). The site already mirrors that media into
 * `public/wp-content/uploads`, so an absolute URL is rewritten to its local
 * path whenever the mirrored file exists - the page then serves the copy
 * from this repo instead of hitting the origin on every request.
 *
 * When the file was never mirrored, the absolute URL is kept. `next.config.ts`
 * allows the origin as a remote pattern, so `next/image` can still optimise
 * it.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

const MIRROR_ROOT = path.join(process.cwd(), 'public');

/** Cache of "is this file mirrored locally?" answers. */
const mirrored = new Map<string, boolean>();

/**
 * The `/wp-content/uploads/...` part of an upload URL, or null when the URL
 * is not an upload at all.
 */
function uploadPath(url: string): string | null {
	const match = url.match(/\/wp-content\/uploads\/[^?#]*/);
	return match ? match[0] : null;
}

/**
 * Whether a root relative path exists in `public/`.
 *
 * Used by the catalogue: a cropped card in `public/assets` is nicer than the
 * published upload, but the set of cropped cards changes over time, so the
 * catalogue falls back to the published image when the crop is gone.
 */
export function existsInPublic(pathname: string): boolean {
	if (!pathname.startsWith('/')) return false;
	return existsSync(path.join(MIRROR_ROOT, pathname));
}

/**
 * Turns a WordPress media URL into the URL the app should render.
 *
 * @param url Absolute or root relative media URL.
 * @returns A root relative path when the file is mirrored locally, the
 *          original URL otherwise, or an empty string when there is no URL.
 */
export function toAssetUrl(url: string | null | undefined): string {
	if (!url) return '';

	const trimmed = url.trim();
	if (!trimmed) return '';

	/* Already a local path - nothing to rewrite. */
	if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

	const pathname = uploadPath(trimmed);
	if (!pathname) return trimmed;

	const isMirrored = mirrored.get(pathname) ?? existsSync(path.join(MIRROR_ROOT, pathname));
	mirrored.set(pathname, isMirrored);

	return isMirrored ? pathname : trimmed;
}
