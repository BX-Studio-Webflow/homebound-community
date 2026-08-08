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
      "Updated Plans - Altadena SVGS/Plan 5/Archive/Plan 5 - Echo - Second Floor.svg",
    ),
    featureId: "OPT_CODE_BALC001",
  },
];

// Full 11'10" x 6'0" deck north of the primary bedroom (not wall thickness).
// See scripts/fix-echo-balcony-size.mjs for the corrected implementation.
const UNITS_PER_FOOT = 168.0763 / 12;
const BEDROOM_X = 282.6081;
const BEDROOM_W = 449.2646 - BEDROOM_X;
const BALCONY_W = (11 + 10 / 12) * UNITS_PER_FOOT;
const BALCONY_H = 6 * UNITS_PER_FOOT;
const BALCONY_X = BEDROOM_X + (BEDROOM_W - BALCONY_W) / 2;
const BALCONY_SOUTH_Y = 11.817;
const BALCONY_Y = BALCONY_SOUTH_Y - BALCONY_H;

const featureHeader = (featureId) => `    <g id="${featureId}" data-attribute="feature" display="none">
      <g id="Whiteout-BALC001" data-name="Whiteout">
        <rect x="${BALCONY_X}" y="${BALCONY_Y}" width="${BALCONY_W}" height="${BALCONY_H + 7.9566}" fill="#fff"/>
      </g>
      <g id="Highlight5" data-name="Highlight" mix-blend-mode="multiply">
        <rect x="${BALCONY_X}" y="${BALCONY_Y}" width="${BALCONY_W}" height="${BALCONY_H}" fill="#faf183" mix-blend-mode="multiply"/>
      </g>
      <g id="Geometry-BALC001" data-name="Geometry">
`;

const featureFooter = `      </g>
      <g id="BALC001-TEXT">
        <text id="BALCONY-LABEL" transform="translate(351.9363 14.2)" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">BALCONY</tspan></text>
        <text id="BALCONY-DIMENSION" transform="translate(333.9363 17.2)" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">11&apos; 10&quot; X 6&apos; 0&quot;</tspan></text>
      </g>
    </g>
`;

function extractBalconyGeometry(content) {
  const start = content.indexOf('<g id="LINE907"');
  const end = content.indexOf('<g id="LINE967"');
  if (start === -1 || end === -1) {
    throw new Error("Could not locate balcony geometry block (LINE907–LINE966)");
  }
  return content.slice(start, end);
}

function patch(file, featureId) {
  let content = fs.readFileSync(file, "utf8");

  if (content.includes(`id="${featureId}"`)) {
    console.log(`Skip ${file} — ${featureId} already present`);
    return false;
  }

  const balconyGeometry = extractBalconyGeometry(content);

  const featureBlock = `${featureHeader(featureId)}${balconyGeometry}${featureFooter}`;
  content = content.replace(
    '    <g id="E1" data-attribute="feature" display="none">',
    `${featureBlock}    <g id="E1" data-attribute="feature" display="none">`,
  );

  fs.writeFileSync(file, content, "utf8");
  console.log(`Patched ${file}`);
  return true;
}

for (const target of targets) {
  patch(target.file, target.featureId);
}
