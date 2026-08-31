import fs from "fs";

const files = [
  "src/example-assets/Altadena/floor-plans/updated/Plan 4 - The Merrick/merrick-first-floor.svg",
  "src/example-assets/Altadena/floor-plans/updated/Plan 4 - The Merrick/merrick-second-floor.svg",
];

for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  const feats = [...c.matchAll(/<g id="([^"]+)"[^>]*data-attribute="feature"/g)].map((m) => m[1]);
  console.log(`\n=== ${f.split("/").pop()} ===`);
  for (const id of feats) console.log(id);
}
