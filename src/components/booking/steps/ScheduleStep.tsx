'use client';

import { DatePicker } from '@/components/booking/DatePicker';
import { OptionCard } from '@/components/booking/OptionCard';
import { ARRIVAL_OPTIONS, arrivalRange, toISODate, today } from '@/lib/booking/schedule';
import type { ArrivalPreference, BookingErrors } from '@/lib/booking/types';

/**
 * Step 5 - the arrival.
 *
 * The customer first says how soon it can be done - as soon as possible,
 * this week, next week, or still asking questions. The exact day and the
 * time are then refined for the answers that carry a date.
 *
 * The day is picked from a calendar, never from the native date input: the
 * native control renders the browser's own calendar, which does not look
 * like the rest of the site. The time slots are the opening hours of the
 * chosen branch, and they are a *preference* - AutoSPA publishes no
 * availability calendar, so the team confirms the schedule.
 */
export interface ScheduleStepProps {
	arrival: ArrivalPreference | null;
	date: string;
	time: string;
	slots: string[];
	/** The name of the branch the slots belong to. */
	branchName: string | null;
	onChange: (field: 'arrival' | 'date' | 'time', value: string) => void;
	errors: BookingErrors;
}

export function ScheduleStep({
	arrival,
	date,
	time,
	slots,
	branchName,
	onChange,
	errors,
}: ScheduleStepProps) {
	const range = arrival ? arrivalRange(arrival) : null;
	const needsDate = arrival === 'minggu-ini' || arrival === 'minggu-depan';
	const needsTime = arrival !== null && arrival !== 'konsultasi';
	return (
		<div className="space-y-8">
			<div>
				<p className="text-sm font-medium text-white">
					Kapan Anda ingin datang?<span className="text-primary-500"> *</span>
				</p>

				<div
					role="radiogroup"
					aria-label="Waktu kedatangan"
					aria-invalid={errors.arrival ? true : undefined}
					className="mt-3 grid gap-3 sm:grid-cols-2"
				>
					{ARRIVAL_OPTIONS.map((option) => (
						<OptionCard
							key={option.id}
							name="arrival"
							title={option.title}
							description={option.description}
							selected={arrival === option.id}
							onSelect={() => onChange('arrival', option.id)}
						/>
					))}
				</div>

				{errors.arrival ? (
					<p role="alert" className="mt-2 text-xs text-ns-red">
						{errors.arrival}
					</p>
				) : null}
			</div>

			{arrival === 'konsultasi' ? (
				<p className="rounded-[20px] border border-white/10 bg-background-7 px-5 py-4 text-sm leading-relaxed text-white/55">
					Belum perlu menentukan tanggal. Ceritakan dulu kendaraannya, tim kami akan
					menghubungi Anda untuk memastikan jadwal dan harga akhirnya.
				</p>
			) : null}

			{needsDate || needsTime ? (
				<div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
					{needsDate ? (
						<div className="rounded-[20px] border border-white/10 bg-background-7 p-4 md:p-5">
							<p className="mb-4 text-sm font-medium text-white">
								Tanggal kedatangan<span className="text-primary-500"> *</span>
							</p>

							<DatePicker
								value={date}
								onChange={(value) => onChange('date', value)}
								minDate={range ? toISODate(range.start) : today()}
								maxDate={range ? toISODate(range.end) : undefined}
								error={errors.date}
							/>
						</div>
					) : null}

					{needsTime ? (
						<div>
							<p className="text-sm font-medium text-white">
								Jam kedatangan <span className="text-white/40">(opsional)</span>
							</p>

							<div
								role="radiogroup"
								aria-label="Jam kedatangan"
								aria-invalid={errors.time ? true : undefined}
								className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4"
							>
								{slots.map((slot) => (
									<OptionCard
										key={slot}
										name="time"
										title={slot}
										selected={time === slot}
										onSelect={() => onChange('time', slot)}
									/>
								))}
							</div>

							{errors.time ? (
								<p role="alert" className="mt-2 text-xs text-ns-red">
									{errors.time}
								</p>
							) : null}

							<p className="mt-4 text-xs leading-relaxed text-white/40">
								{branchName
									? `Jam tersebut mengikuti jam buka cabang ${branchName}.`
									: 'Pilih cabang lebih dulu untuk melihat jam bukanya.'}{' '}
								Jam pilihan bersifat preferensi - tim kami yang memastikan slot
								akhirnya.
							</p>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
}
