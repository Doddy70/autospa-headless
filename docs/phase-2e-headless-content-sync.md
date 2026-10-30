# Phase 2E — Headless Content Sync & Article API (Staging/Local)

**Status:** ✅ Complete — running on `http://localhost:3100`

Scope: mirror every static page of `autospajakarta.com` into the Next.js frontend as
static routes, and wire the article (blog) content of the production WordPress into the
staging frontend through API endpoints. **Nothing was deployed to production** - the
production site was only ever read.

---

## 1. What the production site actually is

| Item | Finding |
|------|---------|
| Pages | 19 published pages, built with **Elementor** (raw HTML + per-page CSS `post-<id>.css`) |
| Articles | 204 published posts, classic Gutenberg HTML (no Elementor) |
| Categories | 18 categories |
| Media | 850 attachments; only the ones referenced by the content are mirrored (111) |
| Web fonts | 14 families, hosted by Elementor on `v2.autospajakarta.com` - **that host no longer resolves** |
| WordPress MCP | The configured MCP server (`autospajakarta.com/wp-json/mcp/...`) exposes only three core abilities (`get-site-info`, `get-user-info`, `get-environment-info`). It has **no** post/page ability, so the content pipeline uses the REST API (read-only GET) instead. |

### Blocker found on the staging host

`https://backend.autospajakarta.com/graphql` answers **404** - nginx only routes
WordPress through `index.php`. Both APIs work through that file:

```
POST https://backend.autospajakarta.com/index.php?graphql
GET  https://backend.autospajakarta.com/index.php?rest_route=/wp/v2
```

The staging install carries the same 204 articles as the production site, but its
WPGraphQL schema exposes **no custom post types** (`services`, `serviceBy`,
`projects`, `locations`, `fAQs` are all absent), so the Phase 2D CPTs are not
registered there.

Consequence (updated): the CMS origin of the frontend is the **staging** install.
The article APIs and the GraphQL client read from it, and the production site
(`autospajakarta.com`) is not queried any more. The service catalogue falls back to
the static mirror while the CPTs are missing from the staging schema.

---

## 2. Static pages

### Approach

Production pages are Elementor layouts, so they are shipped as **snapshots**: the
Elementor markup plus the exact stylesheet/script list of that page.

```
scripts/sync/fetch.mjs          -> .cache/wp/{pages,posts,categories}.json + live HTML per page
scripts/sync/assets.mjs         -> mirrors CSS/JS/media into public/wp-content/**
scripts/sync/fonts.mjs          -> mirrors the Elementor Google fonts into public/wp-content/fonts
scripts/sync/build-manifest.mjs -> src/content/manifest.json + src/content/pages/<slug>.html
```

* The upload URLs are rewritten from `https://autospajakarta.com/wp-content/...` to
  `/wp-content/...`, and every file behind them is mirrored with the **same path**, so a
  rewrite is only "drop the origin".
* The stylesheets are rendered with React's `precedence` so they are hoisted into
  `<head>` and block paint - no flash of unstyled Elementor markup.
* The scripts are replayed **in document order** by `ElementorScripts` (a client
  component that appends each `<script>` and awaits it). Plain `<script>` tags do not
  keep that order: jQuery has to be in place before the plugins, and the Elementor
  inline config has to run before the Elementor frontend boots.
* Inline scripts that are templates (`<script type="text/mf">`, used by MetForm) stay in
  the DOM but are **not** executed - running them throws `Illegal return statement`.
* Analytics and ad pixels (GA, Meta, GTM) are deliberately **not** mirrored, so the
  staging site does not report into the production properties.

### Routes

| Route | Source |
|-------|--------|
| `/`, `/about`, `/contact`, `/services`, `/locations` | native React components (unchanged) |
| `/faq`, `/pricing`, `/team`, `/our-services`, `/blog-standard`, `/news-insight`, `/reservasi`, `/terms-conditions`, `/cookie-policy`, `/privacy-policy`, `/premium-wash`, `/premium-detailing`, `/nano-ceramic-coating`, `/premium-nano-ceramic-coating`, `/360-paint-protection-film-package`, `/premium-coating-lp` | `src/app/[slug]/page.tsx` - static (SSG), `dynamicParams = false` |

`/blog` and `/blog/...` are native React routes (see below), so they are not shadowed by
the catch-all.

### Web fonts

Elementor points its `@font-face` rules at `v2.autospajakarta.com`, which no longer
resolves, so the production site itself renders with fallback fonts. The mirror replaces
them with the matching **Google Fonts** files: Elementor names the file
`<family>-<hash>.woff2`, where `<hash>` is the lowercased basename of the Google file, so
the mapping is deterministic. 775 references / 189 files were recovered.

---

## 3. Article API (production -> staging frontend)

`src/lib/wordpress/rest.ts` is a read-only REST client. `WORDPRESS_REST_URL` selects the
origin, so the same code can be pointed at the staging host once the content is
migrated there.

| Endpoint | Purpose |
|----------|---------|
| `GET /api/articles?page=&perPage=&category=&search=&orderBy=&order=` | list, with pagination metadata (`total`, `totalPages`, `hasNext`, `hasPrev`). `category` accepts an id or a slug |
| `GET /api/articles/<slug>` | single article incl. category names; `404` when unknown, `502` when the origin is unreachable |
| `GET /api/categories` | categories with post counts |

Front-end routes built on top of them:

| Route | Rendering |
|-------|-----------|
| `/blog` | listing with category filter + pagination (SSR, `revalidate = 300`) |
| `/blog/<slug>` | article page, prerendered as SSG for all 204 articles, `revalidate = 300` |
| `/blog/category/<slug>` | category listing |

### The blog templates

The two blog routes follow the layout of the Agntix template that ships with the
project (`autospa-web-agntix`):

| Agntix source | AutoSPA component | Used by |
|---------------|-------------------|---------|
| `pages/blogs/blog-grid-2-col/BlogGridTwoCol.tsx` + `BlogListBreadCrumb` | `src/components/content/BlogHero.tsx` | `/blog`, `/blog/category/<slug>` |
| `components/blog/subComponents/BlogGridTwoItem.tsx` | `src/components/content/ArticleCard.tsx` | the card of the listing |
| `components/blog/BlogListPagination.tsx` | `src/components/content/BlogPagination.tsx` | the pagination of the listing |
| `pages/blogs/blog-details/BlogDeailsMain.tsx` + `postbox-details-*` | `src/components/content/ArticleHeader.tsx` | `/blog/<slug>` |
| `components/blog/BlogSidebar*.tsx` | `src/components/content/ArticleSidebar.tsx` | the sidebar of the article |
| `components/blog/PostboxComment.tsx` | `src/components/content/CommentList.tsx` | the comments of the article |
| `components/forms/PostboxDetailsForm.tsx` | `src/components/content/CommentForm.tsx` | the reply form of the article |

The Agntix markup is Bootstrap + SCSS (`tp-blog-masonry-item`, `postbox-details-*`,
`sidebar-widget`), which does not exist in this project, so every block is rebuilt
with Tailwind and the AutoSPA tokens (`--color-primary-500`).

**The comment form does not write to the CMS.** The WordPress REST API of the origin
answers `rest_comment_login_required` to an anonymous `POST /wp/v2/comments`, and the
CMS stays read-only, so the form hands the message to WhatsApp - the channel AutoSPA
Jakarta already uses for enquiries - instead of posting a comment. The comment *list*
is read from `GET /wp/v2/comments`, which works.

**The article images come from the media library.** `withArticleMeta()` resolves the
featured image, the author and the tags of every article with three batched REST
requests (`/media?include=`, `/users?include=`, `/tags?include=`), so a listing of
twelve articles costs five requests in total instead of one per article. The library
keeps a resized copy of every upload, and the card, the cover and the thumbnail pick
the size that matches their slot.

Each article page emits `BlogPosting` JSON-LD. The sitemap (`src/app/sitemap.ts`) now
lists the native routes, the 16 mirrored pages, the 18 categories and the 204 articles -
243 URLs in total.

---

## 4. Verification

```
npm run sync:verify    # every asset referenced by the mirrored content exists in public/
npm run sync:compare   # compares every rendered page with its mirrored source
```

Results:

* **16/16** mirrored pages match their source exactly (Elementor containers, widgets and
  headings).
* **0** console errors and **0** failed requests on the checked pages (`/faq`,
  `/our-services`, `/blog-standard`, `/team`, `/pricing`, `/premium-wash`).
* `tsc --noEmit` and `next build` are clean (34 static pages + 204 articles).

Eight assets cannot be mirrored because they are **already broken on production**: six
`avatar*.jpg` and `blog-arrow.png` point at the theme demo host
`hubfolio.themescamp.com`, and `post-763.css` returns 404 upstream.

---

## 6. `/about` — served from the production markup

`/about` is one of the pages that carries the real company story (the "Passion for
Detail" narrative, the brand partners, the `7k+` counter and the team roster). A
hand-written React version existed, but its copy was invented - it did **not** match
production.

The page is therefore served from the mirrored production markup again:

* `about` was removed from `NATIVE_SLUGS` (`src/lib/wordpress/pages.ts`), so the
  catch-all route in `src/app/(inner)/[slug]/page.tsx` renders the snapshot from
  `src/content/pages/about.html`.
* `src/app/(inner)/about/page.tsx` was deleted.
* The public URL did not change, and `/about` is back in the sitemap.

### Invalid markup in the production snapshot

The production page opens two `<b>` tags inside the "Passion for Detail" headline and
never closes them. A browser keeps those elements open until the end of the document, so
they swallowed the navigation and the footer of this app and broke the React hydration
(`Hydration failed because the server rendered HTML didn't match the client`).

`balanceInlineTags()` (`src/lib/wordpress/html.ts`) closes the inline tags a mirrored
page leaves open and drops the closing tags without an opening counterpart. It runs in
`ElementorPage` before the markup is injected, so the visual result stays the same as on
production while the stray elements no longer escape the page container. `about.html` was
the only affected snapshot; the other 18 pages were already balanced.

### Theme scripts that must not run here

The mirrored pages replay the scripts of production so the Elementor widgets work. Two
groups of them are filtered out in `src/components/content/ElementorScripts.tsx`:

| Script | Why it is skipped |
|--------|-------------------|
| `ScrollSmoother.min.js`, `app-animation.js` | The theme installs a GSAP smooth scroller that moves the whole document into a `.ScrollSmoother-wrapper`. React then cannot remove the page on the next navigation: *"Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."* |
| `smush-detector.min.js`, `smush-nextgen-fallback.min.js` | The WP-Smush plugin reports the LCP to `autospajakarta.com/wp-admin/admin-ajax.php`. The mirror never talks back to production and the request is blocked by CORS. |

The filtering is done at render time, so `src/content/manifest.json` stays a faithful
mirror of production.

### Verification

```bash
npm run compare:page about   # compares the local page with autospajakarta.com/about/
npm run check:nav /about     # one navigation, no overlap, no mobile overflow
```

`npm run compare:page about` reports **text identical**, **39/39 headings identical**,
**10/10 images identical** and **0 missing copy blocks** against the live production
page.

---

## 7. Commands

```bash
npm run dev            # http://localhost:3100
npm run build && npm run start

npm run sync:content   # fetch + assets + fonts + manifest (read-only against the origin)
npm run sync:verify    # asset completeness
npm run sync:compare   # page fidelity against the mirrored source
npm run compare:page   # parity of one page with the live production page
npm run check:nav      # navigation, overlap and mobile overflow of the inner pages
```

`public/wp-content/**` (≈30 MB of binaries) is gitignored - it is regenerated by
`npm run sync:content`. The content itself (`src/content/manifest.json`,
`src/content/pages/*.html`) **is** committed, so the build works without a sync.

---

## 8. Open items

1. **Staging GraphQL is down.** `backend.autospajakarta.com/graphql` returns 404 and
   WPGraphQL does not answer on `index.php`. The Phase 2D contract (service/location CPTs
   + GraphQL) is therefore unusable until the plugin is re-activated on the staging host.
   The current `/services` and `/locations` routes are static and unaffected.
2. **Article origin.** The articles are read from production. When the staging host
   carries the same posts, set `WORDPRESS_REST_URL=https://backend.autospajakarta.com/wp-json`
   (the `rest_route` query parameter may be needed for that host) and re-run
   `npm run sync:content`.
3. **Asset host `v2.autospajakarta.com`** is dead upstream as well - the Google Fonts
   mirror in this repo is the workaround, and the same fix should be applied on the
   production site.
4. `post-763.css` (Elementor CSS of the contact page) is 404 upstream.
