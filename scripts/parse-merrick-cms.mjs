import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/4810c4ad-2f12-4d8d-b276-f551c0e9311e.txt",
  "utf8",
);

// File has multiple JSON objects, one per line-ish; split by label boundaries
const chunks = raw.split(/\n(?=\{"label":)/).filter(Boolean);
const merrickId = "69dc8c9bb0e2d0e638a5b9a3";

for (const chunk of chunks) {
  let obj;
  try {
    obj = JSON.parse(chunk.trim());
  } catch {
    // try first line only
    obj = JSON.parse(chunk.split("\n")[0]);
  }
  if (obj.label === "list-features") {
    const items = obj.result?.items || [];
    const linked = items.filter((it) =>
      (it.fieldData?.["house-plan-2"] || []).includes(merrickId),
    );
    console.log(`\nCMS features linked to Merrick (${linked.length}):`);
    for (const it of linked.sort((a, b) => (a.fieldData["sort-order"] || 0) - (b.fieldData["sort-order"] || 0))) {
      const f = it.fieldData;
      console.log(
        `- [${f.tab || "?"}] sort=${f["sort-order"]} name="${f.name}" feature="${f.feature}" slug=${f.slug}`,
      );
      console.log(`    desc: ${(f.description || "").slice(0, 80)}`);
    }
  }
  if (obj.label === "get-merrick") {
    const f = obj.result.items[0].fieldData;
    console.log("\nMerrick house plan SVG maps:");
    console.log("  1st:", f["first-floor-svg-map"]);
    console.log("  2nd:", f["second-floor-svg-map"]);
    console.log("  has-multiple-floors:", f["has-multiple-floors"]);
  }
}
