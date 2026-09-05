'use client';

import { ArrowUpRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Services', href: '/service/nano-ceramic-coating' },
  { label: 'Locations', href: '/locations' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
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
            className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
          >
            <Link href={item.href} className="flex items-center gap-1">
              {item.label}
              {item.hasDropdown && (
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="md:hidden" />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center bg-primary-500 text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-primary-600 transition-colors group"
      >
        <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <span className="text-xs md:text-sm font-normal">Booking Now</span>
      </motion.button>
    </nav>
  );
}
