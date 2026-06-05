# Exterior asset upload guide (6 new house plans)

Local folders under `src/example-assets/input/` and `src/example-assets/exteriors/` mirror the Webflow Asset panel structure.
Name each file after its scheme (e.g. `Abbey Iron.jpg`), drop into the matching style folder, then upload to the same path in Webflow.

## Webflow folder tree

```
Exterior Styles
├── The Glenview
│   ├── Spanish Contemporary      (5 images — Schemes 1–5)
│   ├── Transitional Ranch        (5 images — Schemes 1–5)
│   ├── Coastal Colonial          (4 images — Schemes 2–5 only)
│   └── English Cottage           (4 images — Schemes 2–5 only)
├── The Elm
├── The Willow
├── The Vista
├── The Ambrose
└── The Alder
```

**18 images per plan · 108 images total**

## After upload

1. Copy each asset CDN URL from Webflow (in the same order as `UPLOAD_HERE.txt`).
2. Paste into `src/utils/exterior-scheme-modal.ts` inside `buildNewCommunityExteriors('<slug>')` for the matching style array.
3. Rebuild and deploy the script bundle.
4. QA each staging URL (scheme dropdown labels + image swap + gallery lightbox).

## Filename convention

Use the scheme number and name: `Sch 1 - Sunlit Ivory.jpg`, `Sch 2 - Abbey Iron.jpg`, etc.

## Auto-create folders in Webflow

Open the [Webflow Designer MCP link](https://homebound-e3a5e9.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99) (Designer tab in foreground), then ask Cursor to run the `asset_tool` batch in `scripts/webflow-exterior-folder-actions.json`.

Parent folder: **Exterior Styles** (`69f1ef537ce789fa3ce9a3a9`).

---

### The Glenview

- URL: `/house-plans/the-glenview`
- Code slug: `glenview`

#### The Glenview → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Glenview → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Glenview → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Glenview → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

### The Elm

- URL: `/house-plans/the-elm`
- Code slug: `elm`

#### The Elm → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Elm → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Elm → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Elm → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

### The Willow

- URL: `/house-plans/the-willow`
- Code slug: `willow`

#### The Willow → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Willow → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Willow → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Willow → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

### The Vista

- URL: `/house-plans/the-vista`
- Code slug: `vista`

#### The Vista → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Vista → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Vista → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Vista → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

### The Ambrose

- URL: `/house-plans/the-ambrose`
- Code slug: `ambrose`

#### The Ambrose → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Ambrose → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Ambrose → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Ambrose → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

### The Alder

- URL: `/house-plans/the-alder`
- Code slug: `alder`

#### The Alder → Spanish Contemporary

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - Sunlit Ivory.jpg` | Scheme 1: Sunlit Ivory |
| 2 | `Sch 2 - Sandstone Villa.jpg` | Scheme 2: Sandstone Villa |
| 3 | `Sch 3 - Stone Garden.jpg` | Scheme 3: Stone Garden |
| 4 | `Sch 4 - Sienna Stone.jpg` | Scheme 4: Sienna Stone |
| 5 | `Sch 5 - Coastal Villa.jpg` | Scheme 5: Coastal Villa |

#### The Alder → Transitional Ranch

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 1 - White Oak Ranch.jpg` | Scheme 1: White Oak Ranch |
| 2 | `Sch 2 - Midnight Ridge.jpg` | Scheme 2: Midnight Ridge |
| 3 | `Sch 3 - Oakstone.jpg` | Scheme 3: Oakstone |
| 4 | `Sch 4 - White Mason.jpg` | Scheme 4: White Mason |
| 5 | `Sch 5 - Black Timber.jpg` | Scheme 5: Black Timber |

#### The Alder → Coastal Colonial

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Stone Harbor.jpg` | Scheme 2: Stone Harbor |
| 2 | `Sch 3 - Seabreeze.jpg` | Scheme 3: Seabreeze |
| 3 | `Sch 4 - Ivory & Onyx.jpg` | Scheme 4: Ivory & Onyx |
| 4 | `Sch 5 - Coastal Stone.jpg` | Scheme 5: Coastal Stone |

#### The Alder → English Cottage

| Upload order | Filename | Scheme label |
| --- | --- | --- |
| 1 | `Sch 2 - Abbey Iron.jpg` | Scheme 2: Abbey Iron |
| 2 | `Sch 3 - Bronze Meadow.jpg` | Scheme 3: Bronze Meadow |
| 3 | `Sch 4 - Manor Brick.jpg` | Scheme 4: Manor Brick |
| 4 | `Sch 5 - Chateau Stone.jpg` | Scheme 5: Chateau Stone |

