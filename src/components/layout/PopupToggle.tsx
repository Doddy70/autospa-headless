'use client';

/**
 * Header switch for the Beauty Care popout.
 *
 * The bell is the master switch of the popout:
 *
 *   - popout switched off -> the bell is crossed out, the popout never appears,
 *   - popout armed        -> a small dot marks it, the popout opens on its own
 *                           after a few seconds on the homepage,
 *   - popout on screen    -> the bell is solid, clicking it switches the popout
 *                           off completely,
 *   - popout dismissed    -> clicking the bell opens it again.
 *
 * The choice is remembered in `localStorage`, so a visitor who turned the
 * popout off never sees it again.
 */

import { Bell, BellOff } from 'lucide-react';

import { usePopup } from '@/context/PopupContext';

export default function PopupToggle({ className = '' }: { className?: string }) {
	const { enabled, isOpen, setEnabled, open } = usePopup();

	const toggle = () => {
		// The popup is switched off completely -> turn it on and show it.
		if (!enabled) {
			setEnabled(true);
			open();
			return;
		}

		// The popup is on screen -> switch it off completely.
		if (isOpen) {
			setEnabled(false);
			return;
		}

		// The popup is armed but not on screen (it was dismissed for this
		// session) -> open it again.
		open();
	};

	const label = !enabled
		? 'Aktifkan popup Beauty Care'
		: isOpen
			? 'Matikan popup Beauty Care'
			: 'Tampilkan popup Beauty Care';

	return (
		<button
			type="button"
			onClick={toggle}
			aria-pressed={enabled}
			aria-label={label}
			title={label}
			data-testid="popup-toggle"
			data-state={enabled ? 'on' : 'off'}
			className={`relative inline-flex size-10 items-center justify-center rounded-full transition-colors ${
				enabled
					? 'bg-primary-500/15 text-primary-500 hover:bg-primary-500/25'
					: 'text-white/45 hover:bg-white/10 hover:text-white/80'
			} ${className}`}
		>
			{enabled && !isOpen ? (
				<span
					aria-hidden="true"
					className="absolute right-2 top-2 size-1.5 rounded-full bg-primary-500"
				/>
			) : null}
			{enabled ? <Bell className="size-5" /> : <BellOff className="size-5" />}
		</button>
	);
}
