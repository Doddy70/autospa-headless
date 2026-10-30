/**
 * Popout configuration.
 *
 * The AutoSPA Beauty Care popout can be controlled on three levels:
 *
 *   1. Site wide  - the admin sets `POPUP_ENABLED=false` in the environment.
 *      The popout is then gone for every visitor and neither switch in the
 *      interface is shown. `POPUP_ENABLED` is read on the server at runtime,
 *      so the admin can switch the campaign off without a rebuild - only a
 *      restart of the server (or a new deployment) is needed.
 *   2. Per visitor - the bell in the header (desktop) or the switch in the
 *      mobile menu. The choice is remembered in `localStorage`.
 *   3. Per visit   - `?popup=off` (or `?popup=on`) on any URL forces the
 *      popout off (or on) for that browser, which is handy while testing.
 */

/** The query parameter that overrides the switch for a single visit. */
export const POPUP_QUERY_KEY = 'popup';

export interface PopupConfig {
	/**
	 * How long the homepage is given to settle before the popout opens.
	 *
	 * `0` means "as soon as the document is ready": the popout is part of the
	 * homepage, not a reminder that arrives later. Raise the value if the
	 * banner should let the hero breathe first.
	 */
	delayMs: number;
}

export const POPUP_CONFIG: PopupConfig = {
	delayMs: 0,
};

/**
 * The site wide switch of the admin.
 *
 * This runs on the server only - `src/app/layout.tsx` reads it and hands it
 * to the provider. `POPUP_ENABLED` wins over `NEXT_PUBLIC_POPUP_ENABLED`,
 * because the first one is read at runtime and the second one is baked into
 * the build.
 */
export function resolvePopupMasterEnabled(): boolean {
	const raw = process.env.POPUP_ENABLED ?? process.env.NEXT_PUBLIC_POPUP_ENABLED ?? 'true';

	return !['false', '0', 'off'].includes(String(raw).trim().toLowerCase());
}
