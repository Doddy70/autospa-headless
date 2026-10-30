'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Copy, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StepProgress } from '@/components/booking/StepProgress';
import { CarSizeStep } from '@/components/booking/steps/CarSizeStep';
import { CustomerStep } from '@/components/booking/steps/CustomerStep';
import { LocationStep } from '@/components/booking/steps/LocationStep';
import { ReviewStep } from '@/components/booking/steps/ReviewStep';
import { ScheduleStep } from '@/components/booking/steps/ScheduleStep';
import { ServiceStep } from '@/components/booking/steps/ServiceStep';
import { VehicleStep } from '@/components/booking/steps/VehicleStep';
import { CONTACT, branchWhatsapp, whatsappLink } from '@/data/contact';
import { parseBranchHours, timeSlots } from '@/lib/booking/schedule';
import { buildWhatsAppMessage, findBranch, resolveBooking } from '@/lib/booking/summary';
import {
	EMPTY_BOOKING,
	MODEL_SPECIFIC_SERVICES,
	type ArrivalPreference,
	type BookingErrors,
	type BookingState,
	type CarSizeId,
	type StepId,
} from '@/lib/booking/types';
import { validateStep } from '@/lib/booking/validation';
import type { ServiceCard } from '@/lib/services/types';
import { cn } from '@/utils/cn';

/**
 * The AutoSPA service booking wizard.
 *
 * The flow follows the reference implementation of `ebulku/next-stepper`: a
 * step per decision, a progress bar, cards that are picked like options, a
 * back/next navigation and a summary at the end. What is different:
 *
 *   - the store is the React state of this component, not zustand - the
 *     project does not carry that dependency and the wizard needs none of
 *     its features beyond a single source of truth,
 *   - the shadcn/ui primitives are replaced by the AutoSPA design tokens
 *     (`background-7`, `primary-500`, the `btn` utilities),
 *   - the steps are the ones of a detailing workshop: the service, the
 *     branch, the size of the vehicle, the vehicle itself, the schedule and
 *     the customer.
 *
 * There is no booking API behind the wizard. The last step hands the summary
 * over to WhatsApp - the channel AutoSPA uses for reservations - and asks
 * the team to confirm. The wizard never states that a booking is confirmed.
 */

interface StepDefinition {
	id: StepId;
	/** The short label of the step, used in the progress bar. */
	label: string;
	title: string;
	description: string;
}

const STEP_DEFINITIONS: StepDefinition[] = [
	{
		id: 'service',
		label: 'Layanan',
		title: 'Layanan apa yang Anda butuhkan?',
		description:
			'Pilih layanan AutoSPA yang ingin dipesan. Tim kami akan menyesuaikan paket dan harga akhirnya.',
	},
	{
		id: 'location',
		label: 'Cabang',
		title: 'Di cabang mana Anda akan datang?',
		description: 'AutoSPA tersebar di beberapa kota. Pilih cabang yang paling dekat dengan Anda.',
	},
	{
		id: 'carSize',
		label: 'Ukuran',
		title: 'Seberapa besar kendaraan Anda?',
		description:
			'Ukuran kendaraan menentukan lama pengerjaan dan jumlah material yang kami siapkan.',
	},
	{
		id: 'vehicle',
		label: 'Kendaraan',
		title: 'Kendaraan Anda',
		description:
			'Data kendaraan kami perlukan untuk layanan yang dikerjakan per model, seperti paint protection film dan nano ceramic coating.',
	},
	{
		id: 'schedule',
		label: 'Jadwal',
		title: 'Kapan Anda ingin datang?',
		description:
			'Pilih tanggal dan jam yang Anda inginkan. Jam yang muncul mengikuti jam buka cabang yang Anda pilih.',
	},
	{
		id: 'customer',
		label: 'Data Anda',
		title: 'Data Anda',
		description: 'Agar kami bisa menghubungi Anda untuk memastikan jadwal dan harga akhir.',
	},
	{
		id: 'review',
		label: 'Review',
		title: 'Periksa kembali data booking Anda',
		description:
			'Pastikan sudah benar, lalu kirim ringkasannya ke tim AutoSPA lewat WhatsApp untuk dikonfirmasi.',
	},
];

export interface BookingWizardProps {
	/** The service catalogue - the rows of the first step. */
	services: ServiceCard[];
	/**
	 * A service that is already chosen.
	 *
	 * The modal uses it when the wizard is opened from the page of a
	 * service: the step of the service is then skipped.
	 */
	initialServiceSlug?: string | null;
	/** Called when the summary was handed over to WhatsApp. */
	onSubmitted?: (reference: string) => void;
}

export function BookingWizard({
	services,
	initialServiceSlug = null,
	onSubmitted,
}: BookingWizardProps) {
	const [state, setState] = useState<BookingState>(() => ({
		...EMPTY_BOOKING,
		serviceSlug: initialServiceSlug,
	}));
	const [currentStepId, setCurrentStepId] = useState<StepId>(
		initialServiceSlug ? 'location' : 'service',
	);
	/** The errors are shown after the customer tried to continue. */
	const [showErrors, setShowErrors] = useState(false);
	/** Set once the summary was handed over to WhatsApp. */
	const [submitted, setSubmitted] = useState(false);
	const [copied, setCopied] = useState(false);

	const headingRef = useRef<HTMLHeadingElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const steps = STEP_DEFINITIONS;

	const step = STEP_DEFINITIONS.find((item) => item.id === currentStepId) ?? STEP_DEFINITIONS[0]!;
	const stepIndex = Math.max(
		0,
		steps.findIndex((item) => item.id === currentStepId),
	);

	/**
	 * The steps that are part of the flow.
	 *
	 * The vehicle step is skipped for the services that are not cut per
	 * model. The numbering does not change - the step keeps its number and
	 * is shown as skipped, the way a paper form does.
	 */
	const skippedIds = useMemo(() => {
		const skipped: string[] = [];

		if (
			!state.serviceSlug ||
			!MODEL_SPECIFIC_SERVICES.includes(state.serviceSlug)
		) {
			skipped.push('vehicle');
		}

		return skipped;
	}, [state.serviceSlug]);

	const isLastStep = stepIndex === steps.length - 1;

	const errors: BookingErrors = validateStep(step.id, state);

	/** The branch of the request - the opening hours come from it. */
	const branch = findBranch(state.locationSlug);

	/**
	 * The time slots of the chosen branch.
	 *
	 * The site-wide opening hours are the fallback for a branch that
	 * publishes no hours line.
	 */
	const slots = useMemo(() => {
		const hours = parseBranchHours(branch?.hours) ?? parseBranchHours(CONTACT.hours);
		return timeSlots(hours);
	}, [branch]);

	const booking = useMemo(() => resolveBooking(state, services), [state, services]);
	const message = useMemo(() => buildWhatsAppMessage(booking), [booking]);

	/**
	 * Where the summary goes.
	 *
	 * A request that names a branch is handed over to the WhatsApp number
	 * of that branch - the workshop itself answers it. Without a branch the
	 * central number of the site is used.
	 */
	const whatsappNumber = branch ? branchWhatsapp(branch) : CONTACT.whatsapp;
	const whatsappUrl = whatsappLink(message, whatsappNumber);

	/* Move the focus to the heading of the step, so the screen reader and
	   the keyboard follow the flow. */
	useEffect(() => {
		headingRef.current?.focus();
	}, [currentStepId]);

	/* A slot that the new branch is not open for has to go. */
	useEffect(() => {
		if (state.time && slots.length > 0 && !slots.includes(state.time)) {
			setState((previous) => ({ ...previous, time: '' }));
		}
	}, [slots, state.time]);

	const update = useCallback((patch: Partial<BookingState>) => {
		setState((previous) => ({ ...previous, ...patch }));
	}, []);

	const goTo = useCallback((id: StepId) => {
		setCurrentStepId(id);
		setShowErrors(false);
	}, []);

	const handleNext = useCallback(() => {
		if (Object.keys(errors).length > 0) {
			setShowErrors(true);
			return;
		}

		const next = steps
			.slice(stepIndex + 1)
			.find((item) => !skippedIds.includes(item.id));

		if (next) goTo(next.id);
	}, [errors, goTo, skippedIds, stepIndex, steps]);

	const handleBack = useCallback(() => {
		const previous = [...steps.slice(0, stepIndex)]
			.reverse()
			.find((item) => !skippedIds.includes(item.id));

		if (previous) goTo(previous.id);
	}, [goTo, skippedIds, stepIndex, steps]);

	const handleServiceChange = useCallback(
		(slug: string) => {
			const patch: Partial<BookingState> = { serviceSlug: slug };

			/* The vehicle step is skipped when the service does not need the
			   model, so the data of that step is dropped with it. */
			if (!MODEL_SPECIFIC_SERVICES.includes(slug)) {
				patch.vehicleBrand = '';
				patch.vehicleBrandOther = '';
				patch.vehicleModel = '';
				patch.vehicleYear = '';
			}

			update(patch);

			/* Changing the service on the vehicle step itself moves the
			   customer on to the step that follows it. */
			if (currentStepId === 'vehicle' && !MODEL_SPECIFIC_SERVICES.includes(slug)) {
				goTo('schedule');
			}
		},
		[currentStepId, goTo, update],
	);

	const handleSubmit = useCallback(() => {
		/* The last check: every step of the flow has to be complete. */
		const incomplete = steps.some(
			(item) => item.id !== 'review' && Object.keys(validateStep(item.id, state)).length > 0,
		);

		if (incomplete) {
			setShowErrors(true);
			return;
		}

		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
		setSubmitted(true);
		onSubmitted?.(booking.reference);
	}, [booking.reference, onSubmitted, state, steps, whatsappUrl]);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(message);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2500);
		} catch {
			setCopied(false);
		}
	}, [message]);

	const visibleErrors = showErrors ? errors : {};

	return (
		<div className="mx-auto w-full max-w-5xl rounded-[24px] border border-white/10 bg-background-7">
			<div className="border-b border-white/10 p-5 md:p-8">
				<StepProgress
					steps={steps.map((item) => ({ id: item.id, label: item.label }))}
					current={stepIndex}
					skipped={skippedIds}
				/>
			</div>

			<div ref={panelRef} className="p-5 md:p-8">
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={step.id}
						initial={{ opacity: 0, x: 16 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -16 }}
						transition={{ duration: 0.18, ease: 'easeOut' }}
					>
						<h2
							ref={headingRef}
							tabIndex={-1}
							className="text-xl font-bold text-white outline-none md:text-2xl"
						>
							{step.title}
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
							{step.description}
						</p>

						<div className="mt-7">
							{step.id === 'service' ? (
								<ServiceStep
									services={services}
									value={state.serviceSlug}
									onChange={handleServiceChange}
									error={visibleErrors.serviceSlug}
								/>
							) : null}

							{step.id === 'location' ? (
								<LocationStep
									value={state.locationSlug}
									onChange={(slug) => update({ locationSlug: slug })}
									error={visibleErrors.locationSlug}
								/>
							) : null}

							{step.id === 'carSize' ? (
								<CarSizeStep
									value={state.carSizeId}
									onChange={(id: CarSizeId) => update({ carSizeId: id })}
									error={visibleErrors.carSizeId}
								/>
							) : null}

							{step.id === 'vehicle' ? (
								<VehicleStep
									brand={state.vehicleBrand}
									brandOther={state.vehicleBrandOther}
									model={state.vehicleModel}
									year={state.vehicleYear}
									onChange={(field, value) => update({ [field]: value })}
									errors={visibleErrors}
								/>
							) : null}

							{step.id === 'schedule' ? (
								<ScheduleStep
									arrival={state.arrival}
									date={state.date}
									time={state.time}
									slots={slots}
									branchName={branch?.name ?? null}
									onChange={(field, value) => {
										/* A day that belongs to another answer does
										   not travel with it. */
										if (
											field === 'arrival' &&
											(value === 'asap' || value === 'konsultasi')
										) {
											update({
												arrival: value as ArrivalPreference,
												date: '',
												time: value === 'konsultasi' ? '' : state.time,
											});
											return;
										}

										update({ [field]: value });
									}}
									errors={visibleErrors}
								/>
							) : null}

							{step.id === 'customer' ? (
								<CustomerStep
									name={state.customerName}
									phone={state.customerPhone}
									notes={state.customerNotes}
									onChange={(field, value) => update({ [field]: value })}
									errors={visibleErrors}
								/>
							) : null}

							{step.id === 'review' ? (
								<ReviewStep
									booking={booking}
									steps={steps
										.filter(
											(item) => item.id !== 'review' && !skippedIds.includes(item.id),
										)
										.map((item) => ({ id: item.id, label: item.label }))}
									onEdit={(id) => goTo(id as StepId)}
								/>
							) : null}
						</div>
					</motion.div>
				</AnimatePresence>

				{/* The navigation. On a phone it sits under the step, on a wide
				    screen it stays on the right of the content. */}
				<div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<button
						type="button"
						onClick={handleBack}
						disabled={stepIndex === 0}
						className={cn(
							'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition-colors',
							'hover:border-primary-500 hover:text-primary-400 disabled:pointer-events-none disabled:opacity-30',
						)}
					>
						<ArrowLeft className="size-4" aria-hidden="true" />
						Kembali
					</button>

					{isLastStep ? (
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<button
								type="button"
								onClick={handleCopy}
								className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
							>
								{copied ? (
									<Check className="size-4" aria-hidden="true" />
								) : (
									<Copy className="size-4" aria-hidden="true" />
								)}
								{copied ? 'Tersalin' : 'Salin ringkasan'}
							</button>

							<button
								type="button"
								onClick={handleSubmit}
								className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
							>
								<MessageCircle className="size-4" aria-hidden="true" />
								Kirim lewat WhatsApp
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={handleNext}
							className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
						>
							Lanjut
							<ArrowRight className="size-4" aria-hidden="true" />
						</button>
					)}
				</div>

				{/* The hand over to WhatsApp. Nothing here claims the booking
				    is confirmed - the team confirms it. */}
				{submitted ? (
					<div
						role="status"
						className="mt-6 rounded-[20px] border border-primary-500/30 bg-primary-500/10 p-5 md:p-6"
					>
						<h3 className="text-lg font-bold text-white">
							Ringkasan booking Anda sudah siap dikirim
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-white/70">
							{branch ? (
								<>
									Ringkasan ini dikirim ke nomor WhatsApp cabang{' '}
									<strong className="text-white">{branch.name}</strong> ({whatsappNumber}).{' '}
								</>
							) : (
								'Ringkasan ini dikirim ke tim AutoSPA lewat WhatsApp. '
							)}
							Jika WhatsApp tidak terbuka otomatis, gunakan tombol di bawah. Tim kami
							akan membalas untuk mengonfirmasi jadwal, paket, dan harga akhir. Sampai saat
							itu, booking ini <strong className="text-white">belum dikonfirmasi</strong>.
						</p>

						<div className="mt-4 flex flex-col gap-3 sm:flex-row">
							<a
								href={whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
							>
								<MessageCircle className="size-4" aria-hidden="true" />
								Buka WhatsApp
							</a>
							<button
								type="button"
								onClick={handleCopy}
								className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:border-primary-500 hover:text-primary-400"
							>
								{copied ? (
									<Check className="size-4" aria-hidden="true" />
								) : (
									<Copy className="size-4" aria-hidden="true" />
								)}
								{copied ? 'Tersalin' : 'Salin ringkasan'}
							</button>
						</div>

						<pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-background-8 p-4 text-xs leading-relaxed text-white/60">
							{message}
						</pre>
					</div>
				) : null}
			</div>
		</div>
	);
}
