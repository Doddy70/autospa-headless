/**
 * WordPress REST access for articles (blog posts).
 *
 * The staging WordPress has no blog content and its GraphQL route is not
 * reachable, so the articles API is pointed at the production site - READ
 * ONLY, GET only. Nothing in this module ever writes to WordPress.
 *
 * `WORDPRESS_REST_URL` selects the origin, so the same code can be pointed
 * at the staging host once the content is migrated there.
 */

const DEFAULT_REST_URL = 'https://autospajakarta.com/wp-json';
const PRODUCTION_ORIGIN = 'https://autospajakarta.com';

const DEFAULT_REVALIDATE = 300;

export interface RestCategory {
  id: number;
  slug: string;
  name: string;
  count: number;
  description: string;
  parent: number;
}

export interface RestArticle {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: string;
  excerpt: string;
  content: string;
  categories: number[];
  featuredMedia: number;
  author: number;
  categoryNames: string[];
}

function restUrl(): string {
  return (process.env.WORDPRESS_REST_URL ?? DEFAULT_REST_URL).replace(/\/$/, '');
}

function revalidateSeconds(): number {
  const raw = process.env.WORDPRESS_REVALIDATE_SECONDS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REVALIDATE;
}

/**
 * Point every production upload at the copy that was mirrored into
 * `public/wp-content/...` by `scripts/sync/assets.mjs`.
 */
function localiseUploads(value: string): string {
  return value.split(PRODUCTION_ORIGIN).join('');
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function plainText(value: string): string {
  return decodeEntities(
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

async function restFetch<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const url = new URL(`${restUrl()}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: revalidateSeconds(), tags: ['wordpress', 'articles'] },
  });

  if (!response.ok) {
    throw new Error(`WordPress REST ${path} returned ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

interface RawPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories?: number[];
  featured_media?: number;
  author?: number;
}

export interface ArticleQuery {
  page?: number;
  perPage?: number;
  category?: number;
  search?: string;
  orderBy?: 'date' | 'modified' | 'title';
  order?: 'asc' | 'desc';
  include?: number[];
}

export interface ArticlePage {
  articles: RestArticle[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export async function fetchArticles(query: ArticleQuery = {}): Promise<ArticlePage> {
  const {
    page = 1,
    perPage = 12,
    category,
    search,
    orderBy = 'date',
    order = 'desc',
    include,
  } = query;

  const params: Record<string, string | number> = {
    per_page: perPage,
    page,
    orderby: orderBy,
    order,
    _fields: 'id,slug,date,modified,link,title,excerpt,content,categories,featured_media,author',
  };
  if (category) params.categories = category;
  if (search) params.search = search;
  if (include?.length) params.include = include.join(',');

  const url = new URL(`${restUrl()}/wp/v2/posts`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: revalidateSeconds(), tags: ['wordpress', 'articles'] },
  });

  if (!response.ok) {
    throw new Error(`WordPress REST posts returned ${response.status}`);
  }

  const raw = (await response.json()) as RawPost[];
  const total = Number(response.headers.get('X-WP-Total') ?? raw.length);
  const totalPages = Number(response.headers.get('X-WP-TotalPages') ?? 1);

  return {
    articles: raw.map((post) => normalisePost(post)),
    total,
    totalPages,
    page,
    perPage,
  };
}

export async function fetchArticleBySlug(slug: string): Promise<RestArticle | null> {
  const raw = await restFetch<RawPost[]>('/wp/v2/posts', {
    slug,
    per_page: 1,
    _fields: 'id,slug,date,modified,link,title,excerpt,content,categories,featured_media,author',
  });

  const post = raw[0];
  return post ? normalisePost(post) : null;
}

export async function fetchCategories(): Promise<RestCategory[]> {
  const raw = await restFetch<
    { id: number; slug: string; name: string; count: number; description: string; parent: number }[]
  >('/wp/v2/categories', { per_page: 100, orderby: 'count', order: 'desc' });

  return raw.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: decodeEntities(category.name),
    count: category.count,
    description: decodeEntities(category.description),
    parent: category.parent,
  }));
}

function normalisePost(post: RawPost): RestArticle {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    link: post.link,
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered),
    content: localiseUploads(post.content.rendered),
    categories: post.categories ?? [],
    featuredMedia: post.featured_media ?? 0,
    author: post.author ?? 0,
    categoryNames: [],
  };
}

/** Map article category ids to their names, for cards and breadcrumbs. */
export async function withCategoryNames(articles: RestArticle[]): Promise<RestArticle[]> {
  if (articles.length === 0) return articles;

  const ids = [...new Set(articles.flatMap((article) => article.categories))];
  const categories = await fetchCategories();
  const names = new Map(categories.map((category) => [category.id, category.name]));

  return articles.map((article) => ({
    ...article,
    categoryNames: article.categories
      .map((id) => names.get(id))
      .filter((name): name is string => Boolean(name)),
  }));
}
