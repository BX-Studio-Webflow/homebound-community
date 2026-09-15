import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const confirmed = JSON.parse(
    await fs.readFile(path.join(root, 'scripts/park-place-exterior-reexport-confirmed-uploads.json'), 'utf8')
);

// Rebuild the PARK_PLACE_REFRESHED_EXTERIOR_URLS-style key -> hosted URL for each newly uploaded asset.
const planSlugByTitle = { Addison: 'addison', Bandera: 'bandera', Collin: 'collin', Grayson: 'grayson', Magnolia: 'magnolia' };
const newUrlByKey = new Map();
for (const entry of confirmed) {
    const encodedName = encodeURIComponent(entry.s3Key.split('__update_01_')[1]).replace(/%2C/g, ',');
    const url = `https://s3.amazonaws.com/webflow-prod-assets/601ca16f0bb27e965ee867a0/${entry.assetId}__update_01_${encodedName}`;
    newUrlByKey.set(entry.key, url);
}

async function patchTs(filePath) {
    let ts = await fs.readFile(filePath, 'utf8');
    let count = 0;
    for (const [key, url] of newUrlByKey) {
        const escapedKey = key.replace(/'/g, "\\'");
        const re = new RegExp(`('${escapedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\n?\\s*)'[^']+'`);
        const before = ts;
        ts = ts.replace(re, `$1'${url}'`);
        if (ts !== before) count++;
    }
    await fs.writeFile(filePath, ts);
    console.log(`${path.relative(root, filePath)}: patched ${count}/${newUrlByKey.size} keys`);
}

async function patchJson(filePath) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    let count = 0;
    for (const [key, url] of newUrlByKey) {
        if (key in data) {
            data[key] = url;
            count++;
        }
    }
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`${path.relative(root, filePath)}: patched ${count}/${newUrlByKey.size} keys`);
}

await patchTs(path.join(root, 'src/utils/park-place-refreshed-exterior-urls.ts'));
await patchJson(path.join(root, 'scripts/park-place-refreshed-exterior-urls-full.json'));
