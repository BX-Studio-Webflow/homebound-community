import fs from "fs";

const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).items;
const compact = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
if (items.length !== compact.length) {
  throw new Error(`count mismatch ${items.length} vs ${compact.length}`);
}
const site = "601ca16f0bb27e965ee867a0";
const rows = items.map((item, i) => {
  const c = compact[i];
  const key = `${site}/${c.id}_${item.fileName}`;
  const policy = JSON.parse(Buffer.from(c.policy, "base64").toString("utf8"));
  const keyCond = policy.conditions.find((x) => x && typeof x === "object" && x.key);
  if (!keyCond || keyCond.key !== key) {
    throw new Error(`policy key mismatch at ${i}: ${item.fileName}`);
  }
  return {
    fileName: item.fileName,
    id: c.id,
    parentFolder: item.parentFolder,
    hostedUrl: `https://cdn.prod.website-files.com/${site}/${c.id}_${item.fileName.replaceAll(" ", "%20")}`,
    xAmzDate: c.xAmzDate,
    key,
    policy: c.policy,
    xAmzSignature: c.xAmzSignature,
  };
});
fs.writeFileSync("scripts/park-place-s3-rows.json", JSON.stringify(rows, null, 2));
console.log("rows", rows.length, "policy keys ok");
