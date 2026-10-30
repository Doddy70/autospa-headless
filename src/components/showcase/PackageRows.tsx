'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

import type { ServicePackageCard } from '@/lib/services/types';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

/**
 * The packages of a service, as the Agntix portfolio rows.
 *
 * The template's rows carry a photo and a copy block; here the photo is the
 * service photo and the copy block is a package: its name, its promise and
 * what is included. The rows alternate and the photo slides in from the
 * side, exactly like the catalogue rows.
 */
export interface PackageRowsProps {
	/** The packages of the service. */
	packages: ServicePackageCard[];
	/** The photo of the service, used for every row. */
	image: string;
	/** Alternative text of the photo. */
	alt: string;
	/** Label of the price, when the package carries one. */
	priceLabel?: string;
}

export default function PackageRows({
	packages,
	image,
	alt,
	priceLabel = 'Mulai dari',
}: PackageRowsProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const splits: SplitText[] = [];

			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			const media = gsap.matchMedia();

			media.add('(min-width: 991px)', () => {
				gsap.set('.design-project-thumb.item-1', { x: 400, rotate: 10 });
				gsap.set('.design-project-thumb.item-2', { x: -400, rotate: -10 });

				gsap.utils.toArray<HTMLElement>('.design-project-item').forEach((row) => {
					const thumb = row.querySelector('.design-project-thumb');
					if (!thumb) return;

					gsap
						.timeline({
							scrollTrigger: {
								trigger: row,
								start: 'top 100%',
								end: 'bottom center',
								scrub: 1,
							},
						})
						.to(thumb, { x: 0, rotate: 0 });
				});
			});

			root.querySelectorAll<HTMLElement>('.tp_reveal_anim').forEach((element) => {
				const split = new SplitText(element, {
					type: 'lines,words,chars',
					linesClass: 'tp-reveal-line',
				});
				splits.push(split);

				gsap.from(split.chars, {
					duration: 1.4,
					delay: 0.05,
					ease: 'circ.out',
					y: 60,
					stagger: 0.015,
					opacity: 0,
					scrollTrigger: {
						trigger: element,
						start: 'top 85%',
					},
				});
			});

			return () => {
				media.revert();
				splits.forEach((split) => split.revert());
			};
		},
		{ scope: rootRef },
	);

	return (
		<div ref={rootRef} className="design-project-item-wrap">
			{packages.map((servicePackage, index) => {
				const photoOnRight = index % 2 === 1;

				return (
					<div key={servicePackage.name} className="design-project-item mb-[70px] last:mb-0 lg:mb-[120px]">
						<div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-[60px]">
							<div className={`lg:col-span-7 ${photoOnRight ? 'lg:order-2' : 'lg:order-1'}`}>
								<div
									className={`design-project-thumb item-${index % 2 === 0 ? '1' : '2'} ${
										photoOnRight ? 'text-end' : ''
									}`}
								>
									<Image
										src={image}
										alt={alt}
										width={900}
										height={600}
										className="h-auto w-full rounded-[30px] will-change-transform"
									/>
								</div>
							</div>

							<div className={`lg:col-span-5 ${photoOnRight ? 'lg:order-1' : 'lg:order-2'}`}>
								<div className="design-project-content xl:pl-[100px]">
									<span className="tp_reveal_anim mb-4 block text-sm font-semibold tracking-[0.2em] text-primary-500">
										{String(index + 1).padStart(2, '0')}
										{servicePackage.recommended ? ' · Rekomendasi' : ''}
									</span>

									<h3 className="tp_reveal_anim text-[30px] font-normal leading-[0.95] tracking-[-0.02em] text-white lg:text-[46px]">
										{servicePackage.name}
									</h3>

									{servicePackage.summary ? (
										<span className="tp_reveal_anim mt-3 block text-lg font-medium leading-snug tracking-[-0.02em] text-white/60 lg:mt-6 lg:text-xl">
											{servicePackage.summary}
										</span>
									) : null}

									{servicePackage.includes.length > 0 ? (
										<ul className="mt-6 space-y-2.5 lg:mt-8">
											{servicePackage.includes.map((item) => (
												<li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-accent/70">
													<Check
														className="mt-1 size-3.5 shrink-0 text-primary-500"
														strokeWidth={3}
													/>
													{item}
												</li>
											))}
										</ul>
									) : (
										<p className="mt-6 text-sm text-accent/50">
											Detail paket dan harga tersedia melalui tim AutoSPA.
										</p>
									)}

									{servicePackage.price ? (
										<p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary-300">
											{priceLabel} {servicePackage.price}
										</p>
									) : null}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
