import crypto from "crypto";
import fs from "fs";
import path from "path";

const ROOT = "src/example-assets/Park Place Photos";
const SITE = "601ca16f0bb27e965ee867a0";

const INT_FOLDERS = {
  "Interior - The Bandera|Modern Edge": "6a846190d41d96b564b7f892",
  "Interior - The Magnolia|Casual Organic": "6a8461922b968af4812483b7",
};

const EXT_FOLDERS = {
  "The Addison|Modern Cape Dutch": "6a84616ca02e7e7989ca7615",
  "The Addison|Transitional": "6a84616ca02e7e7989ca762a",
  "The Addison|Modern Tudor": "6a84616ced92ab6fcab952e6",
  "The Bandera|Modern Cape Dutch": "6a84616cd41d96b564b7ed9f",
  "The Bandera|Transitional": "6a84616d33b60021dd7b1150",
  "The Bandera|Modern Tudor": "6a84616df7364a39b1c7c1c0",
  "The Collin|Modern Cape Dutch": "6a84616dbcc266bd25e091ae",
  "The Collin|Transitional": "6a84616d33b60021dd7b11b3",
  "The Collin|Modern Tudor": "6a84616efd5d1935ad94d290",
  "The Grayson|Modern Cape Dutch": "6a84616e2b968af48124732c",
  "The Grayson|Transitional": "6a84616efd5d1935ad94d2e3",
  "The Grayson|Modern Tudor": "6a84616ebcc266bd25e0925b",
  "The Magnolia|Modern Cape Dutch": "6a84616e48395d31157dcc68",
  "The Magnolia|Transitional": "6a84616f7392cf5b463e4625",
  "The Magnolia|Modern Tudor": "6a84616f7392cf5b463e4663",
};

const MISSING_INTERIORS = [
  {
    rel: path.join(
      "Interiors - Park Place",
      "Interior - The Bandera",
      "Modern Edge",
      "Primary Bedroom.png",
    ),
    folder: INT_FOLDERS["Interior - The Bandera|Modern Edge"],
  },
  ...["Kitchen.png", "Great Room.png", "Primary Bedroom.png", "Primary Bathroom.png"].map(
    (name) => ({
      rel: path.join(
        "Interiors - Park Place",
        "Interior - The Magnolia",
        "Casual Organic",
        name,
      ),
      folder: INT_FOLDERS["Interior - The Magnolia|Casual Organic"],
    }),
  ),
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.png$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

const missing = [];

for (const item of MISSING_INTERIORS) {
  const abs = path.join(ROOT, item.rel);
  const buf = fs.readFileSync(abs);
  missing.push({
    kind: "interior",
    label: item.rel.replace(/[\\/]/g, "__").replace(/\.png$/i, ""),
    path: abs.replace(/\\/g, "/"),
    fileName: path.basename(item.rel),
    parentFolder: item.folder,
    hash: crypto.createHash("md5").update(buf).digest("hex"),
    size: buf.length,
  });
}

for (const abs of walk(path.join(ROOT, "Exterior Styles"))) {
  const rel = path.relative(path.join(ROOT, "Exterior Styles"), abs);
  const parts = rel.split(path.sep);
  const key = `${parts[0]}|${parts[1]}`;
  const folder = EXT_FOLDERS[key];
  if (!folder) throw new Error(`No folder for ${key}`);
  const buf = fs.readFileSync(abs);
  missing.push({
    kind: "exterior",
    label: rel.replace(/[\\/]/g, "__").replace(/\.png$/i, ""),
    path: abs.replace(/\\/g, "/"),
    fileName: path.basename(abs),
    parentFolder: folder,
    hash: crypto.createHash("md5").update(buf).digest("hex"),
    size: buf.length,
  });
}

const hashCounts = new Map();
for (const m of missing) {
  hashCounts.set(m.hash, (hashCounts.get(m.hash) || 0) + 1);
}
const colliding = missing.filter((m) => hashCounts.get(m.hash) > 1);

fs.writeFileSync(
  "scripts/park-place-missing-uploads.json",
  JSON.stringify({ siteId: SITE, missing, colliding }, null, 2),
);
console.log("missing", missing.length, "interior", missing.filter((m) => m.kind === "interior").length, "exterior", missing.filter((m) => m.kind === "exterior").length);
console.log("colliding hashes in missing set", colliding.length);
if (colliding.length) {
  for (const c of colliding) console.log(" ", c.hash, c.path);
}
