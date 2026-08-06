import fs from "fs";
import path from "path";

const files = [
  "src/example-assets/home-icons/ADUS/STUDIO ADU/ADU/1 Story ADU - First Floor.svg",
  "src/example-assets/home-icons/ADUS/STUDIO ADU/ADU/Detached Garage - First Floor.svg",
  "src/example-assets/home-icons/ADUS/CARRIAGE ADU/ADU I/Carriage House ADU - First Floor.svg",
  "src/example-assets/home-icons/ADUS/CARRIAGE ADU/ADU I/Carriage House ADU - Second Floor.svg",
  "src/example-assets/home-icons/ADUS/TWO STORY ADU/ADU II/2 Story ADU - First Floor.svg",
  "src/example-assets/home-icons/ADUS/TWO STORY ADU/ADU II/2 Story ADU - Second Floor.svg",
];

for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  console.log("\n===", path.basename(f), "len", c.length, "===");
  const opts = [...c.matchAll(/id="(OPT_CODE_[^"]+)"/g)].map((m) => m[1]);
  console.log("OPT ids:", opts);
  for (const key of ["Whiteout", "Highlight", "Geometry", "data-attribute", "display=\"none\""]) {
    const n = (c.match(new RegExp(key.replace(/"/g, '\\"'), "g")) || []).length;
    if (n) console.log(" ", key, "count", n);
  }
  // Show nesting around first OPT
  if (opts[0]) {
    const idx = c.indexOf(`id="${opts[0]}"`);
    console.log("  snippet:", c.slice(Math.max(0, idx - 80), idx + 200).replace(/\s+/g, " "));
  }
}
