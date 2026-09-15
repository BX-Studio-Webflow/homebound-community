import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const ts = await fs.readFile(
    path.join(root, 'src/utils/park-place-refreshed-exterior-urls.ts'),
    'utf8'
);
const entries = [];
const entryRe = /'([^']+)':\s*\n?\s*'([^']+)'/g;
let m;
while ((m = entryRe.exec(ts))) {
    const [key, url] = [m[1], m[2]];
    const assetId = decodeURIComponent(url).split('/').pop().split(/__update_\d+_/)[0];
    entries.push({ key, url, assetId });
}
console.log(JSON.stringify(entries, null, 2));
await fs.writeFile(
    path.join(root, 'scripts/park-place-exterior-asset-ids.json'),
    JSON.stringify(entries, null, 2)
);
