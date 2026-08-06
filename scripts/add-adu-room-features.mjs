/**
 * Adds data-attribute="feature" highlight groups to ADU first-floor SVGs
 * that have room labels but no OPT_CODE feature groups.
 *
 * Codes follow ROOMNAMES_STANDARD label prefixes (without -TEXT).
 */
import fs from "fs";
import path from "path";

const yellow = "#faf185";

/** Approximate room highlight rects from floor-plan label positions / poche. */
const jobs = [
  {
    file: "src/example-assets/home-icons/ADUS/ADUS - Updated SVGS/Carriage House ADU/carriage-house-adu-first-floor.svg",
    features: [
      // Garage fills main floor plate; label ~ (140,136), dims 27'x20'
      { id: "GARAGE", x: 28, y: 28, w: 290, h: 250 },
    ],
  },
  {
    file: "src/example-assets/home-icons/ADUS/ADUS - Updated SVGS/Studio ADU/studio-adu-detached-garage.svg",
    features: [
      // Detached garage plate; label ~ (168,176), dims 20'x19'10"
      { id: "GARAGE", x: 20, y: 20, w: 350, h: 340 },
    ],
  },
  {
    file: "src/example-assets/home-icons/ADUS/ADUS - Updated SVGS/Two-Story ADU/two-story-adu-first-floor.svg",
    features: [
      // Labels: living ~(65,111), kitchen ~(187,111), entry ~(204,235),
      // powder ~(283,234), stairs ~(294,182), porch ~(83,236)
      { id: "LIVING_ROOM", x: 45, y: 55, w: 120, h: 130 },
      { id: "KITCHEN", x: 165, y: 55, w: 95, h: 130 },
      { id: "EVERYDAY_ENTRY", x: 185, y: 200, w: 70, h: 55 },
      { id: "POWDER_ROOM", x: 265, y: 200, w: 70, h: 55 },
      { id: "STAIRS", x: 275, y: 145, w: 60, h: 50 },
      { id: "PORCH", x: 55, y: 215, w: 100, h: 45 },
    ],
  },
];

function featureMarkup({ id, x, y, w, h }) {
  return `    <g id="${id}" data-attribute="feature" display="none">
      <g id="HIGHLIGHT-${id}" mix-blend-mode="multiply">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${yellow}" mix-blend-mode="multiply"/>
      </g>
    </g>
`;
}

function insertFeatures(svg, features) {
  if (features.some((f) => new RegExp(`id="${f.id}"[^>]*data-attribute="feature"`).test(svg))) {
    return { svg, skipped: true };
  }
  const block = features.map(featureMarkup).join("");
  // Insert before </svg> metadata if present, else before closing </svg>
  if (svg.includes("<metadata>")) {
    return {
      svg: svg.replace(/\n  <metadata>/, `\n${block}  <metadata>`),
      skipped: false,
    };
  }
  return {
    svg: svg.replace(/\n<\/svg>\s*$/, `\n${block}</svg>\n`),
    skipped: false,
  };
}

const report = [];
for (const job of jobs) {
  const abs = path.resolve(job.file);
  const raw = fs.readFileSync(abs, "utf8");
  const { svg, skipped } = insertFeatures(raw, job.features);
  if (skipped) {
    console.log(`SKIP (already has features) ${job.file}`);
    report.push({ file: path.basename(job.file), skipped: true, featureIds: job.features.map((f) => f.id) });
    continue;
  }
  fs.writeFileSync(abs, svg, "utf8");
  const ids = job.features.map((f) => f.id);
  console.log(`OK ${path.basename(job.file)} → ${ids.join(", ")}`);
  report.push({ file: path.basename(job.file), skipped: false, featureIds: ids });
}

const reportPath =
  "src/example-assets/home-icons/ADUS/ADUS - Updated SVGS/room-features-report.json";
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log("Wrote", reportPath);
