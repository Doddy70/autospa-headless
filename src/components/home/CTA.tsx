'use client';

import { ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-background-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />

      <div className="main-container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-wider">
            Premium Automotive Care
          </span>

          <h2 className="mt-4 text-white">
            Ready to Transform Your Vehicle?
          </h2>

          <p className="text-accent/60 mx-auto mt-4 max-w-xl">
            Book your appointment today and experience the AutoSPA difference.
            Professional detailing for the automotive enthusiast.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn btn-lg btn-primary group">
              Booking Now
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+6281937773888"
              className="btn btn-lg border border-stroke-6 bg-transparent text-white hover:bg-white/10"
            >
              <Phone className="mr-2 size-5" />
              (+62) 819 3777 3888
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
