import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Clock, Shield, Star } from 'lucide-react';

// For demo purposes - in production this would come from GraphQL
const servicesData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  packages: {
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }[];
}> = {
  'nano-ceramic-coating': {
    title: 'Nano Ceramic Coating',
    tagline: 'Ultimate Protection for Your Vehicle',
    description: 'Our premium nano ceramic coating provides long-lasting protection against UV rays, chemical stains, and minor scratches. It creates a hydrophobic layer that makes cleaning your vehicle effortless.',
    benefits: [
      '5-7 year durability',
      'Hydrophobic surface',
      'UV protection',
      'Chemical resistance',
      'Enhanced gloss',
      'Scratch resistant',
    ],
    packages: [
      {
        name: 'Basic Coat',
        price: 'IDR 2.500.000',
        features: [
          'Single layer coating',
          '6-month durability',
          'Basic paint correction',
          'Surface preparation',
        ],
      },
      {
        name: 'Premium Coat',
        price: 'IDR 5.000.000',
        features: [
          'Double layer coating',
          '2-year durability',
          'Full paint correction',
          'Interior protection',
          'Priority booking',
        ],
        popular: true,
      },
      {
        name: 'Elite Coat',
        price: 'IDR 8.500.000',
        features: [
          'Triple layer coating',
          '5-year durability',
          'Complete paint correction',
          'Full vehicle protection',
          'Annual maintenance',
          'VIP support',
        ],
      },
    ],
  },
  'premium-wash': {
    title: 'Premium Wash',
    tagline: 'Professional Hand Wash Experience',
    description: 'Experience the difference of a premium hand wash. Our trained professionals use premium products and techniques to give your vehicle the care it deserves.',
    benefits: [
      'Hand wash only',
      'pH-neutral shampoo',
      'Wheel & tire cleaning',
      'Interior vacuum',
      'Window cleaning',
      'Air freshener',
    ],
    packages: [
      {
        name: 'Express Wash',
        price: 'IDR 150.000',
        features: [
          'Exterior hand wash',
          'Wheel cleaning',
          'Interior vacuum',
          'Window wipe',
        ],
      },
      {
        name: 'Signature Wash',
        price: 'IDR 350.000',
        features: [
          'Full hand wash',
          'Engine bay cleaning',
          'Interior detailed',
          'Tire dressing',
          'Air freshener',
        ],
        popular: true,
      },
      {
        name: 'Ultimate Wash',
        price: 'IDR 550.000',
        features: [
          'Complete exterior wash',
          'Clay bar treatment',
          'Premium wax',
          'Leather conditioning',
          'Dashboard UV protection',
        ],
      },
    ],
  },
  'premium-detailing': {
    title: 'Premium Detailing',
    tagline: 'Showroom Quality Finish',
    description: 'Our premium detailing service restores your vehicle to showroom condition. From paint correction to interior deep cleaning, we handle every detail.',
    benefits: [
      'Multi-stage paint correction',
      'Interior deep cleaning',
      'Leather conditioning',
      'Engine bay detailing',
      'Headlight restoration',
      'Ceramic coating optional',
    ],
    packages: [
      {
        name: 'Interior Detailing',
        price: 'IDR 750.000',
        features: [
          'Deep seat cleaning',
          'Carpet shampooing',
          'Dashboard restoration',
          'Vent cleaning',
          'Odor elimination',
        ],
      },
      {
        name: 'Full Detailing',
        price: 'IDR 1.500.000',
        features: [
          'Interior + Exterior',
          'Paint correction',
          'Machine wax',
          'Wheel restoration',
          'Glass treatment',
        ],
        popular: true,
      },
      {
        name: 'Prestige Detailing',
        price: 'IDR 2.500.000',
        features: [
          'Complete restoration',
          '3-stage paint correction',
          'Ceramic coating',
          'Paint sealant',
          'Annual maintenance',
        ],
      },
    ],
  },
  'ppf-paint-protection-film': {
    title: 'PPF',
    tagline: 'Invisible Armor for Your Paint',
    description: 'Paint Protection Film (PPF) provides the ultimate protection for your vehicle\'s paintwork. Self-healing technology ensures minor scratches disappear, keeping your car looking new.',
    benefits: [
      'Self-healing technology',
      'Invisible protection',
      'Stone chip prevention',
      'UV resistance',
      '10-year warranty',
      'Easy maintenance',
    ],
    packages: [
      {
        name: 'Front End Kit',
        price: 'IDR 3.500.000',
        features: [
          'Hood protection',
          'Front bumper',
          'Fender mirrors',
          'Headlights',
        ],
      },
      {
        name: 'Full Front',
        price: 'IDR 6.000.000',
        features: [
          'Complete front coverage',
          'Door cups',
          'A-pillars',
          'Full hood & bumper',
        ],
        popular: true,
      },
      {
        name: 'Full Body',
        price: 'IDR 25.000.000',
        features: [
          'Complete vehicle coverage',
          '10-year warranty',
          'Self-healing film',
          'Invisible finish',
          'Annual inspection',
        ],
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-8 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/20 px-4 py-1.5 text-sm text-primary-500">
              <Shield className="size-4" />
              Premium Service
            </div>
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-4 text-xl text-white/70">
              {service.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">About This Service</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Key Benefits</h2>
              <ul className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary-500">
                      <Check className="size-4 text-white" />
                    </div>
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="px-6 py-16 bg-background-7">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Choose Your Package
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {service.packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-8 transition-all ${
                  pkg.popular
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/10 bg-background-8'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-4 py-1 text-sm font-medium text-white">
                      <Star className="size-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="mt-4 text-3xl font-bold text-primary-500">{pkg.price}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-primary-500" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-8 block w-full rounded-full py-3 text-center font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Protect Your Vehicle?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Book your appointment today and experience the AutoSPA difference.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-600"
            >
              Book Now
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              <Clock className="size-5" />
              View Locations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}
