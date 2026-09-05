'use client';

import { ArrowUpRight, Sparkles, Shield, Zap, Car, Award, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AutoSpaFeaturesSection.module.css';

/* ── Marquee items ── */
const MARQUEE_ROW_1 = [
  { icon: Shield, label: 'Ceramic Coating' },
  { icon: Zap, label: 'Paint Correction' },
  { icon: Car, label: 'PPF' },
  { icon: Award, label: 'Premium Detailing' },
  { icon: Wrench, label: 'Interior Detailing' },
  { icon: Sparkles, label: 'Paint Protection' },
];

const MARQUEE_ROW_2 = [
  { icon: Car, label: 'Surface Care' },
  { icon: Shield, label: 'Glass Coating' },
  { icon: Zap, label: 'Engine Bay Detail' },
  { icon: Award, label: 'Paint Sealant' },
  { icon: Wrench, label: 'Wheel & Tire' },
];

/* ── Craftsmanship timeline steps ── */
const CRAFTSMANSHIP_STEPS = [
  'Surface Preparation',
  'Paint Correction',
  'Protection',
  'Long-Term Preservation',
];

/* ─────────────────────────────────────────────── *
 * Craftsmanship Card (Col 1)
 * ─────────────────────────────────────────────── */
function CraftsmanshipCard() {
  return (
    <div className={`${styles['autospa-features__card']} ${styles['autospa-features__craft-card']}`}>
      {/* Image Background */}
      <div className={styles['autospa-features__image-wrap']}>
        <Image
          src="/assets/frammer/MOBIL_FRAMMER.avif"
          alt="Premium automotive detailing"
          fill
          className="object-cover"
          sizes="(max-width: 1100px) 100vw, 33vw"
          quality={85}
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className={styles['autospa-features__overlay']} />

      {/* Noise Texture */}
      <div className={styles['autospa-noise-overlay']} />

      {/* Content */}
      <div className={styles['autospa-features__craft-body']}>
        {/* Label */}
        <div className={styles['autospa-features__label']}>
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
          Craftsmanship
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h2 className={styles['autospa-features__craft-title']}>
          The AutoSPA<br />
          <span>Approach.</span>
        </h2>

        {/* Timeline */}
        <div className={styles['autospa-features__timeline']}>
          {CRAFTSMANSHIP_STEPS.map((step, i) => (
            <div key={i} className={styles['autospa-features__timeline-item']}>
              <div className={styles['autospa-features__timeline-dot']} />
              <span className={styles['autospa-features__timeline-text']}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── *
 * Customer Voice Card (Col 2 — top)
 * ─────────────────────────────────────────────── */
function CustomerVoiceCard() {
  // TODO: Replace with real CMS testimonial when data is available
  const quote =
    'Detailing bukan hanya membuat mobil terlihat bersih. Yang paling penting adalah bagaimana setiap detail dikerjakan dengan presisi dan hasilnya bisa bertahan lebih lama.';

  return (
    <div
      className={`${styles['autospa-features__card']} ${styles['autospa-features__voice-card']} ${styles['autospa-glass']}`}
    >
      {/* Noise Texture */}
      <div className={styles['autospa-noise-overlay']} />

      <div className={styles['autospa-features__card-content']}>
        {/* Label */}
        <div className={styles['autospa-features__label']}>
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
          Customer Voice
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
        </div>

        {/* Quote */}
        <blockquote className={styles['autospa-features__voice-quote']}>
          {quote}
        </blockquote>

        {/* Attribution */}
        <cite className={styles['autospa-features__voice-attribution']}>
          — AutoSPA Customer
        </cite>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── *
 * Statistic Card (Col 2 — bottom)
 * ─────────────────────────────────────────────── */
function StatisticCard() {
  return (
    <div className={`${styles['autospa-features__card']} ${styles['autospa-features__voice-card']}`}>
      {/* Image Background */}
      <div className={styles['autospa-features__image-wrap']}>
        <Image
          src="/assets/frammer/Detailing.avif"
          alt="AutoSPA detailing"
          fill
          className="object-cover"
          sizes="(max-width: 1100px) 100vw, 33vw"
          quality={85}
        />
      </div>

      {/* Dark Overlay */}
      <div className={styles['autospa-features__overlay']} />

      {/* Noise Texture */}
      <div className={styles['autospa-noise-overlay']} />

      {/* Content */}
      <div className={styles['autospa-features__card-content']}>
        <h2 className={styles['autospa-features__stat-wordmark']}>
          Detail<br />
          <span>By Design.</span>
        </h2>
        <p className={styles['autospa-features__stat-caption']}>
          Precision in every surface.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── *
 * Expertise Marquee Card (Col 3 — top)
 * ─────────────────────────────────────────────── */
function ExpertiseCard() {
  const MarqueeRow = ({
    items,
    direction,
  }: {
    items: typeof MARQUEE_ROW_1;
    direction: 'left' | 'right';
  }) => (
    <div className={styles['autospa-features__marquee-track']}>
      <div
        className={`${styles['autospa-features__marquee-inner']} ${
          direction === 'left'
            ? styles['autospa-features__marquee-row-left']
            : styles['autospa-features__marquee-row-right']
        }`}
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((item, i) => {
          const Icon = item.icon;
          return (
            <span key={i} className={styles['autospa-features__marquee-item']}>
              <Icon className={styles['autospa-features__marquee-icon']} strokeWidth={1.5} />
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={`${styles['autospa-features__card']} ${styles['autospa-features__expertise-card']} ${styles['autospa-glass']}`}
    >
      {/* Noise Texture */}
      <div className={styles['autospa-noise-overlay']} />

      <div className={styles['autospa-features__expertise-body']}>
        {/* Label */}
        <div className={styles['autospa-features__label']}>
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
          Our Expertise
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
        </div>

        {/* Marquee Rows */}
        <MarqueeRow items={MARQUEE_ROW_1} direction="left" />
        <MarqueeRow items={MARQUEE_ROW_2} direction="right" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── *
 * Booking CTA Card (Col 3 — bottom)
 * ─────────────────────────────────────────────── */
function BookingCard() {
  return (
    <div className={`${styles['autospa-features__card']} ${styles['autospa-features__expertise-card']}`}>
      {/* Image Background */}
      <div className={styles['autospa-features__image-wrap']}>
        <Image
          src="/assets/frammer/CarSide_Frammer.avif"
          alt="Book your car detailing"
          fill
          className="object-cover"
          sizes="(max-width: 1100px) 100vw, 33vw"
          quality={85}
        />
      </div>

      {/* Dark Overlay */}
      <div className={styles['autospa-features__overlay']} />

      {/* Noise Texture */}
      <div className={styles['autospa-noise-overlay']} />

      <div className={styles['autospa-features__booking-body']}>
        {/* Label */}
        <div className={styles['autospa-features__label']}>
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
          Book Your Car
          <Sparkles className={styles['autospa-features__label-icon']} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className={styles['autospa-features__booking-title']}>
          Give your car<br />the treatment<br />it deserves.
        </h3>
        <p className={styles['autospa-features__booking-desc']}>
          Professional automotive detailing crafted for the enthusiast.
        </p>

        {/* CTA Button */}
        <Link href="/contact" className={styles['autospa-features__booking-cta']}>
          Book an Appointment
          <ArrowUpRight className={styles['autospa-features__booking-cta-icon']} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── *
 * AutoSpaFeaturesSection — main export
 * ─────────────────────────────────────────────── */
export default function AutoSpaFeaturesSection() {
  return (
    <section className={styles['autospa-features']} data-section="autospa-features">
      <div className={styles['autospa-features__grid']}>
        {/* Col 1 — Craftsmanship (image bg + timeline) */}
        <CraftsmanshipCard />

        {/* Col 2 — stacked: Customer Voice + Statistic */}
        <div className={styles['autospa-features__col2']}>
          <CustomerVoiceCard />
          <StatisticCard />
        </div>

        {/* Col 3 — stacked: Expertise Marquee + Booking CTA */}
        <div className={styles['autospa-features__col3']}>
          <ExpertiseCard />
          <BookingCard />
        </div>
      </div>
    </section>
  );
}
