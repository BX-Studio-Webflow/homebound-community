import fs from "fs";
import path from "path";

const jobs = [
  {
    label: "willow-first-floor-update--2",
    filePath:
      "src/example-assets/home-icons/Palisade SVGs/Palisade - Updated SVGS/The Willow - Plan 7/willow-first-floor-update--2.svg",
    hostedUrl:
      "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7ad4f919dd32b01d25d529_willow-first-floor-update--2.svg",
    details: {
      acl: "public-read",
      bucket: "webflow-prod-assets",
      xAmzAlgorithm: "AWS4-HMAC-SHA256",
      xAmzCredential: "AKIAQLLHWD6MEJGETLST/20260811/us-east-1/s3/aws4_request",
      xAmzDate: "20260811T075329Z",
      key: "601ca16f0bb27e965ee867a0/6a7ad4f919dd32b01d25d529_willow-first-floor-update--2.svg",
      policy:
        "eyJleHBpcmF0aW9uIjoiMjAyNi0wOC0xMVQwODo1MzoyOVoiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvIl0seyJjYWNoZS1jb250cm9sIjoibWF4LWFnZT0zMTUzNjAwMCJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2Uvc3ZnK3htbCJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJpbWFnZS9zdmcreG1sIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwzMTQ1NzI4MF0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsiYnVja2V0Ijoid2ViZmxvdy1wcm9kLWFzc2V0cyJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFRTExIV0Q2TUVKR0VUTFNULzIwMjYwODExL3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI2MDgxMVQwNzUzMjlaIn0seyJrZXkiOiI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvNmE3YWQ0ZjkxOWRkMzJiMDFkMjVkNTI5X3dpbGxvdy1maXJzdC1mbG9vci11cGRhdGUtLTIuc3ZnIn1dfQ==",
      xAmzSignature: "db1e38573a2c2a9eb3abd258d156963b7933e1f7c0a95957d4d98edb7e6a7ebc",
      successActionStatus: "201",
      contentType: "image/svg+xml",
      cacheControl: "max-age=31536000",
    },
  },
  {
    label: "willow-second-floor-update--2",
    filePath:
      "src/example-assets/home-icons/Palisade SVGs/Palisade - Updated SVGS/The Willow - Plan 7/willow-second-floor-update--2.svg",
    hostedUrl:
      "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7ad4fa2b03df827d9206a6_willow-second-floor-update--2.svg",
    details: {
      acl: "public-read",
      bucket: "webflow-prod-assets",
      xAmzAlgorithm: "AWS4-HMAC-SHA256",
      xAmzCredential: "AKIAQLLHWD6MEJGETLST/20260811/us-east-1/s3/aws4_request",
      xAmzDate: "20260811T075330Z",
      key: "601ca16f0bb27e965ee867a0/6a7ad4fa2b03df827d9206a6_willow-second-floor-update--2.svg",
      policy:
        "eyJleHBpcmF0aW9uIjoiMjAyNi0wOC0xMVQwODo1MzozMFoiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvIl0seyJjYWNoZS1jb250cm9sIjoibWF4LWFnZT0zMTUzNjAwMCJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2Uvc3ZnK3htbCJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJpbWFnZS9zdmcreG1sIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwzMTQ1NzI4MF0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsiYnVja2V0Ijoid2ViZmxvdy1wcm9kLWFzc2V0cyJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFRTExIV0Q2TUVKR0VUTFNULzIwMjYwODExL3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI2MDgxMVQwNzUzMzBaIn0seyJrZXkiOiI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvNmE3YWQ0ZmEyYjAzZGY4MjdkOTIwNmE2X3dpbGxvdy1zZWNvbmQtZmxvb3ItdXBkYXRlLS0yLnN2ZyJ9XX0=",
      xAmzSignature: "5ec4b911567c9adc516a7e4e04445574b90d5905277af7460266f0670fad76a8",
      successActionStatus: "201",
      contentType: "image/svg+xml",
      cacheControl: "max-age=31536000",
    },
  },
];

async function uploadOne(job) {
  const d = job.details;
  const fileBuf = fs.readFileSync(job.filePath);
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
    path.basename(job.filePath),
  );
  const res = await fetch("https://webflow-prod-assets.s3.amazonaws.com/", {
    method: "POST",
    body: form,
  });
  console.log(job.label, res.status);
  if (res.status !== 201) {
    console.log(await res.text());
    return false;
  }
  console.log("cdn", job.hostedUrl);
  return true;
}

let ok = 0;
for (const job of jobs) {
  if (await uploadOne(job)) ok += 1;
}
if (ok !== jobs.length) process.exit(1);
