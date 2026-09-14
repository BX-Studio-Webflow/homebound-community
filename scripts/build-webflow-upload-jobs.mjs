import fs from 'node:fs';
import path from 'node:path';

const manifestPath = process.argv[2];
const responsePath = process.argv[3];
const outputPath = process.argv[4] || 'scripts/webflow-upload-jobs.json';
if (!manifestPath || !responsePath) {
    throw new Error('Usage: node scripts/build-webflow-upload-jobs.mjs <manifest> <data-tool-response> [output]');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const response = JSON.parse(fs.readFileSync(responsePath, 'utf8'));
const results = response.results || response;
if (manifest.items.length !== results.length) {
    throw new Error(`count mismatch items=${manifest.items.length} results=${results.length}`);
}

const jobs = manifest.items.map((item, index) => {
    const result = results[index].result || results[index];
    if (result.parentFolder && result.parentFolder !== item.parentFolder) {
        throw new Error(`folder mismatch at ${index}: ${item.file}`);
    }
    if (result.originalFileName && result.originalFileName !== path.basename(item.file)) {
        throw new Error(`name mismatch at ${index}: ${item.file} vs ${result.originalFileName}`);
    }
    if (!result.uploadDetails || !result.uploadUrl) {
        throw new Error(`missing upload details at ${index}: ${item.file}`);
    }
    return {
        label: `${item.plan}__${item.style || item.packageName}__${path.basename(item.file)}`,
        path: item.file,
        hostedUrl: result.hostedUrl,
        id: result.id,
        parentFolder: result.parentFolder,
        uploadUrl: result.uploadUrl,
        uploadDetails: result.uploadDetails,
    };
});

fs.writeFileSync(outputPath, `${JSON.stringify(jobs, null, 2)}\n`);
console.log(`Wrote ${jobs.length} Webflow upload jobs to ${outputPath}`);