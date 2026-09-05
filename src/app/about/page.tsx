import { Award, Users, Clock, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Happy Customers', value: '1000+', icon: Users },
  { label: 'Years Experience', value: '5+', icon: Clock },
  { label: 'Customer Rating', value: '4.9/5', icon: ThumbsUp },
  { label: 'Awards Won', value: '12', icon: Award },
];

const values = [
  {
    title: 'Premium Quality',
    description: 'We use only the finest products and latest techniques to ensure your vehicle receives the best care possible.',
  },
  {
    title: 'Expert Team',
    description: 'Our trained professionals have years of experience in automotive detailing and are passionate about what they do.',
  },
  {
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond to exceed your expectations every time.',
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees or surprises. We believe in honest, upfront pricing for all our services.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-8 pt-24">
      {/* Hero */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            About AutoSPA
          </h1>
          <p className="mt-4 text-xl text-white/70">
            Engineered for the Enthusiast
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Our Story</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                AutoSPA Jakarta was founded with a simple mission: to provide premium automotive
                detailing services that exceed expectations. We understand that your vehicle is more
                than just transportation—it's an expression of your personality and passion.
              </p>
              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Our team of dedicated professionals combines years of experience with cutting-edge
                techniques and premium products. From nano ceramic coatings that protect your paint
                to meticulous interior detailing, we treat every vehicle as if it were our own.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-background-7 p-6 text-center">
                    <stat.icon className="mx-auto size-8 text-primary-500" />
                    <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background-7 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-background-8 p-8">
                <h3 className="text-xl font-bold text-white">{value.title}</h3>
                <p className="mt-3 text-white/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white">
            Experience the AutoSPA Difference
          </h2>
          <p className="mt-4 text-white/70">
            Book your appointment today and see why our customers trust us with their vehicles.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-600"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
