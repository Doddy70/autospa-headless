'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import BottomLeftCard from './BottomLeftCard';
import BottomRightCorner from './BottomRightCorner';
import HeroBadge from './HeroBadge';

const VIDEO_URL = '/videos/hero_autospa.mp4';
const VIDEO_POSTER = '/assets/auto-logo.png';

export default function Hero() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-background-8">
      <section
        className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/5 group"
        style={{ contain: 'layout paint' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={VIDEO_POSTER}
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
          aria-hidden="true"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/50 to-transparent z-[1]" />

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <div className="w-full flex flex-col items-center py-20 lg:py-32 text-center max-w-4xl">
            <HeroBadge /> 

            {/* The headline is the largest contentful paint of the page, so it
                animates with CSS keyframes instead of JavaScript - the text is
                visible with the first paint, not after the hydration. */}
            <h1 className="hero-anim-headline text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-bold text-white mb-2 tracking-tight leading-[1.05]">
              Passion for{' '}
              <span className="text-primary-500">Details</span>
            </h1>

            <p className="hero-anim-fade hero-anim-delay-1 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-xl font-normal">
              We provide a Premium Service & produce Premium Results
            </p>

            {/* CTA Buttons */}
            <div className="hero-anim-rise hero-anim-delay-2 flex flex-col sm:flex-row items-center gap-4 mt-8">
              <Link
                href="/services/nano-ceramic-coating"
                prefetch={false}
                className="flex items-center bg-primary-500 text-white rounded-full pl-3 pr-5 py-2.5 gap-2 hover:bg-primary-600 transition-colors group"
              >
                <span className="text-sm font-medium">Explore Services</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="#down"
                prefetch={false}
                className="flex items-center border border-white/30 text-white rounded-full px-6 py-2.5 gap-2 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm font-medium">Book Appointment</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="hero-anim-rise hero-anim-delay-3 flex items-center gap-8 mt-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Rating</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">5+</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Years</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Locations</p>
              </div>
            </div>
          </div>

          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  );
}
