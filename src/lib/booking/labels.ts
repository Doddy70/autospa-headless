/**
 * The labels that stand for a reservation.
 *
 * Every call to action of the site that carries one of these labels opens
 * the reservation dialog instead of leading to a page. The helper keeps that
 * rule in one place, so a new component does not have to decide for itself
 * whether its button is a booking or not.
 */

/** The words that mark a call to action as a booking. */
const BOOKING_LABEL = /\b(book|booking|reservasi|appointment)\b/i;

/**
 * Whether a label asks for a reservation.
 *
 * "Book Sekarang", "Book Now", "Reservasi" and "Book an Appointment" are
 * bookings; "Cek harga" and "Hubungi Kami" are not.
 */
export function isBookingLabel(label: string): boolean {
	return BOOKING_LABEL.test(label.trim());
}
