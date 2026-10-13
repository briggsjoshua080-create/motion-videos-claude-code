import { UK as MAP } from "../../components/uk";

/**
 * The 650 voting areas (constituencies) as dots on the UK map, in map units (viewBox 0 0 MAP.width
 * 1000). Areas have roughly equal numbers of voters, so each nation gets its real number of seats
 * (2024 boundaries) spread evenly over its land: England is dense, Scotland sparse.
 */
export const SEATS_BY_NATION = { England: 543, Scotland: 57, Wales: 32, "Northern Ireland": 18 } as const;

type Pt = [number, number];
export type AreaDot = { x: number; y: number; nation: keyof typeof SEATS_BY_NATION };

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

/** Even-odd point-in-polygon over all rings. */
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
  let hi = 80;
  for (let k = 0; k < 16; k++) {
    const mid = (lo + hi) / 2;
    if (hexGrid(rs, mid).length >= n) lo = mid;
    else hi = mid;
  }
  const pts = hexGrid(rs, lo);
  const extra = pts.length - n;
  return pts.filter((_, i) => extra <= 0 || Math.floor(((i + 1) * extra) / pts.length) === Math.floor((i * extra) / pts.length));
};

/** Dots sorted north to south, so they can sweep in down the map. */
export const AREA_DOTS: AreaDot[] = MAP.regions
  .flatMap((region) => {
    const nation = region.name as AreaDot["nation"];
    return spread(rings(region.d), SEATS_BY_NATION[nation]).map(([x, y]) => ({ x, y, nation }));
  })
  .sort((a, b) => a.y - b.y || a.x - b.x);
