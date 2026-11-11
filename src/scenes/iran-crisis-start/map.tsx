import React from "react";
import { REGION } from "../../components/iran";
import { IR } from "./constants";

export type VB = readonly [number, number, number, number];

/** Longitude/latitude -> map units of src/components/iran.ts (equirectangular, checked against the named points). */
export const geo = (lon: number, lat: number): readonly [number, number] => [(lon - 34.16) * 28.1, 231.4 + (35.69 - lat) * 32.6];

/** The hook's map: Iran and the Gulf, below the text block (no subtitles on the hook, so it may run low). */
export const HOOK_VIEW = { top: 880, height: 600, vb: [200, 70, 900, 500] as VB };
/** The standard map band under a two-line headline (above the subtitles at y 1270). */
export const MAP_VIEW = { top: 720, height: 460, vb: [180, 125, 1040, 443] as VB };

/** Illustrative points inside Iran (large cities), used for impacts and protest dots. Not a list of real targets. */
export const IRAN_SITES: (readonly [number, number])[] = [
  geo(51.4, 35.7), // Tehran
  geo(51.7, 32.65), // Isfahan
  geo(46.3, 38.1), // Tabriz
  geo(52.5, 29.6), // Shiraz
  geo(47.1, 34.3), // Kermanshah
  geo(59.6, 36.3), // Mashhad
  geo(56.3, 27.2), // Bandar Abbas
  geo(48.7, 31.3), // Ahvaz
  geo(50.9, 34.6), // Qom
  geo(51.9, 33.7), // Natanz
  geo(50.8, 28.9), // Bushehr
  geo(60.9, 29.5), // Zahedan
  geo(57.1, 30.3), // Kerman
  geo(48.5, 34.8), // Hamadan
  geo(49.6, 37.3), // Rasht
  geo(54.4, 31.9), // Yazd
  geo(47.0, 35.3), // Sanandaj
  geo(48.5, 36.7), // Zanjan
  geo(49.7, 34.1), // Arak
  geo(59.2, 32.9), // Birjand
  geo(54.4, 36.8), // Gorgan
  geo(45.1, 37.55), // Urmia
  geo(46.4, 33.6), // Ilam
  geo(57.3, 37.5), // Bojnord
];

/** A quadratic arc from a to b that bulges `lift` map units upwards. */
export const arcPoint = (a: readonly [number, number], b: readonly [number, number], lift: number, t: number): [number, number] => {
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2 - lift;
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]];
};

/** Countries of the region; Iran is highlighted. `tone` "flash" draws them in translucent navy for the amber re-hook scenes. */
export const RegionMap: React.FC<{
  top: number;
  height: number;
  vb: VB;
  tone?: "sea" | "flash";
  /** Names of countries to draw brighter than the rest (besides Iran). */
  lit?: string[];
  iranFill?: string;
  opacity?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ top, height, vb, tone = "sea", lit = [], iranFill, opacity = 1, style, children }) => (
  <svg width={1080} height={height} viewBox={vb.join(" ")} style={{ position: "absolute", left: 0, top, opacity, overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)", ...style }}>
    {REGION.countries.map((c) => {
      const isIran = c.name === "Iran";
      const isLit = lit.includes(c.name);
      const fill =
        tone === "flash"
          ? isIran || isLit
            ? "rgba(11,16,48,0.55)"
            : "rgba(11,16,48,0.16)"
          : isIran
            ? (iranFill ?? IR.iran)
            : isLit
              ? "#4A55B8"
              : IR.land;
      return <path key={c.name} d={c.d} fill={fill} stroke={tone === "flash" ? "rgba(11,16,48,0.5)" : IR.landEdge} strokeWidth={1.4} strokeLinejoin="round" />;
    })}
    {children}
  </svg>
);

/** A missile or drone path: draws from a to b as `p` goes 0 -> 1, with a bright head. */
export const Arc: React.FC<{
  a: readonly [number, number];
  b: readonly [number, number];
  lift?: number;
  p: number;
  color?: string;
  width?: number;
  head?: number;
}> = ({ a, b, lift = 60, p, color = IR.strike, width = 4, head = 7 }) => {
  if (p <= 0) return null;
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2 - lift;
  const pos = arcPoint(a, b, lift, Math.min(1, p));
  return (
    <g>
      <path d={`M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p)} opacity={0.85} />
      {p < 1 && <circle cx={pos[0]} cy={pos[1]} r={head} fill="#FFFFFF" />}
    </g>
  );
};

/** An impact: a solid dot with a ring that expands and fades as `p` goes 0 -> 1 (the dot stays). */
export const Impact: React.FC<{ at: readonly [number, number]; p: number; color?: string; r?: number }> = ({ at, p, color = IR.strike, r = 9 }) => {
  if (p <= 0) return null;
  const ring = Math.min(1, p);
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={r * (0.6 + 0.4 * Math.min(1, p * 3))} fill={color} />
      <circle cx={at[0]} cy={at[1]} r={r + ring * r * 4} fill="none" stroke={color} strokeWidth={3} opacity={1 - ring} />
    </g>
  );
};
