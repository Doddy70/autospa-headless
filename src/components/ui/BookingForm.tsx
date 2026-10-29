'use client';

import { useState } from 'react';

import { BRANCHES, CONTACT } from '@/data/contact';
import { SERVICES } from '@/data/services';

/**
 * The booking form.
 *
 * The production `/reservasi` page renders a MetForm widget that comes back
 * empty, so the form is rebuilt here as a native React component.
 *
 * The form has no backend in this phase: submitting hands the request to
 * WhatsApp, which is the channel AutoSPA Jakarta uses for bookings (the
 * production site links to `wa.me/6281937773888` with a pre-filled message).
 * That keeps the staging site read-only against the CMS.
 */
export interface BookingFormProps {
	/** Branch preselected in the dropdown. */
	defaultBranch?: string;
}

export function BookingForm({ defaultBranch }: BookingFormProps) {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = String(data.get('name') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const vehicle = String(data.get('vehicle') ?? '').trim();
		const branch = String(data.get('branch') ?? '').trim();
		const service = String(data.get('service') ?? '').trim();
		const date = String(data.get('date') ?? '').trim();
		const notes = String(data.get('notes') ?? '').trim();

		const lines = [
			'Halo AutoSPA Jakarta, saya ingin reservasi.',
			`Nama: ${name}`,
			`No. HP: ${phone}`,
			`Kendaraan: ${vehicle}`,
			`Cabang: ${branch}`,
			`Layanan: ${service}`,
		];

		if (date) lines.push(`Tanggal rencana: ${date}`);
		if (notes) lines.push(`Catatan: ${notes}`);

		const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;

		window.open(url, '_blank', 'noopener,noreferrer');
		setSubmitted(true);
	};

	const inputClass =
		'w-full rounded-xl border border-white/10 bg-background-8 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary-500 focus:outline-none';

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-[20px] border border-white/10 bg-background-7 p-6 md:p-8"
		>
			<div className="grid gap-5 md:grid-cols-2">
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Nama</span>
					<input
						type="text"
						name="name"
						required
						autoComplete="name"
						placeholder="Nama lengkap"
						className={inputClass}
					/>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Nomor HP</span>
					<input
						type="tel"
						name="phone"
						required
						autoComplete="tel"
						placeholder="08xx xxxx xxxx"
						className={inputClass}
					/>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Kendaraan</span>
					<input
						type="text"
						name="vehicle"
						required
						placeholder="Merk dan tipe kendaraan"
						className={inputClass}
					/>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Cabang</span>
					<select name="branch" defaultValue={defaultBranch ?? ''} className={inputClass}>
						<option value="">Pilih cabang</option>
						{BRANCHES.map((branch) => (
							<option key={branch.slug} value={branch.name}>
								{branch.name}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Layanan</span>
					<select name="service" className={inputClass}>
						<option value="">Pilih layanan</option>
						{SERVICES.map((service) => (
							<option key={service.slug} value={service.title}>
								{service.title}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Tanggal rencana</span>
					<input type="date" name="date" className={inputClass} />
				</label>

				<label className="block md:col-span-2">
					<span className="mb-2 block text-sm font-medium text-white">Catatan</span>
					<textarea
						name="notes"
						rows={4}
						placeholder="Kondisi kendaraan, permintaan khusus, atau hal lain yang perlu kami ketahui"
						className={`${inputClass} resize-y`}
					/>
				</label>
			</div>

			<button type="submit" className="btn btn-lg btn-primary mt-8 w-full">
				Kirim Reservasi via WhatsApp
			</button>

			<p className="mt-4 text-center text-xs text-white/40">
				Form ini membuka WhatsApp dengan detail reservasi Anda. Tim kami akan membalas
				untuk memastikan jadwal.
			</p>

			{submitted ? (
				<p
					role="status"
					className="mt-4 rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-center text-sm text-primary-500"
				>
					WhatsApp terbuka. Jika tidak terbuka, hubungi kami di {CONTACT.phone}.
				</p>
			) : null}
		</form>
	);
}
