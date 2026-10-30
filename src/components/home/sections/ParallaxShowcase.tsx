'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MoveHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import { HOME_WORK } from '@/data/homework';
import type { HomeWorkItem } from '@/data/homework';

/**
 * "Horizontal Showcase" - the AutoSPA version of the Agntix
 * `portfolio-horizontal-showcase` page (`src/pages/portfolios/` +
 * `src/utils/ParallaxSlider.ts`).
 *
 * What was kept
 *   The whole interaction model of the template:
 *     - a horizontal track of cards inside a viewport,
 *     - wheel (and drag) input feeding a `target` offset,
 *     - a lerp easing (`0.05`) between `current` and `target` on every frame,
 *     - a secondary parallax on the images themselves, each one offset by
 *       `ratio - index * 0.7`, so the photo slides inside its frame while the
 *       frame slides with the track,
 *     - the content (category + title) only revealed on hover.
 *
 * What was changed
 *   The template version is a full-page takeover: `.parallax-slider-wrapper`
 *   is `position: fixed` over the whole viewport and the slider grows
 *   `document.body` to make room for the horizontal travel. On a homepage
 *   that would sit on top of the hero, the video band and every other
 *   section, so here it is a self contained section with its own scroll
 *   boundary.
 *
 *   The SCSS was rewritten as Tailwind utilities and the template images
 *   (`port-1.jpg` ... `port-7.jpg`) were replaced by the AutoSPA service
 *   cards already shipped in `public/assets`.
 */

/* ─────────────────────────────────────────────── *
 * Geometry
 * ─────────────────────────────────────────────── */

/**
 * Card width. The template uses a fixed 500px; on small screens that would
 * not fit, so the card shrinks with the viewport instead.
 */
const CARD_CLASS = 'w-[78vw] max-w-[380px] sm:w-[420px] lg:w-[500px]';

/**
 * The photo inside a card is wider than the card and hangs over both edges,
 * so the parallax slide never reveals an empty strip. The template uses
 * 800px inside a 500px card with a -100px left margin.
 */
const IMAGE_CLASS =
  'absolute inset-y-0 left-[-60px] w-[calc(100%+120px)] lg:left-[-100px] lg:w-[calc(100%+200px)]';

/** Gap between two cards (the template uses 30px). */
const GAP_PX = 30;

/** Easing factor of the lerp - smaller means longer inertia. */
const EASE = 0.05;

/** How much of one wheel notch moves the track. */
const WHEEL_SPEED = 0.5;

/* ─────────────────────────────────────────────── *
 * ParallaxShowcase
 * -------------------------------------------------------------------------- */
export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);

  /* Mutable animation state - kept in refs so the animation never triggers
     a React re-render. */
  const current = useRef(0);
  const target = useRef(0);
  const sliderWidth = useRef(0);
  const imageWidth = useRef(0);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const dragStart = useRef(0);
  const dragOrigin = useRef(0);

  const items: HomeWorkItem[] = HOME_WORK;

  /* ─────────────────────────────────────────────
   * Animation loop
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    let frame = 0;
    let visible = true;

    /** Recompute the track geometry after a resize. */
    const measure = () => {
      sliderWidth.current = track.scrollWidth;
      imageWidth.current = sliderWidth.current / Math.max(items.length, 1);
    };

    /** Highest offset the track may reach. */
    const maxOffset = () =>
      Math.max(0, sliderWidth.current - section.clientWidth);

    /**
     * The template's `animateImages`: every image is offset from the track
     * position by its own index, so the pictures move at different speeds
     * inside their frames.
     */
    const animateImages = () => {
      const ratio = imageWidth.current ? current.current / imageWidth.current : 0;

      imageRefs.current.forEach((image, index) => {
        if (!image) return;
        const offset = ratio - index * 0.7;
        image.style.transform = `translateX(${offset * 100}px)`;
      });
    };

    const render = () => {
      // lerp toward the target
      current.current += (target.current - current.current) * EASE;

      track.style.transform = `translateX(-${current.current}px)`;
      animateImages();

      // progress indicator
      const progress = progressRef.current;
      if (progress) {
        const max = maxOffset();
        const ratio = max ? current.current / max : 0;
        progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
      }
    };

    /* Only animate while the section is on screen. */
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 }
    );
    observer.observe(section);

    /* Recompute once the fonts and images have settled. */
    measure();
    const resize = () => measure();
    window.addEventListener('resize', resize);

    /* A single loop: it always reschedules itself, but the DOM is only
       touched while the section is visible. */
    const tick = () => {
      if (visible) render();
      frame = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [items.length]);

  /* ─────────────────────────────────────────────
   * Wheel input
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const maxOffset = () =>
      Math.max(0, sliderWidth.current - section.clientWidth);

    const onWheel = (event: WheelEvent) => {
      const max = maxOffset();
      const delta = event.deltaY * WHEEL_SPEED;

      /* The section only takes over the wheel once it fills the middle of
         the viewport. Before that the page keeps scrolling normally, so the
         visitor is never dropped into the slider by accident. */
      const rect = section.getBoundingClientRect();
      const inFocus =
        rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      if (!inFocus) return;

      // At either end the page keeps scrolling normally, so the section never
      // traps the visitor.
      if (target.current <= 0 && delta < 0) return;
      if (target.current >= max && delta > 0) return;

      event.preventDefault();
      target.current = Math.min(Math.max(target.current + delta, 0), max);
    };

    section.addEventListener('wheel', onWheel, { passive: false });

    return () => section.removeEventListener('wheel', onWheel);
  }, []);

  /* ─────────────────────────────────────────────
   * Drag input (the template is wheel only, which
   * makes the section unusable on touch devices)
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const maxOffset = () =>
      Math.max(0, sliderWidth.current - section.clientWidth);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging.current = true;
      didDrag.current = false;
      dragStart.current = event.clientX;
      dragOrigin.current = target.current;
      section.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const max = maxOffset();
      const next = dragOrigin.current - (event.clientX - dragStart.current);
      if (Math.abs(event.clientX - dragStart.current) > 5) didDrag.current = true;
      target.current = Math.min(Math.max(next, 0), max);
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (section.hasPointerCapture(event.pointerId)) {
        section.releasePointerCapture(event.pointerId);
      }
    };

    section.addEventListener('pointerdown', onPointerDown);
    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerup', endDrag);
    section.addEventListener('pointercancel', endDrag);

    return () => {
      section.removeEventListener('pointerdown', onPointerDown);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerup', endDrag);
      section.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  /* ─────────────────────────────────────────────
   * Controls
   * ───────────────────────────────────────────── */
  const scrollBy = useCallback((distance: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const max = Math.max(0, sliderWidth.current - section.clientWidth);
    target.current = Math.min(Math.max(target.current + distance, 0), max);
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollBy(320);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollBy(-320);
      }
    },
    [scrollBy]
  );

  return (
    <section
      ref={sectionRef}
      onKeyDown={onKeyDown}
      onClickCapture={(event) => {
        // A drag that ends over a card must not open the card.
        if (didDrag.current) {
          event.preventDefault();
          event.stopPropagation();
          didDrag.current = false;
        }
      }}
      tabIndex={-1}
      aria-label="AutoSPA showcase"
      className="relative h-[100svh] w-full overflow-hidden bg-background-8 select-none"
      /* `pan-y` keeps the vertical page scroll on touch devices while the
         horizontal travel belongs to this section. */
      style={{ touchAction: 'pan-y' }}
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 size-[480px] rounded-full bg-primary-500/5 blur-[150px]"
      />

      {/* Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-header">
        <div className="main-container flex flex-wrap items-end justify-between gap-6 py-10 lg:py-14">
          <div>
            <span className="text-xs font-medium uppercase tracking-[3px] text-ns-green">
              Showcase
            </span>
            <h2 className="mt-4 max-w-[640px] text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              {'Every service, one horizontal run.'}
            </h2>
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Previous services"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-primary-500/60 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <ArrowLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(320)}
              aria-label="Next services"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-primary-500/60 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <ArrowRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* The horizontal track */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div
          ref={trackRef}
          className="flex h-[58vh] w-max items-center will-change-transform"
          style={{ gap: `${GAP_PX}px`, transform: 'translateX(0px)' }}
        >
          {items.map((item, index) => (
            <article
              key={item.slug}
              className={`group relative h-full shrink-0 overflow-hidden ${CARD_CLASS}`}
            >
              <Link
                href={item.href}
                className="pointer-events-auto block h-full w-full cursor-pointer"
              >
                {/* Parallax photo */}
                <div
                  ref={(node) => {
                    imageRefs.current[index] = node;
                  }}
                  className={`${IMAGE_CLASS} will-change-transform`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, 500px"
                    quality={85}
                    className="object-cover"
                    draggable={false}
                  />
                </div>

                {/* Hover veil */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30"
                />

                {/* Content, revealed on hover */}
                <div className="pointer-events-none absolute bottom-0 left-0 z-10 m-6 translate-y-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 lg:m-9">
                  <span className="block text-sm uppercase tracking-[2px] text-white/70">
                    {item.categories[0] ?? 'AutoSPA'}
                  </span>
                  <h3 className="mt-2 text-3xl font-semibold leading-none tracking-tight text-white lg:text-[50px]">
                    {item.title}
                  </h3>
                </div>

                {/* Index marker, always visible */}
                <span className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/20 bg-background-8/60 px-3 py-1 text-xs font-semibold tracking-widest text-white/80 backdrop-blur-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Footer: progress bar + hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="main-container flex items-center justify-between gap-6 pb-10">
          <span className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-white/50">
            <MoveHorizontal className="size-4" strokeWidth={1.5} />
            Scroll or drag
          </span>

          <span className="relative block h-px w-[45%] max-w-[420px] bg-white/15">
            <span
              ref={progressRef}
              className="absolute inset-0 block origin-left scale-x-0 bg-primary-500"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
