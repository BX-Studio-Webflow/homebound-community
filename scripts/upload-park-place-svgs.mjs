import fs from "fs";
import path from "path";

const jobs = JSON.parse(
  fs.readFileSync(
    "src/example-assets/home-icons/Park Place Marketing Floor Plans/Park Place - Updated SVGS/s3-upload-jobs.json",
    "utf8",
  ),
);

async function uploadOne(job, attempt = 1) {
  const fileBuf = fs.readFileSync(job.path);
  const d = job.uploadDetails;
  const form = new FormData();
  form.append("acl", d.acl);
  form.append("bucket", d.bucket);
  form.append("X-Amz-Algorithm", d.xAmzAlgorithm);
  form.append("X-Amz-Credential", d.xAmzCredential);
  form.append("X-Amz-Date", d.xAmzDate);
  form.append("key", d.key);
  form.append("Policy", d.policy);
  form.append("X-Amz-Signature", d.xAmzSignature);
  form.append("success_action_status", d.successActionStatus);
  form.append("Content-Type", d.contentType);
  form.append("Cache-Control", d.cacheControl);
  form.append(
    "file",
    new Blob([fileBuf], { type: "image/svg+xml" }),
    path.basename(job.path),
  );
  try {
    const res = await fetch(job.uploadUrl, { method: "POST", body: form });
    const text = await res.text();
    if (res.status === 201) {
      console.log("OK", job.label, job.hostedUrl);
      return true;
    }
    console.error("FAIL", job.label, res.status, text.slice(0, 400));
    return false;
  } catch (err) {
    console.error("ERR", job.label, attempt, err.cause?.code || err.message);
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return uploadOne(job, attempt + 1);
    }
    return false;
  }
}

let ok = 0;
for (const job of jobs) {
  if (await uploadOne(job)) ok += 1;
}
console.log(`Uploaded ${ok}/${jobs.length}`);
if (ok !== jobs.length) process.exit(1);
