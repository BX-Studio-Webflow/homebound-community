import fs from "fs";

const common = {
  acl: "public-read",
  bucket: "webflow-prod-assets",
  xAmzAlgorithm: "AWS4-HMAC-SHA256",
  xAmzCredential: "AKIAQLLHWD6MEJGETLST/20260818/us-east-1/s3/aws4_request",
  successActionStatus: "201",
  contentType: "image/webp",
  cacheControl: "max-age=31536000",
};

const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const itemsFile = process.argv[3] || "scripts/park-place-create-actions.json";
const items = JSON.parse(fs.readFileSync(itemsFile, "utf8")).items;
const jobs = rows.map((row) => {
  const match = items.find(
    (i) => i.fileName === row.fileName && i.parentFolder === row.parentFolder,
  );
  if (!match) throw new Error("no match " + row.fileName + " " + row.parentFolder);
  return {
    label: match.label,
    path: match.path,
    hostedUrl: row.hostedUrl,
    id: row.id,
    parentFolder: row.parentFolder,
    uploadUrl: "https://webflow-prod-assets.s3.amazonaws.com/",
    uploadDetails: {
      ...common,
      xAmzDate: row.xAmzDate,
      key: row.key,
      policy: row.policy,
      xAmzSignature: row.xAmzSignature,
    },
  };
});
fs.writeFileSync("scripts/park-place-s3-jobs.json", JSON.stringify(jobs, null, 2));
console.log("jobs", jobs.length);
