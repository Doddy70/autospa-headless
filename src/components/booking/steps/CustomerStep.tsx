'use client';

import { TextArea, TextInput } from '@/components/booking/fields';
import type { BookingErrors } from '@/lib/booking/types';

/**
 * Step 6 - the customer.
 *
 * The phone number is the channel the booking goes through, so it is the one
 * field that is validated strictly.
 */
export interface CustomerStepProps {
	name: string;
	phone: string;
	notes: string;
	/* The field names are the keys of the booking state, so the step can
	   hand a change straight to it. */
	onChange: (
		field: 'customerName' | 'customerPhone' | 'customerNotes',
		value: string,
	) => void;
	errors: BookingErrors;
}

export function CustomerStep({ name, phone, notes, onChange, errors }: CustomerStepProps) {
	return (
		<div className="grid gap-5 md:grid-cols-2">
			<TextInput
				label="Nama"
				id="booking-name"
				value={name}
				error={errors.customerName}
				autoComplete="name"
				placeholder="Nama lengkap"
				required
				onChange={(event) => onChange('customerName', event.target.value)}
			/>

			<TextInput
				label="Nomor WhatsApp"
				id="booking-phone"
				type="tel"
				inputMode="tel"
				value={phone}
				error={errors.customerPhone}
				autoComplete="tel"
				placeholder="0812 3456 7890"
				required
				onChange={(event) => onChange('customerPhone', event.target.value)}
				hint="Nomor yang akan kami hubungi untuk memastikan jadwal."
			/>

			<TextArea
				label="Catatan (opsional)"
				id="booking-notes"
				value={notes}
				rows={5}
				placeholder="Kondisi kendaraan, permintaan khusus, atau hal lain yang perlu kami ketahui"
				onChange={(event) => onChange('customerNotes', event.target.value)}
				className="md:col-span-2"
			/>
		</div>
	);
}
