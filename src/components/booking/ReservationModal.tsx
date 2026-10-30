'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BookingWizard } from '@/components/booking/BookingWizard';
import type { ServiceCard } from '@/lib/services/types';

/**
 * The reservation modal.
 *
 * The booking wizard lives in a dialog, so a customer can book from any page
 * of the site without leaving it. The dialog follows the pattern of the
 * Beauty Care popout: the page behind it is inert, the scroll is locked, the
 * focus stays inside the dialog and the Escape key closes it.
 *
 * On a phone the dialog is a sheet that slides up from the bottom; on a
 * wide screen it is a centred panel.
 */

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ReservationModalProps {
	/** The service catalogue - the rows of the first step. */
	services: ServiceCard[];
	/** A service that is already chosen when the dialog opens. */
	initialServiceSlug?: string | null;
	/** The label of the button that opens the dialog. */
	triggerLabel?: string;
	/** A custom button. The label is then ignored. */
	trigger?: ReactNode;
	/** Extra classes for the button. */
	triggerClassName?: string;
	/** Extra classes for the dialog panel. */
	className?: string;
	/** Called when the dialog closes. */
	onClose?: () => void;
}

export function ReservationModal({
	services,
	initialServiceSlug = null,
	triggerLabel = 'Buat Reservasi',
	trigger,
	triggerClassName,
	className,
	onClose,
}: ReservationModalProps) {
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();

	const close = useCallback(() => {
		setOpen(false);
		onClose?.();
	}, [onClose]);

	/* The scroll of the page is locked while the dialog is open, and the
	   width of the scrollbar is given back as padding, so the page behind
	   does not move. */
	useEffect(() => {
		if (!open) return;

		const panel = panelRef.current;
		const previouslyFocused = document.activeElement as HTMLElement | null;

		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		const previousPadding = document.body.style.paddingRight;

		document.body.style.paddingRight = `${scrollbar}px`;
		document.body.classList.add('overflow-hidden');

		/* Everything behind the dialog is inert. */
		const inerted: HTMLElement[] = [];

		if (panel) {
			Array.from(document.body.children).forEach((child) => {
				if (child === panel || !(child instanceof HTMLElement)) return;
				if (child.contains(panel)) return;

				child.setAttribute('inert', '');
				child.setAttribute('aria-hidden', 'true');
				inerted.push(child);
			});
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close();
				return;
			}

			if (event.key !== 'Tab' || !panel) return;

			const focusable = Array.from(
				panel.querySelectorAll<HTMLElement>(FOCUSABLE),
			).filter((element) => element.offsetParent !== null);

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (!first || !last) return;

			if (event.shiftKey && (active === first || !panel.contains(active))) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.classList.remove('overflow-hidden');
			document.body.style.paddingRight = previousPadding;

			inerted.forEach((element) => {
				element.removeAttribute('inert');
				element.removeAttribute('aria-hidden');
			});

			window.removeEventListener('keydown', onKeyDown);

			previouslyFocused?.focus?.({ preventScroll: true });
		};
	}, [close, open]);

	const fade = reduceMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
				initial: { opacity: 0, y: 24 },
				animate: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: 24 },
			};

	return (
		<>
			{trigger ?? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={
						triggerClassName ??
						'inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600'
					}
				>
					<CalendarCheck className="size-4" aria-hidden="true" />
					{triggerLabel}
				</button>
			)}

			<AnimatePresence>
				{open ? (
					<div
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						aria-label="Form reservasi layanan AutoSPA"
						onClick={(event) => {
							/* A click on the backdrop closes the dialog; a click
							   inside the panel does not. */
							if (event.target === event.currentTarget) close();
						}}
						className="fixed inset-0 z-[9999] flex items-end justify-center overflow-y-auto bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
					>
						<motion.div
							{...fade}
							transition={{ duration: 0.22, ease: 'easeOut' }}
							className={`relative w-full sm:w-[80vw] sm:max-w-[1180px] overflow-hidden rounded-t-[24px] border border-white/10 bg-background-8 shadow-3 sm:rounded-[24px] ${className ?? ''}`}
						>
							<button
								type="button"
								onClick={close}
								aria-label="Tutup"
								className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-background-7 text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
							>
								<X className="size-4" aria-hidden="true" />
							</button>

							<div className="max-h-[92vh] overflow-y-auto">
								<BookingWizard
									services={services}
									initialServiceSlug={initialServiceSlug}
								/>
							</div>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
		</>
	);
}

export default ReservationModal;
