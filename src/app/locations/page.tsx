import { MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

const locations = [
  {
    name: 'AutoSP Pluit',
    address: 'Jl. Pluit Selatan No. 123, Jakarta Utara 14450',
    phone: '+62 21 660 1234',
    hours: 'Mon-Sat: 08:00 - 18:00',
    services: ['Nano Ceramic Coating', 'Premium Wash', 'Premium Detailing', 'PPF'],
  },
  {
    name: 'AutoSP Kuningan',
    address: 'Jl. HR Rasuna Said Kav. C-17, Jakarta Selatan 12940',
    phone: '+62 21 520 5678',
    hours: 'Mon-Sat: 08:00 - 18:00',
    services: ['Nano Ceramic Coating', 'Premium Wash', 'Premium Detailing'],
  },
  {
    name: 'AutoSP Tangerang',
    address: 'Jl. BSD Raya Utama No. 45, Tangerang 15310',
    phone: '+62 21 538 9012',
    hours: 'Mon-Sat: 08:00 - 17:00',
    services: ['Premium Wash', 'Premium Detailing'],
  },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-background-8 pt-24">
      {/* Hero */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Our Locations
          </h1>
          <p className="mt-4 text-xl text-white/70">
            Visit us at one of our premium detailing centers in Jakarta
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-background-7 p-8 transition-all hover:border-primary-500/50"
              >
                <h2 className="text-xl font-bold text-white">{location.name}</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary-500" />
                    <span className="text-white/70">{location.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="size-5 shrink-0 text-primary-500" />
                    <a href={`tel:${location.phone}`} className="text-white/70 hover:text-primary-500">
                      {location.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="size-5 shrink-0 text-primary-500" />
                    <span className="text-white/70">{location.hours}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-white/50 uppercase tracking-wider">
                    Available Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {location.services.map((service, sIndex) => (
                      <span
                        key={sIndex}
                        className="rounded-full bg-primary-500/20 px-3 py-1 text-sm text-primary-400"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="mt-6 inline-block w-full rounded-full border border-primary-500 py-3 text-center text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white">
            Need Help Choosing a Location?
          </h2>
          <p className="mt-4 text-white/70">
            Our team is ready to help you find the perfect detailing solution for your vehicle.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-600"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
