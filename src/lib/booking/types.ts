/**
 * Booking domain types for the AutoSPA service booking wizard.
 *
 * The wizard collects everything a Service Advisor needs before the vehicle
 * arrives: which service, which branch, how big the vehicle is, which vehicle
 * it is, when the customer wants to come and who they are.
 *
 * There is no booking API behind this yet - the collected data is handed over
 * to WhatsApp, the channel AutoSPA Jakarta uses for reservations. The types
 * therefore describe a *request*, never a confirmed reservation.
 */

/** The steps of the wizard, in the order they are shown. */
export type StepId =
	| 'service'
	| 'location'
	| 'carSize'
	| 'vehicle'
	| 'schedule'
	| 'customer'
	| 'review';

/** The id of a vehicle size category. */
export type CarSizeId = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * How soon the customer wants to come.
 *
 * The service advisor needs the urgency first - a customer that says "as
 * soon as possible" is planned into the week differently from one that says
 * "next week".
 */
export type ArrivalPreference = 'asap' | 'minggu-ini' | 'minggu-depan' | 'konsultasi';

/** Everything the customer picked and typed, step by step. */
export interface BookingState {
	/** Slug of the chosen service, from the service catalogue. */
	serviceSlug: string | null;
	/** Slug of the chosen branch, from the branch directory. */
	locationSlug: string | null;
	/** The vehicle size category. */
	carSizeId: CarSizeId | null;
	/** How soon the customer wants to come. */
	arrival: ArrivalPreference | null;
	vehicleBrand: string;
	/** The typed make, when the customer picked "Lainnya". */
	vehicleBrandOther: string;
	vehicleModel: string;
	vehicleYear: string;
	/** Preferred date, `YYYY-MM-DD`. */
	date: string;
	/** Preferred time slot, `HH:MM`. */
	time: string;
	customerName: string;
	customerPhone: string;
	customerNotes: string;
}

/** A field key of the wizard - the errors of a step are keyed by it. */
export type BookingField =
	| 'serviceSlug'
	| 'locationSlug'
	| 'carSizeId'
	| 'arrival'
	| 'vehicleBrand'
	| 'vehicleModel'
	| 'vehicleYear'
	| 'date'
	| 'time'
	| 'customerName'
	| 'customerPhone';

/** Field name -> error message. An empty object means the step is valid. */
export type BookingErrors = Partial<Record<BookingField, string>>;

/** The state of the wizard, empty. */
export const EMPTY_BOOKING: BookingState = {
	serviceSlug: null,
	locationSlug: null,
	carSizeId: null,
	arrival: null,
	vehicleBrand: '',
	vehicleBrandOther: '',
	vehicleModel: '',
	vehicleYear: '',
	date: '',
	time: '',
	customerName: '',
	customerPhone: '',
	customerNotes: '',
};

/**
 * The services that are cut per vehicle model.
 *
 * A paint protection film and a ceramic coating are applied panel by panel
 * from a template of the exact model, so the customer has to tell us which
 * vehicle is coming. A wash, a detailing or an underbody treatment does not
 * need that information, so the step is skipped for them.
 */
export const MODEL_SPECIFIC_SERVICES = ['premium-360-ppf', 'premium-coating'];
