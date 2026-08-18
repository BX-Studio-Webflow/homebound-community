import fs from "fs";

const all = JSON.parse(fs.readFileSync("scripts/park-place-webp-uploads.json", "utf8")).items;
const kind = process.argv[2]; // interior | exterior-planName | all
let items;
if (!kind || kind === "all") {
  items = all;
} else if (kind === "interior") {
  items = all.filter((m) => m.kind === "interior");
} else {
  items = all.filter((m) => m.kind === "exterior" && m.path.includes(`/${kind}/`));
}

if (!items.length) {
  console.error("no items for", kind);
  process.exit(1);
}

const siteId = "601ca16f0bb27e965ee867a0";
const actions = items.map((m, i) => ({
  label: `${kind}-${i}`,
  create_asset: {
    site_id: siteId,
    file_name: m.fileName,
    file_hash: m.hash,
    parent_folder: m.parentFolder,
  },
}));
const payload = { actions, items };
fs.writeFileSync("scripts/park-place-create-actions.json", JSON.stringify(payload, null, 2));
console.log("wrote", actions.length, "webp create actions for", kind);
items.forEach((i, n) => console.log(n, i.hash, i.parentFolder, i.fileName));

