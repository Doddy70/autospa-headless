'use client';

import { motion } from 'motion/react';
import { ArrowRight, Shield, Sparkles, Car, Award } from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
  {
    name: 'Ceramic Coating',
    icon: Shield,
    description: 'Premium protection for your vehicle\'s paintwork.',
  },
  {
    name: 'Premium Wash',
    icon: Sparkles,
    description: 'Professional hand wash with premium products.',
  },
  {
    name: 'Detailing',
    icon: Car,
    description: 'Complete interior and exterior restoration.',
  },
  {
    name: 'PPF',
    icon: Award,
    description: 'Invisible armor against scratches and debris.',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#010305' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6"
            >
              <span className="text-xs font-medium uppercase tracking-[3px] text-white/40">
                Premium Automotive Care
              </span>
            </motion.div>

            {/* Animated Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-8">
              {['Protection', '&', 'Precision.', 'Engineered', 'for', 'Excellence.'].map((word, i) => (
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

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              className="text-base text-white/60 leading-relaxed max-w-md mb-10"
            >
              From nano ceramic coatings that shield your paint to premium hand washes
              that restore your vehicle&apos;s brilliance. Every detail is crafted with precision
              and passion for the automotive craft.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/service/nano-ceramic-coating"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium transition-colors group"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                View Locations
              </Link>
            </motion.div>
          </div>

          {/* Right Visual - Service Cards */}
          <div className="relative">
            {/* Service Icons Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/10 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{service.name}</h3>
                    <p className="text-white/50 text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-500/20 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
