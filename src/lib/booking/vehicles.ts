/**
 * Vehicle categories and the makes that are common on the AutoSPA customer
 * list.
 *
 * The size categories are not invented: they follow what the published
 * services actually depend on. A Premium Wash is quoted at 30-60 minutes and
 * a Full Detailing at 4-7 hours "depending on the condition of the car", so
 * the area the technician has to cover - and with it the time of the visit -
 * grows with the footprint of the vehicle.
 *
 * The durations quoted below are the ones published on the service pages.
 * Nothing here promises a finish time that AutoSPA does not publish.
 */

import type { CarSizeId } from './types';

export interface CarSize {
	id: CarSizeId;
	/** Short title shown on the card. */
	title: string;
	/** One line describing the class of vehicle. */
	description: string;
	/** Example vehicles, so the customer recognises their own car. */
	examples: string[];
	/** The published duration of the services, for this size. */
	durationNote: string;
}

export const CAR_SIZES: CarSize[] = [
	{
		id: 'small',
		title: 'Small',
		description: 'Mobil kota dan hatchback kecil, di bawah 4,3 meter.',
		examples: ['Honda Brio', 'Daihatsu Xenia', 'Toyota Agya', 'Suzuki Swift'],
		durationNote: 'Premium Wash 30-60 menit, sesuai durasi yang dipublikasikan.',
	},
	{
		id: 'medium',
		title: 'Medium',
		description: 'Sedan, hatchback besar dan SUV compact, 4,3 sampai 4,8 meter.',
		examples: ['Toyota Avanza', 'Honda Brio/RS', 'Mitsubishi Xpander', 'Suzuki Ignis'],
		durationNote: 'Premium Wash 30-60 menit, sesuai durasi yang dipublikasikan.',
	},
	{
		id: 'large',
		title: 'Large',
		description: 'SUV besar dan MPV 7 penumpang, di atas 4,8 meter.',
		examples: ['Toyota Fortuner', 'Mitsubishi Pajero Sport', 'Toyota Kijang Innova'],
		durationNote: 'Full Detailing 4-7 jam, sesuai durasi yang dipublikasikan.',
	},
	{
		id: 'xlarge',
		title: 'XL',
		description: 'Van, busana dan MPV premium dengan area kabin terbesar.',
		examples: ['Toyota Hiace', 'Toyota Alphard', 'Mitsubishi Pajero Sport'],
		durationNote: 'Full Detailing 4-7 jam, sesuai durasi yang dipublikasikan.',
	},
];

export function getCarSize(id: CarSizeId | null): CarSize | null {
	if (!id) return null;
	return CAR_SIZES.find((size) => size.id === id) ?? null;
}

/**
 * The makes that show up the most on the AutoSPA customer list.
 *
 * The list is a convenience, not a restriction: "Lainnya" always lets the
 * customer type their own make.
 */
export const VEHICLE_BRANDS = [
	'Toyota',
	'Honda',
	'Daihatsu',
	'Suzuki',
	'Mitsubishi',
	'Nissan',
	'Mazda',
	'Subaru',
	'Hyundai',
	'Kia',
	'BMW',
	'Mercedes-Benz',
	'Audi',
	'Volkswagen',
	'Lexus',
	'Chery',
	'Wuling',
	'Lainnya',
];

/** The label of the free-text brand option. */
export const OTHER_BRAND = 'Lainnya';

/** The first model year that can still be booked. */
export const EARLIEST_VEHICLE_YEAR = 1990;

/**
 * The model years a vehicle can have, newest first.
 *
 * The list is generated at render time so it never goes stale; the helper is
 * exported for the tests and for the server side.
 */
export function vehicleYears(currentYear = new Date().getFullYear()): string[] {
	const years: string[] = [];

	for (let year = currentYear + 1; year >= EARLIEST_VEHICLE_YEAR; year -= 1) {
		years.push(String(year));
	}

	return years;
}
