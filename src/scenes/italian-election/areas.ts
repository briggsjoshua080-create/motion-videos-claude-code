import { ITALY as MAP } from "../../components/italy";
import { AREA_SEATS } from "./constants";

/**
 * The 147 voting areas of the Chamber (single-member constituencies, 2022) as dots on the Italy map,
 * in map units (viewBox 0 0 MAP.width 1000). Areas have roughly equal numbers of people, so Sicily and
 * Sardinia get their approximate share (12 and 4: 3/8 of their seats) and the mainland the rest,
 * spread evenly over the land. A stylised picture, not the real boundaries.
 */
const SICILY = 12;
const SARDINIA = 4;

type Pt = [number, number];
export type AreaDot = { x: number; y: number };

/** "M1 2 L3 4 ... Z M..." -> rings of points (the outline paths only use M, L and Z). */
const rings = (d: string): Pt[][] =>
  d
    .split("M")
    .filter((part) => part.trim())
    .map((part) =>
      part
        .replace("Z", "")
        .split("L")
        .map((xy) => xy.trim().split(/\s+/).map(Number) as Pt),
    );

const area = (r: Pt[]) => Math.abs(r.reduce((sum, [x, y], i) => sum + x * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * y, 0)) / 2;
const centreY = (r: Pt[]) => r.reduce((sum, p) => sum + p[1], 0) / r.length;

/** Even-odd point-in-polygon over the rings. */
const inside = (x: number, y: number, rs: Pt[][]) => {
  let hit = false;
  for (const r of rs) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i];
      const [xj, yj] = r[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
};

/** Centres of a hexagonal grid with spacing `s` that fall on land. */
const hexGrid = (rs: Pt[][], s: number): Pt[] => {
  const xs = rs.flat().map((p) => p[0]);
  const ys = rs.flat().map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pts: Pt[] = [];
  const dy = (s * Math.sqrt(3)) / 2;
  for (let row = 0, y = y0 + dy / 2; y < y1; row++, y += dy) {
    for (let x = x0 + (row % 2 ? s / 2 : 0) + s / 4; x < x1; x += s) {
      if (inside(x, y, rs)) pts.push([x, y]);
    }
  }
  return pts;
};

/** Exactly `n` evenly spread points: the widest grid with at least n points, thinned evenly. */
const spread = (rs: Pt[][], n: number): Pt[] => {
  let lo = 1;
  let hi = 200;
  for (let k = 0; k < 18; k++) {
    const mid = (lo + hi) / 2;
    if (hexGrid(rs, mid).length >= n) lo = mid;
    else hi = mid;
  }
  const pts = hexGrid(rs, lo);
  const extra = pts.length - n;
  return pts.filter((_, i) => extra <= 0 || Math.floor(((i + 1) * extra) / pts.length) === Math.floor((i * extra) / pts.length));
};

// The three big parts: the mainland is the largest ring; of the next two, Sicily lies further south.
const parts = rings(MAP.d).sort((a, b) => area(b) - area(a));
const [mainland, islandA, islandB] = parts;
const [sicily, sardinia] = centreY(islandA) > centreY(islandB) ? [islandA, islandB] : [islandB, islandA];

/** Dots sorted north to south, so they can sweep in down the map. */
export const AREA_DOTS: AreaDot[] = [
  ...spread([mainland], AREA_SEATS - SICILY - SARDINIA),
  ...spread([sicily], SICILY),
  ...spread([sardinia], SARDINIA),
]
  .map(([x, y]) => ({ x, y }))
  .sort((a, b) => a.y - b.y || a.x - b.x);
