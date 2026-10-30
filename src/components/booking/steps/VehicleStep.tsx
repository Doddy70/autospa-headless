'use client';

import { Select, TextInput } from '@/components/booking/fields';
import { OTHER_BRAND, VEHICLE_BRANDS, vehicleYears } from '@/lib/booking/vehicles';
import type { BookingErrors } from '@/lib/booking/types';

/**
 * Step 4 - the vehicle.
 *
 * This step only appears for the services that are cut per model: a paint
 * protection film and a ceramic coating are applied from a template of the
 * exact vehicle. For the other services the wizard skips it.
 */
export interface VehicleStepProps {
	brand: string;
	brandOther: string;
	model: string;
	year: string;
	/* The field names are the keys of the booking state, so the step can
	   hand a change straight to it. */
	onChange: (
		field: 'vehicleBrand' | 'vehicleBrandOther' | 'vehicleModel' | 'vehicleYear',
		value: string,
	) => void;
	errors: BookingErrors;
}

export function VehicleStep({
	brand,
	brandOther,
	model,
	year,
	onChange,
	errors,
}: VehicleStepProps) {
	const years = vehicleYears();

	return (
		<div className="grid gap-5 md:grid-cols-2">
			<Select
				label="Merek kendaraan"
				id="booking-vehicle-brand"
				value={brand}
				error={errors.vehicleBrand}
				required
				onChange={(event) => onChange('vehicleBrand', event.target.value)}
			>
				<option value="">Pilih merek</option>
				{VEHICLE_BRANDS.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</Select>

			{brand === OTHER_BRAND ? (
				<TextInput
					label="Tuliskan merek"
					id="booking-vehicle-brand-other"
					value={brandOther}
					placeholder="Contoh: Proton"
					required
					onChange={(event) => onChange('vehicleBrandOther', event.target.value)}
				/>
			) : (
				<TextInput
					label="Tipe kendaraan"
					id="booking-vehicle-model"
					value={model}
					error={errors.vehicleModel}
					placeholder="Contoh: Fortuner 2.4 VRZ"
					required
					onChange={(event) => onChange('vehicleModel', event.target.value)}
				/>
			)}

			{brand === OTHER_BRAND ? (
				<TextInput
					label="Tipe kendaraan"
					id="booking-vehicle-model"
					value={model}
					error={errors.vehicleModel}
					placeholder="Contoh: Saga 1.3"
					required
					onChange={(event) => onChange('vehicleModel', event.target.value)}
				/>
			) : null}

			<Select
				label="Tahun kendaraan"
				id="booking-vehicle-year"
				value={year}
				error={errors.vehicleYear}
				required
				onChange={(event) => onChange('vehicleYear', event.target.value)}
			>
				<option value="">Pilih tahun</option>
				{years.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</Select>

			<p className="text-xs leading-relaxed text-white/40 md:col-span-2">
				Untuk paint protection film dan nano ceramic coating, kami memakai template panel
				sesuai model kendaraan. Karena itu data ini kami perlukan untuk layanan tersebut.
			</p>
		</div>
	);
}
