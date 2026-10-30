'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { BookingWizard } from '@/components/booking/BookingWizard';
import { useBooking } from '@/context/BookingContext';
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
 * wide screen it is a centred panel that takes 80% of the width.
 */

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ReservationModalProps {
	/** Whether the dialog is on screen. */
	open: boolean;
	/** Called when the dialog closes. */
	onClose: () => void;
	/** The service rows of the first step. */
	services: ServiceCard[];
	/** A service that is already chosen. */
	initialServiceSlug?: string | null;
	/** Shown while the services are being read. */
	loading?: boolean;
	/** Set when the services could not be read at all. */
	failed?: boolean;
	className?: string;
}

export function ReservationModal({
	open,
	onClose,
	services,
	initialServiceSlug = null,
	loading = false,
	failed = false,
	className,
}: ReservationModalProps) {
	const panelRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();

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
				onClose();
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
	}, [onClose, open]);

	const fade = reduceMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
				initial: { opacity: 0, y: 24 },
				animate: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: 24 },
			};

	return (
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
						if (event.target === event.currentTarget) onClose();
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
							onClick={onClose}
							aria-label="Tutup"
							className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-background-7 text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
						>
							<X className="size-4" aria-hidden="true" />
						</button>

						<div className="max-h-[92vh] overflow-y-auto">
							{loading ? (
								<div className="flex min-h-[320px] items-center justify-center p-10 text-sm text-white/50">
									Memuat layanan AutoSPA...
								</div>
							) : failed ? (
								/* A dead step with no options is worse than a
								   clear message: the customer can close the
								   dialog and try again. */
								<div
									role="alert"
									className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-10 text-center"
								>
									<p className="text-base font-bold text-white">
										Layanan AutoSPA belum bisa dimuat
									</p>
									<p className="max-w-md text-sm leading-relaxed text-white/55">
										Silakan tutup formulir ini dan buka lagi. Jika masalahnya
										berlanjutan, hubungi cabang AutoSPA terdekat untuk membuat
										reservasi.
									</p>
									<button
										type="button"
										onClick={onClose}
										className="mt-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
									>
										Tutup
									</button>
								</div>
							) : (
								<BookingWizard
									services={services}
									initialServiceSlug={initialServiceSlug}
								/>
							)}
						</div>
					</motion.div>
				</div>
			) : null}
		</AnimatePresence>
	);
}

/**
 * The button that opens the reservation dialog.
 *
 * Every call to action of the site that leads to a booking is one of these:
 * the header, the service pages, the landing pages, the footer. The service
 * can be passed along, so a button on a service page opens the wizard with
 * that service already chosen.
 */
export interface BookingTriggerProps {
	/** The label of the button. */
	label?: string;
	/** A service that is already chosen when the dialog opens. */
	serviceSlug?: string | null;
	/** The classes of the button. */
	className?: string;
	/** Custom content instead of the label. */
	children?: ReactNode;
	/** Called when the dialog opens - the mobile menu closes with it. */
	onOpen?: () => void;
}

export function BookingTrigger({
	label = 'Book Sekarang',
	serviceSlug = null,
	className,
	children,
	onOpen,
}: BookingTriggerProps) {
	const { openBooking } = useBooking();

	const handleClick = useCallback(() => {
		openBooking(serviceSlug);
		onOpen?.();
	}, [onOpen, openBooking, serviceSlug]);

	return (
		<button
			type="button"
			data-testid="booking-cta"
			onClick={handleClick}
			className={
				className ??
				'inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600'
			}
		>
			{children ?? label}
		</button>
	);
}

export default ReservationModal;
