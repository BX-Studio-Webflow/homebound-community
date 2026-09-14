import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(__dirname, 'park-place-figma-exterior-upload-manifest.json');
const outputPath = path.join(__dirname, 'park-place-figma-exterior-webp-upload-manifest.json');
const sourceRoot = 'src/example-assets/Park Place/exteriors/';
const outputRoot = 'src/example-assets/Park Place/exteriors-webp-update-01/';
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

const items = source.items.map((item) => ({
  ...item,
  file: item.file
    .replace(sourceRoot, outputRoot)
    .replace(/\.(?:jpeg|jpg|png)$/i, '.webp'),
  format: 'webp',
}));

await fs.writeFile(
  outputPath,
  `${JSON.stringify({ ...source, optimized: true, quality: 80, items }, null, 2)}\n`,
);
console.log(`Wrote ${items.length} optimized Park Place exterior upload records.`);