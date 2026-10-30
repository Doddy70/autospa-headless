'use client';

import { OptionCard } from '@/components/booking/OptionCard';
import { CAR_SIZES } from '@/lib/booking/vehicles';
import type { CarSizeId } from '@/lib/booking/types';

/**
 * Step 3 - the size of the vehicle.
 *
 * The categories are the ones the service pages depend on: the published
 * durations of a Premium Wash (30-60 minutes) and a Full Detailing (4-7
 * hours) both scale with the size of the vehicle, so the technician can
 * reserve the right amount of time.
 */
export interface CarSizeStepProps {
	value: CarSizeId | null;
	onChange: (id: CarSizeId) => void;
	error?: string | undefined;
}

export function CarSizeStep({ value, onChange, error }: CarSizeStepProps) {
	return (
		<div
			role="radiogroup"
			aria-label="Ukuran kendaraan"
			aria-invalid={error ? true : undefined}
			className="grid gap-4 sm:grid-cols-2"
		>
			{CAR_SIZES.map((size) => (
				<OptionCard
					key={size.id}
					name="carSize"
					title={size.title}
					description={size.description}
					meta={`Contoh: ${size.examples.join(', ')}`}
					selected={value === size.id}
					onSelect={() => onChange(size.id)}
				>
					<p className="text-xs text-white/40">{size.durationNote}</p>
				</OptionCard>
			))}

			{error ? (
				<p role="alert" className="text-xs text-ns-red sm:col-span-2">
					{error}
				</p>
			) : null}
		</div>
	);
}
