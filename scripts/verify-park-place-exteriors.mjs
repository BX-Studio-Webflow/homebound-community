import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const manifest = JSON.parse(
  await fs.readFile(path.join(root, 'scripts/park-place-figma-exterior-webp-upload-manifest.json'), 'utf8')
);

// Parse PARK_PLACE_REFRESHED_EXTERIOR_URLS straight out of the TS source (avoids a build step).
const ts = await fs.readFile(
  path.join(root, 'src/utils/park-place-refreshed-exterior-urls.ts'),
  'utf8'
);
const urlByKey = new Map();
const entryRe = /'([^']+)':\s*\n?\s*'([^']+)'/g;
let m;
while ((m = entryRe.exec(ts))) {
  urlByKey.set(m[1], m[2]);
}

const planSlugByName = {
  'The Addison': 'addison',
  'The Bandera': 'bandera',
  'The Collin': 'collin',
  'The Grayson': 'grayson',
  'The Magnolia': 'magnolia',
};

const results = [];
for (const item of manifest.items) {
  const planSlug = planSlugByName[item.plan];
  const key = `${planSlug}.${item.styleKey}|${item.schemeNumber}|${item.schemeName}`;
  const hostedUrl = urlByKey.get(key);
  const localPath = path.join(root, item.file);

  const row = { key, plan: item.plan, style: item.style, schemeNumber: item.schemeNumber, schemeName: item.schemeName };

  if (!hostedUrl) {
    results.push({ ...row, status: 'MISSING_URL_KEY' });
    continue;
  }

  let localBuf;
  try {
    localBuf = await fs.readFile(localPath);
  } catch {
    results.push({ ...row, status: 'MISSING_LOCAL_FILE', hostedUrl });
    continue;
  }
  const localHash = crypto.createHash('md5').update(localBuf).digest('hex');

  let remoteBuf;
  try {
    const res = await fetch(hostedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remoteBuf = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    results.push({ ...row, status: 'FETCH_ERROR', hostedUrl, error: String(err) });
    continue;
  }
  const remoteHash = crypto.createHash('md5').update(remoteBuf).digest('hex');

  // Sanity check: the hosted filename should reference the same style + scheme number + color name as the key.
  const decodedUrl = decodeURIComponent(hostedUrl);
  const nameMatches =
    decodedUrl.includes(item.style) &&
    decodedUrl.includes(`Color Scheme ${item.schemeNumber} `) &&
    decodedUrl.includes(item.schemeName);

  results.push({
    ...row,
    status: localHash === remoteHash ? (nameMatches ? 'OK' : 'HASH_OK_NAME_MISMATCH') : 'HASH_MISMATCH',
    hostedUrl,
    localHash,
    remoteHash,
    localSize: localBuf.length,
    remoteSize: remoteBuf.length,
  });
}

const summary = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1;
  return acc;
}, {});

console.log('Total entries:', results.length);
console.log('Summary:', summary);
console.log();
for (const r of results) {
  if (r.status !== 'OK') {
    console.log(JSON.stringify(r, null, 2));
  }
}

await fs.writeFile(
  path.join(root, 'scripts/park-place-exteriors-verification-report.json'),
  JSON.stringify({ summary, results }, null, 2)
);
