import fs from "fs";
import path from "path";

const root = path.resolve("src/example-assets/home-icons/Altadena");
const targets = [
  {
    file: path.join(
      root,
      "Altadena - Updated SVGS/Plan 5 - The Echo/echo-second-floor.svg",
    ),
    featureId: "BALC001",
  },
  {
    file: path.join(
      root,
      "Altadena - Updated SVGS/Plan 5 - The Echo/echo-second-floor-update--1.svg",
    ),
    featureId: "BALC001",
  },
  {
    file: path.join(
      root,
      "Updated Plans - Altadena SVGS/Plan 5/Archive/Plan 5 - Echo - Second Floor.svg",
    ),
    featureId: "OPT_CODE_BALC001",
  },
];

const UNITS_PER_FOOT = 168.0763 / 12;
const BEDROOM_X = 282.6081;
const BEDROOM_W = 449.2646 - BEDROOM_X;
const BALCONY_W = (11 + 10 / 12) * UNITS_PER_FOOT;
const BALCONY_H = 6 * UNITS_PER_FOOT;
const BALCONY_X = BEDROOM_X + (BEDROOM_W - BALCONY_W) / 2;
const BALCONY_SOUTH_Y = 11.817;
const BALCONY_NORTH_Y = BALCONY_SOUTH_Y - BALCONY_H;
const BALCONY_EAST_X = BALCONY_X + BALCONY_W;

const fmt = (n) => Number(n.toFixed(4));

function extractBalconyWallGeometry(content) {
  const start = content.indexOf('<g id="LINE907"');
  const end = content.indexOf('<g id="LINE967"');
  if (start === -1 || end === -1) {
    throw new Error("Could not locate balcony wall geometry (LINE907–LINE966)");
  }
  return content.slice(start, end);
}

function buildBalconyFeature(featureId, wallGeometry) {
  const labelX = fmt(BALCONY_X + BALCONY_W / 2 - 18);
  const labelY = fmt(BALCONY_NORTH_Y + BALCONY_H / 2 - 4);
  const dimY = fmt(labelY + 14);

  const deckGeometry = `
        <g id="LINE-BALC-NORTH" data-name="LINE">
          <line x1="${fmt(BALCONY_X)}" y1="${fmt(BALCONY_NORTH_Y)}" x2="${fmt(BALCONY_EAST_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>
        <g id="LINE-BALC-WEST" data-name="LINE">
          <line x1="${fmt(BALCONY_X)}" y1="${fmt(BALCONY_SOUTH_Y)}" x2="${fmt(BALCONY_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>
        <g id="LINE-BALC-EAST" data-name="LINE">
          <line x1="${fmt(BALCONY_EAST_X)}" y1="${fmt(BALCONY_SOUTH_Y)}" x2="${fmt(BALCONY_EAST_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>`;

  return `    <g id="${featureId}" data-attribute="feature" display="none">
      <g id="Whiteout-BALC001" data-name="Whiteout">
        <rect x="${fmt(BALCONY_X)}" y="${fmt(BALCONY_NORTH_Y)}" width="${fmt(BALCONY_W)}" height="${fmt(BALCONY_H + 7.9566)}" fill="#fff"/>
      </g>
      <g id="Highlight5" data-name="Highlight" mix-blend-mode="multiply">
        <rect x="${fmt(BALCONY_X)}" y="${fmt(BALCONY_NORTH_Y)}" width="${fmt(BALCONY_W)}" height="${fmt(BALCONY_H)}" fill="#faf183" mix-blend-mode="multiply"/>
      </g>
      <g id="Geometry-BALC001" data-name="Geometry">
${deckGeometry}
${wallGeometry}
      </g>
      <g id="BALC001-TEXT">
        <text id="BALCONY-LABEL" transform="translate(${labelX} ${labelY})" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">BALCONY</tspan></text>
        <text id="BALCONY-DIMENSION" transform="translate(${fmt(labelX - 18)} ${dimY})" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">11&apos; 10&quot; X 6&apos; 0&quot;</tspan></text>
      </g>
    </g>`;
}

function patch(file, featureId) {
  let content = fs.readFileSync(file, "utf8");
  const wallGeometry = extractBalconyWallGeometry(content);

  content = content.replace(
    /viewBox="0 0 468 738"/,
    `viewBox="0 ${fmt(BALCONY_NORTH_Y - 8)} 468 ${fmt(738 - BALCONY_NORTH_Y + 8)}"`,
  );

  content = content.replace(
    /\s*<g id="BALCONY-BASE-WHITEOUT">\s*<rect[^/]*\/>\s*<\/g>\s*/,
    "\n",
  );

  const featurePattern = new RegExp(
    `    <g id="${featureId}" data-attribute="feature" display="none">[\\s\\S]*?    </g>\\n    <g id="E1"`,
  );
  if (!featurePattern.test(content)) {
    throw new Error(`Could not locate ${featureId} block in ${file}`);
  }

  content = content.replace(
    featurePattern,
    `${buildBalconyFeature(featureId, wallGeometry)}
    <g id="E1"`,
  );

  fs.writeFileSync(file, content, "utf8");
  console.log(`Fixed ${path.basename(file)} (${featureId})`);
}

for (const target of targets) {
  patch(target.file, target.featureId);
}

console.log(
  `Balcony footprint: ${fmt(BALCONY_W)} x ${fmt(BALCONY_H)} units (~11'10" x 6'0")`,
);
