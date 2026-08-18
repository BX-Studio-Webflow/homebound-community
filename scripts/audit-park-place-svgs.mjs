import fs from "fs";
import path from "path";

const cmsPath =
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/3d8c684f-1609-4f52-a288-32a4792b300a.txt";
const svgRoot =
  "src/example-assets/home-icons/Park Place Marketing Floor Plans";

const SPEC = {
  Addison: {
    floors: {
      first: [
        ["PRPKIT001", "Add Prep Kitchen"],
        ["EXTCVPT01", "Add Covered Patio"],
        ["DOOREGD001", "Add Sliding Glass Doors at Great Room"],
        ["CEILBEAM012", "Faux Ceiling Beams at Primary Bedroom"],
        ["EXTPRIMBED1", "Extended Primary Bedroom"],
        ["FIREADD001", "Fireplace at Great Room"],
        ["CEILBEAM001", "Faux Ceiling Beams at Great Room"],
        ["GARG3B0001", "Extended Garage"],
      ],
    },
  },
  Bandera: {
    floors: {
      first: [
        ["PRPKIT001", "Add Prep Kitchen"],
        ["ADDFLEXRM1", "Add Flex Room at Everyday Entry"],
        ["EXTCVPT01", "Add Extended Covered Patio at Great Room"],
        ["FIREPLCE11", "Add Fireplace to Courtyard"],
        ["CEILBEAM013", "Faux Ceiling Beams at Primary Bedroom"],
        ["EXTPRIMBED1", "Extended Primary Bedroom"],
        ["FIREPLCE1", "Fireplace at Great Room"],
        ["CEILBEAM012", "Faux Ceiling Beams at Great Room"],
        ["CEILBEAM01", "Faux Ceiling Beams at Dining Room"],
        ["GARG3B0001", "Extended Garage"],
      ],
      second: [
        ["CEILBEAM01", "Faux Ceiling Beams at Loft"],
        ["BEDBATH001", "Add Bedroom 5 with Bath 5"],
        ["MEDIA01", "Add Media Room"],
      ],
    },
  },
  Collin: {
    floors: {
      first: [
        ["EXTPRIMBED1", "Extended Primary Bedroom"],
        ["CEILBEAM012", "Faux Ceiling Beams at Primary Bedroom"],
        ["PRPKIT001", "Add Prep Kitchen"],
        ["GRG2FLX01", "Convert 3-Bay Garage to Flex Room"],
        ["EXTCVPT01", "Add Extended Covered Patio at Great Room"],
        ["GARG3B0001", "Extended Garage"],
        ["FIREADD001", "Fireplace at Great Room"],
        ["CEILBEAM011", "Faux Ceiling Beams at Great Room & Kitchen"],
        ["FIREPLCE11", "Add Fireplace to Courtyard"],
      ],
      second: [["CEILBEAM01", "Faux Ceiling Beams at Game Room"]],
    },
  },
  Grayson: {
    floors: {
      first: [
        ["PRPKTCN1", "Add Prep Kitchen"],
        ["FIREPLCE1", "Fireplace at Great Room"],
        ["DOOREGD001", "Add Sliding Glass Doors at Great Room"],
        ["EXTCVPT01", "Add Extended Covered Patio at Great Room"],
        ["EXTPRIMBED1", "Extended Primary Bedroom"],
        ["CEILBEAM011", "Faux Ceiling Beams at Primary Bedroom"],
        ["GARG3B0001", "Extended Garage"],
      ],
      second: [
        ["ADDMEDIA01", "Add Media Room"],
        ["CEILBEAM01", "Faux Ceiling Beams at Game Room"],
      ],
    },
  },
  Magnolia: {
    floors: {
      first: [
        ["PRPKIT001", "Add Prep Kitchen"],
        ["DOOREGD001", "Add Sliding Glass Doors at Dining Room"],
        ["EXTCVPT01", "Add Extended Covered Patio at Dining Room"],
        ["FIREPLCE1", "Fireplace at Great Room"],
        ["CEILBEAM011", "Faux Ceiling Beams at Primary Bedroom"],
        ["EXTPRIMBED1", "Extended Primary Bedroom"],
        ["GARG3B0001", "Extended Garage"],
      ],
      second: [["BED001", "Add Bedroom 6"]],
    },
  },
};

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.toLowerCase().endsWith(".svg")) out.push(p);
  }
  return out;
}

function extractOptIds(svg) {
  const ids = [];
  const re = /<g\b([^>]*\bid="(OPT_[^"]+)"[^>]*)>/gi;
  let m;
  while ((m = re.exec(svg))) {
    const attrs = m[1];
    const id = m[2];
    ids.push({
      id,
      hasFeature: /data-attribute\s*=\s*"feature"/.test(attrs),
      classAttr: (attrs.match(/class="([^"]+)"/) || [])[1] || "",
    });
  }
  return ids;
}

function normalizeCode(raw) {
  return raw
    .replace(/^OPT_+/, "")
    .replace(/^_+/, "")
    .replace(/_+/g, "")
    .toUpperCase();
}

function codeFromId(id) {
  return id
    .replace(/^OPT_+/, "")
    .replace(/^_+/, "")
    .replace(/-\d+$/, "")
    .replace(/_\d+$/, "");
}

const files = walk(svgRoot).sort();
console.log("=== SVG option-layer audit ===");
for (const f of files) {
  const rel = path.relative(svgRoot, f);
  const svg = fs.readFileSync(f, "utf8");
  const featureCount = [...svg.matchAll(/data-attribute="feature"/g)].length;
  const opts = extractOptIds(svg);
  console.log(`\n${rel}`);
  console.log(`  data-attribute=feature: ${featureCount}`);
  console.log(`  OPT_* groups: ${opts.length}`);
  for (const o of opts) {
    const flag = o.hasFeature ? "ATTR OK" : "NO ATTR";
    console.log(`    [${flag}] ${o.id}`);
  }
}

console.log("\n=== Spec code vs SVG match ===");
const planFileHint = {
  Addison: ["ADDISON"],
  Bandera: ["BANDERA"],
  Collin: ["COLLIN"],
  Grayson: ["GRAYSON"],
  Magnolia: ["MAGNOLIA"],
};

function floorFromName(name) {
  const u = name.toUpperCase();
  if (u.includes("2ND") || u.includes("SECOND")) return "second";
  return "first";
}

for (const [plan, spec] of Object.entries(SPEC)) {
  const planFiles = files.filter((f) =>
    planFileHint[plan].some((h) => path.basename(f).toUpperCase().includes(h)),
  );
  console.log(`\n## ${plan}`);
  for (const [floor, needed] of Object.entries(spec.floors)) {
    const file = planFiles.find((f) => floorFromName(path.basename(f)) === floor);
    if (!file) {
      console.log(`  ${floor}: MISSING SVG FILE`);
      continue;
    }
    const svg = fs.readFileSync(file, "utf8");
    const opts = extractOptIds(svg);
    const optIds = opts.map((o) => o.id);
    console.log(`  ${floor} (${path.basename(file)})`);
    for (const [code, name] of needed) {
      const hits = optIds.filter((id) => {
        const body = codeFromId(id).replace(/_$/, "");
        const compactBody = body.replace(/_/g, "").toUpperCase();
        const compactCode = code.replace(/_/g, "").toUpperCase();
        return (
          body.toUpperCase() === code.toUpperCase() ||
          compactBody === compactCode ||
          compactBody.startsWith(compactCode) ||
          compactCode.startsWith(compactBody.replace(/\d+$/, "")) && compactBody.includes(compactCode.slice(0, 6))
        );
      });
      // tighter match
      const exactish = optIds.filter((id) => {
        const body = codeFromId(id).replace(/_+$/, "");
        const variants = [
          body,
          body.replace(/^_/, ""),
          body.replace(/_$/, ""),
        ];
        return variants.some(
          (v) =>
            v.toUpperCase() === code.toUpperCase() ||
            v.replace(/_/g, "").toUpperCase() === code.replace(/_/g, "").toUpperCase() ||
            v.replace(/\d+$/, "").toUpperCase() === code.replace(/\d+$/, "").toUpperCase() &&
              v.replace(/[A-Z]/g, "") === code.replace(/[A-Z]/g, ""),
        );
      });
      const show = exactish.length ? exactish : hits;
      const status = exactish.length
        ? "MATCH"
        : hits.length
          ? "FUZZY"
          : "MISSING";
      console.log(`    [${status}] ${code}  ${name}  -> ${show.join(" | ") || "(none)"}`);
    }
    const neededCompact = needed.map(([c]) => c.replace(/_/g, "").toUpperCase());
    const extras = optIds.filter((id) => {
      const compact = codeFromId(id).replace(/_/g, "").toUpperCase().replace(/\d+$/, (m) => m);
      return !neededCompact.some(
        (n) =>
          compact === n ||
          compact.startsWith(n) ||
          n.startsWith(compact.replace(/\d+$/, "")),
      );
    });
    if (extras.length) {
      console.log(`    extra OPT layers: ${extras.join(", ")}`);
    }
  }
}

const cmsText = fs.readFileSync(cmsPath, "utf8");
const lines = cmsText.split(/\n/).filter(Boolean);
console.log("\n=== CMS Park Place ===");
for (const line of lines) {
  const obj = JSON.parse(line);
  const items = obj.result?.items || [];
  if (obj.label === "list-communities") {
    for (const it of items) {
      const fd = it.fieldData;
      console.log(
        `community: ${fd.name} slug=${fd.slug} id=${it.id} plans=${(fd["house-plans"] || []).length}`,
      );
      if (String(fd.name).toLowerCase().includes("park")) {
        console.log(`  house-plan ids: ${(fd["house-plans"] || []).join(", ")}`);
      }
    }
  }
  if (obj.label === "list-house-plans") {
    const parkCommunity = "6a232d20b9a6f100a2c5ccf5";
    for (const it of items) {
      const fd = it.fieldData;
      const name = fd.name || "";
      const code = fd["plan-code"] || "";
      const community = fd["upcoming-community"];
      const hay = `${name} ${code} ${fd.slug}`.toLowerCase();
      const isPark =
        community === parkCommunity ||
        hay.includes("park") ||
        /addison|bandera|collin|grayson|magnolia/.test(hay);
      if (!isPark) continue;
      console.log(`plan: ${name}`);
      console.log(`  id=${it.id} slug=${fd.slug} marketing=${JSON.stringify(code)} community=${community}`);
      console.log(`  exteriors=${JSON.stringify(fd["available-exteriors"] || [])}`);
      console.log(`  first=${fd["first-floor-svg-map"] || ""}`);
      console.log(`  second=${fd["second-floor-svg-map"] || ""}`);
      console.log(
        `  beds=${fd.beds} baths=${fd.baths} sqft=${fd["square-feet"]} price=${fd.price} singleFloor=${fd["has-multiple-floors"]}`,
      );
    }
  }
  if (obj.label === "list-exterior-styles") {
    for (const it of items) {
      const fd = it.fieldData;
      const keys = [
        "white-image-scheme",
        "soft-cream-image-scheme",
        "slate-blue-image-scheme",
        "charcoal-grey-image-scheme",
      ];
      const schemes = keys.map((k) => Boolean(fd[k]));
      console.log(
        `style: ${fd.name} display=${fd["display-name"]} slug=${fd.slug} id=${it.id} schemes=${JSON.stringify(schemes)}`,
      );
    }
  }
}
