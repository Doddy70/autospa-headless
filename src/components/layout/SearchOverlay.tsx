'use client';

/**
 * Site search overlay.
 *
 * The Agntix header opens a full screen search through its global context.
 * This app has no search backend, so the overlay hands the query over to the
 * blog, which already filters articles by the `search` parameter.
 */

import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchOverlayProps {
	open: boolean;
	onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');

	// Focus the field as soon as the overlay opens.
	useEffect(() => {
		if (!open) return;

		inputRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', onKeyDown);

		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open, onClose]);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();

		const term = query.trim();

		if (!term) return;

		onClose();
		router.push(`/blog?search=${encodeURIComponent(term)}`);
	};

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					role="dialog"
					aria-modal="true"
					aria-label="Search"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="fixed inset-0 z-[70] bg-background-8/95 backdrop-blur-md"
				>
					<motion.div
						initial={{ y: -24, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -24, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						className="mx-auto flex h-full max-w-[900px] flex-col px-6 pt-32 md:pt-40"
					>
						<form onSubmit={submit} className="flex items-center gap-4 border-b border-white/15 pb-4">
							<Search className="size-6 shrink-0 text-primary-500" />
							<input
								ref={inputRef}
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Cari artikel, panduan, layanan..."
								className="w-full bg-transparent text-xl text-white outline-none placeholder:text-white/30 md:text-2xl"
							/>
							<button
								type="submit"
								className="shrink-0 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
							>
								Cari
							</button>
						</form>

						<p className="mt-6 text-sm text-white/40">
							Tekan Enter untuk mencari di blog AutoSPA.
						</p>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
