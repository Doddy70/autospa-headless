'use client';

/**
 * Popup state.
 *
 * The Beauty Care popout is a global element - it is mounted once in the root
 * layout - while the switch that turns it on and off lives in the header. The
 * context keeps both in sync and remembers the choice in `localStorage`, so
 * the popout stays away once it has been switched off.
 *
 * The popout obeys three levels of control, see `src/config/popup.ts`: the
 * site wide master switch of the admin, the switch of the visitor and the
 * `?popup=off` query parameter.
 *
 * Closing the popout (the X or the "Tutup" footer) only closes it for the
 * current view - it does not remember anything. The popout opens again on the
 * next homepage load, which is what "the popout belongs to the homepage"
 * means. Only an explicit "off" (the bell, the mobile switch, the query
 * parameter or the master switch of the admin) keeps it away.
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

import { POPUP_QUERY_KEY } from '@/config/popup';

const ENABLED_KEY = 'autospa:popup-enabled';

interface PopupContextValue {
	/** Whether the popout may appear at all. */
	enabled: boolean;
	/** Whether the popout is on screen right now. */
	isOpen: boolean;
	/** Whether the site wide master switch allows the popout. */
	masterEnabled: boolean;
	/** Whether the visitor is on a page where the popout belongs. */
	isHome: boolean;
	/** Turns the popout on or off and remembers the choice. */
	setEnabled: (enabled: boolean) => void;
	/** Opens the popout (does nothing when it is switched off or off the homepage). */
	open: () => void;
	/** Closes the popout. */
	close: () => void;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

/** The `?popup=off` / `?popup=on` override of the current visit. */
function readQueryOverride(): 'on' | 'off' | null {
	const value = new URLSearchParams(window.location.search).get(POPUP_QUERY_KEY);

	if (value === 'off') return 'off';
	if (value === 'on') return 'on';

	return null;
}

/** The switch of the visitor, as it was left the last time. */
function readStoredChoice(): boolean | null {
	const stored = window.localStorage.getItem(ENABLED_KEY);

	if (stored === 'true') return true;
	if (stored === 'false') return false;

	return null;
}

export function PopupProvider({
	children,
	masterEnabled = true,
}: {
	children: ReactNode;
	/** The site wide master switch of the admin, read on the server. */
	masterEnabled?: boolean;
}) {
	const pathname = usePathname();
	const isHome = pathname === '/';

	const [isOpen, setIsOpen] = useState(false);
	const [override, setOverride] = useState<'on' | 'off' | null>(null);
	const [storedChoice, setStoredChoice] = useState<boolean | null>(null);

	// The browser state is read after the first paint: the server cannot know
	// the query parameter of the visitor, and reading `localStorage` while
	// rendering would break the hydration.
	useEffect(() => {
		setOverride(readQueryOverride());
		setStoredChoice(readStoredChoice());
	}, []);

	// The switch of the visitor is the base. The query parameter wins over it
	// for this visit - without changing what the visitor chose - and the
	// master switch of the admin wins over everything.
	const enabled = useMemo(() => {
		if (!masterEnabled) return false;

		if (override === 'off') return false;
		if (override === 'on') return true;

		return storedChoice ?? true;
	}, [masterEnabled, override, storedChoice]);

	// The switch is read by `open`, which may be called in the same tick as
	// `setEnabled` - the ref is therefore updated eagerly.
	const enabledRef = useRef(enabled);
	enabledRef.current = enabled;

	// The popout belongs to the homepage. Leaving it takes the popout off the
	// screen, so it does not follow the visitor around the site. Coming back
	// to the homepage opens it again.
	useEffect(() => {
		if (isHome || !isOpen) return;

		setIsOpen(false);
	}, [isHome, isOpen]);

	const setEnabled = useCallback(
		(next: boolean) => {
			// The site wide master switch wins: the popout cannot be switched
			// on while the campaign is off.
			const value = masterEnabled && next;

			// An explicit choice of the visitor wins over the query parameter
			// of the current visit.
			setOverride(null);
			setStoredChoice(value);

			enabledRef.current = value;
			window.localStorage.setItem(ENABLED_KEY, String(value));

			// Switching it off also takes the popout off screen.
			if (!value) {
				setIsOpen(false);
			}
		},
		[masterEnabled],
	);

	const open = useCallback(() => {
		// A popout that was switched off stays off, and the popout only
		// belongs to the homepage.
		if (!enabledRef.current) return;
		if (pathname !== '/') return;

		setIsOpen(true);
	}, [pathname]);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const value = useMemo(
		() => ({ enabled, isOpen, masterEnabled, isHome, setEnabled, open, close }),
		[enabled, isOpen, masterEnabled, isHome, setEnabled, open, close],
	);

	return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
}

export function usePopup() {
	const context = useContext(PopupContext);

	if (!context) {
		throw new Error('usePopup must be used within a PopupProvider');
	}

	return context;
}

export { ENABLED_KEY };
