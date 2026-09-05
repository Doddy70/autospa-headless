'use client';

import { useRef } from 'react';
import Hero from '@/components/home/hero/Hero';
import PalletRossCards from '@/components/PalletRossCards';
import GalleryBanner from '@/components/home/sections/GalleryBanner';
import AutoSpaFeaturesSection from '@/components/home/sections/AutoSpaFeaturesSection';
import CTA from '@/components/home/CTA';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* PalletRossCards must be rendered inside the scroll container */}
      {/* It reads scroll position and animates cards over the content */}
      <PalletRossCards containerRef={containerRef} />

      {/* Container ref spans from Hero through Section 2 */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Hero />

        {/* Section 2 - The e-commerce / cascade section */}
        {/* data-section="two" is required by PalletRossCards to determine lock timing */}
        <section
          data-section="two"
          style={{
            background: '#000000',
            minHeight: '100vh',
            padding: '80px 64px 0',
            display: 'flex',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Left text column */}
          <div style={{ width: 520, paddingTop: 32 }}>
            <div
              style={{
                fontFamily: '"Inter Tight", sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '2.5px',
                color: 'rgba(252,252,252,0.45)',
                marginBottom: 20,
              }}
            >
              AUTOMOTIVE DETAILING
            </div>

            <h2
              style={{
                fontFamily: '"Inter Tight", sans-serif',
                fontSize: 60,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-1.5px',
                margin: 0,
              }}
            >
              <span style={{ display: 'block', color: '#fcfcfc' }}>
                {'REFINE & PROTECT'}
              </span>
              <span style={{ display: 'block', color: '#27A8DF' }}>
                {'YOUR VEHICLE'}
              </span>
            </h2>

            <p
              style={{
                fontFamily: '"Inter Tight", sans-serif',
                marginTop: 28,
                fontSize: 15,
                fontWeight: 400,
                color: 'rgba(252,252,252,0.55)',
                lineHeight: 1.65,
                maxWidth: 340,
              }}
            >
              More than just a clean car. AutoSPA combines precision detailing,
              paint correction, ceramic coating, and paint protection to keep your
              vehicle looking its best.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', marginTop: 48, gap: 12 }}>
              <button
                style={{
                  padding: '14px 28px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#000000',
                  background: '#27A8DF',
                  border: 'none',
                  borderRadius: 9999,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                EXPLORE OUR SERVICES
              </button>
            </div>
          </div>
        </section>

        <GalleryBanner />
        <AutoSpaFeaturesSection />
        <CTA />
      </div>
    </>
  );
}
