'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-8 pt-24">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="rounded-2xl border border-primary-500/50 bg-primary-500/10 p-12">
            <h2 className="text-3xl font-bold text-white">Thank You!</h2>
            <p className="mt-4 text-white/70">
              Your message has been received. Our team will contact you within 24 hours.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-primary-500 px-8 py-3 text-white transition-colors hover:bg-primary-600"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-8 pt-24">
      {/* Hero */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mt-4 text-xl text-white/70">
            Book your appointment or ask us anything
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-background-7 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/70">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-background-8 px-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-background-8 px-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white/70">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-background-8 px-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:outline-none"
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-medium text-white/70">
                    Service Interested
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-background-8 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select a service</option>
                    <option value="nano-ceramic-coating">Nano Ceramic Coating</option>
                    <option value="premium-wash">Premium Wash</option>
                    <option value="premium-detailing">Premium Detailing</option>
                    <option value="ppf">PPF</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-background-8 px-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:outline-none"
                    placeholder="Tell us about your vehicle and what you're looking for..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary-500 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-background-7 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 size-6 text-primary-500" />
                    <div>
                      <h3 className="font-semibold text-white">Phone</h3>
                      <p className="text-white/70">+62 21 660 1234</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 size-6 text-primary-500" />
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-white/70">info@autospajakarta.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 size-6 text-primary-500" />
                    <div>
                      <h3 className="font-semibold text-white">Main Location</h3>
                      <p className="text-white/70">Jl. Pluit Selatan No. 123, Jakarta Utara</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 size-6 text-primary-500" />
                    <div>
                      <h3 className="font-semibold text-white">Business Hours</h3>
                      <p className="text-white/70">Mon - Sat: 08:00 - 18:00</p>
                      <p className="text-white/50 text-sm">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background-7 p-8">
                <h2 className="mb-4 text-xl font-bold text-white">Quick Links</h2>
                <div className="space-y-3">
                  <Link
                    href="/locations"
                    className="block text-primary-500 hover:underline"
                  >
                    View Our Locations →
                  </Link>
                  <Link
                    href="/service/nano-ceramic-coating"
                    className="block text-primary-500 hover:underline"
                  >
                    Nano Ceramic Coating →
                  </Link>
                  <Link
                    href="/service/premium-wash"
                    className="block text-primary-500 hover:underline"
                  >
                    Premium Wash →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
