/**
 * WordPress REST access for articles (blog posts).
 *
 * The origin is the staging install, `https://backend.autospajakarta.com`.
 * Its nginx only routes WordPress through `index.php`, so the REST API is
 * reached with the `rest_route` query parameter instead of the `/wp-json`
 * path - the same trick WordPress itself uses when the pretty permalinks are
 * off.
 *
 * `WORDPRESS_REST_URL` selects the origin, so the same code can be pointed
 * at a `/wp-json` host by setting `.../wp-json` instead.
 *
 * READ ONLY: this module only ever issues GET requests.
 */

const DEFAULT_REST_URL = 'https://backend.autospajakarta.com/index.php?rest_route=/wp/v2';

/**
 * The origins whose uploads are mirrored into `public/wp-content/...`.
 *
 * The current origin is the staging install; the production origin is kept
 * so the older mirrored markup keeps resolving to the local copies.
 */
const UPLOAD_ORIGINS = [
  'https://backend.autospajakarta.com',
  'https://autospajakarta.com',
];

const DEFAULT_REVALIDATE = 300;

export interface RestCategory {
  id: number;
  slug: string;
  name: string;
  count: number;
  description: string;
  parent: number;
}

/** A comment of an article. */
export interface RestComment {
  id: number;
  author: string;
  date: string;
  content: string;
  /** True for a reply to another comment. */
  child: boolean;
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
  tags: number[];
  featuredMedia: number;
  author: number;
  categoryNames: string[];
  /** Tag names of the article. */
  tagNames: string[];
  /** Featured image, resolved from the media library. */
  image: ArticleImage | null;
  /** Author name, resolved from the users endpoint. */
  authorName: string;
}

/** A featured image of an article. */
export interface ArticleImage {
  id: number;
  /** Wide crop, used by the card and the cover of an article. */
  url: string;
  /** The widest generated crop, used by the cover of an article. */
  largeUrl: string;
  /** Square crop of the same image, used for the author/category thumbnails. */
  squareUrl: string;
  alt: string;
  width: number;
  height: number;
}

function restUrl(): string {
  return (process.env.WORDPRESS_REST_URL ?? DEFAULT_REST_URL).replace(/\/$/, '');
}

/**
 * Builds a REST URL.
 *
 * Two shapes are supported:
 *   - `https://host/wp-json` - the path is appended to the base,
 *   - `https://host/index.php?rest_route=/wp/v2` - the path is appended to
 *     the `rest_route` parameter, which is how the staging host is routed.
 */
function buildRestUrl(path: string, params: Record<string, string | number> = {}): URL {
  const base = restUrl();
  const url = new URL(base);

  if (url.searchParams.has('rest_route')) {
    url.searchParams.set('rest_route', `${url.searchParams.get('rest_route')}${path}`);
  } else {
    url.pathname = `${base}${path}`;
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url;
}

function revalidateSeconds(): number {
  const raw = process.env.WORDPRESS_REVALIDATE_SECONDS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REVALIDATE;
}

/**
 * Point every upload at the copy that was mirrored into
 * `public/wp-content/...` by `scripts/sync/assets.mjs`.
 */
function localiseUploads(value: string): string {
  return UPLOAD_ORIGINS.reduce(
    (result, origin) => result.split(origin).join(''),
    value,
  );
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

/**
 * Demote the headings of an article body by one level.
 *
 * The CMS authors its section headings as `<h1>`, but the article page
 * already carries the headline of the article as its `<h1>` - a document may
 * only have one. Every heading of the body therefore moves down one step, so
 * the outline of the page stays correct.
 */
function demoteHeadings(value: string): string {
  return value.replace(
    /<h([1-5])(\s[^>]*)?>/gi,
    (_match, level: string, attributes = '') =>
      `<h${Math.min(6, Number(level) + 1)}${attributes}>`,
  );
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
  const url = buildRestUrl(path, params);

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
  tags?: number[];
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
    _fields: 'id,slug,date,modified,link,title,excerpt,content,categories,tags,featured_media,author',
  };
  if (category) params.categories = category;
  if (search) params.search = search;
  if (include?.length) params.include = include.join(',');

  const url = buildRestUrl('/posts', params);

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
  const raw = await restFetch<RawPost[]>('/posts', {
    slug,
    per_page: 1,
    _fields: 'id,slug,date,modified,link,title,excerpt,content,categories,tags,featured_media,author',
  });

  const post = raw[0];
  return post ? normalisePost(post) : null;
}

export async function fetchCategories(): Promise<RestCategory[]> {
  const raw = await restFetch<
    { id: number; slug: string; name: string; count: number; description: string; parent: number }[]
  >('/categories', { per_page: 100, orderby: 'count', order: 'desc' });

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
    content: demoteHeadings(localiseUploads(post.content.rendered)),
    categories: post.categories ?? [],
    tags: post.tags ?? [],
    featuredMedia: post.featured_media ?? 0,
    author: post.author ?? 0,
    categoryNames: [],
    tagNames: [],
    image: null,
    authorName: 'AutoSPA Jakarta',
  };
}

/**
 * Map article category ids to their names, for cards and breadcrumbs.
 */
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

/**
 * Fetch the comments of an article.
 *
 * READ ONLY: the origin refuses anonymous comments, so the list can only ever
 * be read. The form of the article page sends its message to WhatsApp.
 */
export async function fetchCommentsByPost(postId: number): Promise<RestComment[]> {
  const raw = await restFetch<
    {
      id: number;
      author_name?: string;
      date?: string;
      content?: { rendered?: string };
      parent?: number;
    }[]
  >('/comments', {
    post: postId,
    per_page: 50,
    order: 'asc',
    _fields: 'id,author_name,date,content,parent',
  });

  return raw.map((comment) => ({
    id: comment.id,
    author: decodeEntities(comment.author_name ?? 'Anonim'),
    date: comment.date ?? '',
    content: plainText(comment.content?.rendered ?? ''),
    child: (comment.parent ?? 0) > 0,
    parent: comment.parent ?? 0,
  }));
}

/**
 * Attach the featured image, the author name and the tag names to every
 * article.
 *
 * The media library, the user directory and the tag taxonomy are read in one
 * request each, so a listing of twelve articles costs five requests in total -
 * the same budget the templates spent on their own API calls.
 */
export async function withArticleMeta(articles: RestArticle[]): Promise<RestArticle[]> {
  if (articles.length === 0) return articles;

  const mediaIds = [...new Set(articles.map((article) => article.featuredMedia).filter(Boolean))];
  const authorIds = [...new Set(articles.map((article) => article.author).filter(Boolean))];
  const tagIds = [...new Set(articles.flatMap((article) => article.tags))];

  const [media, authors, tags] = await Promise.all([
    fetchMediaByIds(mediaIds),
    fetchAuthorsByIds(authorIds),
    fetchTagsByIds(tagIds),
  ]);

  return articles.map((article) => ({
    ...article,
    image: media.get(article.featuredMedia) ?? null,
    authorName: authors.get(article.author) ?? 'AutoSPA Jakarta',
    tagNames: article.tags
      .map((id) => tags.get(id))
      .filter((name): name is string => Boolean(name)),
  }));
}

/** Fetch a set of tags by id, keyed by their id. */
export async function fetchTagsByIds(ids: number[]): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  const raw = await restFetch<{ id: number; name?: string }[]>('/tags', {
    include: ids.join(','),
    per_page: Math.min(ids.length, 100),
    _fields: 'id,name',
  });

  for (const item of raw) {
    if (item.name) result.set(item.id, decodeEntities(item.name));
  }

  return result;
}

/** Fetch a set of attachments by id, keyed by their id. */
export async function fetchMediaByIds(ids: number[]): Promise<Map<number, ArticleImage>> {
  const result = new Map<number, ArticleImage>();
  if (ids.length === 0) return result;

  const raw = await restFetch<
    {
      id: number;
      source_url?: string;
      alt_text?: string;
      media_details?: {
        width?: number;
        height?: number;
        sizes?: Record<string, { source_url?: string; width?: number; height?: number }>;
      };
    }[]
  >('/media', {
    include: ids.join(','),
    per_page: Math.min(ids.length, 100),
    _fields: 'id,source_url,alt_text,media_details',
  });

  for (const item of raw) {
    if (!item.source_url) continue;

    // The library keeps a resized copy of every upload. The card and the hero
    // of an article pick the size that matches the layout, so the browser
    // never downloads the (often much heavier) original.
    const sizes = item.media_details?.sizes ?? {};
    const wide = sizes.medium_large ?? sizes.large;
    const large = sizes.large ?? sizes['1536x1536'] ?? wide;
    const square = sizes.thumbnail ?? sizes.medium ?? wide;

    result.set(item.id, {
      id: item.id,
      url: wide?.source_url ?? item.source_url,
      largeUrl: large?.source_url ?? item.source_url,
      alt: item.alt_text ?? '',
      width: wide?.width ?? item.media_details?.width ?? 0,
      height: wide?.height ?? item.media_details?.height ?? 0,
      squareUrl: square?.source_url ?? wide?.source_url ?? item.source_url,
    });
  }

  return result;
}

/** Fetch a set of users by id, keyed by their id. */
export async function fetchAuthorsByIds(ids: number[]): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  const raw = await restFetch<{ id: number; name?: string }[]>('/users', {
    include: ids.join(','),
    per_page: Math.min(ids.length, 100),
    _fields: 'id,name',
  });

  for (const item of raw) {
    if (item.name) result.set(item.id, decodeEntities(item.name));
  }

  return result;
}
