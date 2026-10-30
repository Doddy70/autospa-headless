# Before & After — the comparison slider

The gallery shows the same detail of a vehicle before the work and after it.
The visitor drags the divider and compares the two photos.

```
src/data/before-after.ts                 the pairs - id, title, caption, photos
src/hooks/useBeforeAfterImageSlider.ts   the drag of the divider
src/components/ui/BeforeAfterSlider.tsx  one comparison (the frame and the divider)
src/components/ui/BeforeAfterSlider.module.css
src/components/ui/BeforeAfterCarousel.tsx  the card slider around it
src/components/home/sections/BeforeAfterSection.tsx  the section on the homepage
src/app/(inner)/before-after/page.tsx    the gallery page
```

| Route | Source |
|-------|--------|
| `/` (section "Before & After") | `BeforeAfterSection` over the pairs |
| `/before-after` | the pairs, with the call to action |

The photos live in `public/images/before-after/` and are served by the frontend
itself - they are not part of the WordPress media library yet. Every pair is
a square of 1080 pixels.

## The divider

The divider is one number: the percentage of the frame that shows the photo
from before the work. The hook keeps that number and the component hands it
to the frame as the CSS variable `--ba-split`; the photo from after the work
is clipped to the rest of the frame by the stylesheet of the component.

Because the number is a percentage, a resize of the window keeps the divider
where the visitor put it - nothing has to be recalculated.

The drag is driven by the pointer events, so a mouse, a finger and a pen take
the same path. The divider is a `slider` for the screen readers: the arrow
keys move it by five percent, `Home` and `End` put it at the ends, and
`aria-valuetext` reads the position out loud.

## The card slider

Three cards stand next to each other on a wide screen, two on a tablet and
one on a phone. The arrows move the gallery a page, the dots jump to a page,
and the gallery moves on its own - it stops while the visitor hovers it,
drags a divider, or while the page is not on screen at all.

## The weight of the photos

Every photo is shown in a card, so the `sizes` of the images follow the card
(`30vw` on a wide screen, `45vw` on a tablet, `92vw` on a phone) and the
optimiser of Next.js only sends what the screen really needs. Only the first
card is fetched with the priority of the page; the rest are loaded when the
visitor reaches them.

The photos themselves are squares of 900 pixels - twice the size of a card on
a retina screen. The originals (1080 pixels) are kept in
`.cache/before-after-original/`, and `scripts/gen/resize-before-after.mjs`
writes the smaller ones.

The cards of the other pages stand outside the screen, and the browser does
not always wake up for a photo that only moves into the screen through the
slider. The photos of the page the visitor is on - and of the page that comes
next - are therefore fetched right away (`loading="eager"`), the rest wait
their turn.

## The check

```bash
node scripts/perf/check-before-after.mjs http://localhost:3200
```

It drives a real browser: the drag with the mouse and with a finger, the
click that moves the divider, the keyboard, the cards, the arrows, the dots,
the autoplay and the section on the homepage.
