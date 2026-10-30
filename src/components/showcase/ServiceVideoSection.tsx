'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import styles from './ServiceVideoSection.module.css';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

/**
 * The header of a service page - the Agntix portfolio detail video layout.
 *
 * The template (`portfolios/portfolio-details-video`) is built like this:
 *
 *   1. a wide video frame that stays pinned while the page scrolls,
 *   2. a player row inside the frame - the timer, the play button and the
 *      progress bar,
 *   3. an overlay that scrolls up over the pinned video: the facts of the
 *      entry, the numbered title and the paragraph,
 *   4. a navigation row - the previous entry, the index and the next entry.
 *
 * The overlay fades the video into the page background on its way up, so the
 * video dissolves while the copy takes over.
 *
 * The motion is owned by this component (scoped `useGSAP`), not by a global
 * hook that selects on class names - see `docs/agntix-projects-architecture.md`.
 */
export interface ServiceVideoSectionProps {
	/** The clip of the header, when the service has one. */
	video: { src: string; poster: string } | null;
	/** The photo of the service - the still of a service without a clip. */
	poster: string;
	/** The service title - the headline of the page. */
	title: string;
	/** The one line promise, shown under the headline. */
	tagline: string;
	/** The long description, shown as the paragraph of the title box. */
	description: string;
	/** The published number ("01"), when there is one. */
	number: string | null;
	/** The category of the service, shown next to the number. */
	category: string;
	/** The facts of the service, the way the template lists them. */
	facts: { label: string; value: string }[];
	/** The previous service of the catalogue. */
	prev: { title: string; href: string } | null;
	/** The next service of the catalogue. */
	next: { title: string; href: string } | null;
}

/** Formats the playback position as `M:SS`. */
function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = Math.floor(seconds % 60).toString().padStart(2, '0');
	return `${minutes}:${rest}`;
}

export default function ServiceVideoSection({
	video,
	poster,
	title,
	tagline,
	description,
	number,
	category,
	facts,
	prev,
	next,
}: ServiceVideoSectionProps) {
	const rootRef = useRef<HTMLElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const progressRef = useRef<HTMLProgressElement>(null);

	const [time, setTime] = useState('0:00');
	const [playing, setPlaying] = useState(true);

	/* The timer and the progress bar follow the playback position. */
	useEffect(() => {
		const element = videoRef.current;
		const progress = progressRef.current;

		if (!element || !progress) return;

		const update = () => {
			if (!element.duration) return;

			progress.value = (element.currentTime / element.duration) * 100;
			setTime(formatTime(element.currentTime));
		};

		element.addEventListener('timeupdate', update);
		return () => element.removeEventListener('timeupdate', update);
	}, [video?.src]);

	/* A visitor who asked for less motion gets the still, not the clip. */
	useEffect(() => {
		const element = videoRef.current;

		if (!element) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			element.pause();
			setPlaying(false);
		}
	}, [video?.src]);

	const togglePlay = () => {
		const element = videoRef.current;
		if (!element) return;

		if (element.paused) {
			element.play();
			setPlaying(true);
		} else {
			element.pause();
			setPlaying(false);
		}
	};

	useGSAP(
		() => {
			const root = rootRef.current;
			const frame = frameRef.current;
			if (!root || !frame) return;

			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			const splits: SplitText[] = [];

			/*
			 * The template pins the video while the overlay scrolls over it
			 * (`projectDetailsAnim`). The pin only runs on a wide screen -
			 * on a phone the video simply stays in the flow.
			 */
			const media = gsap.matchMedia();

			media.add('(min-width: 1200px)', () => {
				ScrollTrigger.create({
					trigger: root,
					start: 'top top',
					end: 'bottom -100%',
					pin: frame,
					pinSpacing: false,
				});
			});

			const headline = root.querySelector<HTMLElement>('.tp-service-title');

			if (headline) {
				const split = new SplitText(headline, {
					type: 'lines,words,chars',
					linesClass: 'tp-reveal-line',
				});
				splits.push(split);

				gsap.from(split.chars, {
					duration: 1.2,
					delay: 0.1,
					ease: 'circ.out',
					y: 60,
					stagger: 0.02,
					opacity: 0,
				});
			}

			return () => {
				media.revert();
				splits.forEach((split) => split.revert());
			};
		},
		{ scope: rootRef },
	);

	return (
		<section ref={rootRef} className="relative bg-background-8 pt-[120px]">
			{/* The video frame - pinned while the overlay scrolls over it. */}
			<div className="mx-auto max-w-[1430px] px-6">
				<div
					ref={frameRef}
					className="tp-video-frame relative h-[400px] w-full overflow-hidden bg-background-7 lg:h-[800px]"
				>
					{video ? (
						<>
							<video
								ref={videoRef}
								className="size-full object-cover"
								poster={video.poster}
								autoPlay
								muted
								loop
								playsInline
								preload="metadata"
								aria-label={`${title} - AutoSPA Jakarta`}
							>
								<source src={video.src} type="video/mp4" />
							</video>

							{/* The player row - the timer, the button and the bar. */}
							<div className="absolute inset-x-10 bottom-20 flex flex-col gap-4">
								<div className="flex items-center gap-5">
									<span className="text-xl leading-none text-white">
										{time} Detik
									</span>

									<button
										type="button"
										onClick={togglePlay}
										aria-label={playing ? 'Jeda video' : 'Putar video'}
										className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
									>
										{playing ? (
											<Pause className="size-4 fill-current" />
										) : (
											<Play className="size-4 fill-current" />
										)}
									</button>
								</div>

								<progress
									ref={progressRef}
									className={styles.progress}
									max={100}
									value={0}
									aria-label="Posisi video"
								/>
							</div>
						</>
					) : (
						/* A service without a clip still opens with its photo. */
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={poster}
							alt=""
							className="size-full object-cover"
						/>
					)}
				</div>
			</div>

			{/* The overlay - the facts, the title and the navigation. */}
			<div className={`${styles.overlay} relative`}>
				<div className="mx-auto max-w-[1430px] px-6">
					{/* Facts */}
					<div className="mb-12 flex flex-wrap justify-between gap-y-8">
						{facts.map((fact) => (
							<div key={fact.label} className="min-w-[150px]">
								<span className="mb-2.5 inline-block text-xl font-semibold leading-none text-white">
									{fact.label}
								</span>
								<p className="text-[17px] font-semibold leading-none tracking-[-0.4px] text-white/70">
									{fact.value}
								</p>
							</div>
						))}
					</div>

					{/* Title box */}
					<div className="pb-12">
						<span className="mb-2.5 inline-flex items-center text-lg font-medium leading-none text-white">
							{number ? (
								<>
									<span>{number}</span>
									<span
										aria-hidden="true"
										className="mx-2.5 inline-block h-px w-10 translate-y-[-4px] bg-white/15"
									/>
								</>
							) : null}
							{category}
						</span>

						<h1 className="tp-service-title mb-6 text-[50px] font-semibold leading-none tracking-[-3.2px] text-white lg:text-[80px]">
							{title}
						</h1>

						{tagline ? (
							<p className="mb-5 max-w-4xl text-xl leading-relaxed text-white/70">
								{tagline}
							</p>
						) : null}

						{description ? (
							<p className="max-w-4xl text-lg leading-[28px] text-white/85">
								{description}
							</p>
						) : null}
					</div>

					{/* Navigation */}
					<div className="flex items-center justify-between border-t border-white/10 py-8 lg:px-15 lg:py-8">
						{prev ? (
							<Link
								href={prev.href}
								className="group inline-flex items-center gap-3"
								title={prev.title}
							>
								<span className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:bg-white group-hover:text-black">
									<ArrowLeft className="size-4" />
								</span>
								<span className="text-[17px] font-semibold leading-none text-white">
									Sebelumnya
									<span className="ml-2 hidden text-sm font-normal text-white/50 sm:inline">
										{prev.title}
									</span>
								</span>
							</Link>
						) : (
							<span />
						)}

						<Link
							href="/services"
							aria-label="Semua layanan"
							className="text-white transition-transform duration-300 hover:rotate-90"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<circle cx="17" cy="3" r="3" fill="currentcolor" />
								<circle cx="3" cy="3" r="3" fill="currentcolor" />
								<circle cx="3" cy="17" r="3" fill="currentcolor" />
								<circle cx="17" cy="17" r="3" fill="currentcolor" />
							</svg>
						</Link>

						{next ? (
							<Link
								href={next.href}
								className="group inline-flex items-center gap-3"
								title={next.title}
							>
								<span className="text-[17px] font-semibold leading-none text-white">
									Selanjutnya
									<span className="ml-2 hidden text-sm font-normal text-white/50 sm:inline">
										{next.title}
									</span>
								</span>
								<span className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:bg-white group-hover:text-black">
									<ArrowRight className="size-4" />
								</span>
							</Link>
						) : (
							<span />
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
