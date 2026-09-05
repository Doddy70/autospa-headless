# Phase 2D.9: Content Migration - Execution Report

**Date:** 2026-09-03
**Status:** ⛔ BLOCKED - not executed
**Executed by:** Claude Code

---

## Summary

Batch 1 of the real-content migration was **not run**. Two independent blockers:

| # | Blocker | Effect |
|---|---------|--------|
| B1 | SSH to the staging server is refused | WP-CLI unreachable, so none of `--inspect` / `--dry-run` / `--write` can execute |
| B2 | No verified database rollback point | `--write` is contractually forbidden without one |

Work that did not need the shell was completed: the migration's premise was
independently confirmed over the read-only GraphQL endpoint, two defects in the
migration script were found and fixed, and the real content was inventoried
field by field. That inventory changes the scope of the phase — see
[Finding 3](#finding-3-the-real-blocker-is-missing-content-not-broken-plumbing).

---

## B1 - Staging shell unreachable

```
$ ssh -p 16916 root@148.230.101.241
Permission denied (publickey,password).
```

`ssh -v` confirms the local key is offered and rejected by the server:

```
Offering public key: RSA SHA256:ue9ago9ySFF47kZGWkmVkr6RcCyT8PIqzYA7Qn+gCLo
```

`~/.ssh/` contains only `id_rsa`, `id_rsa.pub`, `known_hosts` — no `config`, and
the repository has no `.env`. Either the key must be authorised on the server, or
the WP-CLI commands must be run by someone who has access.

**Not attempted:** any credential guessing, or any write via another route.

---

## What was verified without the shell

`acf-json/probe-2d9-state.mjs` (new, read-only) reproduces the migration's
`--inspect` findings over the public GraphQL endpoint. One request per
(service, field) pair, so an `Internal server error` on one repeater cannot mask
the state of its siblings.

| Service | benefits | process | technology | shortDescription | relationships |
|---------|----------|---------|------------|------------------|---------------|
| 6856 nano-ceramic-coating | ⛔ Internal server error | ⛔ Internal server error | null | ✅ set | all null |
| 7140 premium-wash | ⛔ Internal server error | ⛔ Internal server error | null | ✅ set | all null |
| 7141 premium-detailing | ⛔ Internal server error | ⛔ Internal server error | null | ✅ set | all null |
| 7142 ppf-paint-protection-film | ⛔ Internal server error | ⛔ Internal server error | null | ✅ set | all null |
| 6994 test (control) | ✅ 5 rows | ✅ 5 rows | ✅ 3 rows | ✅ set | ✅ 2 / 1 / 3 |
| 6995 / 6996 test | null | null | null | — | — |

The premise in `acf-json/migrate-2d9-real-content.php` is therefore correct: the
two repeaters are malformed on all four real Services, while the identical fields
resolve on test Service 6994 and return a clean `null` on 6995 / 6996.

A clean `null` matters as a comparison point — 6995/6996 have no meta at all and
produce no error. So the error on the real Services comes from the *shape* of
what is stored, not from a missing field definition.

---

## Finding 1 - relationship reverse legs wrote the wrong data type

**Severity: High. Fixed in this phase.**

Every relationship field in the schema is ACF type `relationship`, confirmed
against the field-group JSON in `acf-json/`:

| Field | ACF type | ACF key |
|-------|----------|---------|
| `related_locations` / `related_projects` / `related_faqs` / `related_services` | relationship | `field_related_*` |
| `location_services` / `location_testimonials` / `location_faqs` | relationship | `field_location_*` |
| `project_service` / `project_location` | relationship | `field_project_*` |
| `faq_service` / `faq_location` | relationship | `field_faq_*` |
| `testimonial_service` / `testimonial_location` | relationship | `field_testimonial_*` |

An ACF `relationship` field stores an **array** of post IDs. But
`acf-json/create-test-relationships.php` writes the reverse leg as a bare scalar:

```php
update_post_meta($faq_id,     'faq_service',     $service_id);  // int, not [int]
update_post_meta($project_id, 'project_service', $service_id);
update_post_meta($faq_id,     'faq_location',    $location_id);
```

Probing the test data that script produced shows the consequence — **100% of its
array writes still resolve through GraphQL, only 3 of 7 scalar writes do**:

| Post | Field | Written as | Resolves? |
|------|-------|-----------|-----------|
| service 6994 | `related_locations` / `related_projects` / `related_faqs` | array | ✅ all three |
| location 6997 | `location_services` | array | ✅ `[6994, 6996]` |
| location 6998 | `location_services` | array | ✅ `[6994, 6995]` |
| project 6999 | `project_service` | scalar | ✅ `6994` |
| project 7000 | `project_service` | scalar | ✅ `6995` |
| faq 7001 | `faq_service` | scalar | ⛔ null |
| faq 7002 | `faq_service` | scalar | ✅ `6994` |
| faq 7003 | `faq_service` | scalar | ⛔ null |
| faq 7001 | `faq_location` | scalar | ⛔ null |
| faq 7002 | `faq_location` | scalar | ⛔ null |
| faq 7003 | `faq_location` | scalar | ✅ `6998` |

`migrate-2d9-real-content.php` copied that scalar pattern verbatim, so 2 of its 6
relationship writes (`project_service` on 6858, `faq_service` on 6859) were
malformed. Both now write arrays.

### Why Phase 2D.8 did not catch this

`acf-json/fix-relationships.php` scores a test as PASS on
`!isset($result['errors'])` — absence of a GraphQL **error**, not presence of the
correct **value**. A field returning `null` passes. The suite also happened to
probe `faq_service` on 7002 and `faq_location` on 7003, the two IDs that do
resolve; 7001 would have passed too while returning null for both.

The 2D.8 report is accurate about what it tested. The suite's pass criterion is
the gap. `acf-json/verify-2d9-real-content.php` does not share it — it asserts
values, including both reverse legs — so it is a valid gate for this phase.

---

## Finding 2 - reverse legs also overwrote instead of merging

**Severity: Medium. Fixed in this phase.**

`update_post_meta($faq_id, 'faq_service', $service_id)` replaces the field.
`create-test-relationships.php` links FAQ 7003 to Service 6994 and then to
Service 6995; the second call erased the first. The function's own comment says
"bidirectional, idempotent", and the forward leg does merge — only the reverse
leg is destructive.

Batch 1's shape hides the bug (one FAQ ← one Service, one Project ← one Service,
and four Services → one Location where the Location side already merged), but it
would bite the moment a second Service links the same FAQ or Project.

Both fixes are now a single helper, `add_relation()`, used by both legs of all
three link functions:

```php
function add_relation($post_id, $field, $target_id, $label) {
    $current = get_post_meta($post_id, $field, true);
    $current = empty($current) ? [] : (is_array($current) ? $current : [$current]);
    $current = array_values(array_map('intval', $current));

    if (in_array((int) $target_id, $current, true)) {
        echo "  = $label\n";
        return true;
    }
    $current[] = (int) $target_id;
    return write_meta($post_id, $field, $current);
}
```

`write_meta()` additionally now writes the `_<field>` field-key reference meta
(`_faq_service` → `field_faq_service`). Without it the wp-admin editor cannot
locate the stored value, renders the field blank, and the next manual Update
erases it. Every group in `acf-json/` uses the `field_<field_name>` convention,
so the mapping is mechanical.

This last change is **defensive, not a diagnosed fix** — and it is specifically
*not* the cause of the repeater errors. `update_serialized()` in
`complete-business-dataset.php` does not write the reference meta either, yet
6994's `benefits` and `process` resolve fine. Anyone chasing the `Internal
server error` should not spend time on reference meta.

---

## Finding 3 - the real blocker is missing content, not broken plumbing

**Severity: High. Decision required — cannot be fixed in code.**

`acf-json/probe-2d9-content-gaps.mjs` (new, read-only) inventories every ACF
field on every real entity. Result across the eight real posts: **34 fields
populated, 68 empty, 8 unresolved.**

### Real Services 6856 / 7140 / 7141 / 7142

| Field | State |
|-------|-------|
| `heroTitle`, `heroDescription`, `shortDescription` | ✅ populated on all four |
| `seoTitle`, `seoDescription`, `seoFocusKeyword` | ✅ populated on all four |
| `serviceCategory` | ✅ 1 term on all four |
| `packages` | ✅ 6856 → 3 rows, 7142 → 2 rows / ⛔ 7140, 7141 empty (known, out of scope) |
| `benefits`, `process` | ⛔ Internal server error on all four |
| `description` (WYSIWYG) | ⛔ empty on all four |
| `technology` | ⛔ empty on all four |
| `heroImage`, `gallery` | ⛔ empty on all four (media — Phase 2D.10) |
| `seoCanonical`, `seoRobots` | ⛔ empty on all four |

### Location 6857 `autosp-pluit` — an empty shell

Only `locationStatus` (1 term) and `addressCountry` carry content. **Empty:**
`locationPhone`, `locationWhatsapp`, `locationEmail`, `addressStreet`,
`addressDistrict`, `addressCity`, `addressProvince`, `addressPostalCode`, all four
geo fields, `openingHours`, `locationTagline`, `locationDescription`,
`locationHighlights`, `locationFacilities`, `serviceAreas`, `locationGallery`.

For a business whose rebuild is driven by local SEO, this is the most consequential
gap in the dataset: no address, no phone, no opening hours.

### Project 6858, FAQ 6859, Testimonial 6860 — completely empty

Every content field on all three is empty, including `faqQuestion` and
`faqAnswer` on the FAQ, and all seven `projectContent` fields on the Project.

### Why this changes the phase

Step 3 of the migration wires Service 6856 to Location 6857, Project 6858 and
FAQ 6859. All three targets currently contain **no content at all**. Wiring the
relationships would publish an FAQ accordion row with no question and no answer,
a case-study link to an empty case study, and a branch page with no address —
i.e. it would turn an invisible gap into visible broken output.

`docs/phase-2a-service-extraction.md` §4.2 records why: for all four Services the
Phase 2A extraction lists **"Benefits list"** and **"Process steps"** under
`needed:`, with the action *"request missing content from AutoSPA"*. The
authentic content for the two repeaters this phase is meant to repair was never
obtained from the client.

`docs/phase-2a-location-verification.md` does hold verified Pluit data — address
`Jl. Pluit Karang Ayu Barat No.16, Pluit, Jakarta Utara 14440`, phone
`0877-1777-3888` — but that document's own status is
*"IN PROGRESS - Awaiting Client Verification"*.

---

## Open question that only `--inspect` can settle

`normalize_rows()` is a content-preserving reshape — it invents no copy. That is
the right contract, but it makes the outcome depend on what is actually stored:

| If the meta holds | `normalize_rows()` does | Result |
|-------------------|------------------------|--------|
| a numeric row count (native ACF, i.e. saved via wp-admin) | nothing — *"already valid, left alone"* | the GraphQL error **persists** after `--write` |
| malformed rows containing real copy | reshapes into valid rows | fields resolve, real content published |
| malformed rows containing placeholder copy | reshapes into valid rows | fields resolve, **placeholder published to the live frontend** |

The third row is the risk: reshaping turns a visible error into invisible junk.
No script in this repository ever wrote `benefits` or `process` to 6856 / 7140 /
7141 / 7142 — `complete-business-dataset.php` touches only the 6994-7005 test
set — so the stored value's provenance is unknown and cannot be inferred offline.

**`--inspect` must be read before `--write` is authorised.** If it shows
placeholder copy, the correct action is to *delete* the malformed meta so the
fields resolve as clean `null` (matching 6995 / 6996) and record the content gap
— not to reshape it.

---

## Recommended sequence

1. Restore shell access, or have someone with access run `--inspect` and paste the output.
2. Read `--inspect`. Decide reshape vs. clear per the table above.
3. Obtain the real content for Location 6857 from the client — address, phone,
   WhatsApp, opening hours at minimum. This is the highest-value item in the phase.
4. Obtain `benefits` / `process` / `description` / `technology` copy for the four
   Services, or agree to ship them absent.
5. Take a verified database dump.
6. Run `--dry-run`, then `--write`.
7. Run `php acf-json/verify-2d9-real-content.php` — it asserts values, both
   relationship directions included.

Steps 3 and 4 are client-content tasks, not engineering tasks. Wiring
relationships (step 6) before them produces links to empty pages.

---

## Files added or changed in this phase

| File | Change |
|------|--------|
| `acf-json/migrate-2d9-real-content.php` | Fixed Findings 1 and 2: new `add_relation()` helper, `write_meta()` now writes `_<field>` reference meta, docblock updated. **Still unrun.** |
| `acf-json/probe-2d9-state.mjs` | New. Read-only GraphQL stand-in for `--inspect` on the four real Services. |
| `acf-json/probe-2d9-content-gaps.mjs` | New. Read-only field-by-field content inventory of all eight real entities. |
| `docs/phase-2d9-execution-report.md` | This report. |

Nothing was written to staging. No production access was made.

---

## Status

⛔ **BLOCKED.** Phase 2D.9 is not complete and `CLAUDE.md` should continue to
show 2D.8 as the last passing phase.
