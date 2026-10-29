'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

/**
 * Accordion - the FAQ / question-and-answer list.
 *
 * The production Elementor pages use the `tcgelements-accordion` widget,
 * which is Bootstrap collapse markup. The Agntix template has the same
 * widget with its own plus/minus icon treatment.
 *
 * This is a self-contained client component: no Bootstrap, no jQuery, and
 * the open item is animated with `motion` so it matches the rest of the
 * frontend.
 */
export interface AccordionItem {
	question: string;
	answer: string;
}

export interface AccordionProps {
	items: AccordionItem[];
	/** Index of the item that is open initially. */
	defaultOpen?: number;
	/** Allow several items to be open at the same time. */
	allowMultiple?: boolean;
	className?: string;
}

export function Accordion({
	items,
	defaultOpen = 0,
	allowMultiple = false,
	className = '',
}: AccordionProps) {
	const [open, setOpen] = useState<number[]>(defaultOpen >= 0 ? [defaultOpen] : []);

	const toggle = (index: number) => {
		setOpen((current) => {
			if (current.includes(index)) {
				return current.filter((item) => item !== index);
			}

			return allowMultiple ? [...current, index] : [index];
		});
	};

	return (
		<div className={`divide-y divide-white/10 border-y border-white/10 ${className}`}>
			{items.map((item, index) => {
				const isOpen = open.includes(index);

				return (
					<div key={item.question}>
						<h3>
							<button
								type="button"
								onClick={() => toggle(index)}
								aria-expanded={isOpen}
								className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-primary-500"
							>
								<span
									className={`text-lg font-semibold transition-colors md:text-xl ${
										isOpen ? 'text-primary-500' : 'text-white'
									}`}
								>
									{item.question}
								</span>

								<span
									aria-hidden="true"
									className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
										isOpen
											? 'border-primary-500 bg-primary-500 text-white'
											: 'border-white/20 text-white/60'
									}`}
								>
									<svg viewBox="0 0 448 512" className="size-3.5 fill-current">
										{isOpen ? (
											<path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
										) : (
											<path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
										)}
									</svg>
								</span>
							</button>
						</h3>

						<AnimatePresence initial={false}>
							{isOpen ? (
								<motion.div
									key="content"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.28, ease: 'easeInOut' }}
									className="overflow-hidden"
								>
									<p className="max-w-3xl pb-7 pr-10 text-base leading-relaxed text-white/60">
										{item.answer}
									</p>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
