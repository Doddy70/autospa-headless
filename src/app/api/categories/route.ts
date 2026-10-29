import { NextResponse } from 'next/server';

import { fetchCategories } from '@/lib/wordpress/rest';

export const revalidate = 300;

/**
 * GET /api/categories
 *
 * Article categories with their post counts, used by the blog filter bar and
 * the category pages.
 */
export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ categories });
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
