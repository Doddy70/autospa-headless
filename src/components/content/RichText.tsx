/**
 * WordPress WYSIWYG output.
 *
 * The HTML comes from the CMS the site owns, and editors legitimately use
 * markup here, so it is injected rather than escaped. Styling lives in the
 * `.rich-text` class in globals.css so no Tailwind typography plugin is needed
 * for this one field.
 */
export function RichText({ html }: { html: string }) {
  return (
    <div
      className="rich-text max-w-3xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
