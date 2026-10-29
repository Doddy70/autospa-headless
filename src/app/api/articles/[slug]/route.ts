import { NextResponse } from 'next/server';

import { fetchArticleBySlug, withCategoryNames } from '@/lib/wordpress/rest';

export const revalidate = 300;

/**
 * GET /api/articles/<slug>
 *
 * Single article, resolved from the WordPress REST API of the configured
 * origin (production by default, read-only).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const article = await fetchArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'not_found', slug }, { status: 404 });
    }

    const [withNames] = await withCategoryNames([article]);

    return NextResponse.json({ article: withNames });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'upstream_unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}
