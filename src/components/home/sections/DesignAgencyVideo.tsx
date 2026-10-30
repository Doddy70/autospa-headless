'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────── *
 * Types
 * ─────────────────────────────────────────────── */
interface ThumbnailImage {
  /** Path (under /public) of the still frame */
  src: string;
  /** Meaningful description of the frame */
  alt: string;
}

interface VideoConfig {
  /** Path (under /public) of the mp4 */
  src: string;
  /** Mime type of the source */
  type: string;
  /** Still frame shown before the video can play */
  poster: string;
  /** Accessible description of the footage */
  label: string;
}

/* ─────────────────────────────────────────────── *
 * Content
 * ─────────────────────────────────────────────── */

/**
 * The band is a wrapping row of still frames plus one video that sits in the
 * middle of the first row. Only the frames that flank the video are hidden on
 * small screens — the video itself is always visible.
 */
const THUMBNAILS: readonly [
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
] = [
  {
    src: '/images/banner1%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - vehicle in the detailing bay',
  },
  {
    src: '/images/banner2%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - exterior wash and paint care',
  },
  {
    src: '/images/banner3%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - interior detailing',
  },
  {
    src: '/images/banner4%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - paint protection treatment',
  },
  {
    src: '/images/banner5%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - ceramic coating process',
  },
  {
    src: '/images/banner7%20Autospa.jpg',
    alt: 'AutoSPA workshop banner - premium finish result',
  },
];

const VIDEO: VideoConfig = {
  src: '/videos/ferarri_wide.mp4',
  type: 'video/mp4',
  poster: '/assets/gallery/band-poster.jpg',
  label: 'AutoSPA detailing studio in action',
};

/* ─────────────────────────────────────────────── *
 * Helpers
 * ─────────────────────────────────────────────── */

/**
 * The template hides the flanking frames below the `xl` breakpoint; the video
 * stays visible at every size.
 */
const FRAME_HIDDEN_CLASS = 'hidden xl:block';

/**
 * Every cell of the band.
 *
 * The template lays the band out with a wrapping flex row where each cell is
 * 32.5% wide (`justify-content: space-between`), so three cells fill a row.
 * The cells are edge to edge — no gutter — which is what makes the zoom below
 * read as one continuous picture.
 */
const CELL_CLASS =
  'relative aspect-[10/7] overflow-hidden bg-background-5 xl:aspect-auto xl:h-[46vh]';

/** Shared gradient that blends the stills into the dark page */
const OVERLAY_CLASS =
  'pointer-events-none absolute inset-0 bg-gradient-to-t from-background-8/70 via-background-8/5 to-transparent';

/* ─────────────────────────────────────────────── *
 * DesignAgencyVideo
 * -------------------------------------------------------------------------- */
export interface DesignAgencyVideoProps {
  /** Extra classes for the wrapping <section>. */
  className?: string;
  /** Extra spacing classes for the wrapping <section>. */
  spacing?: string;
}

export default function DesignAgencyVideo({
  className = '',
  spacing = '',
}: DesignAgencyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ───────────────────────────────────────────────
   * Expand-on-scroll animation
   *
   * Ported verbatim from the Agntix template
   * (`src/hooks/useGsapAnimation.ts` -> `videoAnimation`): the band is pinned
   * while it is scrolled through and the thumbnail strip is scaled up to
   * 3.2x, so the footage appears to expand into the viewport. The template
   * only runs it from 1199px upwards.
   * ─────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    /**
     * GSAP and its ScrollTrigger plugin are only needed once the band is
     * scrolled into view, so they are fetched after the page is idle instead
     * of blocking the first render with ~70 kB of JavaScript.
     */
    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      media.add('(min-width: 1199px)', () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              scrub: 1,
              pin: true,
              start: 'top 40px',
              end: '+=100%',
            },
          })
          .to(wrapRef.current, { scale: 3.2, ease: 'none' });
      });

      revert = () => media.revert();
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void setup(), { timeout: 2000 })
      : window.setTimeout(() => void setup(), 1200);

    return () => {
      cancelled = true;

      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }

      revert?.();
    };
  }, []);

  /* Play / pause state tracking (drives the control button) */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  /* Autoplay while visible, pause as soon as it leaves the viewport */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsPlaying(false);
      return;
    }

    const attemptPlay = () => {
      const promise = video.play();
      if (promise) {
        promise.catch(() => {
          /* Autoplay blocked — the control button lets the user start it */
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attemptPlay();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  /* Manual control */
  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const promise = video.play();
      if (promise) {
        promise.catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-background-8 ${spacing || 'py-24 lg:py-32'} ${className}`}
      aria-label="AutoSPA detailing showcase"
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/5 blur-[150px]"
      />

      {/* The strip that scales up while the band is pinned */}
      <div
        ref={wrapRef}
        className="relative flex flex-wrap justify-between"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Frame 1 — top left */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[0].src}
            alt={THUMBNAILS[0].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>

        {/* Video — top middle, always visible */}
        <figure className={`${CELL_CLASS} w-full xl:w-[32.5%]`}>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={VIDEO.poster}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={VIDEO.src} type={VIDEO.type} />
            {VIDEO.label} — your browser does not support the video tag.
          </video>

          {/* Accessible description of the footage (the video itself is decorative) */}
          <figcaption className="sr-only">{VIDEO.label}</figcaption>

          {/* Contrast overlay so the control stays readable */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background-8/60 via-transparent to-background-8/20"
          />

          {/* Play / pause control */}
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause showcase video' : 'Play showcase video'}
            aria-pressed={isPlaying}
            className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-colors duration-300 hover:border-primary-500/60 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" strokeWidth={2} />
            ) : (
              <Play className="h-4 w-4 text-white" strokeWidth={2} />
            )}
          </button>
        </figure>

        {/* Frame 2 — top right */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[1].src}
            alt={THUMBNAILS[1].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>

        {/* Frame 3 — bottom left */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[2].src}
            alt={THUMBNAILS[2].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>

        {/* Frame 4 — bottom middle */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[3].src}
            alt={THUMBNAILS[3].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>

        {/* Frame 5 — bottom right */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[4].src}
            alt={THUMBNAILS[4].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>

        {/* Frame 6 — last row */}
        <figure
          className={`${FRAME_HIDDEN_CLASS} ${CELL_CLASS} w-full xl:w-[32.5%]`}
        >
          <Image
            src={THUMBNAILS[5].src}
            alt={THUMBNAILS[5].alt}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            quality={85}
          />
          <span aria-hidden="true" className={OVERLAY_CLASS} />
        </figure>
      </div>
    </section>
  );
}
