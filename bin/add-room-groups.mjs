#!/usr/bin/env node
/**
 * Adds named room `<g>` overlay groups to floor-plan SVGs so that
 * HomeMapController can wire bidirectional hover between CMS cards and SVG rooms.
 *
 * For each SVG:
 *  1. Extracts room-name text labels and their (x, y) positions.
 *  2. Extracts all HATCH polygon/rect/path elements and their bounding boxes.
 *  3. Matches each room label to the HATCH whose bbox contains the label point
 *     and is "room-sized" (not tiny wall fills or the full-page background).
 *  4. Inserts a new `<g id="ROOM-NAME">` wrapper around each matched HATCH.
 *     If no HATCH match is found, creates a transparent rect overlay instead.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';

// ── Known room names → SVG group IDs ────────────────────────────────────────
const ROOM_ID_MAP = {
  'Primary Bath': 'PRIMARY-BATH',
  'Primary Closet': 'PRIMARY-CLOSET',
  'Primary Bedroom': 'PRIMARY-BEDROOM',
  'Primary Retreat': 'PRIMARY-RETREAT',
  'Kitchen': 'KITCHEN',
  'Dining Room': 'DINING-ROOM',
  'Great Room': 'GREAT-ROOM',
  'Foyer': 'FOYER',
  'Pantry': 'PANTRY',
  'Prep Pantry': 'PREP-PANTRY',
  'Powder Room': 'POWDER-ROOM',
  'Laundry Room': 'LAUNDRY-ROOM',
  'Office': 'OFFICE',
  'Flex Room': 'FLEX-ROOM',
  'Garage': 'GARAGE',
  'Covered Patio': 'COVERED-PATIO',
  'Uncovered Patio': 'UNCOVERED-PATIO',
  'Porch': 'PORCH',
  'Bedroom 2': 'BEDROOM-2',
  'Bedroom 3': 'BEDROOM-3',
  'Bedroom 4': 'BEDROOM-4',
  'Bath 2': 'BATH-2',
  'Bath 3': 'BATH-3',
  'Bath 4': 'BATH-4',
  'Loft': 'LOFT',
  'Media Room': 'MEDIA-ROOM',
  'Balcony': 'BALCONY',
  'Hall': 'HALL',
  'Mech': 'MECH',
  'Closet': 'CLOSET',
};

// ── SVG files to process ────────────────────────────────────────────────────
const ROOT = resolve(import.meta.dirname, '..', 'src', 'example-assets', 'home-icons');
const SVG_FILES = [
  `${ROOT}/Iris_FLOORPLAN_2026.01.08/3244_FIRSTFLOORPLAN.svg`,
  `${ROOT}/Iris_FLOORPLAN_2026.01.08/3244_SECONDFLOORPLAN.svg`,
  `${ROOT}/Iris_FLOORPLAN_2026.01.08/3244_FIRSTFLOORPLAN_FLIPPED.svg`,
  `${ROOT}/Iris_FLOORPLAN_2026.01.08/3244_SECONDFLOORPLAN_FLIPPED.svg`,
  `${ROOT}/Daphne FLOORPLAN_12.18.2025/2825_FIRSTFLOOR.svg`,
  `${ROOT}/Daphne FLOORPLAN_12.18.2025/2825_SECONDFLOOR.svg`,
  `${ROOT}/Daphne FLOORPLAN_12.18.2025/2825_FIRSTFLOOR_FLIPPED.svg`,
  `${ROOT}/Daphne FLOORPLAN_12.18.2025/2825_SECONDFLOOR_FLIPPED.svg`,
  `${ROOT}/Sienna_FLOORPLAN_12.10.2025/3550 FIRST FLOORPLAN.svg`,
  `${ROOT}/Sienna_FLOORPLAN_12.10.2025/3550 SECOND FLOORPLAN.svg`,
  `${ROOT}/Sienna_FLOORPLAN_12.10.2025/3550 FIRST FLOORPLAN FLIPPED.svg`,
  `${ROOT}/Sienna_FLOORPLAN_12.10.2025/3550 SECOND FLOORPLAN FLIPPED.svg`,
];

// ── Geometry helpers ────────────────────────────────────────────────────────

function parsePolygonPoints(pointsStr) {
  const nums = pointsStr.trim().split(/[\s,]+/).map(Number);
  const pts = [];
  for (let i = 0; i < nums.length - 1; i += 2) {
    pts.push({ x: nums[i], y: nums[i + 1] });
  }
  return pts;
}

function bboxOfPoints(pts) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const { x, y } of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function bboxOfRect(x, y, w, h) {
  return { x, y, w, h };
}

function bboxArea(bb) {
  return bb.w * bb.h;
}

function bboxContains(bb, px, py) {
  return px >= bb.x && px <= bb.x + bb.w && py >= bb.y && py <= bb.y + bb.h;
}

/** Ray-casting point-in-polygon test. */
function pointInPolygon(pts, px, py) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const { x: xi, y: yi } = pts[i];
    const { x: xj, y: yj } = pts[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// ── SVG parsing helpers ─────────────────────────────────────────────────────

function parseViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  if (!m) return { x: 0, y: 0, w: 300, h: 300 };
  const [x, y, w, h] = m[1].split(/\s+/).map(Number);
  return { x, y, w, h };
}

function extractAtomsFromBlock(block) {
  const atoms = [];
  const textRe = /<text[^>]*transform="translate\(([^)]+)\)[^"]*"[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = textRe.exec(block)) !== null) {
    const coords = m[1].split(/[\s,]+/).map(Number);
    const raw = m[2].replace(/<[^>]+>/g, '');
    if (raw.trim()) atoms.push({ x: coords[0], y: coords[1], text: raw });
  }
  return atoms;
}

function assembleLines(atoms) {
  atoms.sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];
  for (const atom of atoms) {
    const existing = lines.find((l) => Math.abs(l.y - atom.y) < 2);
    if (existing) {
      existing.parts.push(atom);
    } else {
      lines.push({ y: atom.y, parts: [atom] });
    }
  }
  return lines.map((line) => {
    line.parts.sort((a, b) => a.x - b.x);
    return {
      x: line.parts[0].x,
      y: line.y,
      text: line.parts.map((p) => p.text).join('').trim(),
    };
  });
}

function extractTextLabels(svg) {
  // Strategy 1: Use MTEXT groups if present (Daphne/structured SVGs).
  // Each MTEXT group contains one room name, possibly split across lines.
  const mtextRe = /<g id="MTEXT(?:-\d+)?"[^>]*>([\s\S]*?)<\/g>\s*(?:<\/g>|\s*<g id="MTEXT)/g;
  // Simpler: just split on MTEXT boundaries
  const mtextBlocks = [];
  const mtextBlockRe = /<g id="(MTEXT(?:-\d+)?)"[^>]*>([\s\S]*?)(?=<\/g>\s*<g id="MTEXT|<\/g>\s*<\/g>)/g;
  let m;
  while ((m = mtextBlockRe.exec(svg)) !== null) {
    mtextBlocks.push(m[2]);
  }

  if (mtextBlocks.length > 3) {
    // Structured MTEXT groups: parse each independently
    const labels = [];
    for (const block of mtextBlocks) {
      const atoms = extractAtomsFromBlock(block);
      if (!atoms.length) continue;
      const lines = assembleLines(atoms);
      const filtered = lines.filter((l) => !/^[\d'"\sx.]+$/.test(l.text));
      if (!filtered.length) continue;
      const text = filtered.map((l) => l.text).join(' ');
      labels.push({ x: filtered[0].x, y: filtered[0].y, text });
    }
    return labels;
  }

  // Strategy 2: Global extraction (Sienna-style with multi-tspan text elements)
  const atoms = extractAtomsFromBlock(svg);
  const lines = assembleLines(atoms);
  return lines
    .filter((l) => !/^[\d'"\sx.]+$/.test(l.text))
    .map(({ x, y, text }) => ({ x, y, text }));
}

function extractHatches(svg) {
  const hatches = [];
  // Match HATCH groups
  const hatchGroupRe = /<g id="(HATCH(?:-\d+)?)"[^>]*>([\s\S]*?)<\/g>/g;
  let m;
  while ((m = hatchGroupRe.exec(svg)) !== null) {
    const id = m[1];
    const inner = m[2];

    // Try polygon
    const polyM = inner.match(/<polygon[^>]*points="([^"]+)"/);
    if (polyM) {
      const pts = parsePolygonPoints(polyM[1]);
      const bb = bboxOfPoints(pts);
      hatches.push({ id, type: 'polygon', pts, bb, area: bboxArea(bb), raw: m[0] });
      continue;
    }

    // Try rect
    const rectM = inner.match(/<rect[^>]*\bx="([^"]+)"[^>]*\by="([^"]+)"[^>]*\bwidth="([^"]+)"[^>]*\bheight="([^"]+)"/);
    if (rectM) {
      const [, rx, ry, rw, rh] = rectM.map(Number);
      const bb = bboxOfRect(rx, ry, rw, rh);
      hatches.push({ id, type: 'rect', pts: null, bb, area: bboxArea(bb), raw: m[0] });
      continue;
    }

    // Try path — extract M/L/Z coordinates for simple paths
    const pathM = inner.match(/<path[^>]*\bd="([^"]+)"/);
    if (pathM) {
      const d = pathM[1];
      const nums = d.match(/-?\d+\.?\d*/g);
      if (nums && nums.length >= 4) {
        const pts = [];
        for (let i = 0; i < nums.length - 1; i += 2) {
          pts.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) });
        }
        const bb = bboxOfPoints(pts);
        hatches.push({ id, type: 'path', pts, bb, area: bboxArea(bb), raw: m[0] });
      }
    }
  }
  return hatches;
}

// ── Room matching ───────────────────────────────────────────────────────────

function matchRoomLabel(text) {
  // Direct match
  if (ROOM_ID_MAP[text]) return { name: text, id: ROOM_ID_MAP[text] };

  // Try known multi-word room names as prefix matches
  for (const [name, id] of Object.entries(ROOM_ID_MAP)) {
    if (text === name || text.startsWith(name)) return { name, id };
  }

  return null;
}

function groupAdjacentLabels(labels) {
  // Group text elements that are on adjacent lines (same room name split across lines)
  // e.g., "Powder" at (196, 227) + "Room" at (199, 235) → "Powder Room" at (196, 227)
  const grouped = [];
  const used = new Set();

  for (let i = 0; i < labels.length; i++) {
    if (used.has(i)) continue;
    let { x, y, text } = labels[i];

    // Look for a continuation on the next line (within ~15 SVG units vertically, ~20 horizontally)
    for (let j = 0; j < labels.length; j++) {
      if (i === j || used.has(j)) continue;
      const dx = Math.abs(labels[j].x - x);
      const dy = labels[j].y - y;
      if (dx < 20 && dy > 2 && dy < 18) {
        text = text + ' ' + labels[j].text;
        used.add(j);
      }
    }

    const room = matchRoomLabel(text);
    if (room) {
      if (!grouped.find((g) => g.id === room.id)) {
        grouped.push({ ...room, x, y });
      }
    }

    used.add(i);
  }

  return grouped;
}

function isRoomSized(h, viewBox) {
  const vbArea = viewBox.w * viewBox.h;
  if (h.area < vbArea * 0.005 || h.area > vbArea * 0.15) return false;
  const aspect = h.bb.w / h.bb.h;
  if (aspect < 0.25 || aspect > 4) return false;
  const minDim = Math.min(viewBox.w, viewBox.h);
  if (h.bb.w < minDim * 0.08 || h.bb.h < minDim * 0.08) return false;
  return true;
}

function findBestHatch(room, hatches, viewBox) {
  const candidates = hatches.filter((h) => isRoomSized(h, viewBox));

  const containing = candidates.filter((h) => {
    if (h.pts) return pointInPolygon(h.pts, room.x, room.y);
    return bboxContains(h.bb, room.x, room.y);
  });

  if (containing.length > 0) {
    containing.sort((a, b) => a.area - b.area);
    return containing[0];
  }

  return null;
}

// ── Default overlay sizes per room type ─────────────────────────────────────

function defaultOverlaySize(roomId, viewBox) {
  const scale = Math.min(viewBox.w, viewBox.h) / 272;
  const s = (w, h) => ({ w: w * scale, h: h * scale });

  if (/GARAGE/.test(roomId)) return s(80, 100);
  if (/GREAT-ROOM|COVERED-PATIO|UNCOVERED-PATIO/.test(roomId)) return s(70, 80);
  if (/PRIMARY-BEDROOM|BEDROOM/.test(roomId)) return s(65, 70);
  if (/KITCHEN|DINING-ROOM|FLEX-ROOM|MEDIA-ROOM|LOFT/.test(roomId)) return s(55, 60);
  if (/OFFICE|LAUNDRY|RETREAT/.test(roomId)) return s(50, 50);
  if (/CLOSET|BATH|PANTRY|POWDER|MECH|FOYER|HALL|PORCH|BALCONY/.test(roomId)) return s(35, 35);
  return s(45, 45);
}

// ── Main processing ─────────────────────────────────────────────────────────

function processFile(filePath) {
  let svg;
  try {
    svg = readFileSync(filePath, 'utf8');
  } catch {
    console.log(`  SKIP (file not found): ${basename(filePath)}`);
    return;
  }

  // Don't re-process files that already have room groups
  if (svg.includes('id="KITCHEN"') || svg.includes('id="GARAGE"') || svg.includes('id="PRIMARY-BEDROOM"')) {
    console.log(`  SKIP (already has room groups): ${basename(filePath)}`);
    return;
  }

  const viewBox = parseViewBox(svg);
  const labels = extractTextLabels(svg);
  const hatches = extractHatches(svg);
  const rooms = groupAdjacentLabels(labels);

  if (!rooms.length) {
    console.log(`  SKIP (no room labels found): ${basename(filePath)}`);
    return;
  }

  console.log(`  Found ${rooms.length} rooms, ${hatches.length} hatches`);

  // Build overlay group XML
  const overlays = [];
  const wrappedHatchIds = new Set();

  for (const room of rooms) {
    const hatch = findBestHatch(room, hatches, viewBox);

    if (hatch && !wrappedHatchIds.has(hatch.id)) {
      // Wrap existing HATCH in a room group by duplicating its shape as an overlay
      wrappedHatchIds.add(hatch.id);
      const { x, y, w, h } = hatch.bb;
      overlays.push(
        `    <g id="${room.id}" style="pointer-events:all">` +
        `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="rgba(0,0,0,0)" stroke="none"/>` +
        `</g>`
      );
      console.log(`    ✓ ${room.id} → matched HATCH ${hatch.id} (${Math.round(hatch.area)} sq)`);
    } else {
      // Create a fallback transparent rect overlay
      const size = defaultOverlaySize(room.id, viewBox);
      const rx = room.x - size.w * 0.3;
      const ry = room.y - size.h * 0.6;
      overlays.push(
        `    <g id="${room.id}" style="pointer-events:all">` +
        `<rect x="${rx.toFixed(2)}" y="${ry.toFixed(2)}" width="${size.w.toFixed(2)}" height="${size.h.toFixed(2)}" fill="rgba(0,0,0,0)" stroke="none"/>` +
        `</g>`
      );
      console.log(`    ○ ${room.id} → fallback overlay at (${Math.round(rx)}, ${Math.round(ry)}) ${Math.round(size.w)}x${Math.round(size.h)}`);
    }
  }

  // Insert overlays before the closing </svg>
  const overlayBlock = `\n  <!-- Room overlay groups for HomeMapController -->\n  <g id="ROOM-OVERLAYS" style="pointer-events:none">\n${overlays.join('\n')}\n  </g>\n`;
  const modified = svg.replace(/<\/svg>\s*$/, overlayBlock + '</svg>\n');

  writeFileSync(filePath, modified, 'utf8');
  console.log(`  ✓ Wrote ${overlays.length} room groups`);
}

// ── Run ─────────────────────────────────────────────────────────────────────

console.log('Adding room overlay groups to floor-plan SVGs...\n');

for (const file of SVG_FILES) {
  console.log(`Processing: ${basename(file)}`);
  processFile(file);
  console.log('');
}

console.log('Done!');
