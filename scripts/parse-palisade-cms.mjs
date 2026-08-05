import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/6eba649c-9e25-4b12-a543-1dd29f9da8b9.txt",
  "utf8",
);

// Split NDJSON-ish multi objects
const parts = [];
let depth = 0;
let start = -1;
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  if (ch === "{") {
    if (depth === 0) start = i;
    depth++;
  } else if (ch === "}") {
    depth--;
    if (depth === 0 && start >= 0) {
      parts.push(raw.slice(start, i + 1));
      start = -1;
    }
  }
}

const palisadeNames = [
  "Ambrose",
  "Alder",
  "Vista",
  "Willow",
  "Glenview",
  "Elm",
  "Palisade",
];

for (const part of parts) {
  let obj;
  try {
    obj = JSON.parse(part);
  } catch {
    continue;
  }
  const items = obj.result?.items || [];
  if (!items.length) continue;

  if (obj.label === "list-plans") {
    console.log("\n=== HOUSE PLANS (Palisade-ish) ===");
    for (const it of items) {
      const n = it.fieldData?.name || "";
      if (!palisadeNames.some((p) => n.includes(p))) continue;
      const f = it.fieldData;
      console.log(
        JSON.stringify({
          id: it.id,
          name: f.name,
          slug: f.slug,
          multi: f["has-multiple-floors"],
          first: f["first-floor-svg-map"]
            ? String(f["first-floor-svg-map"]).slice(0, 90)
            : null,
          second: f["second-floor-svg-map"]
            ? String(f["second-floor-svg-map"]).slice(0, 90)
            : null,
          city: f.city,
          rebuild: f["rebuild-market"],
        }),
      );
    }
  }

  if (obj.label === "list-features") {
    // Need plan ids first — second pass after collecting
    globalThis.__allFeatures = items;
  }
}

const planPart = parts.find((p) => {
  try {
    return JSON.parse(p).label === "list-plans";
  } catch {
    return false;
  }
});
const plans = JSON.parse(planPart).result.items.filter((it) =>
  palisadeNames.some((p) => (it.fieldData?.name || "").includes(p)),
);
const planIds = new Set(plans.map((p) => p.id));
const planById = Object.fromEntries(plans.map((p) => [p.id, p.fieldData.name]));

const feats = globalThis.__allFeatures || [];
const linked = feats.filter((it) =>
  (it.fieldData?.["house-plan-2"] || []).some((id) => planIds.has(id)),
);

console.log(`\n=== FLOOR PLAN FEATURES linked to Palisade plans (${linked.length}) ===`);
const firstTab = "b9b3ff6995dad6233446a190085a3d1a";
const secondTab = "9abe51351fba65d0cbbd595e60bfc221";

for (const plan of plans.sort((a, b) => a.fieldData.name.localeCompare(b.fieldData.name))) {
  const items = linked
    .filter((it) => (it.fieldData["house-plan-2"] || []).includes(plan.id))
    .sort((a, b) => {
      const ta = a.fieldData.tab === firstTab ? 0 : 1;
      const tb = b.fieldData.tab === firstTab ? 0 : 1;
      if (ta !== tb) return ta - tb;
      return (a.fieldData["sort-order"] || 0) - (b.fieldData["sort-order"] || 0);
    });
  console.log(`\n--- ${plan.fieldData.name} (${items.length}) ---`);
  for (const it of items) {
    const f = it.fieldData;
    const tab = f.tab === firstTab ? "1st" : f.tab === secondTab ? "2nd" : "?";
    console.log(
      `  [${tab} #${f["sort-order"]}] ${f.feature} | ${f.name} | ${it.id}`,
    );
  }
}
