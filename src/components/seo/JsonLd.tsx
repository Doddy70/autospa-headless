/**
 * Structured data injector.
 *
 * Kept in one component so no page hand-rolls a <script> tag. The payload is
 * built by `lib/schema/*` from resolved CMS data only.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Server-rendered from CMS values we control; JSON.stringify escapes the
      // payload and `<` is neutralised so a stray "</script>" cannot break out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
