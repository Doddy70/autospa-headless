'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/utils/cn';

/**
 * The date picker of the arrival step.
 *
 * A calendar instead of the native date input: the native control renders
 * the browser's own calendar, which does not look like the rest of the
 * site and cannot be styled. The picker shows the month as a grid, marks
 * the days that are already past, and hands the chosen day back as
 * `YYYY-MM-DD`.
 */

/** The weekdays, starting on Monday. */
const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

/** The date as `YYYY-MM-DD`, in the local timezone. */
function toISO(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${date.getFullYear()}-${month}-${day}`;
}

/** The date of a `YYYY-MM-DD` string, at midnight. */
function fromISO(value: string): Date | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime()) ? null : date;
}

export interface DatePickerProps {
	/** The chosen day, `YYYY-MM-DD`. */
	value: string;
	onChange: (value: string) => void;
	/** The first day that can be chosen. Defaults to today. */
	minDate?: string;
	/** The last day that can be chosen. */
	maxDate?: string;
	error?: string | undefined;
}

export function DatePicker({ value, onChange, minDate, maxDate, error }: DatePickerProps) {
	const today = useMemo(() => new Date(), []);

	const minimum = useMemo(() => {
		const parsed = minDate ? fromISO(minDate) : null;
		if (!parsed) return today;

		parsed.setHours(0, 0, 0, 0);
		return parsed;
	}, [minDate, today]);

	const maximum = useMemo(() => {
		const parsed = maxDate ? fromISO(maxDate) : null;
		if (!parsed) return null;

		parsed.setHours(23, 59, 59, 999);
		return parsed;
	}, [maxDate]);

	const selected = useMemo(() => fromISO(value), [value]);

	/* The month that is on screen. It follows the chosen day, and stays
	   where it is when the customer picks another day of the same month. */
	const [month, setMonth] = useState<Date>(() => {
		const base = selected ?? minimum;
		return new Date(base.getFullYear(), base.getMonth(), 1);
	});

	const days = useMemo(() => {
		const first = new Date(month.getFullYear(), month.getMonth(), 1);

		/* Monday is the first day of the week in Indonesia. */
		const offset = (first.getDay() + 6) % 7;
		const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

		return Array.from({ length: offset + total }, (_, index) => {
			const day = index - offset + 1;

			if (day < 1) return null;

			return new Date(month.getFullYear(), month.getMonth(), day);
		});
	}, [month]);

	const isPast = (date: Date) => date.getTime() < minimum.getTime();
	const isTooLate = (date: Date) => maximum !== null && date.getTime() > maximum.getTime();

	return (
		<div>
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() =>
						setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
					}
					aria-label="Bulan sebelumnya"
					className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-primary-500 hover:text-primary-400"
				>
					<ChevronLeft className="size-4" aria-hidden="true" />
				</button>

				<p className="text-sm font-bold text-white">
					{month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
				</p>

				<button
					type="button"
					onClick={() =>
						setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
					}
					aria-label="Bulan berikutnya"
					className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-primary-500 hover:text-primary-400"
				>
					<ChevronRight className="size-4" aria-hidden="true" />
				</button>
			</div>

			<div className="mt-4 grid grid-cols-7 gap-1 text-center">
				{WEEKDAYS.map((day) => (
					<div
						key={day}
						className="py-1 text-[11px] font-semibold tracking-wide text-white/35 uppercase"
					>
						{day}
					</div>
				))}

				{days.map((date, index) => {
					if (!date) return <div key={`empty-${index}`} aria-hidden="true" />;

					const iso = toISO(date);
					const disabled = isPast(date) || isTooLate(date);
					const isSelected = iso === value;

					return (
						<button
							key={iso}
							type="button"
							disabled={disabled}
							onClick={() => onChange(iso)}
							aria-pressed={isSelected}
							className={cn(
								'flex aspect-square items-center justify-center rounded-xl text-sm transition-colors',
								disabled && 'cursor-not-allowed text-white/15',
								!disabled && !isSelected && 'text-white/70 hover:bg-white/5 hover:text-white',
								isSelected && 'bg-primary-500 font-bold text-white',
							)}
						>
							{date.getDate()}
						</button>
					);
				})}
			</div>

			<div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
				<button
					type="button"
					disabled={maximum !== null && maximum.getTime() < minimum.getTime()}
					onClick={() => {
						onChange(toISO(minimum));
						setMonth(new Date(minimum.getFullYear(), minimum.getMonth(), 1));
					}}
					className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
				>
					Hari ini
				</button>

				<p className="text-xs text-white/40">
					{selected
						? selected.toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})
						: 'Pilih tanggal kedatangan'}
				</p>
			</div>

			{error ? (
				<p role="alert" className="mt-3 text-xs text-ns-red">
					{error}
				</p>
			) : null}
		</div>
	);
}
