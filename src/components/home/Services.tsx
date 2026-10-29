'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { SERVICES } from '@/data/services';

/**
 * Homepage services grid.
 *
 * The six services and their copy come from production
 * (see `src/data/services.ts`).
 */
const Services = () => {
  return (
    <section className="py-24 bg-background-7 dark:bg-background-9" id="services">
      <div className="main-container">
        {/* Section Header */}
        <div className="mb-16 space-y-4 text-center">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-wider">Our Services</span>
          <h2 className="mx-auto max-w-[600px]">
            Premium Automotive Care
          </h2>
          <p className="text-accent/60 mx-auto max-w-[500px]">
            Professional detailing services designed for the automotive enthusiast.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group block overflow-hidden rounded-[20px] border border-white/10 bg-background-8 transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/40 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-primary-500 px-3 py-1 text-xs font-bold tracking-wider text-white">
                  {service.number}
                </span>
              </div>

              <div className="p-8">
                <h3 className="text-heading-6 mb-2 text-white">{service.title}</h3>
                <p className="text-accent/60 mb-4 line-clamp-3 text-sm">{service.tagline}</p>
                <span className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/services" className="btn btn-lg btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
