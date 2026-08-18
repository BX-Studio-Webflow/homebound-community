import fs from "fs";

const rows = JSON.parse(fs.readFileSync("scripts/park-place-s3-rows.json", "utf8"));
const updates = JSON.parse(fs.readFileSync("scripts/park-place-sig-updates.json", "utf8"));
const byId = new Map(updates.map((u) => [u.id, u]));
for (const row of rows) {
  const u = byId.get(row.id);
  if (!u) throw new Error("missing update " + row.id);
  row.xAmzDate = u.xAmzDate;
  row.policy = u.policy;
  row.xAmzSignature = u.xAmzSignature;
}
fs.writeFileSync("scripts/park-place-s3-rows.json", JSON.stringify(rows));
console.log("patched", rows.length);
