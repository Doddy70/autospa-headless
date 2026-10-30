'use client';

/**
 * AutoSPA Beauty Care popout.
 *
 * The Beauty Care program is a free vehicle assessment in the workshop: the
 * customer gets the condition of the car checked, the findings explained and a
 * recommendation based on what was actually found. The program is described in
 * the printed customer assessment report:
 *
 *   CHECK -> ASSESS -> RECOMMEND -> EDUCATE
 *   "Kenali kondisi mobil. Pahami kebutuhannya. Rawat dengan tepat."
 *
 * The layout follows the care-program popout of bengkelwiguna.com: a white
 * card with the campaign image on top, two benefit blocks, a row of facts, the
 * program name, the call to action and a "Tutup" footer.
 *
 * The popout has no backend of its own: submitting hands the details to
 * WhatsApp, the channel AutoSPA Jakarta uses for bookings.
 */

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
	CalendarDays,
	Clock,
	Gauge,
	Gift,
	MapPin,
	MessageCircle,
	Sparkles,
	Wrench,
	X,
} from 'lucide-react';

import { POPUP_CONFIG } from '@/config/popup';
import { usePopup } from '@/context/PopupContext';
import { BRANCHES, CONTACT, whatsappLink } from '@/data/contact';

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** What the visitor gets, in the words of the assessment report. */
const BENEFITS = [
	{
		icon: Gift,
		title: '🎁 GRATIS OZONIZER TREATMENT',
		description:
			'Treatment complimentary di akhir pemeriksaan, dicatat terpisah dari hasil assessment.',
		tone: 'amber' as const,
	},
	{
		icon: Wrench,
		title: '🔧 GRATIS GENERAL CHECK',
		description:
			'Pemeriksaan menyeluruh pada enam area kendaraan - body, glass, engine bay, interior, window film, dan wheel - beserta rekomendasi perawatan yang sesuai.',
		tone: 'blue' as const,
	},
];

/** The four steps of the program, as printed on the assessment report. */
const STEPS = ['Check', 'Assess', 'Recommend', 'Educate'];

/** The six areas the assessment covers. */
const AREAS = ['Body', 'Glass', 'Engine Bay', 'Interior', 'Window Film', 'Wheel & Tyre'];

/** The facts of the program. */
const FACTS = [
	{ icon: Sparkles, label: 'Gratis', tone: 'amber' as const },
	{ icon: Gauge, label: '6 area pemeriksaan', tone: 'gray' as const },
	{ icon: Clock, label: 'Setiap hari 08.00–18.00', tone: 'gray' as const },
	{ icon: CalendarDays, label: `${BRANCHES.length} cabang`, tone: 'gray' as const },
];

export default function BeautyCarePopup() {
	const { enabled, isOpen, open, close } = usePopup();
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();
	const [submitted, setSubmitted] = useState(false);

	const overlayRef = useRef<HTMLDivElement>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);

	const isHome = pathname === '/';

	// Open the popout as soon as the homepage is ready. It is part of the
	// homepage, not a reminder that arrives later, so the delay in
	// `POPUP_CONFIG` is `0` by default.
	//
	// `DOMContentLoaded` and not `load`: the homepage loads videos and images,
	// and `load` waits for all of them - the popout would then appear half a
	// minute late.
	useEffect(() => {
		if (!enabled || !isHome) return;

		let timer = 0;

		const arm = () => {
			timer = window.setTimeout(() => {
				if (window.scrollY > 200) return;

				open();
			}, POPUP_CONFIG.delayMs);
		};

		if (document.readyState === 'loading') {
			// The timer waits for the document, but not forever: a resource
			// that never finishes loading must not keep the popout away.
			document.addEventListener('DOMContentLoaded', arm, { once: true });

			const fallback = window.setTimeout(arm, POPUP_CONFIG.delayMs + 1500);

			return () => {
				window.clearTimeout(timer);
				window.clearTimeout(fallback);
				document.removeEventListener('DOMContentLoaded', arm);
			};
		}

		arm();

		return () => {
			window.clearTimeout(timer);
		};
	}, [enabled, isHome, open]);

	// The popout is never closed on its own: the visitor closes it with the
	// X, with the "Tutup" footer or with the bell in the header. There is no
	// backdrop click and no Escape shortcut, so a half-filled form is never
	// thrown away.
	useEffect(() => {
		if (!isOpen) return;

		const overlay = overlayRef.current;
		const previouslyFocused = document.activeElement as HTMLElement | null;

		// Lock the scroll without moving the layout: the width of the
		// scrollbar is given back as padding.
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		const previousPadding = document.body.style.paddingRight;

		document.body.style.paddingRight = `${scrollbar}px`;
		document.body.classList.add('overflow-hidden');

		// Everything behind the dialog is inert.
		//
		// The header is the exception: the bell in it is the switch that turns
		// the popout off while it is on screen. An inert element cannot be
		// clicked, so the header has to stay interactive - the trap of the tab
		// key keeps the keyboard inside the dialog anyway.
		const inerted: HTMLElement[] = [];
		const header = document.querySelector<HTMLElement>('[data-testid="site-header"]');

		if (overlay) {
			Array.from(document.body.children).forEach((child) => {
				if (child === overlay || !(child instanceof HTMLElement)) return;
				if (child === header) return;

				child.setAttribute('inert', '');
				child.setAttribute('aria-hidden', 'true');
				inerted.push(child);
			});
		}

		// The first field takes the focus, so the keyboard starts inside the
		// form instead of behind the dialog.
		window.requestAnimationFrame(() => {
			nameInputRef.current?.focus({ preventScroll: true });
		});

		const onKeyDown = (event: KeyboardEvent) => {
			// Keep the tab inside the dialog.
			if (event.key !== 'Tab' || !overlay) return;

			const focusable = Array.from(
				overlay.querySelectorAll<HTMLElement>(FOCUSABLE),
			).filter((element) => element.offsetParent !== null);

			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (!first || !last) return;

			if (event.shiftKey && (active === first || !overlay.contains(active))) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.classList.remove('overflow-hidden');
			document.body.style.paddingRight = previousPadding;

			inerted.forEach((element) => {
				element.removeAttribute('inert');
				element.removeAttribute('aria-hidden');
			});

			window.removeEventListener('keydown', onKeyDown);

			// Give the focus back to whatever had it.
			previouslyFocused?.focus?.({ preventScroll: true });
		};
	}, [isOpen]);

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = String(data.get('name') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const vehicle = String(data.get('vehicle') ?? '').trim();
		const branch = String(data.get('branch') ?? '').trim();

		const lines = [
			'Halo AutoSPA Jakarta, saya ingin mendaftar Beauty Care.',
			`Nama: ${name}`,
			`No. HP: ${phone}`,
			`Kendaraan: ${vehicle}`,
			`Cabang: ${branch || 'Tidak ditentukan'}`,
		];

		window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
		setSubmitted(true);
	};

	const inputClass =
		'h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-primary-500 focus:outline-none';

	const fade = reduceMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
				initial: { opacity: 0, scale: 0.95, y: 16 },
				animate: { opacity: 1, scale: 1, y: 0 },
				exit: { opacity: 0, scale: 0.95, y: 16 },
			};

	return (
		<AnimatePresence>
			{isOpen ? (
				<motion.div
					ref={overlayRef}
					role="dialog"
					aria-modal="true"
					aria-labelledby="beauty-care-title"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: reduceMotion ? 0 : 0.3 }}
					className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<motion.div
						{...fade}
						transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
						className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-background-8 shadow-2xl"
					>
						{/* Close */}
						<button
							type="button"
							onClick={close}
							aria-label="Tutup popup"
							className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
						>
							<X className="size-5" />
						</button>

						{/* The banner and the content scroll together */}
						<div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
							{/* Campaign image - full bleed across the card */}
							<div className="relative w-full bg-background-8">
								<Image
									src="/images/banner_beauty_care.jpg"
									alt="AutoSPA Beauty Care - free vehicle assessment"
									width={1920}
									height={960}
									className="h-auto w-full object-cover"
									priority={false}
								/>
							</div>

							{/* Content */}
							<div className="px-6 py-5">
							<h2 id="beauty-care-title" className="sr-only">
								AutoSPA Beauty Care
							</h2>

							<p className="mb-4 text-sm leading-relaxed text-white/60">
								Yuk, kenali kondisi mobil lebih awal melalui{' '}
								<span className="font-semibold text-white">
									AUTOSPA BEAUTY CARE PROGRAM
								</span>
								!
							</p>

							{/* The four steps of the program */}
							<ol className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2">
								{STEPS.map((step, index) => (
									<li key={step} className="flex items-center gap-1.5">
										<span className="grid size-5 place-items-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
											{index + 1}
										</span>
										<span className="text-xs font-semibold uppercase tracking-wide text-white/75">
											{step}
										</span>
										{index < STEPS.length - 1 ? (
											<span aria-hidden="true" className="text-white/25">
												/
											</span>
										) : null}
									</li>
								))}
							</ol>

							{/* What the visitor gets */}
							{BENEFITS.map((benefit) => {
								const Icon = benefit.icon;

								return (
									<div
										key={benefit.title}
										className={`mb-3 flex items-start gap-4 rounded-xl border p-4 ${
											benefit.tone === 'amber'
												? 'border-amber-400/20 bg-amber-400/[0.07]'
												: 'border-sky-400/20 bg-sky-400/[0.07]'
										}`}
									>
										<div className="grid size-10 flex-shrink-0 place-items-center rounded-full bg-primary-500 text-white">
											<Icon className="size-5" strokeWidth={1.5} />
										</div>
										<div>
											<p className="text-sm font-semibold text-white">
												{benefit.title}
											</p>
											<p className="mt-1 text-xs leading-relaxed text-white/55">
												{benefit.description}
											</p>
										</div>
									</div>
								);
							})}

							{/* The facts */}
							<div className="mb-4 flex flex-wrap gap-2">
								{FACTS.map((fact) => {
									const Icon = fact.icon;

									return (
										<span
											key={fact.label}
											className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
												fact.tone === 'amber'
													? 'border-amber-400/25 bg-amber-400/10 text-amber-300'
													: 'border-white/10 bg-white/[0.05] text-white/70'
											}`}
										>
											<Icon className="size-3.5" strokeWidth={1.5} />
											{fact.label}
										</span>
									);
								})}
							</div>

							{/* The areas the assessment covers */}
							<div className="mb-4">
								<p className="mb-2 text-xs font-medium text-white/45">
									Enam area yang diperiksa
								</p>
								<div className="flex flex-wrap gap-1.5">
									{AREAS.map((area) => (
										<span
											key={area}
											className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60"
										>
											{area}
										</span>
									))}
								</div>
							</div>

							{/* The program */}
							<div className="mb-4 rounded-xl border border-primary-500/20 bg-gradient-to-r from-primary-500/10 via-primary-500/15 to-primary-500/10 px-4 py-4 text-center">
								<p className="mb-1 text-xs font-medium text-primary-500">
									AUTOSPA BEAUTY CARE
								</p>
								<p className="text-base font-semibold text-white">
									Kenali kondisi mobil. Pahami kebutuhannya. Rawat dengan tepat.
								</p>
								<p className="mt-1 text-xs italic text-white/45">
									No finding, no selling.
								</p>
							</div>

							{submitted ? (
								<div className="mb-4 rounded-xl border border-green-400/25 bg-green-400/10 p-4 text-center">
									<p className="text-sm font-semibold text-green-300">
										Lanjutkan di WhatsApp
									</p>
									<p className="mt-1 text-xs leading-relaxed text-white/55">
										WhatsApp terbuka dengan detail pendaftaran Anda - tekan kirim
										untuk meneruskan ke tim kami. Kami akan membalas untuk memastikan
										jadwal. Jika tidak terbuka, hubungi kami di {CONTACT.phone}.
									</p>
								</div>
							) : (
								<form onSubmit={submit} className="mb-4 grid gap-2.5 sm:grid-cols-2">
									<label className="block">
										<span className="mb-1 block text-xs font-medium text-white/55">
											Nama
										</span>
										<input
											ref={nameInputRef}
											type="text"
											name="name"
											required
											autoComplete="name"
											placeholder="Nama lengkap"
											className={inputClass}
										/>
									</label>

									<label className="block">
										<span className="mb-1 block text-xs font-medium text-white/55">
											No. HP
										</span>
										<input
											type="tel"
											name="phone"
											required
											autoComplete="tel"
											inputMode="tel"
											pattern="[0-9+][0-9\s-]{7,}"
											title="Nomor HP, contoh: 0812 3456 7890"
											placeholder="08xx xxxx xxxx"
											className={inputClass}
										/>
									</label>

									<label className="block">
										<span className="mb-1 block text-xs font-medium text-white/55">
											Kendaraan
										</span>
										<input
											type="text"
											name="vehicle"
											required
											placeholder="Merk dan tipe kendaraan"
											className={inputClass}
										/>
									</label>

									<label className="block">
										<span className="mb-1 block text-xs font-medium text-white/55">
											Cabang
										</span>
										<select
											name="branch"
											defaultValue=""
											className={`${inputClass} [&>option]:bg-background-8`}
										>
											<option value="">Pilih cabang</option>
											{BRANCHES.map((branch) => (
												<option key={branch.slug} value={branch.name}>
													{branch.name}
												</option>
											))}
										</select>
									</label>

									<button
										type="submit"
										className="h-10 w-full rounded-lg bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-600 sm:col-span-2"
									>
										Daftar Beauty Care Gratis
									</button>
								</form>
							)}

							{/* The call to action */}
							<a
								href={whatsappLink('Halo AutoSPA Jakarta, saya ingin mendaftar Beauty Care.')}
								target="_blank"
								rel="noopener noreferrer"
								className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#00B14F] px-6 py-4 text-center text-base font-bold text-white transition-all duration-200 hover:bg-[#00a044]"
							>
								<MessageCircle className="size-5" strokeWidth={2} />
								Booking via WhatsApp Sekarang
							</a>

							<p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-white/45">
								<MapPin className="size-4 flex-shrink-0" strokeWidth={1.5} />
								AutoSPA Jakarta - {BRANCHES.length} cabang di Jabodetabek
							</p>
							</div>
						</div>

						{/* Footer */}
						<div className="flex-shrink-0 border-t border-white/10 bg-white/[0.03] px-6 py-4">
							<button
								type="button"
								onClick={close}
								className="w-full text-center text-sm text-white/50 transition-colors hover:text-white/80"
							>
								Tutup
							</button>
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
