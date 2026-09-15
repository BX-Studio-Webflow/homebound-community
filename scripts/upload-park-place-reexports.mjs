import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const manifestPath = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, 'scripts/park-place-exterior-reexport-confirmed-uploads.json');
const entries = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

const uploadUrl = 'https://webflow-prod-assets.s3.amazonaws.com/';

for (const entry of entries) {
  const buf = await fs.readFile(
    entry.tempFile ? path.join(process.env.TEMP, entry.tempFile) : path.join(root, entry.webpPath)
  );
  const form = new FormData();
  form.append('acl', 'public-read');
  form.append('bucket', 'webflow-prod-assets');
  form.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
  form.append(
    'X-Amz-Credential',
    entry.credential ?? 'AKIAQLLHWD6MEJGETLST/20260914/us-east-1/s3/aws4_request'
  );
  form.append('X-Amz-Date', entry.date);
  form.append('key', entry.s3Key);
  form.append('policy', entry.policy);
  form.append('X-Amz-Signature', entry.signature);
  form.append('success_action_status', '201');
  form.append('Content-Type', 'image/webp');
  form.append('Cache-Control', 'max-age=31536000');
  form.append('file', new Blob([buf], { type: 'image/webp' }), 'file.webp');

  const res = await fetch(uploadUrl, { method: 'POST', body: form });
  console.log(entry.key, '->', res.status);
  if (res.status !== 201) {
    console.log(await res.text());
  }
}
