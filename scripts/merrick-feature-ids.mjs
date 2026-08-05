import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/4810c4ad-2f12-4d8d-b276-f551c0e9311e.txt",
  "utf8",
);
const chunks = raw.split(/\n(?=\{"label":)/).filter(Boolean);
const merrickId = "69dc8c9bb0e2d0e638a5b9a3";

for (const chunk of chunks) {
  let obj;
  try {
    obj = JSON.parse(chunk.trim());
  } catch {
    continue;
  }
  if (obj.label !== "list-features") continue;
  const items = obj.result?.items || [];
  const linked = items.filter((it) =>
    (it.fieldData?.["house-plan-2"] || []).includes(merrickId),
  );
  for (const it of linked) {
    const f = it.fieldData;
    console.log(
      JSON.stringify({
        id: it.id,
        name: f.name,
        slug: f.slug,
        feature: f.feature,
        tab: f.tab,
        sort: f["sort-order"],
      }),
    );
  }
}
