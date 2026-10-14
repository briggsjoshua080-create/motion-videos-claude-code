import { POLAND as MAP } from "../../components/poland";
import { SENATE_TOTAL } from "./constants";

/**
 * The 100 Senate districts as dots on the Poland map, in map units (viewBox 0 0 MAP.width 1000),
 * spread evenly over the land. Districts have roughly equal numbers of people, so this is a
 * stylised picture, not the real boundaries.
 */
type Pt = [number, number];
export type DistrictDot = { x: number; y: number };

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
  let hi = 400;
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2;
    if (hexGrid(rs, mid).length >= n) lo = mid;
    else hi = mid;
  }
  const pts = hexGrid(rs, lo);
  const extra = pts.length - n;
  return pts.filter((_, i) => extra <= 0 || Math.floor(((i + 1) * extra) / pts.length) === Math.floor((i * extra) / pts.length));
};

/** Dots sorted west to east, so they fill the Senate's half-circle from left to right. */
export const DISTRICT_DOTS: DistrictDot[] = spread(rings(MAP.d), SENATE_TOTAL)
  .map(([x, y]) => ({ x, y }))
  .sort((a, b) => a.x - b.x || a.y - b.y);
