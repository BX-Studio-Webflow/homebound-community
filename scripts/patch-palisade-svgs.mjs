import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = path.resolve("src/example-assets/home-icons/Palisade SVGs");
const outRoot = path.join(root, "Palisade - Updated SVGS");

const jobs = [
  {
    name: "The Ambrose - Plan 10",
    files: [
      {
        src: path.join(root, "The Ambrose - Plan 10", "HB_CODED_Plan 10 First Floor_edited.svg"),
        out: "ambrose-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "The Ambrose - Plan 10", "HB_CODED_Plan 10 Second Floor_edited.svg"),
        out: "ambrose-second-floor.svg",
        floor: "second",
      },
    ],
  },
  {
    name: "The Alder - Plan 9",
    files: [
      {
        src: path.join(root, "The Alder - Plan 9", "HB_CODED_Plan 9 First Floor_edited.svg"),
        out: "alder-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "The Alder - Plan 9", "HB_CODED_Plan 9 Second Floor_edited.svg"),
        out: "alder-second-floor.svg",
        floor: "second",
      },
    ],
  },
  {
    name: "The Vista - Plan 8",
    files: [
      {
        src: path.join(root, "The Vista - Plan 8", "HB_CODED_Plan 8 First floor_edited.svg"),
        out: "vista-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "The Vista - Plan 8", "HB_CODED_Plan 8 Second Floor_edited.svg"),
        out: "vista-second-floor.svg",
        floor: "second",
      },
    ],
  },
  {
    name: "The Willow - Plan 7",
    files: [
      {
        src: path.join(root, "The Willow - Plan 7", "HB_CODED_Plan 7 First Floor_edited.svg"),
        out: "willow-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "The Willow - Plan 7", "HB_CODED_Plan 7 Second Floor_edited.svg"),
        out: "willow-second-floor.svg",
        floor: "second",
        postPatch: "willow-second-floor-alt-bath-white",
      },
    ],
  },
  {
    name: "The Glenview - Plan 6X",
    files: [
      {
        src: path.join(root, "The Glenview - Plan 6X", "HB_CODED_Plan 6x first floor_edited.svg"),
        out: "glenview-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "The Glenview - Plan 6X", "HB_CODED_Plan 6x Second floor_edited.svg"),
        out: "glenview-second-floor.svg",
        floor: "second",
      },
    ],
  },
  {
    name: "The Elm - Plan 6",
    files: [
      {
        src: path.join(root, "The Elm - Plan 6", "HB_CODED_Plan 6_edited.svg"),
        out: "elm-first-floor.svg",
        floor: "first",
      },
    ],
  },
];

function decodeIllustratorId(raw) {
  return raw
    .replace(/__x28_/g, "(")
    .replace(/_x29_/g, ")")
    .replace(/_x5F_/g, "_")
    .replace(/__/g, "_");
}

function toFeatureId(optCodeId, floor) {
  let body = optCodeId.replace(/^OPT_CODE_/, "");
  // Glenview typo: OPT_CODE_OPT_CODE_CEILBEAM01(...)
  body = body.replace(/^OPT_CODE_/, "");
  body = decodeIllustratorId(body).replace(/^_/, "");
  const lower = body.toLowerCase();

  if (/^ceilbeam/i.test(body)) {
    if (lower.includes("retreat")) return "CEILBEAM01-primary-retreat";
    if (lower.includes("ext") && lower.includes("primary")) {
      return "CEILBEAM01-primary-bedroom";
    }
    if (lower.includes("primary")) return "CEILBEAM01-primary-bedroom";
    if (lower.includes("great")) return "CEILBEAM01-great-room";
    // Plain CEILBEAM01 — infer from floor
    return floor === "second" ? "CEILBEAM01-primary-bedroom" : "CEILBEAM01-great-room";
  }

  // Exact / prefix maps (normalize doc typos to SVG)
  const exact = {
    PREPKIT001: "PREPKIT001",
    ELEVATOR01: "ELEVATOR01",
    ADDWINERM1: "ADDWINERM1",
    ADDWINERM01: "ADDWINERM1",
    FIREPLODR1: "FIREPLODR1",
    FIREADD001: "FIREADD001",
    BEDBATH001: "BEDBATH001",
    EXTCLST001: "EXTCLST001",
    EXTCLS001: "EXTCLST001",
    ADDSKYLT01: "ADDSKYLT01",
    LFT2BED001: "LFT2BED001",
    EXTCVPT02: "EXTCVPT02",
    EXTCVP02: "EXTCVPT02",
    EXTCVPT01: "EXTCVPT01",
    DOOREGD001: "DOOREGD001",
    DOOREG001: "DOOREGD001",
    DOOREGD0011: "DOOREGD0011",
    DOOREGD011: "DOOREGD001",
    ADDLOFT001: "ADDLOFT001",
    DECKCVD001: "DECKCVD001",
    RTREATPM01: "RTREATPM01",
    ATTDEF6: "BEDBATH001",
    A2: "A2",
    G1: "G1",
    H2: "H2",
    LNRYWD001: "LNRYWD001",
    LNRYWD0001: "LNRYWD0001",
    DOORINTSW1: "DOORINTSW1",
    BATH2SHW01: "BATH2SHW01",
  };

  // Storage / Primary Bath door variants
  if (/^DOORINTSW1/i.test(body)) {
    if (lower.includes("storage")) return "DOORINTSW1-storage";
    if (lower.includes("primary")) return "DOORINTSW1-primary-bath";
    return "DOORINTSW1";
  }

  // Bath shower room-specific: BATH2SHW01_BATH106 → BATH2SHW01-BATH106
  if (/^BATH2SHW01/i.test(body)) {
    const m = body.match(/BATH2SHW01_BATH(\d+)/i);
    if (m) return `BATH2SHW01-BATH${m[1]}`;
    return "BATH2SHW01";
  }

  const key = body.split("(")[0].replace(/_+$/, "");
  if (exact[key]) return exact[key];
  if (exact[body]) return exact[body];

  return body
    .replace(/[()]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Remove display="none" from Whiteout/Highlight/Geometry (parent feature stays hidden). */
function stripNestedDisplayNone(svg) {
  return svg.replace(
    /(<g\b[^>]*\b(?:data-name="(?:Whiteout|Highlight|Geometry)"|id="(?:Whiteout\d*|Highlight\d*|Geometry\d*)")[^>]*?)\s+display="none"/gi,
    "$1",
  );
}

function patchSvg(content, floor) {
  const used = new Map();
  const mappings = [];

  let patched = content.replace(
    /<g(\s+)id="((?:OPT_CODE_)+[^"]+)"([^>]*)>/g,
    (_full, sp, id, rest) => {
      let featureId = toFeatureId(id, floor);
      if (used.has(featureId)) {
        let n = 2;
        while (used.has(`${featureId}-${n}`)) n += 1;
        featureId = `${featureId}-${n}`;
      }
      used.set(featureId, id);
      mappings.push({ from: id, to: featureId });

      let attrs = rest || "";
      if (!/data-attribute=/.test(attrs)) {
        attrs = ` data-attribute="feature"${attrs}`;
      }
      return `<g${sp}id="${featureId}"${attrs}>`;
    },
  );

  patched = stripNestedDisplayNone(patched);
  return { patched, mappings };
}

/** Alt Primary Bath base tint is white (not yellow) on Willow second floor. */
function applyWillowSecondFloorAltBathWhite(svg) {
  if (!svg.includes('id="Highlight4"')) return svg;
  if (!/\.st27\s*\{/.test(svg)) {
    svg = svg.replace(
      /(\s*\.st15 \{\s*stroke-dasharray: 4 5;\s*\})\s*<\/style>/,
      `$1
      .st27 {
        fill: #fff;
        opacity: .25;
      }
    </style>`,
    );
  }
  return svg.replace(
    /(<g id="Highlight4"[^>]*>\s*<rect class=")st\d+(" x="385\.33" y="128\.9" width="214\.33" height="119\.91"\/>)/,
    '$1st27$2',
  );
}

const postPatchers = {
  "willow-second-floor-alt-bath-white": applyWillowSecondFloorAltBathWhite,
};

fs.mkdirSync(outRoot, { recursive: true });

const report = [];
const hashes = [];

for (const plan of jobs) {
  const dir = path.join(outRoot, plan.name);
  fs.mkdirSync(dir, { recursive: true });

  for (const file of plan.files) {
    if (!fs.existsSync(file.src)) {
      throw new Error(`Missing source: ${file.src}`);
    }
    const raw = fs.readFileSync(file.src, "utf8");
    let { patched, mappings } = patchSvg(raw, file.floor);
    if (file.postPatch) {
      patched = postPatchers[file.postPatch](patched);
    }
    const dest = path.join(dir, file.out);
    fs.writeFileSync(dest, patched, "utf8");
    const buf = fs.readFileSync(dest);
    const md5 = crypto.createHash("md5").update(buf).digest("hex");
    const featureCount = (patched.match(/data-attribute="feature"/g) || []).length;
    const featureIds = [
      ...patched.matchAll(/<g id="([^"]+)"[^>]*data-attribute="feature"/g),
    ].map((m) => m[1]);
    report.push({
      plan: plan.name,
      file: file.out,
      features: featureCount,
      featureIds,
      mappings,
    });
    hashes.push({
      plan: plan.name,
      file: file.out,
      path: dest,
      size: buf.length,
      md5,
    });
    console.log(`OK ${plan.name}/${file.out} — ${featureCount} features`);
  }
}

fs.writeFileSync(path.join(outRoot, "patch-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outRoot, "upload-hashes.json"), JSON.stringify(hashes, null, 2));
console.log("Wrote patch-report.json + upload-hashes.json");
