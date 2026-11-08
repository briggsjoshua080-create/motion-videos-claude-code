import React from "react";
import { CE } from "./constants";

/**
 * The three problems that came together (the user's request: "show how geographic, politics and social
 * problems came together"): three overlapping circles, Geography (sea blue, a wave), Politics (yellow, a
 * judge's gavel) and Social (red, a shop with its shutter down). Each fills when its beat is spoken; where
 * all three overlap, a spark ignites (the rumour that set it off). No text inside (rule 6): the headline
 * above names the circle being filled.
 */
export const CIRCLES = [
  { cx: 392, cy: 760, color: CE.geo },
  { cx: 688, cy: 760, color: CE.politics },
  { cx: 540, cy: 1016, color: CE.social },
] as const;
export const R = 212;
/** Where all three circles overlap. */
export const CENTRE = { x: 540, y: 846 } as const;

const Wave: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={CE.white} strokeWidth={9} strokeLinecap="round">
    <path d="M-50 -14 C-38 -28 -26 -28 -14 -14 C-2 0 10 0 22 -14 C34 -28 46 -28 50 -20" />
    <path d="M-50 16 C-38 2 -26 2 -14 16 C-2 30 10 30 22 16 C34 2 46 2 50 10" />
  </g>
);

const Gavel: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={CE.white}>
    <g transform="rotate(-40)">
      <rect x={-34} y={-46} width={68} height={34} rx={8} />
      <rect x={-7} y={-14} width={14} height={66} rx={6} />
    </g>
    <rect x={-48} y={40} width={70} height={14} rx={6} />
  </g>
);

const Shop: React.FC<{ x: number; y: number; s: number; shutter: number }> = ({ x, y, s, shutter }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-52 -30 L-44 -52 L44 -52 L52 -30 Z" fill={CE.white} />
    <rect x={-46} y={-30} width={92} height={74} fill="none" stroke={CE.white} strokeWidth={7} />
    {/* The shutter rolls down as `shutter` goes 0 -> 1. */}
    <clipPath id="ce-shop-clip">
      <rect x={-42} y={-26} width={84} height={66 * shutter} />
    </clipPath>
    <g clipPath="url(#ce-shop-clip)">
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={-42} y={-26 + i * 10} width={84} height={7} fill={CE.white} />
      ))}
    </g>
  </g>
);

export const Problems: React.FC<{
  /** Fill of each circle (0..1). */
  fill: [number, number, number];
  /** Outline appearance of each circle (0..1, may overshoot: pop). */
  show: [number, number, number];
  /** Which circle is being talked about (gets a bright rim), or -1. */
  active?: number;
  /** The shop's shutter (0 open .. 1 down). */
  shutter?: number;
  /** The spark where all three overlap (0..1). */
  spark?: number;
  opacity?: number;
}> = ({ fill, show, active = -1, shutter = 0, spark = 0, opacity = 1 }) => {
  const icons = [
    <Wave key="w" x={CIRCLES[0].cx - 70} y={CIRCLES[0].cy - 60} s={1.25} />,
    <Gavel key="g" x={CIRCLES[1].cx + 70} y={CIRCLES[1].cy - 60} s={1.25} />,
    <Shop key="s" x={CIRCLES[2].cx} y={CIRCLES[2].cy + 90} s={1.25} shutter={shutter} />,
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, overflow: "visible" }}>
      {CIRCLES.map((c, i) => {
        const s = Math.max(0, show[i]);
        return (
          <g key={i} transform={`translate(${c.cx} ${c.cy}) scale(${0.6 + 0.4 * Math.min(1.08, s)}) translate(${-c.cx} ${-c.cy})`} opacity={Math.min(1, s * 1.6)}>
            <circle cx={c.cx} cy={c.cy} r={R} fill={c.color} opacity={0.62 * fill[i]} style={{ mixBlendMode: "screen" }} />
            <circle cx={c.cx} cy={c.cy} r={R} fill="none" stroke={i === active ? c.color : CE.white} strokeWidth={i === active ? 10 : 5} opacity={i === active ? 1 : 0.85} />
            <g opacity={0.55 + 0.45 * fill[i]}>{icons[i]}</g>
          </g>
        );
      })}
      {spark > 0 && (
        <g transform={`translate(${CENTRE.x} ${CENTRE.y})`}>
          <circle r={30 + 120 * spark} fill="none" stroke={CE.orange} strokeWidth={8} opacity={Math.max(0, 1 - spark)} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r0 = 26 + 30 * spark;
            const r1 = r0 + 40 * Math.min(1, spark * 2);
            return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={CE.orange} strokeWidth={7} strokeLinecap="round" opacity={Math.min(1, spark * 3)} />;
          })}
          <circle r={24 * Math.min(1, spark * 3)} fill={CE.orange} stroke={CE.white} strokeWidth={5} />
        </g>
      )}
    </svg>
  );
};
