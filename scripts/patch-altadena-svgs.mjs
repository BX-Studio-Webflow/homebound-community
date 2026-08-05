import fs from "fs";
import path from "path";

const root = path.resolve("src/example-assets/home-icons/Altadena");
const srcRoot = path.join(root, "Updated Plans - Altadena SVGS");
const outRoot = path.join(root, "Altadena - Updated SVGS");

const jobs = [
  {
    name: "Plan 1 - The Sycamore",
    files: [
      {
        src: path.join(srcRoot, "Plan 1", "Plan 1 - Sycamore - First Floor.svg"),
        out: "sycamore-first-floor.svg",
      },
    ],
  },
  {
    name: "Plan 2 - The Loma",
    files: [
      {
        src: path.join(srcRoot, "Plan 2", "Plan 2 - Loma - First Floor.svg"),
        out: "loma-first-floor.svg",
      },
    ],
  },
  {
    name: "Plan 3 - The Chaney",
    files: [
      {
        src: path.join(srcRoot, "Plan 3", "Plan 3 - Chaney - First Floor.svg"),
        out: "chaney-first-floor.svg",
      },
    ],
  },
  {
    name: "Plan 4 - The Merrick",
    files: [
      {
        src: path.join(srcRoot, "Plan 4", "Plan 4 - Merrick - First Floor.svg"),
        out: "merrick-first-floor.svg",
      },
      {
        src: path.join(srcRoot, "Plan 4", "Plan 4 - Merrick - Second Floor.svg"),
        out: "merrick-second-floor.svg",
      },
    ],
  },
  {
    name: "Plan 5 - The Echo",
    // Restore option layers from Archive (current Plan 5 exports had none)
    files: [
      {
        src: path.join(
          srcRoot,
          "Plan 5",
          "Archive",
          "Plan 5 - Echo - Combined_1st Floor-02.svg",
        ),
        out: "echo-first-floor.svg",
      },
      {
        src: path.join(srcRoot, "Plan 5", "Archive", "Plan 5 - Echo - Second Floor.svg"),
        out: "echo-second-floor.svg",
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

/** Map OPT_CODE_* Illustrator ids → CMS feature values (July 2026 doc codes). */
function toFeatureId(optCodeId) {
  let body = optCodeId.replace(/^OPT_CODE_/, "");
  body = decodeIllustratorId(body).replace(/^_/, "");
  const lower = body.toLowerCase();

  // Ceiling beams — Chaney doc typo CEILBEAM001 → CEILBEAM01
  if (/^ceilbeam0?0?1/i.test(body) || /^ceilbeam001/i.test(body)) {
    if (lower.includes("primary") && lower.includes("opt")) {
      return "CEILBEAM01-primary-bedroom-on-opt-add-bedroom";
    }
    if (lower.includes("primary")) {
      return "CEILBEAM01-primary-bedroom";
    }
    return "CEILBEAM01-great-room";
  }

  if (body.startsWith("LNRYWD0001") && lower.includes("laundry")) {
    return "LNRYWD0001-on-opt-add-bedroom";
  }

  if (body.startsWith("BATH2SHW01") && lower.includes("opt")) {
    return "BATH2SHW01-on-opt-add-bedroom";
  }

  if (body.startsWith("BATH2SHW03")) {
    if (lower.includes("ensuite")) return "BATH2SHW03-on-opt-ensuite";
    if (lower.includes("opt")) return "BATH2SHW03-on-opt-add-bedroom";
    return "BATH2SHW03";
  }

  const exact = {
    BED001: "BED001",
    BEDBATH001: "BEDBATH001",
    FLX2BED003: "FLX2BED003",
    DOORSG16FT: "DOORSG16FT",
    FIREADD001: "FIREADD001",
    DOORINTFR001: "DOORINTFR001",
    ADDPWDR001: "ADDPWDR001",
    ADDENSTE001: "ADDENSTE001",
    EXTODL: "EXTODL",
    "12080_SLD": "12080-SLD",
    LFT2BED001: "LFT2BED001",
    BALC001: "BALC001",
    CASEOPN001: "CASEOPN001",
    LNRYWD0001: "LNRYWD0001",
    BATH2SHW01: "BATH2SHW01",
    CABLDRY001: "CABLDRY001",
    DOOREGD001: "DOOREGD001",
    ADDWALL001: "ADDWALL001",
    "I1_-_B_-_SPANISH": "I1",
    "E1_-_C_-_CRAFTSMAN": "E1",
  };

  const key = body.split("(")[0].replace(/_+$/, "");
  if (exact[key]) return exact[key];
  if (exact[body]) return exact[body];

  return body
    .replace(/[()]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function patchSvg(content) {
  const used = new Map();
  const mappings = [];

  const patched = content.replace(
    /<g(\s+)id="(OPT_CODE_[^"]+)"([^>]*)>/g,
    (_full, sp, id, rest) => {
      let featureId = toFeatureId(id);
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

  return { patched, mappings };
}

if (fs.existsSync(outRoot)) {
  fs.rmSync(outRoot, { recursive: true, force: true });
}
fs.mkdirSync(outRoot, { recursive: true });

const report = [];

for (const plan of jobs) {
  const dir = path.join(outRoot, plan.name);
  fs.mkdirSync(dir, { recursive: true });

  for (const file of plan.files) {
    if (!fs.existsSync(file.src)) {
      throw new Error(`Missing source: ${file.src}`);
    }
    const raw = fs.readFileSync(file.src, "utf8");
    const { patched, mappings } = patchSvg(raw);
    const dest = path.join(dir, file.out);
    fs.writeFileSync(dest, patched, "utf8");
    const featureCount = (patched.match(/data-attribute="feature"/g) || []).length;
    report.push({
      plan: plan.name,
      file: file.out,
      features: featureCount,
      mappings,
    });
    console.log(`OK ${plan.name}/${file.out} — ${featureCount} features`);
  }
}

const reportPath = path.join(outRoot, "patch-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Wrote ${reportPath}`);
