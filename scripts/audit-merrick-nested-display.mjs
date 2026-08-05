import fs from "fs";
import path from "path";

const files = [
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-first-floor.svg",
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-second-floor.svg",
];

function extractGroup(c, id) {
  const start = c.indexOf(`<g id="${id}"`);
  if (start < 0) return null;
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
    if (nextClose < 0) throw new Error("unclosed " + id);
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
  return { start, end, group: c.slice(start, end) };
}

for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  const feats = [...c.matchAll(/<g id="([^"]+)"[^>]*data-attribute="feature"/g)].map((m) => m[1]);
  console.log(`\n=== ${path.basename(f)} ===`);
  for (const id of feats) {
    const ex = extractGroup(c, id);
    const nested = [...ex.group.matchAll(/<g([^>]*display="none"[^>]*)>/g)].filter((m) => {
      const cid = (m[1].match(/id="([^"]+)"/) || [])[1];
      return cid !== id;
    });
    if (nested.length) {
      console.log(
        `PROBLEM ${id}: ${nested.length} nested display=none —`,
        nested.map((m) => (m[1].match(/id="([^"]+)"/) || [])[1] || (m[1].match(/data-name="([^"]+)"/) || [])[1]),
      );
    } else {
      console.log(`ok ${id}`);
    }
  }
}
