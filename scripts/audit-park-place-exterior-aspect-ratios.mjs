import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const entries = JSON.parse(
  await fs.readFile(path.join(root, 'scripts/park-place-exterior-asset-ids.json'), 'utf8')
);

const tmpDir = path.join(os.tmpdir(), 'pp-aspect-audit');
await fs.mkdir(tmpDir, { recursive: true });

const results = [];
for (const entry of entries) {
  const res = await fetch(entry.url);
  if (!res.ok) {
    results.push({ ...entry, error: `HTTP ${res.status}` });
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const tmpFile = path.join(tmpDir, `${entry.assetId}.webp`);
  await fs.writeFile(tmpFile, buf);
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', tmpFile],
      { encoding: 'utf8' }
    ).trim();
    const [width, height] = out.split(',').map(Number);
    results.push({ ...entry, size: buf.length, width, height, aspect: +(width / height).toFixed(4) });
  } catch (err) {
    results.push({ ...entry, size: buf.length, error: String(err) });
  }
}

const aspectCounts = new Map();
for (const r of results) {
  if (!r.aspect) continue;
  const bucket = r.aspect.toFixed(2);
  aspectCounts.set(bucket, (aspectCounts.get(bucket) || 0) + 1);
}

console.log('Aspect ratio distribution:', Object.fromEntries(aspectCounts));
console.log();
for (const r of results) {
  console.log(`${r.key}: ${r.width}x${r.height} (aspect ${r.aspect}), ${r.size} bytes`);
}

await fs.writeFile(
  path.join(root, 'scripts/park-place-exterior-aspect-audit.json'),
  JSON.stringify({ aspectCounts: Object.fromEntries(aspectCounts), results }, null, 2)
);
