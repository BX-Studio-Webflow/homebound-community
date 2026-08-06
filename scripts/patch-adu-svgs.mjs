import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = path.resolve("src/example-assets/home-icons/ADUS");
const outRoot = path.join(root, "ADUS - Updated SVGS");

const jobs = [
  {
    name: "Studio ADU",
    files: [
      {
        src: path.join(root, "STUDIO ADU/ADU/1 Story ADU - First Floor.svg"),
        out: "studio-adu-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(root, "STUDIO ADU/ADU/Detached Garage - First Floor.svg"),
        out: "studio-adu-detached-garage.svg",
        floor: "first",
      },
    ],
  },
  {
    name: "Carriage House ADU",
    files: [
      {
        src: path.join(root, "CARRIAGE ADU/ADU I/Carriage House ADU - First Floor.svg"),
        out: "carriage-house-adu-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(
          root,
          "CARRIAGE ADU/ADU I/Carriage House ADU - Second Floor.svg",
        ),
        out: "carriage-house-adu-second-floor.svg",
        floor: "second",
      },
    ],
  },
  {
    name: "Two-Story ADU",
    files: [
      {
        src: path.join(root, "TWO STORY ADU/ADU II/2 Story ADU - First Floor.svg"),
        out: "two-story-adu-first-floor.svg",
        floor: "first",
      },
      {
        src: path.join(
          root,
          "TWO STORY ADU/ADU II/2 Story ADU - Second Floor.svg",
        ),
        out: "two-story-adu-second-floor.svg",
        floor: "second",
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
  body = body.replace(/^OPT_CODE_/, "");
  body = decodeIllustratorId(body).replace(/^_/, "");
  const lower = body.toLowerCase();

  // BATH2SHW01 (Bath 1) / (Bath_2) → BATH2SHW01-bath-1
  if (/^BATH2SHW01/i.test(body)) {
    const bath = body.match(/\(Bath[_\s]*(\d+)\)/i);
    if (bath) return `BATH2SHW01-bath-${bath[1]}`;
    const bathAlt = body.match(/_BATH(\d+)/i);
    if (bathAlt) return `BATH2SHW01-BATH${bathAlt[1]}`;
    return "BATH2SHW01";
  }

  const exact = {
    ADDWALL001: "ADDWALL001",
    DOOREGD001: "DOOREGD001",
    LNRYWD0001: "LNRYWD0001",
    LNRYWD001: "LNRYWD001",
    BATH2SHW01: "BATH2SHW01",
  };

  const key = body.split("(")[0].replace(/_+$/, "");
  if (exact[key]) return exact[key];

  return body
    .replace(/[()]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Remove display="none" from Whiteout/Highlight/Geometry (parent feature stays hidden). */
function stripNestedDisplayNone(svg) {
  return svg.replace(
    /(<g\b[^>]*\b(?:data-name="(?:Whiteout|Highlight|Geometry|GEOMETRY)"|id="(?:Whiteout\d*|Highlight\d*|Geometry\d*|GEOMETRY)")[^>]*?)\s+display="none"/gi,
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

if (fs.existsSync(outRoot)) {
  fs.rmSync(outRoot, { recursive: true, force: true });
}
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
    const { patched, mappings } = patchSvg(raw, file.floor);
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
    console.log(
      `OK ${plan.name}/${file.out} — ${featureCount} features (${(buf.length / 1024 / 1024).toFixed(2)} MB)`,
    );
  }
}

fs.writeFileSync(path.join(outRoot, "patch-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outRoot, "upload-hashes.json"), JSON.stringify(hashes, null, 2));
console.log("Wrote patch-report.json + upload-hashes.json");
