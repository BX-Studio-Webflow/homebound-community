import fs from 'fs';

const extData = JSON.parse(fs.readFileSync('scripts/park-place-refreshed-exterior-urls-full.json', 'utf8'));
const extLines = ['export const PARK_PLACE_REFRESHED_EXTERIOR_URLS: Record<string, string> = {'];
for (const [k, v] of Object.entries(extData)) {
    extLines.push(`    '${k.replace(/'/g, "\\'")}': '${v.replace(/'/g, "\\'")}',`);
}
extLines.push('};');
extLines.push('');
fs.writeFileSync('src/utils/park-place-refreshed-exterior-urls.ts', extLines.join('\n'));
console.log('wrote exterior TS file with', Object.keys(extData).length, 'entries');

const intData = JSON.parse(fs.readFileSync('scripts/park-place-refreshed-interior-urls.json', 'utf8'));
const intLines = ['export const PARK_PLACE_REFRESHED_INTERIOR_URLS: Record<string, string> = {'];
for (const [k, v] of Object.entries(intData)) {
    intLines.push(`    '${k.replace(/'/g, "\\'")}': '${v.replace(/'/g, "\\'")}',`);
}
intLines.push('};');
intLines.push('');
fs.writeFileSync('src/utils/park-place-refreshed-interior-urls.ts', intLines.join('\n'));
console.log('wrote interior TS file with', Object.keys(intData).length, 'entries');
