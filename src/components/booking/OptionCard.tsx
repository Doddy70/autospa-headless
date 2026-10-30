'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

/**
 * One selectable card of a wizard step.
 *
 * The card is a real `<button>`, so it is reachable with the keyboard and
 * announced by the screen readers. The reference implementation of the wizard
 * (the `next-stepper` component) used a clickable `<div>`; a button carries
 * the same behaviour without the keyboard handling that goes with it.
 */
export interface OptionCardProps {
	title: string;
	description?: string;
	/** Small line under the description - the examples, the opening hours. */
	meta?: string;
	/** Optional photo of the option. */
	image?: string;
	imageAlt?: string;
	/** Optional badge, e.g. the published number of a service. */
	badge?: string;
	/** Optional content under the title. */
	children?: ReactNode;
	selected: boolean;
	onSelect: () => void;
	/** Name of the radio group the card belongs to. */
	name: string;
}

export function OptionCard({
	title,
	description,
	meta,
	image,
	imageAlt,
	badge,
	children,
	selected,
	onSelect,
	name,
}: OptionCardProps) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			name={name}
			onClick={onSelect}
			className={cn(
				'group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] border text-left transition-all duration-300',
				'border-white/10 bg-background-7 hover:border-primary-500/50 hover:bg-background-6',
				selected && 'border-primary-500 bg-primary-500/10 shadow-2',
			)}
		>
			{image ? (
				<div className="relative h-28 w-full overflow-hidden md:h-32">
					<Image
						src={image}
						alt={imageAlt ?? title}
						fill
						sizes="(max-width: 768px) 50vw, 25vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background-7 via-background-7/20 to-transparent" />
					{badge ? (
						<span className="absolute left-3 top-3 rounded-full bg-background-8/80 px-2.5 py-1 text-xs font-semibold text-primary-400 backdrop-blur-sm">
							{badge}
						</span>
					) : null}
				</div>
			) : badge ? (
				<span className="absolute left-4 top-4 rounded-full bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-400">
					{badge}
				</span>
			) : null}

			<div className="flex flex-1 flex-col p-4 md:p-5">
				<h3
					className={cn(
						'text-base font-bold transition-colors md:text-lg',
						selected ? 'text-white' : 'text-white/90 group-hover:text-white',
					)}
				>
					{title}
				</h3>

				{description ? (
					<p className="mt-1.5 text-sm leading-relaxed text-white/55">{description}</p>
				) : null}

				{meta ? <p className="mt-2 text-xs text-white/40">{meta}</p> : null}

				{children ? <div className="mt-3">{children}</div> : null}
			</div>

			{selected ? (
				<span
					aria-hidden="true"
					className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary-500 text-white shadow-1"
				>
					<svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden="true">
						<path
							d="M4 10.5 8 14.5 16 6"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			) : null}
		</button>
	);
}
