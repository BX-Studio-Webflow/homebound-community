# Webflow Content Runbook: Upcoming Communities and House Plans

This guide explains how to add new `Upcoming Communities` and `House Plans` entries in Webflow and keep their pages connected correctly.

## How these are connected today

- `Upcoming Communities` collection powers the template page at `/upcoming-communities/<slug>`.
- `House Plans` collection powers the template page at `/house-plans/<slug>`.
- The connection is **bidirectional**:
  - In `House Plans`, the `Upcoming Community` field (single reference) points to one community.
  - In `Upcoming Communities`, the `House Plans` field (multi-reference) should include all plans for that community.
- Both template pages rely heavily on CMS fields for SEO and page sections.

---

## Recommended workflow (important)

1. Create or update the **Upcoming Community** first.
2. Create all related **House Plan** items and assign each plan to that community.
3. Return to the community item and confirm its `House Plans` multi-reference includes those plans.
4. Publish CMS items, then publish the site.

This order prevents broken references and empty sections on template pages.

---

## A) Add a new Upcoming Community

In Webflow Designer:

1. Go to **CMS** -> **Upcoming Communities** -> **New Upcoming Community**.
2. Fill required core fields:
   - `Name` (required)
   - `Slug` (required)
   - `Homes` (required multi-reference)
   - `Amentities` (required multi-reference)
   - `Community Gallery` (required multi-image)
   - `Community Amenity Paragraph` (required)
   - `House Plans` (required multi-reference; can be added after plans exist)
3. Fill high-value content fields:
   - `H1 - Header Title`
   - `Card Thumbnail Image`
   - `Card Description`
   - `Card Meta Description`
   - `Location`
   - `Meta Title` and `Meta Description` (used by page SEO bindings)
   - `Main Gallery`
   - `Tour Link`
   - `City` (reference)
4. Optional controls:
   - `Show Cards`
   - `Show Available Homes`
   - `Show Banner`, `Banner Text`, `Banner Link`
   - `SVG Map` (if using interactive map embed logic)
5. Save item (draft is OK for now).

### Upcoming Community quality checks

- `Slug` should be short, lowercase, and URL-safe.
- `Meta Title` and `Meta Description` should be present to avoid weak SEO output on template pages.
- `House Plans` should not be empty before final publish.

---

## B) Add a new House Plan

In Webflow Designer:

1. Go to **CMS** -> **House Plans** -> **New House Plan**.
2. Fill required fields:
   - `Name` (required)
   - `Slug` (required)
   - `Price` (required)
   - `City` (required reference)
   - `Upcoming Community` (required reference)
   - `Available Exteriors` (required multi-reference)
3. Fill display fields used on cards and details:
   - `Plan Code`
   - `Main Image`
   - `Card Hover Image`
   - `Introduction Text` (also used in SEO description binding)
   - `Description`
   - `Beds`, `Baths`, `Square Feet`, `Bays`, `Bay Text`
   - `Photo Gallery`
4. Fill optional plan-specific fields as needed:
   - `First Floor SVG Map`
   - `Second Floor SVG Map`
   - `White Image Scheme`, `Soft Cream Image Scheme`, `Ochre Image Scheme`, `Charcoal Image Scheme`
   - `Calendly Booking Link`
   - `Explore Interiors copy`
   - `OG Image`
5. Save item.

### House Plan quality checks

- Ensure `Upcoming Community` points to the correct community (most common issue).
- Ensure `City` matches the same market/city context as the selected community.
- Ensure primary images are uploaded and not empty.

---

## C) Final connection checks (both sides)

Before publishing:

1. Open each new `House Plan` and confirm `Upcoming Community` is correct.
2. Open the `Upcoming Community` item and confirm `House Plans` includes all intended plans.
3. Confirm required references are populated:
   - Community: `Homes`, `Amentities`, `House Plans`
   - House Plan: `Upcoming Community`, `City`, `Available Exteriors`

If one side is missing, linked sections can appear empty or incomplete on template pages.

---

## D) Publish checklist

1. Publish changed CMS items.
2. Publish the site to production domains.
3. Smoke test URLs:
   - `/upcoming-communities/<community-slug>`
   - `/house-plans/<house-plan-slug>`
4. Verify:
   - Community page shows expected plan cards.
   - Plan page displays correct community context and content.
   - SEO title/description render correctly (view page source if needed).

---

## E) Asset panel structure and image URL workflow

### How assets relate to the live page

Asset folders are where image **files** live. Custom code is the **lookup table** that tells the page which CDN URL to display. Uploading to a folder does not wire the page automatically — someone must copy URLs into code.

```
Webflow Asset Panel          Custom Code                    House Plan Page
─────────────────────        ───────────                    ───────────────
Exterior Styles       →      exterior-scheme-modal.ts  →    Exterior slides + scheme dropdown
Interiors - Altadena  →      house-plans.ts            →    Explore Interiors swiper
Interiors - Iris      →      house-plans.ts            →    (same UI, different slug map)
```

CMS fields such as `Main Image`, `Photo Gallery`, and `White Image Scheme` are separate. The interactive **Explore Interiors** swiper and **exterior scheme dropdown** are driven only by hardcoded URL maps in code, not by those CMS fields.

---

### Exterior asset structure → code

Folder hierarchy in the Asset panel:

```
Exterior Styles
├── The Chaney
│   ├── Craftsman
│   ├── Jane_s Cottage
│   └── Spanish
├── The Echo
├── The Loma
├── The Merrick
└── The Sycamore
```

Each style folder contains **5 elevation images** (Scheme 1 through Scheme 5).

#### Plan folder → code slug

| Asset folder (plan) | URL slug (`/house-plans/...`) | Code key in `EXTERIOR_IMAGE_SETS_BY_PLAN` | Plan # in filenames |
| --- | --- | --- | --- |
| The Sycamore | `the-sycamore` → `sycamore` | `sycamore` | Eaton1 / Plan 1 |
| The Loma | `the-loma` → `loma` | `loma` | Eaton2 / Plan 2 |
| The Chaney | `the-chaney` → `chaney` | `chaney` | Eaton3 / Plan 3 |
| The Merrick | `the-merrick` → `merrick` | `merrick` | Eaton4 / Plan 4 |
| The Echo | `the-echo` → `echo` | `echo` | Eaton5 / Plan 5 |

#### Style folder → code property → page slide

| Asset style folder | Code array property | Webflow slide attribute `exterior-style` |
| --- | --- | --- |
| Craftsman | `craftsman[]` | `craftsman-style` |
| Jane_s Cottage / Janes Cottage | `janesCottage[]` | `janes-cottage` |
| Spanish | `spanish[]` | `spanish-transitional` |

#### Scheme array order

Each style array has 5 URLs in order. Index 0 = Scheme 1, index 4 = Scheme 5.

| Index | Craftsman label | Janes Cottage label | Spanish label |
| --- | --- | --- | --- |
| 0 | Classic Cream | Warm White | Coastal White |
| 1 | Soft Green | Dusk Gray | Natural Gray |
| 2 | Coastal Navy | Neutral Stone | Garden Olive |
| 3 | Warm Taupe | Soft White | Rich Bronze |
| 4 | Natural Charcoal | Historic Gray | Warm Earth Clay |

#### Exterior update steps

1. Upload 5 images to `Exterior Styles / <Plan Name> / <Style>`.
2. Copy each asset CDN URL from the Asset panel.
3. Paste into `src/utils/exterior-scheme-modal.ts` → `EXTERIOR_IMAGE_SETS_BY_PLAN.<slug>.<style>[0..4]`.
4. Rebuild and deploy the script bundle.
5. QA on `/house-plans/<slug>`: each exterior slide × all 5 schemes.

Only these five Altadena slugs use `EXTERIOR_IMAGE_SETS_BY_PLAN`: `echo`, `merrick`, `chaney`, `loma`, `sycamore`.

The six new-community slugs (`glenview`, `elm`, `willow`, `vista`, `ambrose`, `alder`) use `NEW_COMMUNITY_EXTERIOR_IMAGE_URLS` in the same file. Both sets power the same exterior scheme dropdown UI on house plan pages.

#### New community plans (Glenview, Elm, Willow, Vista, Ambrose, Alder)

**Site:** Homebound (`601ca16f0bb27e965ee867a0` / `homebound-e3a5e9`)

**Designer MCP link** (required for asset audits and folder creation — keep the Designer tab active and in the foreground):

[Open Homebound in Webflow Designer (MCP)](https://homebound-e3a5e9.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99)

Folder hierarchy (same pattern as Altadena, under the existing **Exterior Styles** root — folder ID `69f1ef537ce789fa3ce9a3a9`):

```
Exterior Styles
├── The Glenview
│   ├── Spanish Contemporary
│   ├── Transitional Ranch
│   ├── Coastal Colonial
│   └── English Cottage
├── The Elm
├── The Willow
├── The Vista
├── The Ambrose
└── The Alder
```

| Asset folder (plan) | URL slug | Code slug | `exterior-style` prefix |
| --- | --- | --- | --- |
| The Glenview | `the-glenview` | `glenview` | `glenview-` |
| The Elm | `the-elm` | `elm` | `elm-` |
| The Willow | `the-willow` | `willow` | `willow-` |
| The Vista | `the-vista` | `vista` | `vista-` |
| The Ambrose | `the-ambrose` | `ambrose` | `ambrose-` |
| The Alder | `the-alder` | `alder` | `alder-` |

| Style folder | Code property | Slide attribute `exterior-style` (Glenview example) | Schemes in dropdown |
| --- | --- | --- | --- |
| Spanish Contemporary | `spanishContemporary` | `glenview-spanish-contemporary` | 1–5 |
| Transitional Ranch | `transitionalRanch` | `glenview-transitional-ranch` | 1–5 |
| Coastal Colonial | `coastalColonial` | `glenview-coastal-colonial` | **2–5 only** |
| English Cottage | `englishCottage` | `glenview-english-cottage` | **2–5 only** |

**18 wired URLs per plan · 108 total** (4 styles × varying scheme counts).

#### Scheme labels (new community)

| Spanish Contemporary | Transitional Ranch | Coastal Colonial | English Cottage |
| --- | --- | --- | --- |
| 1 Sunlit Ivory | 1 White Oak Ranch | 2 Stone Harbor | 2 Abbey Iron |
| 2 Sandstone Villa | 2 Midnight Ridge | 3 Seabreeze | 3 Bronze Meadow |
| 3 Stone Garden | 3 Oakstone | 4 Ivory & Onyx | 4 Manor Brick |
| 4 Sienna Stone | 4 White Mason | 5 Coastal Stone | 5 Chateau Stone |
| 5 Coastal Villa | 5 Black Timber | | |

Coastal Colonial and English Cottage **do not** expose Scheme 1 in the dropdown. Optional Sch 1 assets (`Saltwood`, `Ivory Meadow`) may exist locally or in Webflow but are not wired in code.

#### Filename convention

Use scheme number and name only (no plan prefix):

`Sch 1 - Sunlit Ivory.jpg`, `Sch 2 - Abbey Iron.jpg`, etc.

Webflow converts uploads to `.webp` automatically; the CDN URL filename may differ from the source `.jpg`.

#### Local working folders

| Path | Purpose |
| --- | --- |
| `src/example-assets/input/` | Primary drop zone — one folder per plan/style, each with `UPLOAD_HERE.txt` checklist |
| `src/example-assets/exteriors/` | Mirror of Webflow folder tree (reference + empty upload targets) |
| `scripts/exterior-asset-structure.config.json` | Source of truth for plan/style/scheme names |

**Helper scripts:**

| Script | Purpose |
| --- | --- |
| `node scripts/create-exterior-asset-structure.mjs` | Create local `input/` + `exteriors/` folders and checklists |
| `node scripts/rename-exterior-input-files.mjs` | Rename loose files to `Sch N - Name.ext` |
| `python scripts/audit-input-files.py` | Validate local files against config |
| `python scripts/generate-exterior-urls.py` | Generate TS URL block from a Webflow MCP asset export |

#### Code paste target

`src/utils/exterior-scheme-modal.ts` → `NEW_COMMUNITY_EXTERIOR_IMAGE_URLS.<slug>.<styleKey>[]`

Array order matches scheme numbers for that style (Coastal Colonial / English Cottage arrays have 4 entries for Schemes 2–5).

Related files: `src/utils/gallery.ts` reads the same URL maps for the exterior lightbox.

#### New community exterior update steps

1. Place images in `src/example-assets/input/The <Plan>/<Style>/` using the filename pattern above.
2. Upload to the matching Webflow path: `Exterior Styles / The <Plan> / <Style>`.
3. Use **Upload** in the target folder — do **not** drag assets between plan folders (see pitfall below).
4. Open the [Designer MCP link](#new-community-plans-glenview-elm-willow-vista-ambrose-alder) and ask Cursor to **recheck** — it pulls assets and syncs CDN URLs into code.
5. Alternatively: copy CDN URLs manually into `NEW_COMMUNITY_EXTERIOR_IMAGE_URLS`, or run `python scripts/generate-exterior-urls.py` after an MCP asset export.
6. Rebuild and deploy the script bundle (`npm run build`).
7. QA each staging URL — scheme dropdown labels, image swap, and gallery lightbox.

**Staging smoke-test URLs:**

- `/house-plans/the-glenview`
- `/house-plans/the-elm`
- `/house-plans/the-willow`
- `/house-plans/the-vista`
- `/house-plans/the-ambrose`
- `/house-plans/the-alder`

#### Shared CDN URLs (identical source files)

When two plans use the **same image bytes** (e.g. Ambrose and Alder Spanish Sch 2–5), you do **not** need separate Webflow uploads for each plan. Paste the **same CDN URL** into both plan entries in `NEW_COMMUNITY_EXTERIOR_IMAGE_URLS`.

Example: Alder `spanishContemporary` Sch 2–5 reuse Ambrose’s URLs; Alder Sch 1 keeps its own URL.

Replace shared URLs with plan-specific ones when unique renders become available.

#### Webflow asset pitfall: one asset, one folder

Each image in Webflow is a **single asset record** that lives in **one folder**. Dragging an asset from `The Ambrose / Spanish Contemporary` to `The Alder / Spanish Contemporary` **moves** it — Ambrose will no longer have that file.

| Symptom | Cause |
| --- | --- |
| Upload to Alder, Ambrose loses Sch 2–5 | Same asset was moved, not duplicated |
| Recheck shows asset in wrong plan folder | Asset was dragged between plan folders |
| Same CDN asset ID under two plans in code | Intentional URL sharing (OK if images are identical) |

**Fix:** Upload fresh copies via **Upload** in each folder, **or** share one CDN URL in code and keep the physical asset in one folder only.

#### Implementation status (exteriors)

| Plan | Exterior URLs in code |
| --- | --- |
| Glenview, Elm, Willow, Vista, Ambrose, Alder | **Complete** (18/18 each) |

**Interiors for these six plans:** not started — still requires `house-plans.ts` / `housePlanImageUrlsBySlug` work and an `Interiors - <Community>` asset root (TBD).

Per-plan upload checklists with every filename: `src/example-assets/exteriors/README.md`.

---

### Interior asset structure → code

#### Altadena (`Interiors - Altadena`)

Folder hierarchy:

```
Interiors - Altadena
├── Interior - The Chaney
│   ├── Craftsman
│   │   ├── Great Room
│   │   ├── Kitchen
│   │   ├── Primary Bathroom
│   │   └── Primary Bedroom
│   ├── Janes Cottage
│   ├── Spanish
│   └── Transitional Organic
└── Interior - The Echo
    ├── Craftsman
    ├── Janes Cottage
    └── Spanish
```

(Same pattern for `Interior - The Loma`, `Interior - The Merrick`, `Interior - The Sycamore`.)

#### Room folder → page tab → code key

| Asset room folder | Page tab (`dev-target`) | Code key in `housePlanImageUrlsBySlug` |
| --- | --- | --- |
| Kitchen | `kitchen-interior` | `kitchen-interior` |
| Great Room | `living-interior` | `living-interior` |
| Primary Bedroom | `bedroom-interior` | `bedroom-interior` |
| Primary Bathroom | `bathroom-interior` | `bathroom-interior` |

#### Style folder → scheme swatch (Altadena plans only)

For `echo`, `merrick`, `chaney`, `loma`, `sycamore`:

| Asset style folder | Swatch button (`dev-target`) | Code scheme token | Label on page |
| --- | --- | --- | --- |
| Spanish | `pos-1` | `pos-1` | Spanish |
| Janes Cottage | `pos-2` | `pos-2` | Jane's Cottage |
| Craftsman | `pos-3` | `pos-3` | Craftsman |
| Transitional Organic | `pos-4` | `pos-4` | Transitional Organic |

#### Interior lookup example

To update **The Chaney → Craftsman → Kitchen** for the Spanish swatch:

1. Asset path: `Interiors - Altadena / Interior - The Chaney / Craftsman / Kitchen`
2. Copy the image CDN URL.
3. Paste into `housePlanImageUrlsBySlug.chaney['kitchen-interior']['pos-1']` in `src/house-plans.ts`.

The page reads the slug from the URL (`/house-plans/the-chaney` → `chaney`), then swaps `img[dev-target="interior-image"]` when the user changes room tab or scheme swatch.

#### Other interior roots (non-Altadena)

| Asset root folder | Code slug in `housePlanImageUrlsBySlug` | Scheme naming on page |
| --- | --- | --- |
| `Interiors - Iris` | `iris` | Warm / Light / Bold / Refined Transitional |
| `Interiors - Daphne` | `daphne` | Warm / Light / Bold / Refined Transitional |
| `Interiors - Sienna` | `sienna` | Warm / Light / Bold / Refined Transitional |

For these communities, scheme tokens map to package names, not architectural styles:

| Swatch (`dev-target`) | Label |
| --- | --- |
| `pos-1` | Warm Transitional |
| `pos-2` | Light Transitional |
| `pos-3` | Bold Transitional |
| `pos-4` | Refined Transitional |

Room folders (`Kitchen`, `Great Room`, `Primary Bedroom`, `Primary Bathroom`) follow the same mapping as Altadena.

#### Interior update steps

1. Upload image to the correct folder: `<Interiors root> / Interior - The <Plan> / <Style> / <Room>`.
2. Copy the asset CDN URL.
3. Paste into `src/house-plans.ts` → `housePlanImageUrlsBySlug.<slug>['<room-key>']['<pos-N>']`.
4. Rebuild and deploy the script bundle.
5. QA: every room tab × every scheme swatch on `/house-plans/<slug>`.

---

### Other asset folders (reference)

- `Plan 1 - The Sycamore` through `Plan 5 - The Echo` — general plan assets (floor plans, marketing, etc.)
- `Altadena - SVGS` — floor plan SVG sources
- `Exterior Styles` — see exterior section above
- `Interiors - Altadena`, `Interiors - Iris`, `Interiors - Daphne`, `Interiors - Sienna` — see interior section above

### Naming consistency note

There is currently mixed naming for one style in the Asset panel:

- `Janes Cottage`
- `Jane_s Cottage`

Use one naming convention going forward. In code, the exterior property is always `janesCottage` and the slide attribute is `janes-cottage`.

### Post-update QA for image changes

After any interior or exterior image update:

1. Rebuild and deploy script changes (required — asset upload alone is not enough).
2. Open each affected house plan URL (`/house-plans/<slug>`).
3. **Interiors:** test all four room tabs × all four scheme swatches; confirm image and title match.
4. **Exteriors (Altadena):** test each exterior style slide × all five schemes in the dropdown.
5. **Exteriors (new community):** test each of four style slides; Spanish / Transitional Ranch × 5 schemes; Coastal Colonial / English Cottage × 4 schemes (2–5). Confirm gallery lightbox images match.
6. Confirm no broken image URLs or stale fallbacks.

---

## Common mistakes to avoid

- Creating house plans but forgetting to include them in community `House Plans`.
- Leaving `Meta Title`/`Meta Description` blank on `Upcoming Communities`.
- Mismatched city/community references.
- Publishing only item drafts but not the site.
- Using special characters in slugs that cause unexpected URLs.
- Uploading new interior or exterior images without updating custom-code URL mappings.
- **Dragging exterior assets between plan folders in Webflow** — moves the file out of the source plan’s folder.
- **Assuming upload to a folder wires the page** — CDN URLs must still be pasted or synced into `exterior-scheme-modal.ts` / `house-plans.ts`, then rebuilt and deployed.
- **Expecting Coastal Colonial / English Cottage to show Scheme 1** — the dropdown only includes Schemes 2–5 for those styles on new-community plans.

---

## Ownership suggestion (for client handoff)

- Content owner updates CMS items.
- Marketing/SEO owner reviews meta fields.
- Web admin performs final publish and smoke test.

