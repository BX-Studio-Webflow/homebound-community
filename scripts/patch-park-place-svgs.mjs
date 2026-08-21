import fs from "fs";
import path from "path";

const srcRoot = path.resolve(
  "src/example-assets/home-icons/Park Place Marketing Floor Plans",
);
const outRoot = path.join(srcRoot, "Park Place - Updated SVGS");

const jobs = [
  {
    name: "The Addison",
    files: [
      {
        src: path.join(outRoot, "The Addison", "addison-first-floor.svg"),
        out: "addison-first-floor.svg",
        map: {
          OPT_PREPKIT001: "PREPKIT001",
          OPT_EXTCVPT01: "EXTCVPT01",
          OPT__DOOREGD001: "DOOREGD001",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_FIREADD001: "FIREADD001",
          OPT_CEILBEAM011: "CEILBEAM01-great-room",
          OPT_GARG3B0001: "GARG3B0001",
        },
        merge: {
          OPT_CEILBEAM01: "CEILBEAM012",
        },
      },
    ],
  },
  {
    name: "The Bandera",
    files: [
      {
        src: path.join(outRoot, "The Bandera", "bandera-first-floor.svg"),
        out: "bandera-first-floor.svg",
        map: {
          OPT_PRPKTCN01: "PREPKIT001",
          OPT_ADDFLEXRM1: "ADDFLEXRM1",
          OPT_EXTCVPT01: "EXTCVPT01",
          OPT_FIREPLCE11: "FIREPLCE11",
          OPT_CEILBEAM013: "CEILBEAM013",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_CEILBEAM01: "CEILBEAM01-dining-room",
          OPT_GARG3B0001: "GARG3B0001",
        },
        merge: {
          OPT_CEILBEAM011: "CEILBEAM013",
        },
      },
      {
        src: path.join(outRoot, "The Bandera", "bandera-second-floor.svg"),
        out: "bandera-second-floor.svg",
        map: {
          OPT_CEILBEAM01: "CEILBEAM01-loft",
          OPT_BEDBATH001: "BEDBATH001",
          OPT_MEDIA01: "MEDIA01",
        },
      },
    ],
  },
  {
    name: "The Collin",
    files: [
      {
        src: path.join(outRoot, "The Collin", "collin-first-floor.svg"),
        out: "collin-first-floor.svg",
        map: {
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_CEILBEAM012: "CEILBEAM012",
          OPT_PRPKTCN1: "PREPKIT001",
          OPT_GRG2FLX01: "GRG2FLX01",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_GARG3B0001: "GARG3B0001",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_FIREPLCE11: "FIREPLCE11",
        },
        merge: {
          OPT_CEILBEAM01: "CEILBEAM012",
        },
      },
      {
        src: path.join(outRoot, "The Collin", "collin-second-floor.svg"),
        out: "collin-second-floor.svg",
        map: {
          OPT_CEILBEAM01: "CEILBEAM01-game-room",
        },
      },
    ],
  },
  {
    name: "The Grayson",
    files: [
      {
        src: path.join(outRoot, "The Grayson", "grayson-first-floor.svg"),
        out: "grayson-first-floor.svg",
        map: {
          OPT_PRPKTCN1: "PRPKTCN1",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_DOOREGD001: "DOOREGD001",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_GARG3B0001: "GARG3B0001",
        },
        merge: {
          OPT_CEILBEAM01: "CEILBEAM011",
        },
      },
      {
        src: path.join(outRoot, "The Grayson", "grayson-second-floor.svg"),
        out: "grayson-second-floor.svg",
        map: {
          OPT_ADDMEDIA01: "ADDMEDIA01",
          OPT_CEILBEAM01: "CEILBEAM01-game-room",
        },
      },
    ],
  },
  {
    name: "The Magnolia",
    files: [
      {
        src: path.join(outRoot, "The Magnolia", "magnolia-first-floor.svg"),
        out: "magnolia-first-floor.svg",
        map: {
          OPT_PRPKTCN1: "PREPKIT001",
          OPT__DOOREGD001: "DOOREGD001",
          OPT_EXTCVPT1: "EXTCVPT01",
          OPT_FIREPLCE1: "FIREPLCE1",
          OPT_CEILBEAM011: "CEILBEAM011",
          OPT_EXTPRIMBED1: "EXTPRIMBED1",
          OPT_GARG3B0001: "GARG3B0001",
        },
        merge: {
          OPT_CEILBEAM01: "CEILBEAM011",
        },
      },
      {
        src: path.join(outRoot, "The Magnolia", "magnolia-second-floor.svg"),
        out: "magnolia-second-floor.svg",
        map: {
          OPT_BED001: "BED001",
        },
      },
    ],
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findGroupRange(svg, id) {
  const openRe = new RegExp(`<g\\s+id="${escapeRegExp(id)}"[^>]*>`);
  const openMatch = openRe.exec(svg);
  if (!openMatch) return null;

  const start = openMatch.index;
  const innerStart = start + openMatch[0].length;
  let depth = 1;
  let i = innerStart;

  while (i < svg.length && depth > 0) {
    const nextOpen = svg.indexOf("<g", i);
    const nextClose = svg.indexOf("</g>", i);
    if (nextClose === -1) return null;

    const openIsTag =
      nextOpen !== -1 && nextOpen < nextClose && /^<g[\s>]/.test(svg.slice(nextOpen, nextOpen + 3));

    if (openIsTag) {
      depth += 1;
      i = nextOpen + 2;
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      const end = nextClose + 4;
      return {
        start,
        end,
        innerStart,
        innerEnd: nextClose,
        openTag: openMatch[0],
        inner: svg.slice(innerStart, nextClose),
        full: svg.slice(start, end),
      };
    }
    i = nextClose + 4;
  }
  return null;
}

function yellowClassNames(svg) {
  const styleMatch = svg.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) return new Set();
  const names = new Set();
  const blocks = styleMatch[1].split("}");
  for (const block of blocks) {
    if (!/#fff200/i.test(block)) continue;
    const selector = block.split("{")[0] || "";
    for (const token of selector.split(",")) {
      const m = token.trim().match(/^\.([A-Za-z0-9_-]+)/);
      if (m) names.add(m[1]);
    }
  }
  return names;
}

function withDisplayNone(openTag) {
  if (/\sdisplay=/.test(openTag)) return openTag;
  return openTag.replace(/>$/, ' display="none">');
}

function hideYellowInFragment(fragment, yellowClasses) {
  return fragment.replace(
    /<(rect|g|path|polygon|ellipse|polyline)(\s[^>]*?)(\/?)>/g,
    (full, tag, attrs, slash) => {
      if (/\sdisplay=/.test(attrs)) return full;
      const id = (attrs.match(/\bid="([^"]+)"/) || [])[1] || "";
      const cls = (attrs.match(/\bclass="([^"]+)"/) || [])[1] || "";
      const isHighlight = /^HIGHLIGHT/i.test(id);
      const isYellow = cls.split(/\s+/).some((c) => yellowClasses.has(c));
      if (!isHighlight && !isYellow) return full;
      return `<${tag}${attrs} display="none"${slash}>`;
    },
  );
}

function hideUnmappedOptYellow(svg, yellowClasses) {
  const optIds = [...svg.matchAll(/<g\s+id="(OPT_[^"]+)"/g)].map((m) => m[1]);
  let patched = svg;
  const hidden = [];

  for (const id of optIds) {
    const group = findGroupRange(patched, id);
    if (!group) continue;
    if (/\sdata-attribute="feature"/.test(group.openTag)) continue;

    const isBeam = /CEILBEAM/i.test(id);
    let next;
    if (isBeam) {
      next = withDisplayNone(group.openTag) + group.inner + "</g>";
      hidden.push({ id, mode: "group" });
    } else {
      next = group.openTag + hideYellowInFragment(group.inner, yellowClasses) + "</g>";
      hidden.push({ id, mode: "yellow" });
    }
    patched = patched.slice(0, group.start) + next + patched.slice(group.end);
  }

  return { patched, hidden };
}

function hideFeatureGroups(svg) {
  return svg.replace(
    /<g(\s+)id="([^"]+)"([^>]*\bdata-attribute="feature"[^>]*)>/g,
    (full, sp, id, rest) => {
      if (/\sdisplay=/.test(rest)) return full;
      return `<g${sp}id="${id}"${rest} display="none">`;
    },
  );
}

function mergeGroups(svg, mergeMap = {}) {
  const merged = [];
  let patched = svg;

  for (const [fromId, toId] of Object.entries(mergeMap)) {
    const from = findGroupRange(patched, fromId);
    if (!from) {
      merged.push({ from: fromId, to: toId, ok: false, reason: "missing-source" });
      continue;
    }

    patched = patched.slice(0, from.start) + patched.slice(from.end);

    const to = findGroupRange(patched, toId);
    if (!to) {
      merged.push({ from: fromId, to: toId, ok: false, reason: "missing-target" });
      continue;
    }

    const inserted =
      patched.slice(0, to.innerEnd) + "\n" + from.inner + patched.slice(to.innerEnd);
    patched = inserted;
    merged.push({ from: fromId, to: toId, ok: true });
  }

  return { patched, merged };
}

function remapIds(content, map) {
  const mappings = [];
  let patched = content;
  const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of entries) {
    const re = new RegExp(`<g(\\s+)id="${escapeRegExp(from)}"([^>]*)>`, "g");
    let count = 0;
    patched = patched.replace(re, (_full, sp, rest) => {
      count += 1;
      let attrs = rest || "";
      if (!/data-attribute=/.test(attrs)) {
        attrs = ` data-attribute="feature"${attrs}`;
      }
      return `<g${sp}id="${to}"${attrs}>`;
    });
    mappings.push({ from, to, count });
  }

  return { patched, mappings };
}

function removePlanText(svg) {
  const group = findGroupRange(svg, "PLAN_TEXT");
  if (!group) return { patched: svg, removed: false };
  return {
    patched: svg.slice(0, group.start) + svg.slice(group.end),
    removed: true,
  };
}

function hasGroup(svg, id) {
  return new RegExp(`<g\\s+id="${escapeRegExp(id)}"`).test(svg);
}

function patchSvg(content, file) {
  const yellowClasses = yellowClassNames(content);
  const chrome = removePlanText(content);
  const remapped = remapIds(chrome.patched, file.map);
  const merged = mergeGroups(remapped.patched, file.merge);
  let patched = hideFeatureGroups(merged.patched);
  const unmapped = hideUnmappedOptYellow(patched, yellowClasses);
  patched = unmapped.patched;
  return {
    patched,
    planTextRemoved: chrome.removed,
    mappings: remapped.mappings,
    merged: merged.merged,
    unmappedHidden: unmapped.hidden,
    yellowClasses: [...yellowClasses],
  };
}

fs.mkdirSync(outRoot, { recursive: true });

const report = [];
let failed = false;

for (const plan of jobs) {
  const dir = path.join(outRoot, plan.name);
  fs.mkdirSync(dir, { recursive: true });

  for (const file of plan.files) {
    if (!fs.existsSync(file.src)) {
      throw new Error(`Missing source: ${file.src}`);
    }
    const raw = fs.readFileSync(file.src, "utf8");
    const result = patchSvg(raw, file);
    const dest = path.join(dir, file.out);
    fs.writeFileSync(dest, result.patched, "utf8");
    const featureCount = (result.patched.match(/data-attribute="feature"/g) || []).length;
    const missing = result.mappings.filter((m) => {
      if (m.count === 1) return false;
      if (m.count === 0 && hasGroup(result.patched, m.to)) return false;
      return true;
    });
    const mergeFailed = (result.merged || []).filter((m) => {
      if (m.ok) return false;
      if (m.reason === "missing-source" && hasGroup(result.patched, m.to)) return false;
      return true;
    });
    report.push({
      plan: plan.name,
      file: file.out,
      features: featureCount,
      yellowClasses: result.yellowClasses,
      mappings: result.mappings,
      merged: result.merged,
      unmappedHidden: result.unmappedHidden,
    });
    const flag = missing.length || mergeFailed.length ? "WARN" : "OK";
    console.log(
      `${flag} ${plan.name}/${file.out} — ${featureCount} features` +
        (missing.length
          ? ` | unexpected counts: ${missing.map((m) => `${m.from}=${m.count}`).join(", ")}`
          : "") +
        (mergeFailed.length
          ? ` | merge failed: ${mergeFailed.map((m) => `${m.from}->${m.to} (${m.reason})`).join(", ")}`
          : ""),
    );
    if (missing.length || mergeFailed.length) failed = true;
  }
}

const reportPath = path.join(outRoot, "patch-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Wrote ${reportPath}`);
if (failed) process.exitCode = 1;
