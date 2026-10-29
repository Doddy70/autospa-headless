'use client';

import { useEffect } from 'react';

export interface ScriptAsset {
  kind: 'style' | 'script' | 'inline';
  src?: string;
  code?: string;
  type?: string;
}

/** Scripts that were already injected, so Strict Mode does not run them twice. */
const loaded = new Set<string>();

/**
 * Scripts of the production theme that must not run inside this app.
 *
 * - `ScrollSmoother` and `app-animation` install a GSAP smooth scroller that
 *   moves the whole document into a wrapper of its own. React then fails to
 *   remove the page on the next navigation ("The node to be removed is not a
 *   child of this node"), and the smooth scrolling of the theme conflicts
 *   with the scroll handling of this shell anyway.
 * - The `wp-smush` scripts measure the LCP of the page and report it to
 *   `autospajakarta.com/wp-admin/admin-ajax.php`. The mirror never talks
 *   back to production - the request is blocked by CORS anyway and shows up
 *   as an error in the console.
 */
const SKIPPED_SCRIPTS = [
  'ScrollSmoother.min.js',
  'app-animation.js',
  'smush-detector.min.js',
  'smush-nextgen-fallback.min.js',
];

/** Whether a script of the mirrored page may be replayed. */
function isAllowed(src: string | undefined): boolean {
  if (!src) return false;
  return !SKIPPED_SCRIPTS.some((skipped) => src.includes(skipped));
}

function loadScript(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  loaded.add(src);

  return new Promise((resolve) => {
    const element = document.createElement('script');
    element.src = src;
    element.async = false;
    element.addEventListener('load', () => resolve());
    element.addEventListener('error', () => {
      console.error(`[elementor] failed to load ${src}`);
      resolve();
    });
    document.body.appendChild(element);
  });
}

/**
 * Loads the scripts of a mirrored WordPress page in document order.
 *
 * The production pages load jQuery, then a long list of plugins, then the
 * Elementor frontend, and only then their inline configuration. Rendering
 * them as plain <script> tags in a server component does not preserve that
 * order (React hoists them), so they are injected here one by one instead:
 * each script is awaited before the next one is added.
 */
export default function ElementorScripts({ assets }: { assets: ScriptAsset[] }) {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (const asset of assets) {
        if (cancelled) return;

        if (asset.kind === 'script' && asset.src) {
          if (!isAllowed(asset.src)) continue;
          await loadScript(asset.src);
          continue;
        }

        if (asset.kind === 'inline' && asset.code) {
          try {
            (0, eval)(asset.code);
          } catch (error) {
            console.error('[elementor] inline script failed:', error);
          }
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [assets]);

  return null;
}
