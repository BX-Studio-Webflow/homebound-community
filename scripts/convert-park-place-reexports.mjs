import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cwebp = 'C:\\Users\\user\\projects\\libwebp-1.6.0-windows-x64\\bin\\cwebp.exe';

const manifest = JSON.parse(
    await fs.readFile(path.join(root, 'scripts/park-place-exterior-reexport-manifest.json'), 'utf8')
);

// nodeId (numeric part) -> path to the chosen master JPEG on disk.
const MASTER_FILE_BY_NODE = {
    6437: path.join(os.tmpdir(), 'pp-figma-test', 'raw1.jpeg'),
    6540: path.join(os.tmpdir(), 'pp-reexport-batch1', '6540-a.jpg'),
    6478: path.join(os.tmpdir(), 'pp-reexport-batch1', '6478-a.jpg'),
    6519: path.join(os.tmpdir(), 'pp-reexport-batch1', '6519-a.jpg'),
    6457: path.join(os.tmpdir(), 'pp-reexport-batch1', '6457-a.jpg'),
    6550: path.join(os.tmpdir(), 'pp-reexport-batch1', '6550-a.jpg'),
    6499: path.join(os.tmpdir(), 'pp-reexport-batch1', '6499-a.jpg'),
    8091: path.join(os.tmpdir(), 'pp-reexport-batch1', '8091-a.jpg'),
    7998: path.join(os.tmpdir(), 'pp-reexport-batch1', '7998-a.jpg'),
    8060: path.join(os.tmpdir(), 'pp-reexport-batch1', '8060-a.jpg'),
    8101: path.join(os.tmpdir(), 'pp-reexport-batch1', '8101-a.jpg'),
    8039: path.join(os.tmpdir(), 'pp-reexport-batch1', '8039-a.jpg'),
    7957: path.join(os.tmpdir(), 'pp-reexport-batch1', '7957-a.jpg'),
    8081: path.join(os.tmpdir(), 'pp-reexport-batch2', '8081-master.jpg'),
    7988: path.join(os.tmpdir(), 'pp-reexport-batch2', '7988-master.jpg'),
    9366: path.join(os.tmpdir(), 'pp-reexport-batch2', '9366-3-master.jpg'),
    9304: path.join(os.tmpdir(), 'pp-reexport-batch2', '9304-master.jpg'),
    9345: path.join(os.tmpdir(), 'pp-reexport-batch2', '9345-master.jpg'),
    9376: path.join(os.tmpdir(), 'pp-reexport-batch2', '9376-master.jpg'),
    9387: path.join(os.tmpdir(), 'pp-reexport-batch2', '9387-master.jpg'),
    9356: path.join(os.tmpdir(), 'pp-reexport-batch2', '9356-master.jpg'),
    9294: path.join(os.tmpdir(), 'pp-reexport-batch2', '9294-master.jpg'),
    9325: path.join(os.tmpdir(), 'pp-reexport-batch2', '9325-master.jpg'),
    10620: path.join(os.tmpdir(), 'pp-reexport-batch2', '10620-3-master.jpg'),
    10651: path.join(os.tmpdir(), 'pp-reexport-batch2', '10651-master.jpg'),
    10661: path.join(os.tmpdir(), 'pp-reexport-batch3', '10661-master.jpg'),
    10568: path.join(os.tmpdir(), 'pp-reexport-batch3', '10568-master.jpg'),
    10641: path.join(os.tmpdir(), 'pp-reexport-batch3', '10641-master.jpg'),
    11882: path.join(os.tmpdir(), 'pp-reexport-batch3', '11882-1-master.jpg'),
    11820: path.join(os.tmpdir(), 'pp-reexport-batch3', '11820-master.jpg'),
    11944: path.join(os.tmpdir(), 'pp-reexport-batch3', '11944-master.jpg'),
    11830: path.join(os.tmpdir(), 'pp-reexport-batch3', '11830-master.jpg'),
    11861: path.join(os.tmpdir(), 'pp-reexport-batch3', '11861-master.jpg'),
    11954: path.join(os.tmpdir(), 'pp-reexport-batch3', '11954-master.jpg'),
    11872: path.join(os.tmpdir(), 'pp-reexport-batch3', '11872-master.jpg'),
    11841: path.join(os.tmpdir(), 'pp-reexport-batch3', '11841-master.jpg'),
};

const STYLE_NAME = { capeDutch: 'Modern Cape Dutch', transitional: 'Transitional', tudor: 'Modern Tudor' };
const outputRoot = path.join(root, 'src/example-assets/Park Place/exteriors-refresh-2');

const results = [];
for (const item of manifest) {
    const nodeNum = Number(item.nodeId.split(':')[1]);
    const masterPath = MASTER_FILE_BY_NODE[nodeNum];
    if (!masterPath) throw new Error(`No master mapped for node ${item.nodeId} (${item.key})`);

    const dims = execFileSync(
        'ffprobe',
        ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', masterPath],
        { encoding: 'utf8' }
    ).trim();
    const [width, height] = dims.split(',').map(Number);
    if (width < 2000) throw new Error(`Master for ${item.key} is unexpectedly small: ${dims}`);

    const planTitle = item.planSlug[0].toUpperCase() + item.planSlug.slice(1);
    const styleName = STYLE_NAME[item.styleKey];
    const fileBase = `_update_01_${styleName} Color Scheme ${item.schemeNumber} ${item.schemeName}`;
    const planDir = path.join(outputRoot, `The ${planTitle}`, styleName);
    await fs.mkdir(planDir, { recursive: true });
    const webpPath = path.join(planDir, `${fileBase}.webp`);

    execFileSync(cwebp, ['-quiet', '-q', '80', masterPath, '-o', webpPath]);
    const buf = await fs.readFile(webpPath);
    const md5 = crypto.createHash('md5').update(buf).digest('hex');

    results.push({
        key: item.key,
        planSlug: item.planSlug,
        styleKey: item.styleKey,
        schemeNumber: item.schemeNumber,
        schemeName: item.schemeName,
        sourceWidth: width,
        sourceHeight: height,
        webpPath: path.relative(root, webpPath).replaceAll('\\', '/'),
        fileName: `${fileBase}.webp`,
        md5,
        size: buf.length,
    });
    console.log(`${item.key}: ${width}x${height} -> ${buf.length} bytes webp`);
}

await fs.writeFile(
    path.join(root, 'scripts/park-place-exterior-reexport-upload-plan.json'),
    JSON.stringify(results, null, 2)
);
console.log('Prepared', results.length, 'images for upload');
