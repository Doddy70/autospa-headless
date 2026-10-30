'use client';

/**
 * The reservation modal state.
 *
 * The reservation wizard is a single dialog that is mounted once in the root
 * layout. Every call to action of the site - the header, the service pages,
 * the footer, the landing pages - opens that one dialog instead of leading
 * to a separate page.
 *
 * The context carries the service that was chosen when the dialog was
 * opened: a "Book Sekarang" on the page of a ceramic coating opens the
 * wizard with that service already selected.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface BookingContextValue {
	/** Whether the reservation dialog is on screen. */
	isOpen: boolean;
	/** The service that was chosen when the dialog was opened. */
	serviceSlug: string | null;
	/** Opens the dialog, optionally with a service already chosen. */
	openBooking: (serviceSlug?: string | null) => void;
	/** Closes the dialog. */
	closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [serviceSlug, setServiceSlug] = useState<string | null>(null);

	const openBooking = useCallback((slug?: string | null) => {
		setServiceSlug(slug ?? null);
		setIsOpen(true);
	}, []);

	const closeBooking = useCallback(() => {
		setIsOpen(false);
	}, []);

	const value = useMemo(
		() => ({ isOpen, serviceSlug, openBooking, closeBooking }),
		[isOpen, serviceSlug, openBooking, closeBooking],
	);

	return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
	const context = useContext(BookingContext);

	if (!context) {
		throw new Error('useBooking must be used within a BookingProvider');
	}

	return context;
}
