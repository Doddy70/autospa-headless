'use client';

import { cn } from '@/utils/cn';

/**
 * The progress bar of the wizard.
 *
 * It shows every step of the flow. A step that is skipped in the current
 * flow - the vehicle step for a service that is not cut per model - keeps
 * its number and is marked as skipped, so the numbering of the steps never
 * changes under the customer.
 */
export interface StepProgressProps {
	/** The steps of the flow, in order. */
	steps: { id: string; label: string }[];
	/** The index of the step that is shown. */
	current: number;
	/** The ids of the steps that are skipped in this flow. */
	skipped?: string[];
	className?: string;
}

export function StepProgress({ steps, current, skipped = [], className }: StepProgressProps) {
	const total = steps.length;
	const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

	return (
		<div className={className}>
			<div className="flex items-center justify-between gap-4">
				<p className="text-xs font-semibold tracking-[0.2em] text-primary-400 uppercase">
					Langkah {current + 1} dari {total}
				</p>
				<p className="text-xs text-white/40">{steps[current]?.label}</p>
			</div>

			<div
				role="progressbar"
				aria-valuemin={1}
				aria-valuemax={total}
				aria-valuenow={current + 1}
				aria-label="Kemajuan pengisian booking"
				className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
			>
				<div
					className="h-full rounded-full bg-gradient-1 transition-[width] duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>

			{/* The dots of the steps - a quick way to see where the customer is. */}
			<ol className="mt-4 hidden items-center gap-2 md:flex">
				{steps.map((step, index) => {
					const isSkipped = skipped.includes(step.id);

					return (
						<li key={step.id} className="flex flex-1 items-center gap-2">
							<span
								className={cn(
									'flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors',
									index < current && 'border-primary-500 bg-primary-500 text-white',
									index === current && 'border-primary-500 text-primary-400',
									index > current && 'border-white/15 text-white/40',
									isSkipped && 'border-dashed border-white/15 text-white/25 line-through',
								)}
							>
								{index + 1}
							</span>
							<span
								className={cn(
									'truncate text-xs transition-colors',
									index === current ? 'text-white' : 'text-white/40',
									isSkipped && 'text-white/25 line-through',
								)}
							>
								{step.label}
							</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
