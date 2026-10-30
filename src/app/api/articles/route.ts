import { NextResponse } from 'next/server';

import {
  fetchArticles,
  fetchCategories,
  withArticleMeta,
  withCategoryNames,
} from '@/lib/wordpress/rest';

export const revalidate = 300;

const PER_PAGE_MAX = 50;

/**
 * GET /api/articles
 *
 * Articles served from the WordPress REST API of the configured origin
 * (production by default, read-only).
 *
 * Query parameters:
 *   page      1-based page number            (default 1)
 *   perPage   items per page, max 50          (default 12)
 *   category  category id or slug
 *   search    full text search term
 *   orderBy   date | modified | title         (default date)
 *   order     asc | desc                      (default desc)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const perPage = Math.min(
    PER_PAGE_MAX,
    Math.max(1, Number(searchParams.get('perPage') ?? '12') || 12),
  );
  const search = searchParams.get('search')?.trim() || undefined;
  const orderByParam = searchParams.get('orderBy');
  const orderBy =
    orderByParam === 'modified' || orderByParam === 'title' ? orderByParam : 'date';
  const orderParam = searchParams.get('order');
  const order = orderParam === 'asc' ? 'asc' : 'desc';

  const categoryParam = searchParams.get('category')?.trim();
  let categoryId: number | undefined;

  if (categoryParam) {
    if (/^\d+$/.test(categoryParam)) {
      categoryId = Number(categoryParam);
    } else {
      const categories = await fetchCategories();
      const match = categories.find((category) => category.slug === categoryParam);
      if (!match) {
        return NextResponse.json(
          { error: 'unknown_category', category: categoryParam },
          { status: 404 },
        );
      }
      categoryId = match.id;
    }
  }

  try {
    const result = await fetchArticles({
      page,
      perPage,
      category: categoryId,
      search,
      orderBy,
      order,
    });

    const articles = await withArticleMeta(await withCategoryNames(result.articles));

    return NextResponse.json({
      articles,
      pagination: {
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1,
      },
    });
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
