'use client';

/**
 * The copyright bar of the footer.
 *
 * Cloned from the Agntix `CreativeAgencyCopyright`: the brand name is set
 * oversized across the full width, and the row under it carries the year on
 * the left and the legal links on the right.
 *
 * The brand is AutoSPA Jakarta - the Agntix placeholder ("Autospa Jakarta")
 * is the name of the site, so the wordmark is kept and the year is read at
 * render time.
 */

import Link from 'next/link';

interface CreativeAgencyCopyrightProps {
	/** The background of the bar - the footer owns the colour, so it is
	 *  passed down instead of being repeated here. */
	bgColor?: string;
}

export default function CreativeAgencyCopyright({
	bgColor = '#1B1B1D',
}: CreativeAgencyCopyrightProps) {
	const year = new Date().getFullYear();

	return (
		<div className="tp-copyright-area tp-copyright-style-6" style={{ backgroundColor: bgColor }}>
			<div className="mx-auto w-full max-w-[1536px] px-6">
				{/* The oversized wordmark - the Agntix `tp-copyright-big-text`. */}
				<h3 className="footer-big-text text-center font-extrabold leading-[0.9] tracking-[-0.06em] text-white">
					Autospa Jakarta
				</h3>

				<div className="tp-copyright-bottom border-t border-white/10 py-7">
					<div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
						<div className="tp-copyright-left">
							<span className="text-base leading-[1.5] tracking-[-0.02em] text-white/70">
								©{year} Autospa Jakarta. All rights reserved.
							</span>
						</div>
						<div className="tp-copyright-right flex flex-wrap items-center justify-center gap-6 md:justify-end">
							<Link
								href="/terms-conditions"
								className="text-base leading-[1.5] tracking-[-0.02em] text-white/70 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
							>
								Terms and Conditions
							</Link>
							<Link
								href="/privacy-policy"
								className="text-base leading-[1.5] tracking-[-0.02em] text-white/70 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
							>
								Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
