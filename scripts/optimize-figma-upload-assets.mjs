import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const converter = 'C:\\Users\\user\\projects\\libwebp-1.6.0-windows-x64\\bin\\cwebp.exe';
const manifestPath = path.resolve(root, process.argv[2]);
if (!process.argv[2]) throw new Error('Usage: node scripts/optimize-figma-upload-assets.mjs <manifest>');

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const items = manifest.items.map((item) => {
    const sourceFile = item.file;
    const file = item.file.replace(
        /\/((?:interiors|exteriors))\//,
        '/$1-webp-update-01/',
    ).replace(/\.(?:jpeg|jpg|png)$/i, '.webp');
    return { ...item, file, sourceFile, format: 'webp' };
});

for (const item of items) {
    const source = path.resolve(root, item.sourceFile);
    const destination = path.resolve(root, item.file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await execFileAsync(converter, ['-q', '80', source, '-o', destination]);
}

const outputItems = items.map(({ sourceFile, ...item }) => item);
const outputPath = path.join(
    path.dirname(manifestPath),
    path.basename(manifestPath, '.json').replace(/-upload-manifest$/, '-webp-upload-manifest') + '.json',
);
await fs.writeFile(outputPath, `${JSON.stringify({ ...manifest, optimized: true, quality: 80, items: outputItems }, null, 2)}\n`);
console.log(`Optimized ${items.length} files: ${path.relative(root, outputPath)}`);