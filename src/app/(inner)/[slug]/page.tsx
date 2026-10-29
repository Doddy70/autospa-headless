import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ElementorPage from '@/components/content/ElementorPage';
import { getPage, readPageHtml, staticPageSlugs } from '@/lib/wordpress/pages';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return staticPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    return { title: 'Halaman tidak ditemukan' };
  }

  const canonical = `/` + page.slug;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function StaticPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    notFound();
  }

  const html = await readPageHtml(page.slug);

  return (
    <>
      {page.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.jsonLd }}
        />
      ) : null}
      <ElementorPage page={page} html={html} />
    </>
  );
}
