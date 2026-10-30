'use client';

import { useCallback, useEffect, useState } from 'react';

import { ReservationModal } from '@/components/booking/ReservationModal';
import { useBooking } from '@/context/BookingContext';
import type { ServiceCard } from '@/lib/services/types';

/**
 * The host of the reservation dialog.
 *
 * It is mounted once, in the root layout, so every call to action of the site
 * opens the same dialog. The services are read from the API when the dialog
 * is opened for the first time - the page itself does not pay for them.
 */
export function BookingModalHost() {
	const { isOpen, serviceSlug, closeBooking } = useBooking();

	const [services, setServices] = useState<ServiceCard[] | null>(null);
	const [loading, setLoading] = useState(false);
	/** Set when the catalogue could not be read at all. */
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (!isOpen || services) return;

		let cancelled = false;

		setLoading(true);
		setFailed(false);

		fetch('/api/services')
			.then(async (response) => {
				if (!response.ok) throw new Error(`the catalogue answered ${response.status}`);

				return (await response.json()) as { services?: ServiceCard[] };
			})
			.then((data: { services?: ServiceCard[] }) => {
				if (cancelled) return;

				setServices(data.services ?? []);
			})
			.catch(() => {
				if (!cancelled) setFailed(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [isOpen, services]);

	const handleClose = useCallback(() => closeBooking(), [closeBooking]);

	return (
		<ReservationModal
			open={isOpen}
			onClose={handleClose}
			services={services ?? []}
			initialServiceSlug={serviceSlug}
			loading={loading || !services}
			failed={failed}
		/>
	);
}

export default BookingModalHost;
