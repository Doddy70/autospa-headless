/**
 * The origin of the mirrored WordPress content.
 *
 * The pages that are served as a snapshot carry the URLs of the site they
 * were taken from. The Elementor configuration inside them points its asset
 * loader at `autospajakarta.com`, so the webpack runtime of the plugin asks
 * for its lazy chunks there - and the production host answers with a 404,
 * because production is the Next.js frontend and no longer serves
 * `/wp-content/...`.
 *
 * The staging install serves the very same files, so the URLs of the mirrored
 * markup are rewritten to the staging origin. The result is a snapshot that
 * still finds every asset it asks for.
 */

/** The origin the content was published on. */
const PUBLISHED_ORIGIN = 'autospajakarta.com';

/** The origin the frontend reads from. */
const CURRENT_ORIGIN =
	process.env.WORDPRESS_SITE_URL ?? 'https://backend.autospajakarta.com';

/**
 * The host of the current origin, without the scheme.
 *
 * The rewriting happens on the host only: the paths of the staging and the
 * production install are the same, and the scheme of the origin is decided
 * by the browser.
 */
const CURRENT_HOST = CURRENT_ORIGIN.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

/**
 * Rewrite the published host to the current one.
 *
 * Only a host that stands on its own is rewritten. `v2.autospajakarta.com`
 * is a different host that happens to end with the same name - it stays as
 * it is.
 */
export function rewritePublishedOrigin(value: string): string {
	if (!value.includes(PUBLISHED_ORIGIN)) return value;

	/* A host that is preceded by a dot belongs to another domain. */
	return value.replace(
		new RegExp(`(^|[^.\\w-])${PUBLISHED_ORIGIN.replace(/\./g, '\\.')}`, 'g'),
		`$1${CURRENT_HOST}`,
	);
}
