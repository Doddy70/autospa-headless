/**
 * The opening hours of a branch and the time slots derived from them.
 *
 * The branch directory (`data/contact.ts`) publishes the opening hours of
 * every branch as free text - "Every day 08.30 - 18.00 WIB". The wizard
 * reads that text so the time slots of the schedule step are the slots the
 * chosen branch is actually open for: a branch that closes at 17.00 does not
 * offer a 17.30 slot.
 *
 * This is an opening-hours filter, not a live availability system. AutoSPA
 * publishes no slot calendar, so the wizard never claims a slot is free.
 */

import type { ArrivalPreference } from './types';

export interface BranchHours {
	/** Opening time, `HH:MM`. */
	open: string;
	/** Closing time, `HH:MM`. */
	close: string;
}

/** "08.30", "08:30" and "8.30" all mean the same thing. */
function toMinutes(value: string): number | null {
	const match = value.trim().match(/^(\d{1,2})[:.](\d{2})$/);
	if (!match) return null;

	const hours = Number(match[1]);
	const minutes = Number(match[2]);

	if (hours > 24 || minutes > 59) return null;

	return hours * 60 + minutes;
}

/** "08.30" -> "08:30". */
function toClock(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;

	return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

/**
 * The opening hours of a branch, parsed from its published hours line.
 *
 * Returns null when the line cannot be parsed - the wizard then falls back
 * to the site-wide opening hours instead of guessing.
 */
export function parseBranchHours(hours: string | null | undefined): BranchHours | null {
	if (!hours) return null;

	const match = hours.match(/(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/);
	if (!match) return null;

	const open = toMinutes(`${match[1]}:${match[2]}`);
	const close = toMinutes(`${match[3]}:${match[4]}`);
	if (open === null || close === null || close <= open) return null;

	return { open: toClock(open), close: toClock(close) };
}

/**
 * The time slots of a branch, one every full hour.
 *
 * The first slot starts at the next full hour after the branch opens, and
 * the last slot starts an hour before closing, so a customer is never
 * booked into the last minute of the working day.
 */
export function timeSlots(hours: BranchHours | null): string[] {
	if (!hours) return [];

	const open = toMinutes(hours.open);
	const close = toMinutes(hours.close);
	if (open === null || close === null) return [];

	/* The first full hour of the working day. */
	const start = Math.ceil(open / 60) * 60;

	const slots: string[] = [];

	for (let minute = start; minute + 60 <= close; minute += 60) {
		slots.push(toClock(minute));
	}

	return slots;
}

/** Today, as `YYYY-MM-DD` in the local timezone of the browser. */
export function today(): string {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${now.getFullYear()}-${month}-${day}`;
}

/** The weekday of a `YYYY-MM-DD` date, in Indonesian. */
export function weekdayOf(date: string): string {
	const parsed = new Date(`${date}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) return '';

	return parsed.toLocaleDateString('id-ID', { weekday: 'long' });
}

/** A `YYYY-MM-DD` date as a readable Indonesian date. */
export function formatDate(date: string): string {
	const parsed = new Date(`${date}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) return date;

	return parsed.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/* ------------------------------------------------------------- arrival --- */

/**
 * How soon the customer wants to come.
 *
 * The four answers the service advisor hears the most. The urgency comes
 * first, the exact day and time are refined afterwards.
 */
export const ARRIVAL_OPTIONS: {
	id: ArrivalPreference;
	title: string;
	description: string;
}[] = [
	{
		id: 'asap',
		title: 'Secepatnya',
		description: 'Paling cepat bisa ditutup.',
	},
	{
		id: 'minggu-ini',
		title: 'Minggu ini',
		description: 'Masih dalam minggu ini.',
	},
	{
		id: 'minggu-depan',
		title: 'Minggu depan',
		description: 'Ada rencana minggu depan.',
	},
	{
		id: 'konsultasi',
		title: 'Masih konsultasi',
		description: 'Cuma mau tanya-tanya dulu.',
	},
];

export function getArrivalOption(id: ArrivalPreference | null) {
	if (!id) return null;
	return ARRIVAL_OPTIONS.find((option) => option.id === id) ?? null;
}

/**
 * The days a customer can choose for an arrival preference.
 *
 * The week starts on Monday. "Minggu ini" reaches to the end of the
 * current week, "Minggu depan" covers the whole of the next one. The
 * "as soon as possible" and "still consulting" answers carry no date.
 */
export function arrivalRange(id: ArrivalPreference): { start: Date; end: Date } | null {
	const now = new Date();
	now.setHours(0, 0, 0, 0);

	if (id === 'minggu-ini') {
		/* Sunday is the last day of the week. */
		const daysToSunday = (7 - ((now.getDay() + 6) % 7)) - 1;
		const end = new Date(now);
		end.setDate(end.getDate() + daysToSunday);

		return { start: now, end };
	}

	if (id === 'minggu-depan') {
		const start = new Date(now);
		start.setDate(start.getDate() + (7 - ((now.getDay() + 6) % 7)));

		const end = new Date(start);
		end.setDate(end.getDate() + 6);

		return { start, end };
	}

	return null;
}

/** The date as `YYYY-MM-DD`, in the local timezone. */
export function toISODate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${date.getFullYear()}-${month}-${day}`;
}
