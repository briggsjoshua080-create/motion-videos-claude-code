import React from "react";
import type { ExplainerPalette } from "./palette";

type IconProps = { size: number; palette: ExplainerPalette };

/** SVG path of an upright five-pointed star centred on (cx, cy). */
export const starPath = (cx: number, cy: number, r: number, inner = 0.382) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * inner;
    return `${i === 0 ? "M" : "L"}${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  }).join(" ") + " Z";

/** The EU flag: 12 yellow stars on a circle of radius 1/3 of the height (Regulation 1049/2014). */
export const EuFlag: React.FC<{ width: number; blue: string; yellow: string }> = ({ width, blue, yellow }) => (
  <svg width={width} height={(width * 2) / 3} viewBox="0 0 150 100" style={{ display: "block" }}>
    <rect width={150} height={100} fill={blue} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return <path key={i} d={starPath(75 + (100 / 3) * Math.sin(a), 50 - (100 / 3) * Math.cos(a), 100 / 18)} fill={yellow} />;
    })}
  </svg>
);

/**
 * The Union flag at 3:5 (or any ratio): white and counterchanged red saltires, white-edged red cross.
 * Stripe widths follow the shorter side, so a tall box (e.g. to fill a map) still reads as the flag.
 * `x`/`y` place it inside a parent SVG; `id` keeps the clip paths of several flags apart.
 */
export const UnionFlag: React.FC<{
  width: number;
  height?: number;
  blue: string;
  red: string;
  white: string;
  id: string;
  x?: number;
  y?: number;
}> = ({ width, height = width * 0.6, blue, red, white, id, x, y }) => {
  // Units: the shorter side is 30, as in the flag's 30 x 60 construction sheet.
  const unit = Math.min(width, height) / 30;
  const w = width / unit;
  const h = height / unit;
  const cx = w / 2;
  const cy = h / 2;
  return (
    <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <clipPath id={`${id}-flag`}>
          <rect width={w} height={h} />
        </clipPath>
        <clipPath id={`${id}-saltire`}>
          <path d={`M${cx},${cy} h${cx} v${cy} z v${cy} h-${cx} z h-${cx} v-${cy} z v-${cy} h${cx} z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-flag)`}>
        <rect width={w} height={h} fill={blue} />
        <path d={`M0,0 L${w},${h} M${w},0 L0,${h}`} stroke={white} strokeWidth={6} />
        <path d={`M0,0 L${w},${h} M${w},0 L0,${h}`} clipPath={`url(#${id}-saltire)`} stroke={red} strokeWidth={4} />
        <path d={`M${cx},0 v${h} M0,${cy} h${w}`} stroke={white} strokeWidth={10} />
        <path d={`M${cx},0 v${h} M0,${cy} h${w}`} stroke={red} strokeWidth={6} />
      </g>
    </svg>
  );
};

/** Tiny flag for headers, with a hairline so white stripes stay visible on white. */
export const FlagChip: React.FC<{ width: number; palette: ExplainerPalette }> = ({ width, palette: c }) =>
  c.emblem === "eu" ? (
    <div style={{ borderRadius: 5, overflow: "hidden", boxShadow: `0 0 0 2px ${c.line}`, flexShrink: 0, lineHeight: 0 }}>
      <EuFlag width={width} blue={c.flag[0]} yellow={c.accent} />
    </div>
  ) : c.emblem === "uk" ? (
    <div style={{ borderRadius: 5, overflow: "hidden", boxShadow: `0 0 0 2px ${c.line}`, flexShrink: 0, lineHeight: 0 }}>
      <UnionFlag width={width} blue={c.flag[0]} white={c.flag[1]} red={c.flag[2]} id="flag-chip" />
    </div>
  ) : (
  <div
    style={{
      width,
      height: width * 0.6,
      borderRadius: 5,
      overflow: "hidden",
      display: "flex",
      flexDirection: c.flagVertical ? "row" : "column",
      boxShadow: `0 0 0 2px ${c.line}`,
      flexShrink: 0,
    }}
  >
    {c.flag.map((color, i) => (
      <div key={`${color}-${i}`} style={{ flex: 1, background: color }} />
    ))}
  </div>
  );

/** A path that draws itself as `p` goes 0 -> 1 (use inside an <svg>). */
export const DrawnPath: React.FC<{ d: string; p: number; color: string; width: number }> = ({ d, p, color, width }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="1 2"
    strokeDashoffset={1 - Math.min(1, Math.max(0, p))}
    opacity={p > 0.001 ? 1 : 0}
  />
);

/** A hand-drawn cross that draws itself as `p` goes 0 -> 1. */
export const DrawnCross: React.FC<{ size: number; p: number; color: string; stroke?: number }> = ({ size, p, color, stroke = 5.5 }) => {
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
      <DrawnPath d="M9 8 L31 32" p={a} color={color} width={stroke} />
      <DrawnPath d="M31 9 L9 31" p={b} color={color} width={stroke} />
    </svg>
  );
};

/** Curved arrow from (x1,y1) to (x2,y2) in the parent SVG's coordinates; draws itself with `p`. */
export const DrawnArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  p: number;
  color: string;
  width?: number;
}> = ({ x1, y1, x2, y2, bend = 0, p, color, width = 5 }) => {
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - my, x2 - mx);
  const head = 16;
  const tip = `M${x2 - head * Math.cos(angle - 0.5)} ${y2 - head * Math.sin(angle - 0.5)} L${x2} ${y2} L${
    x2 - head * Math.cos(angle + 0.5)
  } ${y2 - head * Math.sin(angle + 0.5)}`;
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <DrawnPath d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} p={p} color={color} width={width} />
      <path d={tip} opacity={p > 0.92 ? 1 : 0} />
    </g>
  );
};

/** Royal crown in the accent colour. */
export const CrownIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 120 94" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={4} strokeLinejoin="round">
      <path d="M12 70 L18 22 L40 48 L60 10 L80 48 L102 22 L108 70 Z" fill={c.accent} />
      <rect x={8} y={66} width={104} height={22} rx={7} fill={c.accent} />
      <circle cx={18} cy={20} r={7} fill={c.white} />
      <circle cx={60} cy={9} r={8} fill={c.white} />
      <circle cx={102} cy={20} r={7} fill={c.white} />
    </g>
    <circle cx={36} cy={77} r={5.5} fill={c.alert} />
    <circle cx={60} cy={77} r={6.5} fill={c.white} />
    <circle cx={84} cy={77} r={5.5} fill={c.alert} />
  </svg>
);

/** Ballot box with a paper going in. */
export const BallotBoxIcon: React.FC<IconProps & { mark?: string }> = ({ size, palette: c, mark }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={6} strokeLinejoin="round">
      <rect x={62} y={14} width={86} height={96} rx={8} fill={c.card} transform="rotate(8 105 62)" />
      <rect x={20} y={88} width={160} height={100} rx={18} fill={c.paperDeep} />
      <rect x={56} y={80} width={88} height={14} rx={7} fill={c.ink} />
    </g>
    <rect x={88} y={40} width={22} height={22} rx={5} fill={mark ?? c.alert} transform="rotate(8 105 62)" />
  </svg>
);

/**
 * The red pencil Dutch voters use (or any pencil: `lead` colours the tip). Tip at the SVG origin,
 * pointing down-left.
 */
export const RedPencil: React.FC<{ length: number; palette: ExplainerPalette; color: string; lead?: string }> = ({
  length,
  palette: c,
  color,
  lead = color,
}) => (
  <svg width={1} height={1} style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
    <g transform={`rotate(-38) scale(${length / 256})`}>
      <path d="M0 0 L40 -15 L40 15 Z" fill="#F2D2A9" stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M0 0 L14 -5 L14 5 Z" fill={lead} />
      <rect x={40} y={-15} width={190} height={30} rx={4} fill={color} stroke={c.ink} strokeWidth={3} />
      <rect x={230} y={-15} width={26} height={30} rx={5} fill={c.muted} stroke={c.ink} strokeWidth={3} />
    </g>
  </svg>
);

/** Classic parliament building with columns and a small flag. */
export const ParliamentIcon: React.FC<{ width: number; palette: ExplainerPalette }> = ({ width, palette: c }) => (
  <svg width={width} height={(width * 150) / 240} viewBox="0 0 240 150" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <line x1={120} y1={6} x2={120} y2={34} />
      <path d="M24 64 L120 30 L216 64 Z" fill={c.card} />
      <rect x={20} y={64} width={200} height={16} rx={3} fill={c.card} />
      {[44, 82, 120, 158, 196].map((x) => (
        <line key={x} x1={x} y1={86} x2={x} y2={128} />
      ))}
      <rect x={12} y={128} width={216} height={16} rx={3} fill={c.card} />
    </g>
    {c.emblem === "eu" ? (
      <g>
        <rect x={123} y={6} width={27} height={18} fill={c.flag[0]} />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={136.5 + 6 * Math.sin((i * Math.PI) / 6)} cy={15 - 6 * Math.cos((i * Math.PI) / 6)} r={1.1} fill={c.accent} />
        ))}
      </g>
    ) : c.emblem === "uk" ? (
      <UnionFlag x={123} y={6} width={30} height={18} blue={c.flag[0]} white={c.flag[1]} red={c.flag[2]} id="parliament-flag" />
    ) : (
      c.flag.map((color, i) => <rect key={`${color}-${i}`} x={123} y={6 + i * 6} width={26} height={6} fill={color} />)
    )}
  </svg>
);

/** A law: paper with text lines and a seal. */
export const LawIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
      <path d="M24 8 H64 L80 24 V92 H24 Z" fill={c.card} />
      <path d="M64 8 V24 H80" fill="none" />
      <line x1={34} y1={36} x2={70} y2={36} />
      <line x1={34} y1={48} x2={70} y2={48} />
      <line x1={34} y1={60} x2={58} y2={60} />
    </g>
    <circle cx={64} cy={76} r={10} fill={c.alert} />
  </svg>
);

/** Budget: a stack of coins with a euro sign. */
export const BudgetIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={4}>
      {[74, 62, 50].map((y) => (
        <ellipse key={y} cx={40} cy={y} rx={26} ry={9} fill={c.accent} />
      ))}
      <circle cx={68} cy={46} r={22} fill={c.accent} />
    </g>
    <text x={68} y={55} textAnchor="middle" fontSize={26} fontWeight={900} fontFamily="sans-serif" fill={c.ink}>
      €
    </text>
  </svg>
);

/** Checking: a magnifying glass. */
export const MagnifierIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={6} strokeLinecap="round">
      <circle cx={42} cy={42} r={24} fill={c.paperDeep} />
      <line x1={60} y1={60} x2={84} y2={84} strokeWidth={10} />
    </g>
    <path d="M30 36 Q36 28 46 28" stroke={c.white} strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);

/** "Vote it out": an open door with an arrow leaving. */
export const VoteOutIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
      <rect x={14} y={12} width={44} height={78} rx={4} fill={c.paperDeep} />
      <path d="M14 12 L40 20 V96 L14 90 Z" fill={c.card} />
      <path d="M52 52 H88 M76 40 L88 52 L76 64" fill="none" stroke={c.alert} strokeWidth={7} />
    </g>
  </svg>
);

/** A provincial council hall. */
export const CouncilIcon: React.FC<IconProps> = ({ size, palette: c }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <g stroke={c.ink} strokeWidth={3} strokeLinejoin="round">
      <path d="M32 6 L58 22 L6 22 Z" fill={c.card} />
      {[12, 24, 36, 48].map((x) => (
        <rect key={x} x={x} y={25} width={5} height={22} rx={1.5} fill={c.card} />
      ))}
      <rect x={4} y={48} width={56} height={8} rx={2} fill={c.card} />
    </g>
  </svg>
);
