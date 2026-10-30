/**
 * The booking summary - the text the customer hands over to the team.
 *
 * The wizard has no backend, so the summary is the deliverable: it is shown
 * on the review step, copied to the clipboard and handed to WhatsApp. The
 * reference code in it is generated in the browser; it is a request number
 * for the conversation, not a reservation number.
 */

import { BRANCHES, type ContactBranch } from '@/data/contact';
import type { ServiceCard } from '@/lib/services/types';

import { formatDate, getArrivalOption, toISODate, weekdayOf } from './schedule';
import { toInternationalPhone } from './validation';
import { getCarSize, OTHER_BRAND, type CarSize } from './vehicles';
import type { BookingState } from './types';

/** One line of the summary. */
export interface SummaryRow {
	label: string;
	value: string;
}

export interface ResolvedBooking {
	/** The request number, e.g. `ASPA-260630-K4T2`. */
	reference: string;
	rows: SummaryRow[];
	/** The customer, as typed. */
	customerName: string;
	/** The phone number in the international format. */
	customerPhone: string;
	notes: string;
}

/**
 * A short request number.
 *
 * The date of the requested visit is part of it, so the number is recognisable
 * in the conversation, and four random characters keep two requests of the
 * same day apart. A request without a day - "as soon as possible" or "still
 * asking questions" - carries the day it was made, so the number never ends
 * up with an empty part.
 */
export function bookingReference(date: string): string {
	const stamp = (date || toISODate(new Date())).replaceAll('-', '').slice(2);
	const random = Math.random().toString(36).slice(2, 6).toUpperCase();

	return `ASPA-${stamp}-${random}`;
}

/** The branch of the request. */
export function findBranch(slug: string | null): ContactBranch | null {
	if (!slug) return null;
	return BRANCHES.find((branch) => branch.slug === slug) ?? null;
}

/**
 * The summary of the request.
 *
 * Rows that are not filled in are left out, so the summary only shows what
 * the customer actually entered.
 */
export function resolveBooking(state: BookingState, services: ServiceCard[]): ResolvedBooking {
	const service = services.find((item) => item.slug === state.serviceSlug) ?? null;
	const branch = findBranch(state.locationSlug);
	const carSize = getCarSize(state.carSizeId);

	const rows: SummaryRow[] = [];

	if (service) rows.push({ label: 'Layanan', value: service.title });
	if (branch) rows.push({ label: 'Cabang', value: branch.name });
	if (carSize) rows.push({ label: 'Ukuran kendaraan', value: carSize.title });

	const vehicleParts = [
		state.vehicleBrand === OTHER_BRAND
			? state.vehicleBrandOther.trim()
			: state.vehicleBrand.trim(),
		state.vehicleModel.trim(),
		state.vehicleYear.trim(),
	].filter((part) => part.length > 0);

	if (vehicleParts.length > 0) {
		rows.push({ label: 'Kendaraan', value: vehicleParts.join(' ') });
	}

	if (state.arrival) {
		const option = getArrivalOption(state.arrival);

		const parts = [option?.title ?? ''];

		if (state.arrival === 'konsultasi') {
			parts.push('belum ada tanggal yang ditentukan');
		} else {
			if (state.date) {
				parts.push(`${formatDate(state.date)} (${weekdayOf(state.date)})`);
			}
			if (state.time) parts.push(`${state.time} WIB`);
		}

		rows.push({ label: 'Jadwal', value: parts.filter(Boolean).join(' · ') });
	}

	return {
		reference: bookingReference(state.date),
		rows,
		customerName: state.customerName.trim(),
		customerPhone: toInternationalPhone(state.customerPhone),
		notes: state.customerNotes.trim(),
	};
}

/**
 * The message that is sent to WhatsApp.
 *
 * The wording asks for a confirmation instead of stating one: the request
 * is not a confirmed booking until the team answers.
 */
export function buildWhatsAppMessage(resolved: ResolvedBooking): string {
	const lines = [
		`Halo AutoSPA Jakarta, saya ingin booking ${resolved.reference}.`,
		'',
		...resolved.rows.map((row) => `${row.label}: ${row.value}`),
		'',
		`Nama: ${resolved.customerName}`,
		`No. WhatsApp: ${resolved.customerPhone}`,
	];

	if (resolved.notes) lines.push(`Catatan: ${resolved.notes}`);

	lines.push('', 'Mohon konfirmasi jadwal dan harga akhirnya. Terima kasih!');

	return lines.join('\n');
}
