import fs from "fs";
import path from "path";

const root =
  "src/example-assets/home-icons/Palisade SVGs/Palisade - Updated Plans";

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.toLowerCase().endsWith(".svg")) out.push(p);
  }
  return out;
}

function decodeId(id) {
  return id
    .replace(/__x28_/g, "(")
    .replace(/_x29_/g, ")")
    .replace(/_x5F_/g, "_")
    .replace(/__/g, " ");
}

for (const f of walk(root).sort()) {
  const c = fs.readFileSync(f, "utf8");
  const features = [...c.matchAll(/data-attribute="feature"/g)].length;
  const optCodes = [...c.matchAll(/id="(OPT_CODE_[^"]+)"/g)].map((m) => decodeId(m[1]));
  const highlightIds = [...c.matchAll(/id="(highlight-[^"]+)"/g)].map((m) => m[1]);
  const featureIds = [
    ...c.matchAll(/<g id="([^"]+)"[^>]*data-attribute="feature"/g),
  ].map((m) => m[1]);
  const nestedDisplay = [...c.matchAll(/data-attribute="feature"[^>]*>[\s\S]{0,200}?display="none"/g)];
  // Count nested display=none inside feature groups more carefully later
  console.log("\n===", path.relative(root, f), "===");
  console.log("  data-attribute=feature:", features);
  console.log("  feature ids:", featureIds.length ? featureIds.join(", ") : "(none)");
  console.log("  OPT_CODE:", optCodes.length ? optCodes.join(" | ") : "(none)");
  console.log("  highlight-*:", highlightIds.length ? highlightIds.join(", ") : "(none)");
}
