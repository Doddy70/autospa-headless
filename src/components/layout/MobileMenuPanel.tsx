'use client';

/**
 * Mobile off-canvas navigation.
 *
 * Ported from the Agntix `OffCanvasPanel`: the menu slides in from the right
 * over a dimmed backdrop, locks the page scroll while it is open and closes
 * on Escape, on a backdrop click or on a link click.
 */

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

import { NAVIGATION } from '@/config/navigation';
import { usePopup } from '@/context/PopupContext';

interface MobileMenuPanelProps {
	open: boolean;
	onClose: () => void;
}

export default function MobileMenuPanel({ open, onClose }: MobileMenuPanelProps) {
	// Lock the page scroll while the panel is open.
	useEffect(() => {
		if (!open) return;

		document.body.classList.add('overflow-hidden');

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.classList.remove('overflow-hidden');
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open ? (
				<>
					<motion.button
						type="button"
						aria-label="Close menu"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-[60] cursor-default bg-black/70 backdrop-blur-sm"
					/>

					<motion.aside
						role="dialog"
						aria-modal="true"
						aria-label="Mobile navigation"
						data-testid="mobile-menu"
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						className="fixed right-0 top-0 z-[61] flex h-full w-[min(360px,88vw)] flex-col overflow-y-auto border-l border-white/10 bg-background-8 px-6 py-6"
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
								Menu
							</span>
							<button
								type="button"
								onClick={onClose}
								aria-label="Close menu"
								className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
							>
								<X className="size-5" />
							</button>
						</div>

						<ul className="mt-8 flex flex-col gap-1">
							{NAVIGATION.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										prefetch={false}
										onClick={onClose}
										className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-primary-500"
									>
										{item.label}
										{item.children?.length ? (
											<ChevronDown className="size-4 opacity-50" />
										) : null}
									</Link>

									{item.children?.length ? (
										<ul className="mt-1 border-l border-white/10 pl-4">
											{item.children.map((child) => (
												<li key={child.href}>
													<Link
														href={child.href}
														prefetch={false}
														onClick={onClose}
														className="block rounded-lg px-3 py-2.5 text-sm text-white/55 transition-colors hover:text-primary-500"
													>
														{child.label}
													</Link>
												</li>
											))}
										</ul>
									) : null}
								</li>
							))}
						</ul>

						<div className="mt-auto pt-8">
							<PopupSwitch />
							<Link
								href="/contact"
								prefetch={false}
								onClick={onClose}
								className="flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
							>
								Book Sekarang
							</Link>
						</div>
					</motion.aside>
				</>
			) : null}
		</AnimatePresence>
	);
}

/**
 * The popup switch as a row inside the off-canvas menu.
 */
function PopupSwitch() {
	const { enabled, setEnabled, masterEnabled } = usePopup();

	// The campaign is off site wide - there is nothing to switch.
	if (!masterEnabled) return null;

	return (
		<button
			type="button"
			onClick={() => setEnabled(!enabled)}
			aria-pressed={enabled}
			data-testid="popup-switch"
			className="mb-4 flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
		>
			<span className="flex flex-col items-start">
				<span>Popup Beauty Care</span>
				<span className="text-[11px] text-white/35">
					{enabled ? 'Aktif' : 'Nonaktif'}
				</span>
			</span>
			<span
				className={`relative h-6 w-11 rounded-full transition-colors ${
					enabled ? 'bg-primary-500' : 'bg-white/15'
				}`}
			>
				<span
					className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
						enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
					}`}
				/>
			</span>
		</button>
	);
}
