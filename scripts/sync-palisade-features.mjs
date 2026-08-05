/**
 * Build CMS update/create payloads for Palisade Floor Plan Features
 * from July 2026 doc + patched SVG feature ids.
 */
import fs from "fs";

const FIRST = "b9b3ff6995dad6233446a190085a3d1a";
const SECOND = "9abe51351fba65d0cbbd595e60bfc221";

const PLANS = {
  Ambrose: "6a1ff02dd3d3113ee5e41940",
  Alder: "6a1ff02dd3d3113ee5e41942",
  Vista: "6a1ff02dd3d3113ee5e4193e",
  Willow: "6a1ff02dd3d3113ee5e4193c",
  Glenview: "6a1fed9fbf445d0192b88f42",
  Elm: "6a1ff0ecd3d3113ee5e4b084",
};

const DESC = {
  prep:
    "Create extra space for meal prep, storage, and entertaining with a prep kitchen. In place of the tandem garage.",
  elevator:
    "Enhance convenience and accessibility with a private in-home elevator.",
  wine: "Add a dedicated wine room for stylish storage and effortless entertaining.",
  wineVista:
    "Create a dedicated wine room for stylish storage and entertaining.",
  patioFp: "Add a covered patio fireplace for year-round outdoor comfort.",
  patioFpVista:
    "Create a warm, inviting outdoor space perfect for relaxing and entertaining year-round",
  patioFpGlen: "Enjoy cozy outdoor living year-round.",
  fireGr: "Adds warmth and a welcoming focal point.",
  bedBath: "Create additional private living space and everyday convenience.",
  closet:
    "Expand your primary walk-in closet for enhanced storage and everyday convenience.",
  beams: "Add warmth, depth, and architectural character to the space.",
  skylight: "For abundant natural light for a brighter, spa-like retreat.",
  doors: "Add more natural light and easy indoor-outdoor living.",
  loftBed: "Ideal for guests, family, or a private home office.",
  patio: "Designed to enhance indoor-outdoor living.",
  loft: "Create a versatile space for relaxing, entertaining, or everyday living.",
  retreat:
    "Create a private retreat within your primary suite for added comfort and relaxation.",
  stdLoft:
    "Ideal for a media room, playroom, home office, or additional living space.",
  stdPrivate: "Thoughtfully separated for added comfort and functionality.",
  stdBed4:
    "Features direct access to a nearby full bath, making it perfect for guests or multigenerational living.",
  stdOpen:
    "Creating a bright, airy feel and enhanced architectural character.",
  stdPatio: "Offering additional outdoor living and entertaining space.",
};

/** Desired features: planKey -> array of { tab, sort, feature, name, description, slug, matchFeaturePrefixes? } */
const DESIRED = {
  Ambrose: [
    {
      tab: FIRST,
      sort: 1,
      feature: "PREPKIT001",
      name: "Add Prep Kitchen",
      description: DESC.prep,
      slug: "ambrose-add-prep-kitchen",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "ELEVATOR01",
      name: "Add Elevator",
      description: DESC.elevator,
      slug: "ambrose-add-elevator",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "ADDWINERM1",
      name: "Add Wine Room",
      description: DESC.wine,
      slug: "ambrose-add-wine-room",
    },
    {
      tab: FIRST,
      sort: 4,
      feature: "FIREPLODR1",
      name: "Add Fireplace at Covered Patio",
      description: DESC.patioFp,
      slug: "ambrose-fireplace-covered-patio",
    },
    {
      tab: FIRST,
      sort: 5,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "ambrose-fireplace-great-room",
    },
    {
      tab: SECOND,
      sort: 1,
      feature: "BEDBATH001",
      name: "Add Bedroom 5 with Bath 5",
      description: DESC.bedBath,
      slug: "ambrose-bedroom-5-bath-5",
    },
    {
      tab: SECOND,
      sort: 2,
      feature: "EXTCLST001",
      name: "Extend Primary Walk-in Closet in Lieu of Loft",
      description: DESC.closet,
      slug: "ambrose-extend-primary-closet-lieu-loft",
    },
    {
      tab: SECOND,
      sort: 3,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "ambrose-faux-ceiling-beams-primary-bedroom",
    },
    {
      tab: SECOND,
      sort: 4,
      feature: "ELEVATOR01",
      name: "Add Elevator",
      description: DESC.elevator,
      slug: "ambrose-elevator-second-floor",
    },
    {
      tab: SECOND,
      sort: 5,
      feature: "ADDSKYLT01",
      name: "Add Skylight in Primary Bathroom",
      description: DESC.skylight,
      slug: "ambrose-skylight-primary-bathroom",
    },
  ],
  Alder: [
    {
      tab: FIRST,
      sort: 1,
      feature: "CEILBEAM01-great-room",
      name: "Faux Ceiling Beams at Great Room",
      description: DESC.beams,
      slug: "alder-faux-ceiling-beams-great-room",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "alder-fireplace-great-room",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "DOOREGD001",
      name: "Add Sliding Glass Doors at Great Room",
      description: DESC.doors,
      slug: "alder-sliding-glass-doors-great-room",
    },
    {
      tab: SECOND,
      sort: 1,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "alder-faux-ceiling-beams-primary-bedroom",
    },
    {
      tab: SECOND,
      sort: 2,
      feature: "ADDSKYLT01",
      name: "Add Skylight in Primary Bathroom",
      description: DESC.skylight,
      slug: "alder-skylight-primary-bathroom",
    },
    {
      tab: SECOND,
      sort: 3,
      feature: "LFT2BED001",
      name: "Add Bedroom 5 in Lieu of Loft",
      description: DESC.loftBed,
      slug: "alder-bedroom-5-lieu-loft",
    },
  ],
  Vista: [
    // Skip Vista GR beams (doc: Don't execute pending clarification)
    {
      tab: FIRST,
      sort: 1,
      feature: "PREPKIT001",
      name: "Add Prep Kitchen",
      description: DESC.prep,
      slug: "vista-add-prep-kitchen",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "ADDWINERM1",
      name: "Add Wine Room in Lieu of Pantry",
      description: DESC.wineVista,
      slug: "vista-wine-room-lieu-pantry",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "EXTCVPT02",
      name: "Add Covered Patio",
      description: DESC.patio,
      slug: "vista-add-covered-patio",
    },
    {
      tab: FIRST,
      sort: 4,
      feature: "DOOREGD001",
      name: "Add Sliding Glass Doors at Kitchen",
      description: DESC.doors,
      slug: "vista-sliding-glass-doors-kitchen",
    },
    {
      tab: FIRST,
      sort: 5,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "vista-fireplace-great-room",
    },
    {
      tab: FIRST,
      sort: 6,
      feature: "FIREPLODR1",
      name: "Add a Courtyard Fireplace",
      description: DESC.patioFpVista,
      slug: "vista-courtyard-fireplace",
    },
    {
      tab: SECOND,
      sort: 1,
      feature: "EXTCLST001",
      name: "Extend Primary Walk-in Closet",
      description: DESC.closet,
      slug: "vista-extend-primary-closet",
    },
    {
      tab: SECOND,
      sort: 2,
      feature: "ADDSKYLT01",
      name: "Add Skylight in Primary Bathroom",
      description: DESC.skylight,
      slug: "vista-skylight-primary-bathroom",
    },
    {
      tab: SECOND,
      sort: 3,
      feature: "BEDBATH001",
      name: "Add Bedroom 5 with Bath 4",
      description: DESC.bedBath,
      slug: "vista-bedroom-5-bath-4",
    },
    {
      tab: SECOND,
      sort: 4,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "vista-faux-ceiling-beams-primary-bedroom",
    },
  ],
  Willow: [
    {
      tab: FIRST,
      sort: 1,
      feature: "EXTCVPT01",
      name: "Add Extended Covered Patio at Dining Room",
      description: DESC.patio,
      slug: "willow-extended-covered-patio-dining",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "DOOREGD0011",
      name: "Add Sliding Glass Doors from Dining Room to Covered Patio",
      description: DESC.doors,
      slug: "willow-sliding-doors-dining-to-patio",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "DOOREGD001",
      name: "Add Sliding Glass Doors from Dining Room",
      description: DESC.doors,
      slug: "willow-sliding-doors-dining",
    },
    {
      tab: FIRST,
      sort: 4,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "willow-fireplace-great-room",
    },
    {
      tab: FIRST,
      sort: 5,
      feature: "CEILBEAM01-great-room",
      name: "Faux Ceiling Beams at Great Room",
      description: DESC.beams,
      slug: "willow-faux-ceiling-beams-great-room",
    },
    {
      tab: SECOND,
      sort: 1,
      feature: "ADDLOFT001",
      name: "Add Loft",
      description: DESC.loft,
      slug: "willow-add-loft",
    },
    {
      tab: SECOND,
      sort: 2,
      feature: "DECKCVD001",
      name: "Add a Covered Deck at Primary Bedroom",
      description: DESC.patio,
      slug: "willow-covered-deck-primary-bedroom",
    },
    {
      tab: SECOND,
      sort: 3,
      feature: "BEDBATH001",
      name: "Add Bedroom 5 with Bath 4",
      description: DESC.bedBath,
      slug: "willow-bedroom-5-bath-4",
    },
    {
      tab: SECOND,
      sort: 4,
      feature: "ADDSKYLT01",
      name: "Add Skylight in Primary Bathroom",
      description: DESC.skylight,
      slug: "willow-skylight-primary-bathroom",
    },
    {
      tab: SECOND,
      sort: 5,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "willow-faux-ceiling-beams-primary-bedroom",
    },
  ],
  Glenview: [
    {
      tab: FIRST,
      sort: 1,
      feature: "EXTCVPT02",
      name: "Add Extended Covered Patio at Living and Dining Room",
      description: DESC.patio,
      slug: "glenview-extended-covered-patio",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "FIREPLODR1",
      name: "Add Fireplace to Extended Covered Patio",
      description: DESC.patioFpGlen,
      slug: "glenview-fireplace-extended-patio",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "DOOREGD001",
      name: "Add Sliding Glass Doors at Great Room and Dining Room",
      description: DESC.doors,
      slug: "glenview-sliding-doors-great-room-dining",
    },
    {
      tab: FIRST,
      sort: 4,
      feature: "CEILBEAM01-great-room",
      name: "Faux Ceiling Beams at Great Room",
      description: DESC.beams,
      slug: "glenview-faux-ceiling-beams-great-room",
    },
    {
      tab: FIRST,
      sort: 5,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "glenview-fireplace-great-room",
    },
    {
      tab: FIRST,
      sort: 6,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "glenview-faux-ceiling-beams-primary-bedroom",
    },
    {
      tab: FIRST,
      sort: 7,
      feature: "RTREATPM01",
      name: "Add Primary Retreat",
      description: DESC.retreat,
      slug: "glenview-add-primary-retreat",
    },
    {
      tab: FIRST,
      sort: 8,
      feature: "CEILBEAM01-primary-retreat",
      name: "Add Faux Ceiling Beams Primary Retreat",
      description: DESC.beams,
      slug: "glenview-faux-ceiling-beams-primary-retreat",
    },
    {
      tab: SECOND,
      sort: 1,
      feature: "A2",
      name: "Spacious second-floor loft",
      description: DESC.stdLoft,
      slug: "glenview-spacious-second-floor-loft",
    },
    {
      tab: SECOND,
      sort: 2,
      feature: "BATH2SHW01-BATH204",
      name: "Private secondary bedrooms",
      description: DESC.stdPrivate,
      slug: "glenview-private-secondary-bedrooms",
    },
    {
      tab: SECOND,
      sort: 3,
      feature: "BATH2SHW01-BATH207",
      name: "Bedroom 4",
      description: DESC.stdBed4,
      slug: "glenview-bedroom-4",
    },
    {
      tab: SECOND,
      sort: 4,
      feature: "H2",
      name: "Open-to-below design",
      description: DESC.stdOpen,
      slug: "glenview-open-to-below-design",
    },
    {
      tab: SECOND,
      sort: 5,
      feature: "G1",
      name: "Covered second-floor patio",
      description: DESC.stdPatio,
      slug: "glenview-covered-second-floor-patio",
    },
  ],
  Elm: [
    {
      tab: FIRST,
      sort: 1,
      feature: "EXTCVPT02",
      name: "Add Covered Patio at Living and Dining Room",
      description: DESC.patio,
      slug: "elm-covered-patio-living-dining",
    },
    {
      tab: FIRST,
      sort: 2,
      feature: "FIREPLODR1",
      name: "Add Fireplace at Covered Patio",
      description: DESC.patioFp,
      slug: "elm-fireplace-covered-patio",
    },
    {
      tab: FIRST,
      sort: 3,
      feature: "DOOREGD001",
      name: "Add Sliding Glass Doors at Great Room and Dining Room",
      description: DESC.doors,
      slug: "elm-sliding-doors-great-room-dining",
    },
    {
      tab: FIRST,
      sort: 4,
      feature: "CEILBEAM01-great-room",
      name: "Faux Ceiling Beams at Great Room",
      description: DESC.beams,
      slug: "elm-faux-ceiling-beams-great-room",
    },
    {
      tab: FIRST,
      sort: 5,
      feature: "FIREADD001",
      name: "Fireplace at Great Room",
      description: DESC.fireGr,
      slug: "elm-fireplace-great-room",
    },
    {
      tab: FIRST,
      sort: 6,
      feature: "RTREATPM01",
      name: "Add Primary Retreat",
      description: DESC.retreat,
      slug: "elm-add-primary-retreat",
    },
    {
      tab: FIRST,
      sort: 7,
      feature: "CEILBEAM01-primary-bedroom",
      name: "Faux Ceiling Beams at Primary Bedroom",
      description: DESC.beams,
      slug: "elm-faux-ceiling-beams-primary-bedroom",
    },
    {
      tab: FIRST,
      sort: 8,
      feature: "ADDSKYLT01",
      name: "Add Skylight in Primary Bathroom",
      description: DESC.skylight,
      slug: "elm-skylight-primary-bathroom",
    },
  ],
};

function normalizeFeature(f) {
  if (!f) return "";
  return String(f)
    .replace(/^OPT_CODE_/, "")
    .replace(/__x28_/g, "-")
    .replace(/_x28_/g, "-")
    .replace(/_x29_/g, "")
    .replace(/_x5F_/g, "_")
    .replace(/__/g, "-")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function featureLooseMatch(cmsFeature, desiredFeature) {
  const a = normalizeFeature(cmsFeature);
  const b = normalizeFeature(desiredFeature);
  if (a === b) return true;
  // CEILBEAM01 variants (tab already scopes floor; bare CEILBEAM01 matches either)
  if (b.includes("CEILBEAM01") && a.includes("CEILBEAM01")) {
    if (b.includes("GREAT") && (a.includes("GREAT") || a === "CEILBEAM01"))
      return true;
    if (
      b.includes("PRIMARY-BEDROOM") &&
      (a === "CEILBEAM01" ||
        (a.includes("PRIMARY") && (a.includes("BED") || a.includes("EXT"))))
    )
      return true;
    if (b.includes("PRIMARY-RETREAT") && a.includes("RETREAT")) return true;
  }
  // Elevator same code different floors matched by tab
  if (b === "ELEVATOR01" && a === "ELEVATOR01") return true;
  if (b === "BATH2SHW01-BATH204" && a.includes("BATH204")) return true;
  if (b === "BATH2SHW01-BATH207" && a.includes("BATH207")) return true;
  if (b === "A2" && a === "A2") return true;
  if (b === "G1" && a === "G1") return true;
  if (b === "H2" && a === "H2") return true;
  // Vista beams FOR_EXT maps to primary-bedroom-2; treat as primary bedroom match
  if (
    b === "CEILBEAM01-PRIMARY-BEDROOM" &&
    a.includes("CEILBEAM01") &&
    (a.includes("EXT") || a.includes("PRIMARY"))
  )
    return true;
  return false;
}

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/5970b0e3-c060-44d9-9d45-e590a065f7ae.txt",
  "utf8",
);
const data = JSON.parse(raw);
const items = data.result?.items || [];

const byPlan = {};
for (const [name, id] of Object.entries(PLANS)) byPlan[name] = [];
for (const i of items) {
  const refs = i.fieldData["house-plan-2"] || [];
  for (const [name, id] of Object.entries(PLANS)) {
    if (refs.includes(id)) {
      byPlan[name].push(i);
    }
  }
}

const updates = [];
const creates = [];
const unmatchedExisting = [];

for (const [planName, desiredList] of Object.entries(DESIRED)) {
  const planId = PLANS[planName];
  const existing = [...byPlan[planName]];
  const used = new Set();

  for (const d of desiredList) {
    const candidates = existing.filter((it) => {
      if (used.has(it.id)) return false;
      if (it.fieldData.tab !== d.tab) return false;
      return featureLooseMatch(it.fieldData.feature, d.feature);
    });
    // Prefer exact slug match, then same sort, then first
    let match =
      candidates.find((c) => c.fieldData.slug === d.slug) ||
      candidates.find((c) => c.fieldData["sort-order"] === d.sort) ||
      candidates[0];

    // Elevator: two items same feature different floors — already filtered by tab
    if (!match && d.feature === "ELEVATOR01") {
      match = existing.find(
        (it) =>
          !used.has(it.id) &&
          it.fieldData.tab === d.tab &&
          normalizeFeature(it.fieldData.feature).includes("ELEVATOR"),
      );
    }

    if (match) {
      used.add(match.id);
      updates.push({
        id: match.id,
        fieldData: {
          name: d.name,
          slug: d.slug,
          description: d.description,
          feature: d.feature,
          "sort-order": d.sort,
          tab: d.tab,
          "house-plan-2": [planId],
        },
      });
    } else {
      creates.push({
        name: d.name,
        slug: d.slug,
        description: d.description,
        feature: d.feature,
        "sort-order": d.sort,
        tab: d.tab,
        "house-plan-2": [planId],
      });
    }
  }

  for (const it of existing) {
    if (!used.has(it.id)) {
      unmatchedExisting.push({
        plan: planName,
        id: it.id,
        name: it.fieldData.name,
        feature: it.fieldData.feature,
        tab: it.fieldData.tab,
        sort: it.fieldData["sort-order"],
      });
    }
  }
}

const out = { updates, creates, unmatchedExisting };
fs.writeFileSync(
  "scripts/palisade-feature-sync.json",
  JSON.stringify(out, null, 2),
);
console.log(
  JSON.stringify(
    {
      updates: updates.length,
      creates: creates.length,
      unmatchedExisting: unmatchedExisting.length,
      unmatched: unmatchedExisting,
      createSlugs: creates.map((c) => c.slug),
    },
    null,
    2,
  ),
);
