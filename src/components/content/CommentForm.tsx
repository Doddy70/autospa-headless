'use client';

import { useState } from 'react';

import { CONTACT } from '@/data/contact';

/**
 * The "Leave a Reply" form of the article page.
 *
 * Ported from the Agntix `PostboxDetailsForm`. The WordPress REST API of the
 * origin refuses anonymous comments (`rest_comment_login_required`), and the
 * CMS stays read-only, so the form hands the message to WhatsApp - the
 * channel AutoSPA Jakarta already uses for enquiries - instead of posting it
 * into the CMS.
 */
export default function CommentForm({ articleTitle }: { articleTitle: string }) {
	const [sent, setSent] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();

		const lines = [
			'Halo AutoSPA Jakarta, saya ingin meninggalkan komentar.',
			`Artikel: ${articleTitle}`,
			`Nama: ${name}`,
			`Email: ${email}`,
			'',
			message,
		];

		window.open(
			`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`,
			'_blank',
			'noopener,noreferrer',
		);
		setSent(true);
	};

	const inputClass =
		'w-full rounded-xl border border-white/10 bg-background-8 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary-500 focus:outline-none';

	return (
		<form onSubmit={handleSubmit} className="rounded-[20px] border border-white/10 bg-background-7 p-6 md:p-8">
			<div className="grid gap-5 md:grid-cols-2">
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Nama *</span>
					<input type="text" name="name" required autoComplete="name" placeholder="Nama lengkap" className={inputClass} />
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-white">Email *</span>
					<input type="email" name="email" required autoComplete="email" placeholder="email@contoh.com" className={inputClass} />
				</label>
			</div>

			<label className="mt-5 block">
				<span className="mb-2 block text-sm font-medium text-white">Komentar *</span>
				<textarea
					name="message"
					rows={6}
					required
					placeholder="Tulis komentar Anda di sini..."
					className={`${inputClass} resize-y`}
				/>
			</label>

			<button type="submit" className="btn btn-lg btn-primary mt-7">
				Kirim Komentar
			</button>

			<p className="mt-4 text-xs text-white/40">
				Komentar akan dikirim lewat WhatsApp dan tim kami akan membalasnya.
			</p>

			{sent ? (
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
