import fs from "fs";
import path from "path";
import crypto from "crypto";

const src =
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-first-floor.svg";
const out = path.join(path.dirname(src), "merrick-first-floor-01.svg");

let c = fs.readFileSync(src, "utf8");

const start = c.indexOf('<g id="FIREADD001"');
if (start < 0) throw new Error("FIREADD001 not found");
const gt = c.indexOf(">", start);
let pos = gt + 1;
let depth = 1;
let end;
while (pos < c.length && depth > 0) {
  const a = c.indexOf("<g ", pos);
  const b = c.indexOf("<g>", pos);
  let nextOpen = -1;
  if (a >= 0 && b >= 0) nextOpen = Math.min(a, b);
  else if (a >= 0) nextOpen = a;
  else nextOpen = b;
  const nextClose = c.indexOf("</g>", pos);
  if (nextClose < 0) throw new Error("unclosed");
  if (nextOpen >= 0 && nextOpen < nextClose) {
    depth += 1;
    pos = nextOpen + 2;
  } else {
    depth -= 1;
    if (depth === 0) {
      end = nextClose + 4;
      break;
    }
    pos = nextClose + 4;
  }
}

const group = c.slice(start, end);
// Keep display=none on outer FIREADD001 only; strip from nested Whiteout/Highlight/Geometry
const fixedGroup = group.replace(
  /(<g id="(?:Whiteout3|Highlight2|Geometry4)"[^>]*?)\s+display="none"/g,
  "$1",
);

if (fixedGroup === group) throw new Error("No nested display=none removed — pattern miss?");

const next = c.slice(0, start) + fixedGroup + c.slice(end);
fs.writeFileSync(src, next, "utf8");
fs.writeFileSync(out, next, "utf8");

const buf = fs.readFileSync(out);
const hash = crypto.createHash("md5").update(buf).digest("hex");
console.log(JSON.stringify({ out, size: buf.length, md5: hash }, null, 2));

// verify
const v = fs.readFileSync(out, "utf8");
const fireStart = v.indexOf('<g id="FIREADD001"');
const snippet = v.slice(fireStart, fireStart + 600);
console.log(snippet);
const nested = [...snippet.matchAll(/display="none"/g)].length;
console.log("display=none count in first 600 chars of group:", nested);
