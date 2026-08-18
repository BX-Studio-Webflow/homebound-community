import fs from "fs";
import path from "path";

const missing = JSON.parse(
  fs.readFileSync("scripts/park-place-missing-uploads.json", "utf8"),
).missing;
const exteriors = missing.filter((m) => m.kind === "exterior");
const byPlan = {};
for (const m of exteriors) {
  const plan = m.path.split("/")[4];
  if (!byPlan[plan]) byPlan[plan] = [];
  byPlan[plan].push({
    label: m.label.slice(0, 40),
    fileName: m.fileName,
    hash: m.hash,
    parentFolder: m.parentFolder,
    path: m.path,
  });
}
for (const [plan, items] of Object.entries(byPlan)) {
  console.log("\nPLAN", plan, items.length);
  items.forEach((i, idx) => {
    console.log(`${idx} ${i.hash} ${i.parentFolder} ${i.fileName}`);
  });
}
fs.writeFileSync("scripts/park-place-exterior-batches.json", JSON.stringify(byPlan, null, 2));
