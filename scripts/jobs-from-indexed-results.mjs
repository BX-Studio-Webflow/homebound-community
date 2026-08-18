import fs from "fs";

const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).items;
const results = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
if (items.length !== results.length) {
  throw new Error(`count mismatch items=${items.length} results=${results.length}`);
}
const jobs = items.map((item, i) => {
  const r = results[i];
  if (r.parentFolder && r.parentFolder !== item.parentFolder) {
    throw new Error(`folder mismatch at ${i}: ${item.fileName}`);
  }
  if (r.originalFileName && r.originalFileName !== item.fileName) {
    throw new Error(`name mismatch at ${i}: ${item.fileName} vs ${r.originalFileName}`);
  }
  return {
    label: item.label,
    path: item.path,
    hostedUrl: r.hostedUrl,
    id: r.id,
    parentFolder: item.parentFolder,
    uploadUrl: r.uploadUrl || "https://webflow-prod-assets.s3.amazonaws.com/",
    uploadDetails: r.uploadDetails,
  };
});
fs.writeFileSync("scripts/park-place-s3-jobs.json", JSON.stringify(jobs, null, 2));
console.log("jobs", jobs.length);
jobs.forEach((j) => {
  const okPlan = j.path.includes(process.argv[4] || "");
  const okExt = j.path.endsWith(".webp");
  console.log(j.id, okPlan, okExt, j.path.split(/[/\\]/).slice(-3).join("/"));
});
