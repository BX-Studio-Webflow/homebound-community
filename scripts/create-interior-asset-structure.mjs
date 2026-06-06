import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'interior-asset-structure.config.json'), 'utf8')
);

const interiorRoot = path.join(repoRoot, 'src', 'example-assets', 'Palisade Interiors');
const roomFilenames = config.localFilenames;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildManifestLines(plan, pkg) {
  return [
    `Plan: ${plan.folder}`,
    `Package: ${pkg}`,
    `Code keys: housePlanImageUrlsBySlug.${plan.slug} / pos mapped to package swatch`,
    '',
    `Expected files:`,
    ...roomFilenames.map((name) => `  - ${name}`),
    '',
    'Webflow path: Interiors - Palisade / Interior - ' + plan.folder + ' / ' + pkg,
  ];
}

for (const plan of config.plans) {
  for (const pkg of plan.packages) {
    const pkgDir = path.join(interiorRoot, plan.folder, pkg);
    ensureDir(pkgDir);
    fs.writeFileSync(
      path.join(pkgDir, 'UPLOAD_HERE.txt'),
      `${buildManifestLines(plan, pkg).join('\n')}\n`,
      'utf8'
    );
  }
}

console.log(
  `Created interior folders for ${config.plans.length} plans under ${interiorRoot}`
);
