/**
 * Article body rendered from the WordPress REST API.
 *
 * The HTML is authored by the CMS the site owns, so it is injected rather
 * than escaped - the same decision the `RichText` component makes. Styling
 * lives in `src/styles/article.css`.
 */
export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="article-body mx-auto max-w-3xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
