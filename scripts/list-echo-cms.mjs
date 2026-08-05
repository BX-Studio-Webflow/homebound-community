import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/4810c4ad-2f12-4d8d-b276-f551c0e9311e.txt",
  "utf8",
);
const chunks = raw.split(/\n(?=\{"label":)/).filter(Boolean);
const echoId = "69dc8c9bb0e2d0e638a5b9a1";
const firstTab = "b9b3ff6995dad6233446a190085a3d1a";
const secondTab = "9abe51351fba65d0cbbd595e60bfc221";

for (const chunk of chunks) {
  let obj;
  try {
    obj = JSON.parse(chunk.trim());
  } catch {
    continue;
  }
  if (obj.label !== "list-features") continue;
  const items = (obj.result?.items || []).filter((it) =>
    (it.fieldData?.["house-plan-2"] || []).includes(echoId),
  );
  const byTab = (tab) =>
    items
      .filter((it) => it.fieldData.tab === tab)
      .sort((a, b) => (a.fieldData["sort-order"] || 0) - (b.fieldData["sort-order"] || 0));

  console.log("\n=== Echo CMS first-tab ===");
  for (const it of byTab(firstTab)) {
    const f = it.fieldData;
    console.log(`${f["sort-order"]}\t${f.feature}\t${f.name}\t${it.id}`);
  }
  console.log("\n=== Echo CMS second-tab ===");
  for (const it of byTab(secondTab)) {
    const f = it.fieldData;
    console.log(`${f["sort-order"]}\t${f.feature}\t${f.name}\t${it.id}`);
  }
  console.log("\n=== All Echo (unsorted dump) ===");
  for (const it of items) {
    const f = it.fieldData;
    console.log(
      JSON.stringify({
        id: it.id,
        name: f.name,
        feature: f.feature,
        tab: f.tab === firstTab ? "first" : f.tab === secondTab ? "second" : f.tab,
        sort: f["sort-order"],
        slug: f.slug,
      }),
    );
  }
}
