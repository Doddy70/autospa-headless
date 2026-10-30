'use client';

import { OptionCard } from '@/components/booking/OptionCard';
import type { ServiceCard } from '@/lib/services/types';

/**
 * Step 1 - the service.
 *
 * The rows come from the service catalogue, so the wizard offers exactly the
 * services the site publishes. The photo of a service is optional: the
 * catalogue falls back to a static card when WordPress cannot answer.
 */
export interface ServiceStepProps {
	services: ServiceCard[];
	value: string | null;
	onChange: (slug: string) => void;
	error?: string | undefined;
}

export function ServiceStep({ services, value, onChange, error }: ServiceStepProps) {
	return (
		<div
			role="radiogroup"
			aria-label="Layanan yang dipilih"
			aria-invalid={error ? true : undefined}
			className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
		>
			{services.map((service) => (
				<OptionCard
					key={service.slug}
					name="service"
					title={service.title}
					description={service.subtitle}
					image={service.image}
					imageAlt={service.alt}
					badge={service.number ?? undefined}
					selected={value === service.slug}
					onSelect={() => onChange(service.slug)}
				/>
			))}

			{error ? (
				<p role="alert" className="text-xs text-ns-red sm:col-span-2 lg:col-span-3">
					{error}
				</p>
			) : null}
		</div>
	);
}
