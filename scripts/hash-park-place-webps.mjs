import crypto from "crypto";
import fs from "fs";
import path from "path";

const missing = JSON.parse(
  fs.readFileSync("scripts/park-place-missing-uploads.json", "utf8"),
).missing;

const items = missing.map((m) => {
  const webpPath = m.path
    .replace(
      "src/example-assets/Park Place Photos/",
      "src/example-assets/Park Place Photos-webp/",
    )
    .replace(/\.png$/i, ".webp");
  if (!fs.existsSync(webpPath)) throw new Error("missing webp " + webpPath);
  const buf = fs.readFileSync(webpPath);
  return {
    kind: m.kind,
    label: m.label,
    path: webpPath,
    fileName: path.basename(webpPath),
    parentFolder: m.parentFolder,
    hash: crypto.createHash("md5").update(buf).digest("hex"),
    size: buf.length,
  };
});

fs.writeFileSync(
  "scripts/park-place-webp-uploads.json",
  JSON.stringify({ count: items.length, items }, null, 2),
);
console.log("webp jobs", items.length, "interiors", items.filter((i) => i.kind === "interior").length);
