import fs from "fs";

const f =
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-first-floor.svg";
const c = fs.readFileSync(f, "utf8");

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
  return c.slice(start, end);
}

for (const id of ["FIREADD001", "CEILBEAM01-great-room", "CASEOPN001"]) {
  const g = extractGroup(c, id);
  if (!g) {
    console.log(id, "MISSING");
    continue;
  }
  // Direct child g tags with display
  const nestedNone = [...g.matchAll(/<g([^>]*display="none"[^>]*)>/g)];
  console.log(`\n=== ${id} ===`);
  console.log("open:", g.slice(0, g.indexOf(">") + 1));
  console.log("groups with display=none:", nestedNone.length);
  for (const m of nestedNone.slice(0, 8)) {
    const attrs = m[1];
    const cid = (attrs.match(/id="([^"]+)"/) || [])[1];
    const dn = (attrs.match(/data-name="([^"]+)"/) || [])[1];
    console.log(" ", { id: cid, dn });
  }
}

// Also check uploaded CDN? compare source original
const src =
  "src/example-assets/home-icons/Altadena/Updated Plans - Altadena SVGS/Plan 4/Plan 4 - Merrick - First Floor.svg";
const s = fs.readFileSync(src, "utf8");
const fireSrc = s.indexOf("OPT_CODE_FIREADD001");
console.log("\n=== SOURCE OPT_CODE_FIREADD001 snippet ===");
console.log(s.slice(fireSrc, fireSrc + 400));
