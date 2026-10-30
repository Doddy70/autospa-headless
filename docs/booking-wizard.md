# AutoSPA Service Booking Wizard

The reservation wizard of the AutoSPA Jakarta site. It is a dialog that is
mounted once in the root layout, so every booking call to action of the site
opens the same form without leaving the page.

## What it is

A multi-step form adapted from
[`ebulku/next-stepper`](https://github.com/ebulku/next-stepper). The
reference implementation was reviewed and rebuilt on top of the conventions of
this project:

| Reference (`next-stepper`) | This project |
|---|---|
| `zustand` store | React state in `BookingWizard.tsx` |
| shadcn/ui `card`, `button`, `progress` | AutoSPA design tokens (`background-7`, `primary-500`, the `btn` utilities) |
| Clickable `<div>` option cards | Real `<button role="radio">` elements |
| `validNextSteps` on every item | One conditional step: the vehicle |
| Own date and time inputs | The AutoSPA arrival step (see below) |

The reference project was never copied into this repository and no separate
project was created - the wizard lives in the existing frontend.

## The steps

| # | Step | What it does |
|---|---|---|
| 1 | Layanan | The service, read from the service catalogue. |
| 2 | Cabang | The branch, from the branch directory of the production contact page. |
| 3 | Ukuran kendaraan | Small / Medium / Large / XL. |
| 4 | Kendaraan | Brand, model and year. **Skipped** unless the service is cut per model. |
| 5 | Kedatangan | How soon the customer wants to come, then the day and the time. |
| 6 | Data Anda | Name, WhatsApp number, optional notes. |
| 7 | Review | Everything, with a button per row to go back and change it. |

### The conditional step

A paint protection film and a nano ceramic coating are applied panel by panel
from a template of the exact vehicle, so the model is needed for those two
services only. For every other service the step is skipped - it keeps its
number in the progress bar and is marked as skipped, so the numbering never
changes under the customer.

### The arrival step

The urgency comes first, the exact day and the time are refined afterwards:

| Answer | What it asks for |
|---|---|
| **Secepatnya** | The time slot only - the branch calls the customer back. |
| **Minggu ini** | The day (limited to this week) and the time slot. |
| **Minggu depan** | The day (limited to next week) and the time slot. |
| **Masih konsultasi** | Nothing - there is no date to confirm yet. |

The day is picked from a calendar (`DatePicker.tsx`), never from the native
date input: the native control renders the browser's own calendar, which does
not look like the rest of the site.

The calendar follows the range. Switching the answer from "this week" to "next
week" moves the grid into the month of that week, so the customer is never
looking at a month in which every day is greyed out. The shortcut picks the
first day that can be chosen, and it says which day that is - it is "today"
for "this week", but the Monday of next week for "next week".

The time slots are the opening hours of the chosen branch. The published
hours of the branches are free text ("Every day 08.30 - 18.00 WIB"); they are
parsed into slots, and the first slot starts at the first full hour of the
working day, the last one an hour before closing.

## The hand over

There is no booking API behind the wizard. The summary is handed to WhatsApp,
the channel AutoSPA uses for reservations, and the team confirms it. The
wizard never states that a booking is confirmed - the review step says so
explicitly.

**The request goes to the WhatsApp number of the branch the customer picked**,
not to the central number of the site. Every branch publishes its own phone
number, and that number is the WhatsApp line of the workshop
(`branchWhatsapp()` in `src/data/contact.ts`).

### The skipped step is not a missing answer

Only a paint protection film and a nano ceramic coating need the model of the
vehicle, so the vehicle step is skipped for every other service. A skipped
step is **not** an unanswered one: the hand over checks the steps that are
part of the flow, and the request of a wash reaches WhatsApp exactly like the
request of a coating.

Counting the skipped step made the "Kirim lewat WhatsApp" button a dead end
for four of the six services - nothing happened on click, no WhatsApp tab
opened, and no message said why. When a step is still missing, the wizard
shows that step instead.

### The catalogue never leaves the customer without a choice

The dialog reads the services from `/api/services` when it opens. The route
reads the CMS, and the published pages are the mirror that takes over when the
origin cannot answer - the route never fails, so the service step is never
empty. When the catalogue cannot be read at all, the dialog says so and
offers to close, instead of showing a step with no options.

The CMS has eight seconds to answer. The origin is read-only and either
answers or it does not; a stalled request must not hold the customer on a
loading screen.

## Where it lives

```
src/lib/booking/          the domain: types, validation, summary, schedule, vehicles
src/components/booking/   the wizard, the modal, the trigger, the steps
src/context/BookingContext.tsx  the state of the dialog
src/app/api/services/     the catalogue as JSON for the dialog
```

## How the call to actions are wired

Every call to action that asks for a booking is a `BookingTrigger`:

```tsx
<BookingTrigger label="Book Sekarang" serviceSlug={card.slug} />
```

The trigger opens the dialog of the site. `serviceSlug` preselects a service -
the "Book Sekarang" of a service page opens the wizard with that service
already chosen.

A label that asks for a booking is recognised by `isBookingLabel()`
(`src/lib/booking/labels.ts`). The components that take a label from the
outside - `CtaBand`, `PackageCard`, the footer - use it to decide between a
link and a trigger.

Converted: the header, the mobile menu, the service pages, the service
listing, the landing page, the homepage features, the homepage service
showcase, the closing CTA band, the package cards, the locations page and the
footer.

## Checks

```bash
node scripts/perf/check-booking-wizard.mjs http://localhost:3200
MSYS_NO_PATHCONV=1 BASE_URL=http://localhost:3200 node scripts/sync/check-inner-nav.mjs /reservasi /services
```

The first drives the whole flow in a real browser: the steps, the conditional
step, the validation, the slots of a branch, the summary and the hand over to
the number of the chosen branch. It hands over twice - once for a service
that is cut per model and once for a wash, which is the case where the
skipped step must not block the request. The second checks that the header
still carries exactly one booking call to action and that no page overflows
on a phone.

## Not implemented

There is no live availability system. AutoSPA publishes no slot calendar, so
the wizard never claims a slot is free - the requested slot is a preference
that the team confirms.
