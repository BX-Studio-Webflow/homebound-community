import fs from "fs";

const p = "c:/Users/user/Downloads/LA ADU Plan Pages.md";
let c = fs.readFileSync(p, "utf8");
c = c
  .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
  .replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+/g, "[IMG]");

const lines = c.split(/\r?\n/);
const out = [];
for (const line of lines) {
  const t = line.trim();
  if (!t) continue;
  if (t === "[IMG]") continue;
  if (t.length > 400) continue;
  if (/^#{1,6}\s/.test(t) || /^-/.test(t) || /^\d+\./.test(t)) {
    out.push(t);
    continue;
  }
  if (
    /OPT_|option|feature|floor|bedroom|bath|sq\.?\s*ft|ADU|Garage|Carriage|Studio|plan|beds?|starting|personaliz|don't execute|execute/i.test(
      t,
    )
  ) {
    out.push(t);
  }
}
fs.writeFileSync("scripts/adu-doc-extract.txt", out.join("\n"));
console.log("lines", out.length);
console.log(out.slice(0, 250).join("\n"));
