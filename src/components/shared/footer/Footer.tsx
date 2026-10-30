'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { BRANCHES, CONTACT, whatsappLink } from '@/data/contact';

import CreativeAgencyCopyright from './subComponents/CreativeAgencyCopyright';
import { FooterSocialIcons } from './subComponents/FooterSocialIcons';
import FooterLink from './FooterLink';

gsap.registerPlugin(ScrollTrigger);

/**
 * The footer of the site.
 *
 * Cloned from the Agntix `CreativeAgencyFooter` - the variant of the
 * contact page (`src/pages/contacts/contact-us/ContactUsMain.tsx`):
 *
 *   - the brand on the left, with the oversized title and the social marks,
 *   - the quick links as a menu of pills in the middle,
 *   - the contact details on the right,
 *   - the copyright bar with the oversized wordmark under it.
 *
 * The Agntix template is Bootstrap, AutoSPA is Tailwind, so the layout is
 * written in Tailwind - the classes of the template (`tp-footer-widget`,
 * `tp-footer-widget-menu`, ...) are kept as the names of the parts, not as
 * the markup.
 *
 * The brand is AutoSPA Jakarta: the logo of the site replaces the wordmark
 * of the template.
 */

const BG_COLOR = '#1B1B1D';

/** The pill of the quick links menu -  `tp-footer-widget-menu`. */
const PILL =
	'inline-block rounded-full bg-white/[0.06] px-5 py-[13px] text-[14px] font-medium uppercase leading-none tracking-[-0.02em] text-white transition-colors duration-300 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500';

const QUICK_LINKS = [
	{ label: 'About', href: '/about' },
	{ label: 'Our Team', href: '/team' },
	{ label: 'Services', href: '/services' },
	{ label: 'Locations', href: '/locations' },
	{ label: 'Before & After', href: '/before-after' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'FAQ', href: '/faq' },
	{ label: 'Contact Us', href: '/contact' },
];

/** The branch that carries the address of the site - Pluit. */
const HEADQUARTERS = BRANCHES.find((branch) => branch.slug === 'pluit');

export default function Footer() {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			gsap.utils.toArray<HTMLElement>('[data-footer-fade]').forEach((element) => {
				gsap.from(element, {
					opacity: 0,
					y: 30,
					duration: 0.9,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: element,
						start: 'top 88%',
						once: true,
					},
				});
			});
		},
		{ scope: rootRef },
	);

	return (
		<div ref={rootRef}>
			<footer className="tp-footer-area tp-footer-style-6 pt-20 pb-9 md:pt-28 lg:pt-[120px]" style={{ backgroundColor: BG_COLOR }}>
				<div className="mx-auto w-full max-w-[1536px] px-6 md:px-10">
					<div className="grid items-start gap-y-12 lg:grid-cols-12">
						{/* The brand - the Agntix `tp-footer-col-1`. */}
						<div className="lg:col-span-4" data-footer-fade>
							<Link
								href="/"
								aria-label="AutoSPA Jakarta"
								className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
							>
								<Image
									src="/assets/auto-logo.png"
									alt="AutoSPA Jakarta"
									width={180}
									height={60}
									className="h-12 w-auto object-contain"
								/>
							</Link>

							<h2 className="mt-8 text-[44px] font-bold leading-[1.05] tracking-[-0.06em] text-white sm:text-[56px] lg:text-[64px] xl:text-[80px]">
								Passion for
								<br />
								Detail.
							</h2>

							<p className="mt-6 max-w-[320px] text-base leading-[1.6] text-white/60">
								Premium automotive detailing and car wash services in Jakarta. Engineered
								for the enthusiast.
							</p>

							<div className="mt-8">
								<FooterSocialIcons className="flex flex-wrap items-center gap-3" />
							</div>
						</div>

						{/* The quick links - the Agntix `tp-footer-col-2`. */}
						<div className="lg:col-span-5 lg:pl-0 lg:pr-0 xl:pl-[110px] xl:pr-[50px]" data-footer-fade>
							<h3 className="mb-6 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-white">
								<span className="size-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
								Quick links
							</h3>

							<ul className="flex flex-wrap gap-2">
								{QUICK_LINKS.map((link) => (
									<li key={link.href}>
										<FooterLink href={link.href} label={link.label} className={PILL} />
									</li>
								))}
								<li>
									<FooterLink href="/reservasi" label="Book Now" className={PILL} />
								</li>
							</ul>
						</div>

						{/* The contact - the Agntix `tp-footer-col-3`. */}
						<div className="lg:col-span-3 lg:pl-5" data-footer-fade>
							<h3 className="mb-5 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-white">
								<span className="size-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
								Contact
							</h3>

							<div className="space-y-2.5">
								<Link
									href={`mailto:${CONTACT.email}`}
									className="block text-base leading-[1.5] tracking-[-0.02em] text-white transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
								>
									{CONTACT.email}
								</Link>
								<Link
									href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
									className="block text-base leading-[1.5] tracking-[-0.02em] text-white transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
								>
									{CONTACT.phone}
								</Link>
								<a
									href={whatsappLink('Halo AutoSPA Jakarta, saya ingin membuat reservasi.')}
									target="_blank"
									rel="noopener noreferrer"
									className="block text-base leading-[1.5] tracking-[-0.02em] text-white transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
								>
									WhatsApp
								</a>
							</div>

							<div className="mt-6">
								<p className="text-base leading-[1.5] tracking-[-0.02em] text-white/60">
									{CONTACT.hours}
								</p>
								{HEADQUARTERS?.address ? (
									<p className="mt-2 max-w-[280px] text-sm leading-[1.6] text-white/40">
										{HEADQUARTERS.name} - {HEADQUARTERS.address}
									</p>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</footer>

			<CreativeAgencyCopyright bgColor={BG_COLOR} />
		</div>
	);
}
