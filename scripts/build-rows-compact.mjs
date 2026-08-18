import fs from "fs";

const site = "601ca16f0bb27e965ee867a0";
const compact = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const rows = compact.map((r) => ({
  fileName: r.fileName,
  id: r.id,
  parentFolder: r.parentFolder,
  hostedUrl: `https://cdn.prod.website-files.com/${site}/${r.id}_${r.fileName.replaceAll(" ", "%20")}`,
  xAmzDate: r.xAmzDate,
  key: `${site}/${r.id}_${r.fileName}`,
  policy: r.policy,
  xAmzSignature: r.xAmzSignature,
}));
fs.writeFileSync("scripts/park-place-s3-rows.json", JSON.stringify(rows, null, 2));
console.log("rows", rows.length);
