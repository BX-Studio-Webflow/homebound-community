import fs from "fs";
import path from "path";

const src =
  "src/example-assets/home-icons/Altadena/Updated Plans - Altadena SVGS/Plan 4";
for (const f of fs.readdirSync(src).filter((x) => x.endsWith(".svg"))) {
  const c = fs.readFileSync(path.join(src, f), "utf8");
  const ids = [...c.matchAll(/id="(OPT_CODE_[^"]+)"/g)].map((m) => m[1]);
  console.log(`\nSOURCE ${f}`);
  for (const id of ids) {
    const decoded = id
      .replace(/__x28_/g, "(")
      .replace(/_x29_/g, ")")
      .replace(/_x5F_/g, "_")
      .replace(/__/g, "_");
    console.log(" ", decoded);
  }
}
