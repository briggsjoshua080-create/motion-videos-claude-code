import React from "react";
import { random } from "remotion";
import { CE } from "./constants";
import { STRAIT } from "./strait";
import { Swimmer } from "./ui";

/**
 * Two maps for the Ceuta video.
 * - `StraitMap`: the real outlines of Spain, Portugal, Morocco and Algeria (Natural Earth 1:10m, strait.ts),
 *   with Ceuta as a pulsing orange point; the camera zooms from Iberia onto it.
 * - `CeutaChart`: a schematic (not to scale) chart of Ceuta and its land border: the peninsula with
 *   Monte Hacho, the double fence from Benzú (north) to Tarajal (south), the breakwater where the fence
 *   ends in the sea, Fnideq's beach, swimmers going around the fence's end, and the 500 m floating
 *   barrier as a dotted orange line (the rewatch detail).
 */

/** The chart's own coordinates (north up): Ceuta runs east into the sea, Morocco fills the bottom left. */
export const CHART = { w: 1000, h: 700 } as const;
const BORDER: [number, number][] = [
  [300, 200],
  [328, 258],
  [362, 322],
  [408, 398],
  [440, 470],
];
/** Where the fence's breakwater ends in the sea (Tarajal), and the floating barrier beyond it. */
export const BREAKWATER: [number, number][] = [
  [440, 470],
  [482, 506],
];
export const BARRIER = { from: [486, 510] as const, to: [588, 566] as const, n: 9 };
/** The swimmers' route: from Fnideq's beach, around the breakwater's end, onto Tarajal beach. */
const ROUTE: [number, number][] = [
  [452, 612],
  [498, 566],
  [522, 520],
  [500, 470],
  [470, 440],
];

const CEUTA_D =
  "M300 200 C340 188 420 186 470 205 C520 222 575 245 615 275 L640 292 C662 284 690 284 705 290 C730 262 790 245 850 255 C905 265 935 300 925 335 C915 372 860 392 800 385 C755 380 725 365 705 348 C690 352 660 354 640 346 C600 362 545 395 500 428 C475 446 455 460 440 470 L408 398 L362 322 L328 258 Z";
const MOROCCO_D =
  "M-300 222 L120 214 C200 210 260 205 300 200 L328 258 L362 322 L408 398 L440 470 C437 520 430 580 420 640 L408 800 L-300 800 Z";

const pointAt = (route: [number, number][], t: number): [number, number] => {
  const seg = Math.min(route.length - 2, Math.floor(t * (route.length - 1)));
  const local = t * (route.length - 1) - seg;
  const [x0, y0] = route[seg];
  const [x1, y1] = route[seg + 1];
  return [x0 + (x1 - x0) * local, y0 + (y1 - y0) * local];
};

export type ChartProps = {
  /** "sea": on the blue backdrop (hook, barrier); "paper": the light nautical chart. */
  tone: "sea" | "paper";
  /** 0..1: how much of the fence is drawn (from Benzú down to the breakwater). */
  fence?: number;
  /** Glow on the fence's end in the sea (0..1). */
  endGlow?: number;
  /** Swimmers: their flow (in frames, drives the motion) and how many are in the water (0..1). */
  swimFrame?: number;
  swimAmount?: number;
  /** Swimmers that already arrived: a crowd on Tarajal beach (0..1). */
  crowd?: number;
  /** The floating barrier: opacity (0..1) and glow (0..1). */
  barrier?: number;
  barrierGlow?: number;
};

/** The chart drawn in its own coordinates; place it inside an <svg> with a viewBox or a transform. */
export const CeutaChart: React.FC<ChartProps> = ({ tone, fence = 1, endGlow = 0, swimFrame = 0, swimAmount = 0, crowd = 0, barrier = 1, barrierGlow = 0 }) => {
  const paper = tone === "paper";
  const morocco = paper ? CE.chartLand : CE.land;
  const ceuta = paper ? CE.chartSpain : CE.spain;
  const edge = paper ? "rgba(15,30,43,0.35)" : CE.landEdge;
  const fenceColor = paper ? CE.navy : CE.white;
  // The fence as a polyline, drawn in up to `fence` of its length (border + breakwater).
  const fencePts = [...BORDER, BREAKWATER[1]];
  const lengths = fencePts.slice(1).map(([x, y], i) => Math.hypot(x - fencePts[i][0], y - fencePts[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  const swimmers = 34;
  return (
    <g>
      {paper && <rect x={-300} y={-200} width={1600} height={1100} fill={CE.chartSea} />}
      {/* Depth contours in the sea (chart style). */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M-300 ${150 - i * 34} C100 ${140 - i * 34} 500 ${120 - i * 30} 1300 ${170 - i * 40} M${560 + i * 40} 900 C${560 + i * 40} 640 ${700 + i * 50} 480 1300 ${430 + i * 25}`}
          fill="none"
          stroke={paper ? "rgba(46,110,160,0.25)" : "rgba(255,255,255,0.08)"}
          strokeWidth={2}
          strokeDasharray="10 12"
        />
      ))}
      <path d={MOROCCO_D} fill={morocco} stroke={edge} strokeWidth={2} />
      <path d={CEUTA_D} fill={ceuta} stroke={edge} strokeWidth={2} />
      {/* Fnideq: a cluster of town blocks on Morocco's coast. */}
      {[
        [352, 560, 40, 26],
        [386, 572, 30, 34],
        [340, 598, 46, 28],
        [380, 616, 34, 26],
        [356, 636, 30, 22],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill={paper ? "rgba(15,30,43,0.28)" : "rgba(255,255,255,0.22)"} />
      ))}
      {/* Ceuta's town on the isthmus. */}
      {[
        [610, 300, 30, 22],
        [650, 310, 28, 24],
        [690, 318, 22, 20],
        [575, 318, 26, 20],
      ].map(([x, y, w, h], i) => (
        <rect key={`c${i}`} x={x} y={y} width={w} height={h} rx={4} fill={paper ? "rgba(15,30,43,0.18)" : "rgba(10,32,54,0.2)"} />
      ))}
      {/* The double fence and its breakwater, drawn in. */}
      {[-5, 5].map((off) => (
        <polyline
          key={off}
          points={fencePts.map(([x, y]) => `${x + off * 0.9},${y - off * 0.45}`).join(" ")}
          fill="none"
          stroke={fenceColor}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={`${total * fence} ${total}`}
        />
      ))}
      {fence >= 1 && (
        <polyline points={BREAKWATER.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={fenceColor} strokeWidth={16} strokeLinecap="round" opacity={0.85} />
      )}
      {endGlow > 0 && <circle cx={BREAKWATER[1][0]} cy={BREAKWATER[1][1]} r={20 + 26 * endGlow} fill="none" stroke={CE.orange} strokeWidth={6} opacity={endGlow} />}
      {/* The floating barrier: orange floats in a dotted line. */}
      {barrier > 0 &&
        Array.from({ length: BARRIER.n }, (_, i) => {
          const t = i / (BARRIER.n - 1);
          const x = BARRIER.from[0] + (BARRIER.to[0] - BARRIER.from[0]) * t;
          const y = BARRIER.from[1] + (BARRIER.to[1] - BARRIER.from[1]) * t;
          return (
            <g key={i} opacity={barrier}>
              {barrierGlow > 0 && <circle cx={x} cy={y} r={9 + 10 * barrierGlow} fill="rgba(255,106,19,0.35)" />}
              <circle cx={x} cy={y} r={6.5} fill={CE.orange} stroke={paper ? CE.navy : CE.white} strokeWidth={1.5} />
            </g>
          );
        })}
      {/* Swimmers in the water, each looping along the route with its own speed and offset. */}
      {swimAmount > 0 &&
        Array.from({ length: swimmers }, (_, i) => {
          if (i / swimmers > swimAmount) return null;
          const speed = 0.006 + random(`ce-sw-speed-${i}`) * 0.004;
          const t = (random(`ce-sw-start-${i}`) + swimFrame * speed) % 1;
          const [x, y] = pointAt(ROUTE, t);
          const dx = (random(`ce-sw-x-${i}`) - 0.5) * 70;
          const dy = (random(`ce-sw-y-${i}`) - 0.5) * 44;
          const fade = Math.min(1, t * 8, (1 - t) * 8);
          return (
            <g key={i} opacity={fade}>
              <Swimmer x={x + dx} y={y + dy} s={0.72} color={paper ? CE.navy : CE.white} phase={swimFrame * 0.5 + i} />
            </g>
          );
        })}
      {/* Arrivals gathering on Tarajal beach. */}
      {crowd > 0 &&
        Array.from({ length: 40 }, (_, i) => {
          if (i / 40 > crowd) return null;
          const x = 455 + random(`ce-cr-x-${i}`) * 90 - (random(`ce-cr-y-${i}`) * 20);
          const y = 418 + random(`ce-cr-y-${i}`) * 34 - (x - 455) * 0.55;
          return <circle key={i} cx={x} cy={y} r={5} fill={paper ? CE.orangeDeep : CE.orange} />;
        })}
    </g>
  );
};

/** The real map, zoomed by `k` around Ceuta, which sits at (cx, cy) on screen. */
export const StraitMap: React.FC<{ k: number; cx: number; cy: number; pulse: number; opacity?: number }> = ({ k, cx, cy, pulse, opacity = 1 }) => {
  const [px, py] = STRAIT.ceuta;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-px} ${-py})`}>
        {STRAIT.countries.map((c) => (
          <path
            key={c.name}
            d={c.d}
            fill={c.name === "Spain" ? "#4F8DBF" : "#24557E"}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.2 / k}
            strokeLinejoin="round"
          />
        ))}
      </g>
      {/* Ceuta: an orange point with a ring that pulses (constant size on screen). */}
      <circle cx={cx} cy={cy} r={16} fill={CE.orange} stroke={CE.white} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={22 + 40 * pulse} fill="none" stroke={CE.orange} strokeWidth={5} opacity={1 - pulse} />
    </svg>
  );
};

/**
 * The chart in a box on screen: `vb` is the part of the chart shown (x, y, w, h in chart units),
 * stretched over `width` px from `left`, starting at `top`; its top and bottom edges fade out.
 */
export const ChartView: React.FC<ChartProps & { top: number; left?: number; width?: number; vb: [number, number, number, number]; opacity?: number; style?: React.CSSProperties }> = ({
  top,
  left = 0,
  width = 1080,
  vb,
  opacity = 1,
  style,
  ...chart
}) => {
  const height = (width * vb[3]) / vb[2];
  const mask = "linear-gradient(to bottom, transparent 0%, black 10%, black 86%, transparent 100%)";
  return (
    <div style={{ position: "absolute", left, top, width, height, opacity, WebkitMaskImage: mask, maskImage: mask, ...style }}>
      <svg width={width} height={height} viewBox={vb.join(" ")} preserveAspectRatio="xMidYMid slice" style={{ overflow: "hidden" }}>
        <CeutaChart {...chart} />
      </svg>
    </div>
  );
};

/** The hook's view of the chart (the closing question puts YES/NO in the same place). */
export const HOOK_VIEW = { top: 890, vb: [170, 150, 820, 480] as [number, number, number, number] };
