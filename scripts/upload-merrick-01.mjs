import fs from "fs";
import path from "path";

const details = {
  acl: "public-read",
  bucket: "webflow-prod-assets",
  xAmzAlgorithm: "AWS4-HMAC-SHA256",
  xAmzCredential: "AKIAQLLHWD6MEJGETLST/20260805/us-east-1/s3/aws4_request",
  xAmzDate: "20260805T094833Z",
  key: "601ca16f0bb27e965ee867a0/6a7306f1c8664a10cacf92af_merrick-first-floor-01.svg",
  policy:
    "eyJleHBpcmF0aW9uIjoiMjAyNi0wOC0wNVQxMDo0ODozM1oiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvIl0seyJjYWNoZS1jb250cm9sIjoibWF4LWFnZT0zMTUzNjAwMCJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2Uvc3ZnK3htbCJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJpbWFnZS9zdmcreG1sIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwzMTQ1NzI4MF0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsiYnVja2V0Ijoid2ViZmxvdy1wcm9kLWFzc2V0cyJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFRTExIV0Q2TUVKR0VUTFNULzIwMjYwODA1L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI2MDgwNVQwOTQ4MzNaIn0seyJrZXkiOiI2MDFjYTE2ZjBiYjI3ZTk2NWVlODY3YTAvNmE3MzA2ZjFjODY2NGExMGNhY2Y5MmFmX21lcnJpY2stZmlyc3QtZmxvb3ItMDEuc3ZnIn1dfQ==",
  xAmzSignature: "c71f54ad910b14a8ed0dbf35598ff44b4542d885de5b2be5e05b2fc2cac4bb1d",
  successActionStatus: "201",
  contentType: "image/svg+xml",
  cacheControl: "max-age=31536000",
};

const filePath =
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-first-floor-01.svg";
const fileBuf = fs.readFileSync(filePath);
const form = new FormData();
form.append("acl", details.acl);
form.append("bucket", details.bucket);
form.append("X-Amz-Algorithm", details.xAmzAlgorithm);
form.append("X-Amz-Credential", details.xAmzCredential);
form.append("X-Amz-Date", details.xAmzDate);
form.append("key", details.key);
form.append("Policy", details.policy);
form.append("X-Amz-Signature", details.xAmzSignature);
form.append("success_action_status", details.successActionStatus);
form.append("Content-Type", details.contentType);
form.append("Cache-Control", details.cacheControl);
form.append("file", new Blob([fileBuf], { type: "image/svg+xml" }), path.basename(filePath));

const res = await fetch("https://webflow-prod-assets.s3.amazonaws.com/", {
  method: "POST",
  body: form,
});
console.log("status", res.status);
const text = await res.text();
if (text) console.log(text.slice(0, 500));
if (res.status !== 201) process.exit(1);
console.log("upload ok");
console.log(
  "cdn",
  "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7306f1c8664a10cacf92af_merrick-first-floor-01.svg",
);
