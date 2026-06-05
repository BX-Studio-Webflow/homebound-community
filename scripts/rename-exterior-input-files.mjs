import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputRoot = path.join(__dirname, '..', 'src', 'example-assets', 'input');
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'exterior-asset-structure.config.json'), 'utf8')
);

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const aliasToScheme = {
  abeyiron: { name: 'Abbey Iron', number: 2 },
  abbeyiorn: { name: 'Abbey Iron', number: 2 },
  chateeustone: { name: 'Chateau Stone', number: 5 },
  chateustone: { name: 'Chateau Stone', number: 5 },
  sienastorn: { name: 'Sienna Stone', number: 4 },
  stoneharbour: { name: 'Stone Harbor', number: 2 },
  saltwood: { name: 'Saltwood', number: 1 },
  slatwood: { name: 'Saltwood', number: 1 },
  ivorymeadow: { name: 'Ivory Meadow', number: 1 },
  brownzemeadow: { name: 'Bronze Meadow', number: 3 },
  oakstone: { name: 'Oakstone', number: 3 },
  ivoryorynx: { name: 'Ivory & Onyx', number: 4 },
  manowbrick: { name: 'Manor Brick', number: 4 },
  searbreeze: { name: 'Seabreeze', number: 3 },
  seabreeze: { name: 'Seabreeze', number: 3 },
};

function detectScheme(fileBaseName, schemes) {
  const normalizedFile = normalize(fileBaseName);

  const schPrefixMatch = fileBaseName.match(/^sch\s*(\d+)\s*-\s*(.+)$/i);
  if (schPrefixMatch) {
    const number = Number(schPrefixMatch[1]);
    const byNumber = schemes.find((scheme) => scheme.number === number);
    if (byNumber) return byNumber;
  }

  for (const scheme of schemes) {
    if (normalizedFile.includes(normalize(scheme.name))) {
      return scheme;
    }
    if (normalizedFile.includes(normalize(scheme.fileToken))) {
      return scheme;
    }
  }

  for (const [alias, scheme] of Object.entries(aliasToScheme)) {
    if (normalizedFile.includes(alias)) {
      const fromConfig = schemes.find((item) => item.name === scheme.name);
      return fromConfig ?? scheme;
    }
  }

  const schemeNumberMatch = fileBaseName.match(/scheme\s*(\d+)/i);
  if (schemeNumberMatch) {
    const number = Number(schemeNumberMatch[1]);
    const byNumber = schemes.find((scheme) => scheme.number === number);
    if (byNumber) return byNumber;
  }

  const leadingNumberMatch = fileBaseName.match(/^\s*(\d+)\s*[-.]/);
  if (leadingNumberMatch) {
    const number = Number(leadingNumberMatch[1]);
    const byNumber = schemes.find((scheme) => scheme.number === number);
    if (byNumber) return byNumber;
  }

  return null;
}

function targetName(scheme, ext) {
  const number = scheme.number ?? 1;
  return `Sch ${number} - ${scheme.name}${ext}`;
}

const renames = [];
const skipped = [];

for (const plan of config.plans) {
  const planDir = path.join(inputRoot, plan.folder);
  if (!fs.existsSync(planDir)) continue;

  for (const style of config.styles) {
    const styleDir = path.join(planDir, style.folder);
    if (!fs.existsSync(styleDir)) continue;

    for (const entry of fs.readdirSync(styleDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (entry.name === 'UPLOAD_HERE.txt') continue;

      const oldPath = path.join(styleDir, entry.name);
      const ext = path.extname(entry.name);
      const base = path.basename(entry.name, ext);
      const scheme = detectScheme(base, style.schemes);

      if (!scheme) {
        skipped.push({ file: oldPath, reason: 'no scheme match' });
        continue;
      }

      const newName = targetName(scheme, ext);
      const newPath = path.join(styleDir, newName);

      if (entry.name === newName) continue;

      renames.push({ from: oldPath, to: newPath, newName, temp: `${oldPath}.renaming` });
    }
  }
}

for (const { from, temp } of renames) {
  fs.renameSync(from, temp);
}

for (const { temp, to, newName, from } of renames) {
  if (fs.existsSync(to)) {
    skipped.push({ file: from, reason: `target exists: ${newName}` });
    fs.renameSync(temp, from);
    continue;
  }
  fs.renameSync(temp, to);
  console.log(`✓ ${path.relative(inputRoot, from)} → ${newName}`);
}

if (skipped.length) {
  console.log('\nSkipped:');
  for (const item of skipped) {
    console.log(`- ${path.relative(inputRoot, item.file)} (${item.reason})`);
  }
}

console.log(`\nRenamed ${renames.length} file(s).`);
