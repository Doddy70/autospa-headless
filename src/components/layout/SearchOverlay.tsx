'use client';

/**
 * Site search overlay.
 *
 * The Agntix header opens a full screen search through its global context.
 * This app has no search backend, so the overlay hands the query over to the
 * blog, which already filters articles by the `search` parameter.
 *
 * The overlay behaves like the reservation dialog: the page behind it is
 * inert, the scroll is locked, the focus stays inside the dialog and the
 * Escape key closes it. The close button is the way out for everyone who
 * does not use the keyboard - the Escape key alone would leave the visitor
 * without a visible way to dismiss the overlay.
 */

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface SearchOverlayProps {
	open: boolean;
	onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState('');
	const reduceMotion = useReducedMotion();

	// Focus the field as soon as the overlay opens, and keep the focus
	// inside the dialog while it is on screen.
	useEffect(() => {
		if (!open) return;

		inputRef.current?.focus();

		const previouslyFocused = document.activeElement as HTMLElement | null;

		/* The page behind the overlay does not scroll. */
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}

			if (event.key !== 'Tab' || !panelRef.current) return;

			const focusable = Array.from(
				panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
			).filter((element) => element.offsetParent !== null);

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (!first || !last) return;

			if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKeyDown);
			previouslyFocused?.focus?.({ preventScroll: true });
		};
	}, [open, onClose]);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();

		const term = query.trim();

		if (!term) return;

		onClose();
		router.push(`/blog?search=${encodeURIComponent(term)}`);
	};

	const fade = reduceMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
				initial: { opacity: 0, y: -24 },
				animate: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: -24 },
			};

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-label="Search"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="fixed inset-0 z-[70] bg-background-8/95 backdrop-blur-md"
				>
					{/* The close button. The overlay covers the whole screen,
					    so the button sits in the corner of the viewport. */}
					<button
						type="button"
						onClick={onClose}
						aria-label="Close search"
						data-testid="search-close"
						className="absolute top-6 right-6 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
					>
						<X className="size-5" aria-hidden="true" />
					</button>

					<motion.div
						{...fade}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						className="mx-auto flex h-full max-w-[900px] flex-col px-6 pt-32 md:pt-40"
					>
						<form onSubmit={submit} className="flex items-center gap-4 border-b border-white/15 pb-4">
							<Search className="size-6 shrink-0 text-primary-500" />
							<input
								ref={inputRef}
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Cari artikel, panduan, layanan..."
								aria-label="Kata kunci pencarian"
								className="w-full bg-transparent text-xl text-white outline-none placeholder:text-white/30 md:text-2xl"
							/>
							<button
								type="submit"
								className="shrink-0 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
							>
								Cari
							</button>
						</form>

						<p className="mt-6 text-sm text-white/40">
							Tekan Enter untuk mencari di blog AutoSPA.
						</p>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
