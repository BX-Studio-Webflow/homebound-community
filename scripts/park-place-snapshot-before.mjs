import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-projects-homebound-community/agent-tools/4f0f7a63-1e38-4fbb-98f1-2a4059ae49de.txt",
  "utf8",
);
const interiors = JSON.parse(
  raw.split(/\r?\n/).find((l) => l.includes('"label":"interiors"')),
);
const snap = {};
for (const a of interiors.result.assets) {
  if (!snap[a.folderId]) snap[a.folderId] = [];
  snap[a.folderId].push({ id: a.id, name: a.displayName, url: a.hostedUrl });
}
fs.writeFileSync(
  "scripts/park-place-interior-before.json",
  JSON.stringify({ count: interiors.result.assets.length, byFolder: snap }, null, 2),
);
console.log("before interiors", interiors.result.assets.length, "folders", Object.keys(snap).length);
