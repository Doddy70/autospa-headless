'use client';

/**
 * The default site header.
 *
 * Ported from the Agntix `CorporateAgencyHeader`: logo on the left, a pill
 * shaped menu with a dropdown, a search button, a call-to-action button and a
 * burger that opens an off-canvas panel on small screens. The bar floats over
 * the homepage hero and turns into a solid, blurred bar once the page is
 * scrolled.
 *
 * The Agntix markup is Bootstrap + SCSS (`tp-header-9`), which does not exist
 * here, so the structure is rebuilt with Tailwind and the AutoSPA tokens.
 */

import { ArrowUpRight, ChevronDown, Menu, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { BookingTrigger } from '@/components/booking/ReservationModal';
import { NAVIGATION, type NavItem } from '@/config/navigation';
import { usePopup } from '@/context/PopupContext';
import { useNavbarScroll } from '@/hooks/useScrollHeader';
import MobileMenuPanel from './MobileMenuPanel';
import PopupToggle from './PopupToggle';
import SearchOverlay from './SearchOverlay';

export default function Header() {
	const { isScrolled } = useNavbarScroll(20);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const pathname = usePathname();

	// While the popout is on screen the header floats above its overlay, so the
	// bell stays reachable and can switch the popout off.
	const { isOpen: isPopupOpen, masterEnabled: isPopupAvailable } = usePopup();

	/**
	 * Whether a menu entry leads to the page that is open.
	 *
	 * The entry of a section is active as well when one of its children is
	 * open - on `/services/premium-wash` the "Services" entry stays marked.
	 */
	const isActive = (item: NavItem) => {
		if (pathname === item.href) return true;

		return (
			item.href !== '/' &&
			pathname.startsWith(`${item.href}/`) &&
			/* `/blog` and `/blog/<slug>` are the same section; the entry of
			   the section is marked for both. */
			(item.children?.length ?? 0) > 0
		);
	};

	return (
		<>
			<header
				data-testid="site-header"
				className={`fixed inset-x-0 top-0 h-header transition-colors duration-300 ${
					isPopupOpen ? 'z-[90]' : 'z-50'
				} ${
					isScrolled
						? 'border-b border-white/10 bg-background-8/90 backdrop-blur-md'
						: 'bg-transparent'
				}`}
			>
				<div className="mx-auto flex h-full w-full max-w-[1536px] items-center justify-between gap-6 px-6 md:px-10">
					<Link
						href="/"
						className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
						aria-label="AutoSPA Jakarta"
					>
						<Image
							src="/assets/auto-logo.png"
							alt="AutoSPA Jakarta"
							width={120}
							height={40}
							className="h-9 w-auto object-contain"
							priority
						/>
					</Link>

					<nav className="flex items-center gap-3" aria-label="Main navigation">
						<ul className="hidden items-center gap-1 rounded-[14px] border border-white/[0.06] bg-white/[0.04] p-1 xl:flex">
							{NAVIGATION.map((item) => {
								const active = isActive(item);

								return (
									<li key={item.label} className="group relative">
										<Link
											href={item.href}
											prefetch={false}
											aria-current={active ? 'page' : undefined}
											className={`flex items-center gap-1 rounded-lg px-4 py-2 text-[15px] font-medium tracking-[-0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
												active
													? 'bg-white/[0.08] text-white'
													: 'text-white/70 hover:bg-white/[0.06] hover:text-primary-500'
											}`}
										>
											{item.label}
											{item.children?.length ? (
												<ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
											) : null}
										</Link>

										{item.children?.length ? <Dropdown item={item} /> : null}
									</li>
								);
							})}
						</ul>

						<button
							type="button"
							onClick={() => setSearchOpen(true)}
							aria-label="Search"
							className="hidden size-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:inline-flex"
						>
							<Search className="size-5" />
						</button>

						{/* Switch for the Beauty Care popout */}
						{isPopupAvailable ? (
							<PopupToggle className="hidden md:inline-flex" />
						) : null}

						{/* The booking call to action of the header. It opens the
						    reservation dialog of the site. */}
						<BookingTrigger
							label="Reservation"
							className="hidden items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 xl:inline-flex"
						>
							<span>Reservation</span>
							<span className="grid size-6 place-items-center rounded-full bg-white/20">
								<ArrowUpRight className="size-3.5" />
							</span>
						</BookingTrigger>

						<button
							type="button"
							onClick={() => setMobileOpen(true)}
							aria-expanded={mobileOpen}
							aria-controls="mobile-menu"
							aria-label="Open menu"
							data-testid="mobile-menu-toggle"
							className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 xl:hidden"
						>
							<Menu className="size-5" />
						</button>
					</nav>
				</div>
			</header>

			<MobileMenuPanel
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				onSearch={() => setSearchOpen(true)}
			/>
			<SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
		</>
	);
}

/**
 * The dropdown of a menu entry, opened on hover and on keyboard focus.
 */
function Dropdown({ item }: { item: NavItem }) {
	return (
		<div
			className="invisible absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
		>
			<ul className="rounded-2xl border border-white/10 bg-background-8/95 p-2 shadow-2xl backdrop-blur-md">
				{item.children?.map((child) => (
					<li key={child.href}>
						<Link
							href={child.href}
							prefetch={false}
							className="block rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
						>
							{child.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
