import AutoSpaFeaturesSection from '@/components/home/sections/AutoSpaFeaturesSection';
import BeforeAfterSection from '@/components/home/sections/BeforeAfterSection';
import DesignAgencyVideo from '@/components/home/sections/DesignAgencyVideo';
import GalleryBanner from '@/components/home/sections/GalleryBanner';
import Hero from '@/components/home/hero/Hero';
import ParallaxShowcase from '@/components/home/sections/ParallaxShowcase';
import ServiceShowcase from '@/components/home/sections/ServiceShowcase';
import { listServiceCards } from '@/lib/services/catalog';

/* The catalogue is re-read every five minutes, so the page follows the CMS
   as soon as it answers - and picks up the mirror again when it does not. */
export const revalidate = 300;

export default async function HomePage() {
  /*
   * The service rows are read on the server so the catalogue can come from
   * WordPress (with the static mirror as its fallback) instead of being
   * hardcoded in the page.
   */
  const services = await listServiceCards();

  return (
    <>
      {/* Main content container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          // `clip` instead of `hidden`: `hidden` turns the element into a
          // scroll container, which breaks the pinned scroll animation of the
          // video band. `clip` hides the overflow without scrolling.
          overflowX: 'clip',
        }}
      >
        {/* Hero Section */}
        <Hero />

        {/* Video Band */}
        <DesignAgencyVideo />

        {/* Gallery Banner */}
        <GalleryBanner />

        {/* AutoSpa Features Section */}
        <AutoSpaFeaturesSection />

        {/* Before & After gallery */}
        <BeforeAfterSection />

        {/* Service catalogue */}
        <ServiceShowcase items={services} />

        {/* Horizontal Showcase */}
        <ParallaxShowcase />
      </div>
    </>
  );
}
