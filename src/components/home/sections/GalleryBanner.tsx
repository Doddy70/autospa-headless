'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Premium Wash',
    subtitle: 'Showroom Quality',
    description: 'Professional exterior wash with premium products',
    src: '/assets/gallery/Premium Wash.jpg',
  },
  {
    id: 2,
    title: 'Interior Detailing',
    subtitle: 'Deep Clean',
    description: 'Complete interior restoration and sanitization',
    src: '/assets/gallery/Interior  Detailing.webp',
  },
  {
    id: 3,
    title: 'Engine Detailing',
    subtitle: 'Engine Bay',
    description: 'Professional engine bay cleaning and detailing',
    src: '/assets/gallery/Engine Detailing.webp',
  },
  {
    id: 4,
    title: 'Auto Detailing',
    subtitle: 'Full Service',
    description: 'Comprehensive auto detailing services',
    src: '/assets/gallery/auto detailing.webp',
  },
];

export default function GalleryBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % GALLERY_ITEMS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActiveSlide((s) => (s - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  const next = () => setActiveSlide((s) => (s + 1) % GALLERY_ITEMS.length);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#030810' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="relative max-w-xl mb-12 z-10">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mb-6"
          >
            <span className="text-xs font-medium uppercase tracking-[3px] text-white/40">
              Gallery
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.0] tracking-tight text-white mb-0">
            {['Craftsmanship', 'in', 'Every', 'Detail.'].map((word, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', marginRight: '0.2em' }}
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.07 }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Floating Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute top-32 right-16 lg:right-32 z-20"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-3 rounded-full border border-primary-500/30"
            />
            <div className="relative bg-primary-500 rounded-full px-5 py-2.5">
              <span className="text-sm font-semibold text-white">Premium Quality</span>
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden"
          style={{ height: '500px', aspectRatio: '16/9', background: '#030810' }}
        >
          {/* Slide Images */}
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              animate={{
                opacity: i === activeSlide ? 1 : 0,
                scale: i === activeSlide ? 1 : 1.05,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {/* Background Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
                priority={i === 0}
                quality={85}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />

              {/* Dark Overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(3, 8, 16, 0.95) 0%, rgba(3, 8, 16, 0.6) 50%, rgba(3, 8, 16, 0.3) 100%)',
                }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
                <div className="max-w-lg">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary-400 mb-2 block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Indicators */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            {GALLERY_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? 'w-8 bg-white'
                    : 'w-3 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Play Button */}
          <div className="absolute bottom-8 left-8 z-20">
            <motion.button
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-full border-2 border-white/30 animate-ping opacity-50" />
              <Link
                href="/gallery"
                className="relative flex items-center gap-3 bg-white text-background-8 px-5 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">View Gallery</span>
              </Link>
            </motion.button>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 right-8 z-20 flex gap-3">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.08 }}
              className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-background-8" />
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.08 }}
              className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-background-8" />
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '1000+', label: 'Happy Customers' },
            { value: '5+', label: 'Years Experience' },
            { value: '4.9', label: 'Customer Rating' },
            { value: '3', label: 'Locations' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
