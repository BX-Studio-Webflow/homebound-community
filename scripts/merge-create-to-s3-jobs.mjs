import fs from "fs";

const mcpPath = process.argv[2];
const raw = fs.readFileSync(mcpPath, "utf8").trim();
let records;
try {
  const parsed = JSON.parse(raw);
  records = Array.isArray(parsed) ? parsed : [parsed];
} catch {
  const fixed = `[${raw.replace(/}\s*\{/g, "},{")}]`;
  records = JSON.parse(fixed);
}

const items = JSON.parse(
  fs.readFileSync("scripts/park-place-create-actions.json", "utf8"),
).items;

const jobs = [];
for (const rec of records) {
  const r = rec.result || rec;
  if (!r?.id || !r.uploadDetails) continue;
  const match = items.find(
    (i) => i.fileName === r.originalFileName && i.parentFolder === r.parentFolder,
  ) || items.find((i) => i.fileName === r.originalFileName);
  if (!match) {
    console.warn("no match", r.originalFileName, r.id);
    continue;
  }
  jobs.push({
    label: match.label,
    path: match.path,
    hostedUrl: r.hostedUrl,
    id: r.id,
    parentFolder: r.parentFolder,
    uploadUrl: r.uploadUrl,
    uploadDetails: r.uploadDetails,
  });
}
fs.writeFileSync("scripts/park-place-s3-jobs.json", JSON.stringify(jobs, null, 2));
console.log("jobs", jobs.length);
jobs.forEach((j) => console.log(j.id, j.parentFolder, j.label.split("__").pop()));
