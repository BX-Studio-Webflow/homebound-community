import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/e4dcdc8e-597a-45de-83b5-258fc5b172be.txt",
  "utf8",
);
const items = JSON.parse(raw).result.items;

const ALT_REBUILD = "69403e59b32c58cb0bcc2a03";
const PAL_CITY = "68a5ba4ebffda3670051f249";
const H2 = "Explore Floor Plan";
const DESC_DEFAULT =
  "Personalize your home's layout and features to reflect the way you live.";
const DESC_SPECIAL =
  "Modify your homes layout and built in features to fit your lifestyle.";

const byRebuild = {};
for (const i of items) {
  const r = i.fieldData["rebuild-market"] || "none";
  byRebuild[r] = byRebuild[r] || [];
  byRebuild[r].push(i.fieldData.name);
}
for (const [r, names] of Object.entries(byRebuild)) {
  console.log(r, names.length, names.join(" | "));
}

const updates = items.map((i) => {
  const isAlt = i.fieldData["rebuild-market"] === ALT_REBUILD;
  const isPal = i.fieldData.city === PAL_CITY;
  return {
    id: i.id,
    name: i.fieldData.name,
    special: isAlt || isPal,
    fieldData: {
      "floor-plan-h2": H2,
      "floor-plan-descriptor": isAlt || isPal ? DESC_SPECIAL : DESC_DEFAULT,
    },
  };
});

console.log(
  "special",
  updates.filter((u) => u.special).map((u) => u.name).join(", "),
);
console.log("default count", updates.filter((u) => !u.special).length);

fs.writeFileSync(
  "scripts/floor-plan-copy-updates.json",
  JSON.stringify(updates, null, 2),
);
