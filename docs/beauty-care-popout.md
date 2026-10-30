# AutoSPA Beauty Care Popout

The campaign popout on the homepage. It replaces the Agntix email-subscribe
popup that was ported earlier.

## Where it lives

```
src/app/layout.tsx          (server component)
└─ <PopupProvider masterEnabled={popupEnabled}>
   ├─ <Header />            the bell only - the popout is not inside it
   ├─ <main>{children}</main>
   ├─ <Footer />
   └─ <BeautyCarePopup />   the popout
```

The popout is mounted in the **root layout**, not in the header and not in
`page.tsx`. The bell in the header has to open it, so both need the same
`PopupProvider`, and the provider has to sit above the header.

The "only on the homepage" rule is enforced in the context, not in the mount
position:

| Rule | Where |
|---|---|
| Opens only on `/` | `open()` refuses when `pathname !== '/'` |
| Leaves when the route changes | effect in `PopupContext`: closes it |
| The bell on an inner page does not open it | same `open()` guard |

## Files

```
src/components/layout/BeautyCarePopup.tsx   the dialog and the form
src/context/PopupContext.tsx                the state (enabled / open / dismissed)
src/components/layout/PopupToggle.tsx       the bell in the header
src/components/layout/Header.tsx            mounts the bell
src/config/popup.ts                         the delay and the master switch
public/images/banner_beauty_care.jpg
```

The campaign artwork lives in the `Beauty Care Campaign/` folder, which is
gitignored. The banner that is used by the popout is
`public/images/banner_beauty_care.jpg`.

## Behaviour

| | |
|---|---|
| Opens | as soon as the document is ready, on `/` - the delay in `src/config/popup.ts` is `0` |
| Stays away | when the visitor has scrolled past 200 px, or switched it off |
| Closing | closes it for the current view only - the next homepage load opens it again |
| Form | nama, no. HP, kendaraan, cabang -> `wa.me` with a prefilled message |
| Copy | from the printed assessment report (`nyaBeauty_care.pdf`): CHECK - ASSESS - RECOMMEND - EDUCATE, the six areas, and the principle "no finding, no selling" |

The layout follows the care-program popout of bengkelwiguna.com: a white card
with the campaign image on top, the benefit blocks, a row of facts, the program
name, the form, the call to action and a "Tutup" footer. The content is
AutoSPA's own.

It behaves like a dialog: the page behind it is inert, the focus moves into the
name field and the tab key stays inside.

**It never closes on its own.** There is no backdrop click, no Escape shortcut
and no timer that puts it away - a half-filled form is never thrown away. Only
three things close it:

- the **X** in the corner,
- the **Tutup** footer,
- the **bell** in the header, which switches the popout off completely.

Leaving the homepage also closes it, because the popout does not exist on the
other pages - and coming back to the homepage opens it again. Closing the
popout never remembers anything: only an explicit "off" (the bell, the mobile
switch, `?popup=off` or the master switch of the admin) keeps it away.

## Switching it off

Three levels, from the broadest to the narrowest.

### 1. Site wide - for the admin

```
POPUP_ENABLED=false
```

in `.env.local` (local) or in the environment of the deployment. The popout
never appears and the switches in the interface are hidden.

`POPUP_ENABLED` is read **on the server at runtime**, so the campaign can be
switched off without a rebuild - change the variable and restart the server
(or redeploy). `NEXT_PUBLIC_POPUP_ENABLED` is the fallback for setups that can
only change the environment at build time.

### 2. Per visitor - for the interface

- Desktop: the bell in the header. Clicking it while the popout is on screen
  switches the popout off completely.
- Mobile: the switch in the burger menu.

The choice is remembered in `localStorage` (`autospa:popup-enabled`), so a
visitor who switched it off never sees it again - not even after a reload. To
see it again in that browser, click the bell once more or open the homepage
with `?popup=on`.

### 3. Per visit - for testing

```
http://localhost:3100/?popup=off    the popout stays away for this visit
http://localhost:3100/?popup=on     the popout opens even if it was switched off
```

The parameter wins over the stored choice but does not change it.

## Verifying a change

```bash
npm run dev                          # the popout is on the homepage
node scripts/perf/check-beauty-popup.mjs   # the dialog, the form, the switches
node scripts/perf/check-popup-scope.mjs    # the homepage only
```

## Note on the development server

`next dev` and `next build` in the same checkout corrupt each other's `.next`.
When a build has to run while a dev server is up:

```bash
NEXT_DIST_DIR=.next-build npx next build
```

`next.config.ts` reads `NEXT_DIST_DIR` for the output directory.
