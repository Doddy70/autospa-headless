/**
 * Validation of the booking wizard.
 *
 * Every step is validated on its own, so the "Next" button can be blocked
 * with a reason instead of failing at the end. The rules are deliberately
 * close to what the team asks for on WhatsApp anyway.
 */

import { arrivalRange } from './schedule';
import { getCarSize, OTHER_BRAND } from './vehicles';
import type { BookingErrors, BookingState, StepId } from './types';

/**
 * A phone number a Service Advisor can call back.
 *
 * Indonesian numbers are written with a leading zero (08...) or in the
 * international format (+62... / 62...); both are accepted, and the number of
 * digits is checked so a typo cannot reach the team.
 */
export function isValidPhone(value: string): boolean {
	const digits = value.replace(/[\s().-]/g, '');

	if (!/^(\+?62|0)\d{8,14}$/.test(digits)) return false;

	return digits.replace(/\D/g, '').length >= 10;
}

/** The phone number in the international format used by wa.me links. */
export function toInternationalPhone(value: string): string {
	const digits = value.replace(/\D/g, '');

	if (digits.startsWith('62')) return digits;
	if (digits.startsWith('0')) return `62${digits.slice(1)}`;
	if (digits.startsWith('8')) return `62${digits}`;

	return digits;
}

/**
 * The errors of one step.
 *
 * Returns an empty object when the step is complete.
 */
export function validateStep(step: StepId, state: BookingState): BookingErrors {
	const errors: BookingErrors = {};

	switch (step) {
		case 'service':
			if (!state.serviceSlug) errors.serviceSlug = 'Pilih layanan yang ingin dipesan.';
			break;

		case 'location':
			if (!state.locationSlug) errors.locationSlug = 'Pilih cabang AutoSPA terdekat.';
			break;

		case 'carSize':
			if (!state.carSizeId || !getCarSize(state.carSizeId)) {
				errors.carSizeId = 'Pilih ukuran kendaraan Anda.';
			}
			break;

		case 'vehicle':
			if (!state.vehicleBrand) {
				errors.vehicleBrand = 'Pilih merek kendaraan.';
			} else if (state.vehicleBrand === OTHER_BRAND && !state.vehicleBrandOther.trim()) {
				errors.vehicleBrand = 'Tuliskan merek kendaraan Anda.';
			}
			if (!state.vehicleModel.trim()) {
				errors.vehicleModel = 'Tuliskan tipe kendaraan, misalnya Fortuner.';
			}
			if (!state.vehicleYear) errors.vehicleYear = 'Pilih tahun kendaraan.';
			break;

		case 'schedule': {
			if (!state.arrival) {
				errors.arrival = 'Pilih kapan Anda ingin datang.';
				break;
			}

			/* A customer that is still asking questions does not pick a day
			   yet - there is nothing to confirm. */
			if (state.arrival === 'konsultasi') break;

			/* Only the answers that carry a day need one. "As soon as
			   possible" is handled by the branch - the customer is called
			   back. */
			if (state.arrival === 'minggu-ini' || state.arrival === 'minggu-depan') {
				if (!state.date) {
					errors.date = 'Pilih tanggal kedatangan.';
					break;
				}

				const range = arrivalRange(state.arrival);
				const chosen = new Date(`${state.date}T00:00:00`);

				if (!range || Number.isNaN(chosen.getTime())) {
					errors.date = 'Tanggal tidak valid.';
					break;
				}

				if (chosen < range.start || chosen > range.end) {
					errors.date =
						state.arrival === 'minggu-ini'
							? 'Tanggal harus masih dalam minggu ini.'
							: 'Tanggal harus dalam minggu depan.';
					break;
				}
			}

			/* The time is a preference, not a condition: the branch proposes
			   the final slot. */
			break;
		}

		case 'customer':
			if (state.customerName.trim().length < 2) {
				errors.customerName = 'Tuliskan nama Anda.';
			}
			if (!isValidPhone(state.customerPhone)) {
				errors.customerPhone = 'Masukkan nomor WhatsApp yang bisa dihubungi, contoh 0812 3456 7890.';
			}
			break;

		case 'review':
			break;
	}

	return errors;
}

/** Whether a step is complete. */
export function isStepValid(step: StepId, state: BookingState): boolean {
	return Object.keys(validateStep(step, state)).length === 0;
}
