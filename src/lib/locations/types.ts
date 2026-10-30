/**
 * Location domain for the presentation layer.
 *
 * Two sources feed the branch directory:
 *
 *   - WordPress (via `lib/wordpress/repositories/locations`) - the headless
 *     origin. It is the source of truth once the CMS is connected.
 *   - `data/contact.ts` - the static mirror of the published production
 *     contact page. It fills the gaps and takes over completely while the
 *     GraphQL endpoint is unreachable.
 *
 * Both are mapped into the shape below, so a component never has to know
 * where a branch came from.
 */

/** Where a branch was read from. */
export type LocationSource = 'wordpress' | 'static';

/** One branch of the directory. */
export interface LocationCard {
  /** Branch slug, the same key in the CMS and in the branch directory. */
  slug: string;
  /** The name of the workshop. */
  name: string;
  /** The published address, one line. */
  address: string;
  /** The published phone numbers - the first one is the workshop line. */
  phones: string[];
  /** The WhatsApp line of the branch, digits only, ready for a wa.me URL. */
  whatsapp: string | null;
  /** The opening hours, as one line. */
  hours: string | null;
  /** The embeddable Google Maps URL of the branch. */
  mapsUrl: string | null;
  /** Which origin the branch was read from. */
  source: LocationSource;
}
