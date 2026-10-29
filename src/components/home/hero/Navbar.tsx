'use client';

import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MenuItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

/**
 * The main navigation.
 *
 * The structure mirrors the production menu of autospajakarta.com: Home,
 * About, Services (with the four service pages as a dropdown), Blog, FAQ and
 * Contact.
 */
const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/our-services', hasDropdown: true },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

/** The service pages that the production menu nests under "Services". */
const SERVICE_LINKS = [
  { label: 'Premium Wash', href: '/services/premium-wash' },
  { label: 'Premium Detailing', href: '/services/premium-detailing' },
  { label: 'Premium Nano Ceramic Coating', href: '/services/premium-coating' },
  { label: 'Premium 360° PPF', href: '/services/premium-360-ppf' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/assets/auto-logo.png"
          alt="AutoSPA Jakarta"
          width={120}
          height={40}
          className="h-8 md:h-10 w-auto object-contain"
          priority
        />
      </Link>

      <ul className="hidden md:flex items-center gap-8 text-white font-normal text-sm">
        {MENU_ITEMS.map((item) => (
          <li
            key={item.href}
            className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group relative"
          >
            <Link href={item.href} className="flex items-center gap-1">
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </Link>

            {item.hasDropdown ? (
              <div className="invisible absolute left-0 top-full z-20 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <ul className="min-w-56 rounded-2xl border border-white/10 bg-background-8/95 p-2 shadow-xl backdrop-blur-md">
                  {SERVICE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="md:hidden flex items-center">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="mobile-menu-toggle"
          className="flex items-center justify-center w-10 h-10 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
        >
          {menuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl bg-background-8/95 backdrop-blur-md border border-white/10 overflow-hidden"
          >
            <ul className="flex flex-col text-white text-sm">
              {MENU_ITEMS.map((item) => (
                <li key={item.href} className="border-b border-white/5 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                    {item.hasDropdown ? (
                      <ChevronDown className="w-4 h-4 opacity-60" />
                    ) : null}
                  </Link>

                  {item.hasDropdown ? (
                    <ul className="border-t border-white/5 bg-white/[0.02] py-1">
                      {SERVICE_LINKS.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2.5 pl-8 pr-5 text-sm text-white/55 transition-colors hover:text-primary-500"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/contact"
        className="flex items-center bg-primary-500 text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-primary-600 transition-colors group"
      >
        <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <span className="text-xs md:text-sm font-normal">Booking Now</span>
      </Link>
    </nav>
  );
}
