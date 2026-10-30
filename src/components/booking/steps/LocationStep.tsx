'use client';

import { OptionCard } from '@/components/booking/OptionCard';
import { BRANCHES } from '@/data/contact';

/**
 * Step 2 - the branch.
 *
 * The branches are the ones the production contact page publishes, so the
 * customer always picks a location AutoSPA really has.
 */
export interface LocationStepProps {
	value: string | null;
	onChange: (slug: string) => void;
	error?: string | undefined;
}

export function LocationStep({ value, onChange, error }: LocationStepProps) {
	return (
		<div
			role="radiogroup"
			aria-label="Cabang yang dipilih"
			aria-invalid={error ? true : undefined}
			className="grid gap-4 sm:grid-cols-2"
		>
			{BRANCHES.map((branch) => (
				<OptionCard
					key={branch.slug}
					name="location"
					title={branch.name}
					description={branch.address ?? 'Alamat lengkap tersedia di halaman cabang.'}
					meta={`${branch.hours} · ${branch.phones[0] ?? ''}`}
					selected={value === branch.slug}
					onSelect={() => onChange(branch.slug)}
				/>
			))}

			{error ? (
				<p role="alert" className="text-xs text-ns-red sm:col-span-2">
					{error}
				</p>
			) : null}
		</div>
	);
}
