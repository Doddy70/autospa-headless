'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const servicesData = [
  {
    id: 1,
    title: 'Nano Ceramic Coating',
    description: 'Advanced ceramic coating for long-lasting protection and hydrophobic finish.',
    icon: '🛡️',
    href: '/service/nano-ceramic-coating',
  },
  {
    id: 2,
    title: 'Premium Wash',
    description: 'Professional hand wash with premium products for a showroom finish.',
    icon: '✨',
    href: '/service/premium-wash',
  },
  {
    id: 3,
    title: 'Premium Detailing',
    description: 'Complete interior and exterior detailing for the discerning owner.',
    icon: '🚗',
    href: '/service/premium-detailing',
  },
  {
    id: 4,
    title: 'PPF',
    description: 'Paint Protection Film to shield your vehicle from scratches and debris.',
    icon: '🔒',
    href: '/service/ppf-paint-protection-film',
  },
];

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {servicesData.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group block rounded-[20px] border border-white/10 bg-background-8 p-8 transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
            >
              {/* Icon */}
              <div className="mb-6 text-5xl">{service.icon}</div>

              {/* Content */}
              <h3 className="text-heading-6 mb-2 text-white">{service.title}</h3>
              <p className="text-accent/60 mb-4 text-sm">{service.description}</p>
              <span className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold group-hover:gap-3 transition-all">
                Learn More
                <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/service/nano-ceramic-coating" className="btn btn-lg btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
