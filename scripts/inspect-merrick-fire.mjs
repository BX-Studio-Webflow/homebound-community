import fs from "fs";

const f =
  "src/example-assets/home-icons/Altadena/Altadena - Updated SVGS/Plan 4 - The Merrick/merrick-first-floor.svg";
const c = fs.readFileSync(f, "utf8");

const start = c.indexOf('<g id="FIREADD001"');
if (start < 0) {
  console.log("FIREADD001 not found as id=");
  const alt = [...c.matchAll(/FIREADD001[^"]*/g)].slice(0, 10);
  console.log(alt.map((m) => m[0]));
  process.exit(1);
}

// Extract group by depth
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
console.log("GROUP length:", group.length);
console.log("OPEN TAG:", group.slice(0, group.indexOf(">") + 1));
console.log("\n--- child top-level ids/data-names ---");
const childStarts = [...group.matchAll(/<g([^>]*)>/g)].slice(0, 30);
for (const m of childStarts) {
  const attrs = m[1];
  const id = (attrs.match(/id="([^"]+)"/) || [])[1];
  const dn = (attrs.match(/data-name="([^"]+)"/) || [])[1];
  const da = (attrs.match(/data-attribute="([^"]+)"/) || [])[1];
  const disp = (attrs.match(/display="([^"]+)"/) || [])[1];
  if (id || dn) console.log({ id, dn, da, disp });
}

// Highlight content
const highlights = [...group.matchAll(/<g[^>]*(?:id|data-name)="[^"]*[Hh]ighlight[^"]*"[^>]*>[\s\S]*?<\/g>/g)];
console.log("\n--- highlight groups ---", highlights.length);
for (const h of highlights) {
  console.log(h[0].slice(0, 500));
  console.log("---");
}

// Any rects with yellow-ish fills
const yellows = [...group.matchAll(/fill="#[fF][a-fA-F0-9]{5}"/g)];
console.log("\nyellow-ish fills count:", yellows.length);

// Check display:none on feature groups
const feats = [...c.matchAll(/<g id="([^"]+)"([^>]*)data-attribute="feature"([^>]*)>/g)];
console.log("\nAll features:");
for (const m of feats) {
  console.log(m[1], (m[2] + m[3]).trim());
}
