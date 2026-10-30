/**
 * WPGraphQL transport.
 *
 * Phase 1C RULE 7: GraphQL is never called from a UI component. This module is
 * imported only by `lib/wordpress/repositories/*`.
 *
 * The staging schema answers some optional ACF repeaters with null, and it
 * used to throw on others. GraphQL answers those with BOTH a partial `data`
 * payload AND a per-path entry in `errors` - the field comes back null while
 * every sibling resolves normally.
 *
 * So this client deliberately does NOT throw on `errors`. It converts them
 * into a set of dotted field paths (`service.serviceContent.benefits`) that the
 * repository layer reads to mark a field "unavailable" rather than "empty".
 * Only transport-level failures - network, non-2xx, unparseable body - throw.
 */

/**
 * The GraphQL endpoint of the staging install.
 *
 * The staging host routes WordPress through `index.php`; the `/graphql` path
 * answers 404 on nginx.
 */
const DEFAULT_GRAPHQL_URL = 'https://backend.autospajakarta.com/index.php?graphql';

const DEFAULT_REVALIDATE = 300;

export interface GraphQLError {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface WpQueryResult<T> {
  data: T | null;
  /** Dotted paths of fields whose resolver failed. Array indices are dropped. */
  unavailable: Set<string>;
  errors: GraphQLError[];
}

export class WordPressTransportError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'WordPressTransportError';
  }
}

function endpoint(): string {
  const url = process.env.WORDPRESS_GRAPHQL_URL?.trim();
  /* The staging endpoint is the default, so the app also runs without a
     .env.local file. */
  return url || DEFAULT_GRAPHQL_URL;
}

function revalidateSeconds(): number {
  const raw = process.env.WORDPRESS_REVALIDATE_SECONDS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REVALIDATE;
}

/**
 * `["service", "serviceContent", "benefits"]` -> `"service.serviceContent.benefits"`.
 * Numeric segments are dropped so a failure inside row 3 of a repeater still
 * marks the whole repeater unavailable, which is the only actionable signal.
 */
function toDottedPath(path: (string | number)[] | undefined): string | null {
  if (!path || path.length === 0) return null;
  const parts = path.filter((p): p is string => typeof p === 'string');
  return parts.length > 0 ? parts.join('.') : null;
}

export interface WpQueryOptions {
  variables?: Record<string, unknown>;
  /** Cache tags for on-demand revalidation (Phase 1C section 7). */
  tags?: string[];
  revalidate?: number;
}

export async function wpQuery<T>(
  query: string,
  options: WpQueryOptions = {},
): Promise<WpQueryResult<T>> {
  const { variables, tags = [], revalidate } = options;

  let response: Response;
  try {
    response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: revalidate ?? revalidateSeconds(),
        tags: ['wordpress', ...tags],
      },
    });
  } catch (cause) {
    throw new WordPressTransportError(
      `GraphQL request failed: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }

  if (!response.ok) {
    throw new WordPressTransportError(
      `GraphQL endpoint returned ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  let body: { data?: T | null; errors?: GraphQLError[] };
  try {
    body = (await response.json()) as typeof body;
  } catch {
    throw new WordPressTransportError('GraphQL response was not valid JSON');
  }

  const errors = body.errors ?? [];
  const unavailable = new Set<string>();
  for (const error of errors) {
    const dotted = toDottedPath(error.path);
    if (dotted) unavailable.add(dotted);
  }

  /*
   * A response with errors but no `data` at all is a query-level failure
   * (validation, syntax, auth) - not a degraded field. That is a bug in our
   * query, so surface it loudly instead of rendering an empty page.
   */
  if (body.data == null && errors.length > 0) {
    throw new WordPressTransportError(
      `GraphQL query rejected: ${errors.map((e) => e.message).join('; ')}`,
    );
  }

  if (errors.length > 0) {
    console.warn(
      '[wordpress] degraded fields:',
      [...unavailable].join(', ') || '(unknown path)',
    );
  }

  return { data: body.data ?? null, unavailable, errors };
}
