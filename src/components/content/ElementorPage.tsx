import ElementorScripts, { type ScriptAsset } from '@/components/content/ElementorScripts';
import type { PageAsset } from '@/lib/wordpress/pages';
import { balanceInlineTags } from '@/lib/wordpress/html';

/**
 * Renders a WordPress page snapshot (Elementor markup) inside the Next.js
 * shell.
 *
 * The production theme styles the page with ~60 stylesheets and ~70 scripts
 * (Elementor core + widgets + the hubfolio theme). All of them are mirrored
 * locally under `public/wp-content/...`, so the page renders identically
 * without touching production at request time.
 *
 * The stylesheets are declared with `precedence` so React hoists them into
 * <head> and blocks paint until they are ready - that avoids the flash of
 * unstyled Elementor markup. The scripts are replayed in document order by
 * `ElementorScripts`, because jQuery and the Elementor configuration have to
 * run before the plugins that depend on them.
 */
export default function ElementorPage({
  page,
  html,
}: {
  page: PageAsset;
  html: string;
}) {
  const assets = page.assets ?? [];

  const stylesheets = [
    ...new Set(
      assets.filter((asset) => asset.kind === 'style').map((asset) => asset.src as string),
    ),
  ];

  const executable: ScriptAsset[] = assets
    .filter((asset) => asset.kind === 'script' || asset.kind === 'inline')
    .filter((asset) => {
      if (asset.kind === 'inline') {
        // `<script type="text/mf">` and friends are templates, not code -
        // the browser never executes them, and neither should we.
        const type = asset.type ?? '';
        return type === '' || type === 'text/javascript' || type === 'application/javascript';
      }
      return true;
    });

  // Templates stay in the DOM so the plugin that owns them can read them.
  const templates = assets.filter(
    (asset) => asset.kind === 'inline' && !executable.includes(asset),
  );

  return (
    <>
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="elementor" />
      ))}

      <div
        className={page.bodyClass ? `wp-page ${page.bodyClass}` : 'wp-page'}
        data-elementor-id={page.elementorId}
        dangerouslySetInnerHTML={{ __html: balanceInlineTags(html) }}
      />

      {templates.map((asset, index) => (
        <script
          key={`${asset.type}-${index}`}
          type={asset.type}
          dangerouslySetInnerHTML={{ __html: asset.code ?? '' }}
        />
      ))}

      <ElementorScripts assets={executable} />
    </>
  );
}
