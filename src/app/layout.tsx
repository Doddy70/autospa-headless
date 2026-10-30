import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/shared/footer/Footer';
import Header from '@/components/layout/Header';
import BeautyCarePopup from '@/components/layout/BeautyCarePopup';
import { resolvePopupMasterEnabled } from '@/config/popup';
import { PopupProvider } from '@/context/PopupContext';

// Load Inter font with optimal settings for Core Web Vitals
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030810',
};

export const metadata: Metadata = {
  title: 'AutoSPA Jakarta | Premium Automotive Detailing',
  description:
    'Premium automotive detailing and car wash services in Jakarta. Engineered for the enthusiast.',
  keywords: ['auto detailing', 'car wash', 'ceramic coating', 'Jakarta', 'PPF', 'paint protection'],
  authors: [{ name: 'AutoSPA Jakarta' }],
  openGraph: {
    title: 'AutoSPA Jakarta | Premium Automotive Detailing',
    description: 'Premium automotive detailing and car wash services in Jakarta.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://autospajakarta.com',
    siteName: 'AutoSPA Jakarta',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoSPA Jakarta | Premium Automotive Detailing',
    description: 'Premium automotive detailing and car wash services in Jakarta.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/auto-logo.png',
    apple: '/assets/auto-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The site wide switch of the admin. It is read on the server, so the
  // Beauty Care popout can be switched off without a rebuild.
  const popupEnabled = resolvePopupMasterEnabled();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepairShop',
    name: 'AutoSPA Jakarta',
    description: 'Premium automotive detailing and car wash services in Jakarta.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://autospajakarta.com',
    image: '/assets/auto-logo.png',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    telephone: '+62-819-3777-3888',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '18:00',
    },
  };

  return (
    <html lang="id" className={`dark ${inter.variable}`}>
      <head>
        {/* Preconnect to WordPress backend for faster image loading */}
        <link rel="preconnect" href="https://backend.autospajakarta.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://backend.autospajakarta.com" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background-8 text-white antialiased">
        <PopupProvider masterEnabled={popupEnabled}>
          <Header />
          <main>{children}</main>
          <Footer />
          <BeautyCarePopup />
        </PopupProvider>
      </body>
    </html>
  );
}
