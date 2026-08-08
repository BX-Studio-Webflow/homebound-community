import fs from "fs";
import path from "path";

const svgPath = path.resolve(
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 5 - The Echo/echo-second-floor.svg",
);
const previewPath = path.resolve("scripts/preview-echo-balcony.html");

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

  return `    <g id="${featureId}" data-attribute="feature" display="none">
      <g id="Whiteout-BALC001" data-name="Whiteout">
        <rect x="${fmt(BALCONY_X)}" y="${fmt(BALCONY_NORTH_Y)}" width="${fmt(BALCONY_W)}" height="${fmt(BALCONY_H + 7.9566)}" fill="#fff"/>
      </g>
      <g id="Highlight5" data-name="Highlight" mix-blend-mode="multiply">
        <rect x="${fmt(BALCONY_X)}" y="${fmt(BALCONY_NORTH_Y)}" width="${fmt(BALCONY_W)}" height="${fmt(BALCONY_H)}" fill="#faf183" mix-blend-mode="multiply"/>
      </g>
      <g id="Geometry-BALC001" data-name="Geometry">
        <g id="LINE-BALC-NORTH" data-name="LINE">
          <line x1="${fmt(BALCONY_X)}" y1="${fmt(BALCONY_NORTH_Y)}" x2="${fmt(BALCONY_EAST_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>
        <g id="LINE-BALC-WEST" data-name="LINE">
          <line x1="${fmt(BALCONY_X)}" y1="${fmt(BALCONY_SOUTH_Y)}" x2="${fmt(BALCONY_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>
        <g id="LINE-BALC-EAST" data-name="LINE">
          <line x1="${fmt(BALCONY_EAST_X)}" y1="${fmt(BALCONY_SOUTH_Y)}" x2="${fmt(BALCONY_EAST_X)}" y2="${fmt(BALCONY_NORTH_Y)}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".18"/>
        </g>
${wallGeometry}
      </g>
      <g id="BALC001-TEXT">
        <text id="BALCONY-LABEL" transform="translate(${labelX} ${labelY})" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">BALCONY</tspan></text>
        <text id="BALCONY-DIMENSION" transform="translate(${fmt(labelX - 18)} ${dimY})" fill="#231f20" font-family="SansSerif, SansSerif" font-size="12"><tspan x="0" y="0">11&apos; 10&quot; X 6&apos; 0&quot;</tspan></text>
      </g>
    </g>`;
}

let content = fs.readFileSync(svgPath, "utf8");
const wallGeometry = extractBalconyWallGeometry(content);

content = content.replace(
  /\s*<g id="BALCONY-BASE-WHITEOUT">\s*<rect[^/]*\/>\s*<\/g>\s*/,
  "\n",
);

const featurePattern =
  /    <g id="BALC001" data-attribute="feature" display="none">[\s\S]*?    <\/g>\n    <g id="E1"/;
if (!featurePattern.test(content)) {
  throw new Error("Could not locate BALC001 block");
}
content = content.replace(
  featurePattern,
  `${buildBalconyFeature("BALC001", wallGeometry)}\n    <g id="E1"`,
);

fs.writeFileSync(svgPath, content, "utf8");
console.log("Patched echo-second-floor.svg — whiteout moved into BALC001 feature group");

const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Echo Balcony Preview (BALC001)</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f3f3f4; }
    header {
      padding: 12px 20px;
      background: #fff;
      border-bottom: 1px solid #dfdfe2;
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .panel { padding: 20px; overflow: auto; }
    .panel svg { width: min(100%, 900px); height: auto; display: block; margin: 0 auto; background: #fff; }
    [data-attribute="feature"] { display: none; }
    .home-map__shape--active { display: block !important; }
    .note { color: #555; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <strong>Echo Second Floor — Balcony preview</strong>
    <label><input id="toggle" type="checkbox" checked /> Add Balcony to Primary Bedroom (BALC001)</label>
    <span class="note">Unchecked = default plan. Checked = yellow highlight like other options.</span>
  </header>
  <div class="panel" id="mount">${content}</div>
  <script>
    const toggle = document.getElementById("toggle");
    const svg = document.querySelector("#mount svg");
    svg.classList.add("home-map__svg");
    const balcony = svg.querySelector('#BALC001[data-attribute="feature"]');
    if (balcony) balcony.classList.add("home-map__shape");
    const sync = () => balcony?.classList.toggle("home-map__shape--active", toggle.checked);
    toggle.addEventListener("change", sync);
    sync();
  </script>
</body>
</html>
`;

fs.writeFileSync(previewPath, previewHtml, "utf8");
console.log(`Preview: file://${previewPath.replace(/\\\\/g, "/")}`);
