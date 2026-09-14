import fs from 'node:fs';
import path from 'node:path';

const jobsPath = process.argv[2] || 'scripts/webflow-upload-jobs.json';
const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

async function uploadOne(job, attempt = 1) {
  const filePath = path.resolve(job.path);
  const fileBuf = fs.readFileSync(filePath);
  const details = job.uploadDetails;
  const form = new FormData();
  form.append('acl', details.acl);
  form.append('bucket', details.bucket);
  form.append('X-Amz-Algorithm', details.xAmzAlgorithm);
  form.append('X-Amz-Credential', details.xAmzCredential);
  form.append('X-Amz-Date', details.xAmzDate);
  form.append('key', details.key);
  form.append('Policy', details.policy);
  form.append('X-Amz-Signature', details.xAmzSignature);
  form.append('success_action_status', details.successActionStatus);
  form.append('Content-Type', details.contentType);
  form.append('Cache-Control', details.cacheControl);
  form.append('file', new Blob([fileBuf], { type: details.contentType }), path.basename(filePath));

  try {
    const response = await fetch(job.uploadUrl, { method: 'POST', body: form });
    const text = await response.text();
    if (response.status === 201) {
      console.log(`OK ${job.label}`);
      return true;
    }
    console.error(`FAIL ${job.label} ${response.status} ${text.slice(0, 400)}`);
  } catch (error) {
    console.error(`ERR ${job.label} ${attempt} ${error.cause?.code || error.message}`);
  }
  if (attempt < 4) {
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    return uploadOne(job, attempt + 1);
  }
  return false;
}

let uploaded = 0;
for (const job of jobs) {
  if (await uploadOne(job)) uploaded += 1;
}
console.log(`Uploaded ${uploaded}/${jobs.length}`);
if (uploaded !== jobs.length) process.exit(1);