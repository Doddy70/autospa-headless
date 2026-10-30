'use client';

/**
 * The team of the About page.
 *
 * The Agntix template (`src/components/team/AboutUsTeam.tsx`) puts the team
 * on a dark band with a huge headline and a slider of photo cards that
 * autoplays. The slider is Swiper in the template; here it is a small
 * carousel of its own - a track that slides a page at a time, with arrows,
 * dots and autoplay - so the team keeps moving without pulling in a slider
 * library.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import styles from './AboutTeam.module.css';

interface TeamMember {
	/** The name of the member. */
	name: string;
	/** The role of the member. */
	role: string;
	/** The photo of the member. */
	image: { src: string; alt: string; width: number; height: number };
}

interface AboutTeamProps {
	members: TeamMember[];
	/** The headline of the section. */
	title?: string;
	/** The label above the headline. */
	eyebrow?: string;
	className?: string;
}

/** How many cards fit on a page, per breakpoint. */
function perViewFor(width: number) {
	if (width < 640) return 1;
	if (width < 1024) return 2;
	return 3;
}

export function AboutTeam({
	members,
	title = 'Meet our team',
	eyebrow = 'Our Teams',
	className = '',
}: AboutTeamProps) {
	const [perView, setPerView] = useState(3);
	const [page, setPage] = useState(0);
	const [paused, setPaused] = useState(false);

	// The number of cards on a page follows the width of the window.
	useEffect(() => {
		const update = () => setPerView(perViewFor(window.innerWidth));
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const pages = Math.max(1, Math.ceil(members.length / perView));

	// A narrower window adds pages - never leave the carousel on a page that
	// does not exist any more.
	useEffect(() => {
		setPage((current) => Math.min(current, pages - 1));
	}, [pages]);

	const goTo = useCallback(
		(next: number) => {
			setPage(((next % pages) + pages) % pages);
		},
		[pages],
	);

	// Autoplay, paused on hover and when the tab is hidden.
	useEffect(() => {
		if (paused || pages < 2) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const timer = setInterval(() => {
			if (document.visibilityState === 'visible') {
				setPage((current) => (current + 1) % pages);
			}
		}, 5000);

		return () => clearInterval(timer);
	}, [paused, pages]);

	// The cards of the current page. The last page is padded with empty
	// slots, so the cards of that page keep the place they have on the
	// other pages.
	const slides = useMemo(() => {
		const slots: (TeamMember | null)[] = [...members];
		while (slots.length % perView !== 0) slots.push(null);
		return slots;
	}, [members, perView]);

	if (members.length === 0) return null;

	const activeFrom = page * perView;

	return (
		<section className={`relative overflow-hidden bg-background-8 px-6 py-20 md:py-28 ${className}`}>
			{/* The noise of the template's dark band, replaced by a soft
			    glow of the brand colour. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl"
			/>

			<div className="relative mx-auto max-w-6xl">
				<div className="text-center">
					<span className="text-sm font-semibold tracking-[0.2em] text-primary-500 uppercase">
						{eyebrow}
					</span>
					<h2 className="mt-4 text-4xl font-extrabold leading-[0.9] tracking-[-0.03em] text-white md:text-6xl">
						{title}
					</h2>
				</div>
			</div>

			{/* The carousel of the cards. */}
			<div
				className="relative mx-auto mt-12 max-w-6xl"
				onMouseEnter={() => setPaused(true)}
				onMouseLeave={() => setPaused(false)}
				onFocusCapture={() => setPaused(true)}
				onBlurCapture={() => setPaused(false)}
			>
				<div className={styles.viewport}>
					<ul
						className={styles.track}
						style={
							{
								'--per-view': perView,
								transform: `translateX(-${page * (100 / perView)}%)`,
							} as CSSProperties
						}
					>
						{slides.map((member, index) => (
							<li
								key={member?.name ?? `empty-${index}`}
								className={`${styles.item} ${
									index >= activeFrom && index < activeFrom + perView ? styles.active : ''
								}`}
							>
								{member ? (
									<article className="group overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-colors duration-300 hover:border-primary-500/50">
										<div className="relative aspect-square overflow-hidden bg-white/5">
											<Image
												src={member.image.src}
												alt={member.image.alt}
												width={member.image.width}
												height={member.image.height}
												sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
												className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-background-7/80 via-transparent to-transparent" />
										</div>

										<div className="p-5 text-center">
											<h3 className="text-base font-bold text-white">{member.name}</h3>
											<p className="mt-1 text-sm text-primary-500">{member.role}</p>
										</div>
									</article>
								) : null}
							</li>
						))}
					</ul>
				</div>

				{/* The arrows of the carousel. */}
				{pages > 1 ? (
					<>
						<button
							type="button"
							onClick={() => goTo(page - 1)}
							aria-label="Anggota tim sebelumnya"
							className="absolute top-1/2 -left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-background-8/80 text-white/70 backdrop-blur transition-colors hover:border-primary-500 hover:text-primary-500 md:-left-5"
						>
							<ChevronLeft className="size-5" aria-hidden="true" />
						</button>

						<button
							type="button"
							onClick={() => goTo(page + 1)}
							aria-label="Anggota tim berikutnya"
							className="absolute top-1/2 -right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-background-8/80 text-white/70 backdrop-blur transition-colors hover:border-primary-500 hover:text-primary-500 md:-right-5"
						>
							<ChevronRight className="size-5" aria-hidden="true" />
						</button>
					</>
				) : null}
			</div>

			{/* The dots of the carousel. */}
			{pages > 1 ? (
				<div className="relative mt-8 flex items-center justify-center gap-2">
					{Array.from({ length: pages }).map((_, index) => (
						<button
							key={`dot-${index}`}
							type="button"
							onClick={() => goTo(index)}
							aria-label={`Halaman tim ${index + 1}`}
							aria-current={index === page}
							className={`h-2 rounded-full transition-all ${
								index === page ? 'w-6 bg-primary-500' : 'w-2 bg-white/20 hover:bg-white/40'
							}`}
						/>
					))}
				</div>
			) : null}
		</section>
	);
}

export default AboutTeam;
