import fs from "fs";

const svgPath =
  "src/example-assets/home-icons/Park Place Marketing Floor Plans/Park Place - Updated SVGS/The Addison/addison-first-floor.svg";

const svg = fs.readFileSync(svgPath, "utf8");
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

function add(x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
}

const cleaned = svg.replace(/<[^>]+display="none"[^>]*\/>/g, "");

for (const r of cleaned.matchAll(/<rect[^>]*>/g).map((m) => m[0])) {
  const x = Number((r.match(/\sx="([\d.-]+)"/) || [])[1]);
  const y = Number((r.match(/\sy="([\d.-]+)"/) || [])[1]);
  const w = Number((r.match(/\swidth="([\d.-]+)"/) || [])[1]);
  const h = Number((r.match(/\sheight="([\d.-]+)"/) || [])[1]);
  add(x, y);
  add(x + w, y + h);
}

for (const r of cleaned.matchAll(/<line[^>]*>/g).map((m) => m[0])) {
  add(Number((r.match(/x1="([\d.-]+)"/) || [])[1]), Number((r.match(/y1="([\d.-]+)"/) || [])[1]));
  add(Number((r.match(/x2="([\d.-]+)"/) || [])[1]), Number((r.match(/y2="([\d.-]+)"/) || [])[1]));
}

for (const m of cleaned.matchAll(/points="([^"]+)"/g)) {
  const nums = m[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter(Number.isFinite);
  for (let i = 0; i < nums.length - 1; i += 2) add(nums[i], nums[i + 1]);
}

for (const m of cleaned.matchAll(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/g)) {
  add(Number(m[1]), Number(m[2]));
}

for (const m of cleaned.matchAll(/\sd="([^"]+)"/g)) {
  const d = m[1];
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let pm;
  while ((pm = re.exec(d))) {
    const cmd = pm[1];
    const nums = pm[2]
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    const rel = cmd === cmd.toLowerCase();
    const c = cmd.toUpperCase();
    if (c === "Z") {
      x = startX;
      y = startY;
      continue;
    }
    if (c === "M" || c === "L" || c === "T") {
      for (let i = 0; i < nums.length; i += 2) {
        x = rel ? x + nums[i] : nums[i];
        y = rel ? y + nums[i + 1] : nums[i + 1];
        add(x, y);
        if (c === "M" && i === 0) {
          startX = x;
          startY = y;
        }
      }
    } else if (c === "H") {
      for (const n of nums) {
        x = rel ? x + n : n;
        add(x, y);
      }
    } else if (c === "V") {
      for (const n of nums) {
        y = rel ? y + n : n;
        add(x, y);
      }
    } else if (c === "C") {
      for (let i = 0; i < nums.length; i += 6) {
        const pts = [
          [nums[i], nums[i + 1]],
          [nums[i + 2], nums[i + 3]],
          [nums[i + 4], nums[i + 5]],
        ];
        for (const [px, py] of pts) {
          const ax = rel ? x + px : px;
          const ay = rel ? y + py : py;
          add(ax, ay);
          x = ax;
          y = ay;
        }
      }
    } else if (c === "S" || c === "Q") {
      for (let i = 0; i < nums.length; i += 4) {
        const ax = rel ? x + nums[i] : nums[i];
        const ay = rel ? y + nums[i + 1] : nums[i + 1];
        const bx = rel ? x + nums[i + 2] : nums[i + 2];
        const by = rel ? y + nums[i + 3] : nums[i + 3];
        add(ax, ay);
        add(bx, by);
        x = bx;
        y = by;
      }
    } else if (c === "A") {
      for (let i = 0; i < nums.length; i += 7) {
        x = rel ? x + nums[i + 5] : nums[i + 5];
        y = rel ? y + nums[i + 6] : nums[i + 6];
        add(x, y);
      }
    }
  }
}

const pad = 12;
const viewBox = [
  +(minX - pad).toFixed(2),
  +(minY - pad).toFixed(2),
  +(maxX - minX + pad * 2).toFixed(2),
  +(maxY - minY + pad * 2).toFixed(2),
];

console.log({ minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY, viewBox });

if (process.argv.includes("--write")) {
  const next = svg.replace(/viewBox="[^"]+"/, `viewBox="${viewBox.join(" ")}"`);
  fs.writeFileSync(svgPath, next);
  console.log("updated viewBox");
}
