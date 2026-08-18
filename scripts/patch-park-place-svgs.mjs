import fs from "fs";
import path from "path";

const srcRoot = path.resolve(
  "src/example-assets/home-icons/Park Place Marketing Floor Plans",
);
const outRoot = path.join(srcRoot, "Park Place - Updated SVGS");

const jobs = [
  {
    name: "The Addison",
    files: [
      {
        src: path.join(srcRoot, "The Addison", "ADDISON_FLOORPLAN_2026.02.03.svg"),
        out: "addison-first-floor.svg",
        map: {
          OPT_PREPKIT001: "PREPKIT001",
          OPT_EXTCVPT01: "EXTCVPT01",
          OPT__DOOREGD001: "DOOREGD001",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_FIREADD001: "FIREADD001",
          OPT_CEILBEAM01: "CEILBEAM01-great-room",
          OPT_GARG3B0001: "GARG3B0001",
        },
      },
    ],
  },
  {
    name: "The Bandera",
    files: [
      {
        src: path.join(srcRoot, "The Bandera", "BANDERA_1STFLOOR_2026.02.17.svg"),
        out: "bandera-first-floor.svg",
        map: {
          OPT_PRPKTCN01: "PREPKIT001",
          OPT_ADDFLEXRM1: "ADDFLEXRM1",
          OPT_EXTCVPT01: "EXTCVPT01",
          OPT_FIREPLCE11: "FIREPLCE11",
          OPT_CEILBEAM013: "CEILBEAM013",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_CEILBEAM01: "CEILBEAM01-dining-room",
          OPT_GARG3B0001: "GARG3B0001",
        },
      },
      {
        src: path.join(srcRoot, "The Bandera", "BANDERA_2NDFLOOR_2026.02.17.svg"),
        out: "bandera-second-floor.svg",
        map: {
          OPT_CEILBEAM01: "CEILBEAM01-loft",
          OPT_BEDBATH001: "BEDBATH001",
          OPT_MEDIA01: "MEDIA01",
        },
      },
    ],
  },
  {
    name: "The Collin",
    files: [
      {
        src: path.join(srcRoot, "The Collin", "COLLIN_1STFLOORPLAN_2026.02.25.svg"),
        out: "collin-first-floor.svg",
        map: {
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_PRPKTCN1: "PREPKIT001",
          OPT_GRG2FLX01: "GRG2FLX01",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_GARG3B0001: "GARG3B0001",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_FIREPLCE11: "FIREPLCE11",
        },
      },
      {
        src: path.join(srcRoot, "The Collin", "COLLIN_2NDFLOORPLAN_2026.02.25.svg"),
        out: "collin-second-floor.svg",
        map: {
          OPT_CEILBEAM01: "CEILBEAM01-game-room",
        },
      },
    ],
  },
  {
    name: "The Grayson",
    files: [
      {
        src: path.join(srcRoot, "The Grayson", "GRAYSON_1STFLOORPLAN_2026.02.26.svg"),
        out: "grayson-first-floor.svg",
        map: {
          OPT_PRPKTCN1: "PRPKTCN1",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_DOOREGD001: "DOOREGD001",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_GARG3B0001: "GARG3B0001",
        },
      },
      {
        src: path.join(srcRoot, "The Grayson", "GRAYSON_2NDFLOORPLAN_2026.02.26.svg"),
        out: "grayson-second-floor.svg",
        map: {
          OPT_ADDMEDIA01: "ADDMEDIA01",
          OPT_CEILBEAM01: "CEILBEAM01-game-room",
        },
      },
    ],
  },
  {
    name: "The Magnolia",
    files: [
      {
        src: path.join(srcRoot, "The Magnolia", "MAGNOLIA_1STFLOORPLAN_2026.02.17.svg"),
        out: "magnolia-first-floor.svg",
        map: {
          OPT_PRPKTCN1: "PREPKIT001",
          OPT__DOOREGD001: "DOOREGD001",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_GARG3B0001: "GARG3B0001",
        },
      },
      {
        src: path.join(srcRoot, "The Magnolia", "MAGNOLIA_2NDFLOORPLAN_2026.02.17.svg"),
        out: "magnolia-second-floor.svg",
        map: {
          OPT_BED001: "BED001",
        },
      },
    ],
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patchSvg(content, map) {
  const mappings = [];
  let patched = content;
  const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of entries) {
    const re = new RegExp(`<g(\\s+)id="${escapeRegExp(from)}"([^>]*)>`, "g");
    let count = 0;
    patched = patched.replace(re, (_full, sp, rest) => {
      count += 1;
      let attrs = rest || "";
      if (!/data-attribute=/.test(attrs)) {
        attrs = ` data-attribute="feature"${attrs}`;
      }
      return `<g${sp}id="${to}"${attrs}>`;
    });
    mappings.push({ from, to, count });
  }

  return { patched, mappings };
}

if (fs.existsSync(outRoot)) {
  fs.rmSync(outRoot, { recursive: true, force: true });
}
fs.mkdirSync(outRoot, { recursive: true });

const report = [];
let failed = false;

for (const plan of jobs) {
  const dir = path.join(outRoot, plan.name);
  fs.mkdirSync(dir, { recursive: true });

  for (const file of plan.files) {
    if (!fs.existsSync(file.src)) {
      throw new Error(`Missing source: ${file.src}`);
    }
    const raw = fs.readFileSync(file.src, "utf8");
    const { patched, mappings } = patchSvg(raw, file.map);
    const dest = path.join(dir, file.out);
    fs.writeFileSync(dest, patched, "utf8");
    const featureCount = (patched.match(/data-attribute="feature"/g) || []).length;
    const missing = mappings.filter((m) => m.count !== 1);
    report.push({
      plan: plan.name,
      file: file.out,
      features: featureCount,
      mappings,
    });
    const flag = missing.length ? "WARN" : "OK";
    console.log(
      `${flag} ${plan.name}/${file.out} — ${featureCount} features` +
        (missing.length
          ? ` | unexpected counts: ${missing.map((m) => `${m.from}=${m.count}`).join(", ")}`
          : ""),
    );
    if (missing.length) failed = true;
  }
}

const reportPath = path.join(outRoot, "patch-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Wrote ${reportPath}`);
if (failed) process.exitCode = 1;
