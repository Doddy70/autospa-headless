'use client';

import { Pencil } from 'lucide-react';

import type { ResolvedBooking } from '@/lib/booking/summary';

/**
 * Step 7 - the review.
 *
 * Everything the customer picked is listed once, with a button per row to go
 * back and change it. The reference number is shown, but nothing here says
 * the booking is confirmed - the team confirms it on WhatsApp.
 */
export interface ReviewStepProps {
	booking: ResolvedBooking;
	/** The label of the step a row belongs to, and the step to go back to. */
	steps: { id: string; label: string }[];
	onEdit: (stepId: string) => void;
}

export function ReviewStep({ booking, steps, onEdit }: ReviewStepProps) {
	const rowStep: Record<string, string> = {
		Layanan: 'service',
		Cabang: 'location',
		'Ukuran kendaraan': 'carSize',
		Kendaraan: 'vehicle',
		Jadwal: 'schedule',
	};

	return (
		<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<div className="rounded-[20px] border border-white/10 bg-background-7 p-5 md:p-6">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
					<div>
						<p className="text-xs tracking-[0.2em] text-white/40 uppercase">Ringkasan booking</p>
						<p className="mt-1 text-lg font-bold text-white">{booking.reference}</p>
					</div>
				</div>

				<dl className="mt-4 divide-y divide-white/10">
					{booking.rows.map((row) => (
						<div key={row.label} className="flex items-start gap-4 py-3">
							<dt className="w-36 shrink-0 text-sm text-white/45">{row.label}</dt>
							<dd className="flex-1 text-sm font-medium text-white">{row.value}</dd>
							{rowStep[row.label] ? (
								<button
									type="button"
									onClick={() => onEdit(rowStep[row.label] as string)}
									className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-colors hover:border-primary-500 hover:text-primary-400"
								>
									<Pencil className="size-3" aria-hidden="true" />
									Ubah
								</button>
							) : null}
						</div>
					))}

					<div className="flex items-start gap-4 py-3">
						<dt className="w-36 shrink-0 text-sm text-white/45">Nama</dt>
						<dd className="flex-1 text-sm font-medium text-white">{booking.customerName}</dd>
					</div>

					<div className="flex items-start gap-4 py-3">
						<dt className="w-36 shrink-0 text-sm text-white/45">No. WhatsApp</dt>
						<dd className="flex-1 text-sm font-medium text-white">{booking.customerPhone}</dd>
					</div>

					{booking.notes ? (
						<div className="flex items-start gap-4 py-3">
							<dt className="w-36 shrink-0 text-sm text-white/45">Catatan</dt>
							<dd className="flex-1 text-sm leading-relaxed text-white/80">{booking.notes}</dd>
						</div>
					) : null}
				</dl>
			</div>

			<aside className="rounded-[20px] border border-primary-500/25 bg-primary-500/5 p-5 md:p-6">
				<h3 className="text-lg font-bold text-white">Bagaimana selanjutnya?</h3>
				<p className="mt-2 text-sm leading-relaxed text-white/60">
					Ringkasan ini dikirim ke tim AutoSPA lewat WhatsApp. Tim kami akan membalas untuk
					konfirmasi jadwal, paket, dan harga akhir.
				</p>

				<p className="mt-4 rounded-xl border border-white/10 bg-background-8 px-4 py-3 text-xs leading-relaxed text-white/50">
					Booking ini <strong className="text-white/80">belum dikonfirmasi</strong>. Jadwal yang
					Anda pilih adalah preferensi, dan baru berlaku setelah tim kami membalas.
				</p>

				<ul className="mt-4 space-y-2 text-sm text-white/55">
					{steps.map((step) => (
						<li key={step.id} className="flex items-center gap-2">
							<span className="size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
							{step.label}
						</li>
					))}
				</ul>
			</aside>
		</div>
	);
}
