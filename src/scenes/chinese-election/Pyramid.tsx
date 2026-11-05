import React from "react";
import { CN, DIRECT_TIERS, TIERS } from "./constants";
import { Star } from "./ui";

export type PyramidLayout = { cx: number; base: number; baseW: number; topW: number; tierH: number; gap: number };

/** Geometry of tier i (0 = township at the bottom, 4 = the National People's Congress at the top). */
export const tierBox = (L: PyramidLayout, i: number) => {
  const step = (L.baseW - L.topW) / TIERS;
  const bottom = L.base - i * (L.tierH + L.gap);
  const top = bottom - L.tierH;
  const wBottom = L.baseW - i * step;
  const wTop = wBottom - step * (L.tierH / (L.tierH + L.gap));
  return { top, bottom, wTop, wBottom };
};

/** Where the floating star sits: above the tip, with a clear gap (so it reads as separate). */
export const starCentre = (L: PyramidLayout) => {
  const tip = tierBox(L, TIERS - 1).top;
  return { x: L.cx, y: tip - L.tierH * 1.25 - 26 };
};

/**
 * The ladder of people's congresses as a five-tier pyramid. The two bottom tiers (township and
 * county, which voters elect directly) are solid yellow; the three upper tiers (city, province,
 * nation, each elected by the tier below) are hollow outlines. `build(i)` gives each tier's
 * appearance (0..1, default all in), `lit(i)` fills a hollow tier, and a small star floats above
 * the tip (the Communist Party, the rewatch detail) with `star` as its visibility and `glow` lighting it up.
 */
export const Pyramid: React.FC<{
  layout: PyramidLayout;
  build?: (i: number) => number;
  lit?: (i: number) => number;
  star?: number;
  glow?: number;
  starSize?: number;
}> = ({ layout: L, build = () => 1, lit = () => 0, star = 1, glow = 0, starSize = 64 }) => {
  const s = starCentre(L);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: TIERS }, (_, i) => {
          const b = Math.min(1, Math.max(0, build(i)));
          if (b <= 0) return null;
          const { top, bottom, wTop, wBottom } = tierBox(L, i);
          const dy = (1 - b) * 30;
          const pts = `${L.cx - wBottom / 2},${bottom + dy} ${L.cx + wBottom / 2},${bottom + dy} ${L.cx + wTop / 2},${top + dy} ${L.cx - wTop / 2},${top + dy}`;
          const solid = i < DIRECT_TIERS;
          const fill = solid ? CN.yellow : `rgba(255,222,0,${0.9 * Math.min(1, Math.max(0, lit(i)))})`;
          return (
            <polygon
              key={i}
              points={pts}
              fill={fill}
              stroke={solid ? CN.yellow : CN.white}
              strokeWidth={solid ? 0 : Math.max(3, L.tierH * 0.08)}
              strokeLinejoin="round"
              strokeDasharray={solid ? undefined : `${L.tierH * 0.32} ${L.tierH * 0.2}`}
              opacity={b}
              style={{ filter: solid ? "drop-shadow(0 0 18px rgba(255,222,0,0.35))" : undefined }}
            />
          );
        })}
      </svg>
      {star > 0 && (
        <Star
          size={starSize}
          glow={glow}
          style={{
            position: "absolute",
            left: s.x - starSize / 2,
            top: s.y - starSize / 2,
            opacity: Math.min(1, star),
            transform: `scale(${0.5 + 0.5 * Math.min(1, star)})`,
          }}
        />
      )}
    </>
  );
};
