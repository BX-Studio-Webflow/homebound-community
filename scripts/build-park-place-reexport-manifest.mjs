import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const aspectAudit = JSON.parse(
    await fs.readFile(path.join(root, 'scripts/park-place-exterior-aspect-audit.json'), 'utf8')
);

// First "Image" node id (scheme 1, capeDutch) per plan's "Available Exteriors - All Scheme Assets" section.
const BASE_IMAGE_NODE = {
    addison: 6437,
    bandera: 7957,
    collin: 9263,
    grayson: 10517,
    magnolia: 11810,
};
// Node ids share a common Figma page/file prefix "87:".
const NODE_PAGE = 87;

const STYLE_INDEX = { capeDutch: 0, transitional: 1, tudor: 2 };

function nodeIdFor(planSlug, styleKey, schemeNumber) {
    const base = BASE_IMAGE_NODE[planSlug];
    const r = schemeNumber - 1;
    const t = STYLE_INDEX[styleKey];
    return `${NODE_PAGE}:${base + r * 31 + t * 10}`;
}

const lowRes = aspectAudit.results.filter((r) => r.width === 512);
console.log('Low-res entries:', lowRes.length);

const manifest = lowRes.map((r) => {
    const [planStyle, schemeNumberStr, schemeName] = r.key.split('|');
    const [planSlug, styleKey] = planStyle.split('.');
    const schemeNumber = Number(schemeNumberStr);
    return {
        key: r.key,
        planSlug,
        styleKey,
        schemeNumber,
        schemeName,
        currentUrl: r.url,
        nodeId: nodeIdFor(planSlug, styleKey, schemeNumber),
    };
});

for (const m of manifest) console.log(m.key, '->', m.nodeId);

await fs.writeFile(
    path.join(root, 'scripts/park-place-exterior-reexport-manifest.json'),
    JSON.stringify(manifest, null, 2)
);
