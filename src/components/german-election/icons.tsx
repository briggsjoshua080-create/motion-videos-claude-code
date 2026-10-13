import React from "react";
import { COLORS } from "../../compositions/german-election/constants";

type BustProps = {
  size: number;
  /** Background disc colour. */
  bg: string;
  suit: string;
  tie?: string;
  hair: string;
  hairStyle?: "short" | "receding";
  /** Rosette pinned to the lapel (election candidate). */
  rosette?: boolean;
  glasses?: boolean;
  id: string;
};

/** Flat, friendly character bust used for the candidate, the Chancellor and the President. */
export const PersonBust: React.FC<BustProps> = ({
  size,
  bg,
  suit,
  tie = COLORS.red,
  hair,
  hairStyle = "short",
  rosette = false,
  glasses = false,
  id,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
    <defs>
      <clipPath id={`${id}-disc`}>
        <circle cx={100} cy={100} r={100} />
      </clipPath>
    </defs>
    <circle cx={100} cy={100} r={100} fill={bg} />
    <g clipPath={`url(#${id}-disc)`}>
      <rect x={87} y={104} width={26} height={34} rx={10} fill={COLORS.skinShade} />
      <path d="M22 210 C22 156 56 130 100 130 C144 130 178 156 178 210 Z" fill={suit} />
      <path d="M82 131 L100 166 L118 131 Z" fill={COLORS.white} />
      <path d="M96 138 L104 138 L108 172 L100 184 L92 172 Z" fill={tie} />
      <path d="M82 131 L72 210 L100 166 Z" fill="rgba(0,0,0,0.18)" />
      <path d="M118 131 L128 210 L100 166 Z" fill="rgba(0,0,0,0.1)" />
      {rosette ? (
        <g transform="translate(140 166)">
          <circle r={13} fill={COLORS.gold} />
          <circle r={6} fill={COLORS.red} />
          <path d="M-6 10 L-10 30 L-2 25 L2 30 L6 10 Z" fill={COLORS.red} />
        </g>
      ) : null}
    </g>
    <circle cx={65} cy={84} r={8} fill={COLORS.skin} />
    <circle cx={135} cy={84} r={8} fill={COLORS.skin} />
    <ellipse cx={100} cy={80} rx={35} ry={41} fill={COLORS.skin} />
    {hairStyle === "short" ? (
      <path d="M64 80 C60 48 78 36 100 36 C124 36 142 50 136 80 C132 64 120 56 100 56 C80 56 68 64 64 80 Z" fill={hair} />
    ) : (
      <path d="M64 84 C62 64 66 50 74 46 C70 60 72 70 76 78 Z M136 84 C138 64 134 50 126 46 C130 60 128 70 124 78 Z" fill={hair} />
    )}
    <circle cx={87} cy={84} r={3.6} fill={COLORS.ink} />
    <circle cx={113} cy={84} r={3.6} fill={COLORS.ink} />
    <path d="M90 104 Q100 109 110 104" stroke={COLORS.skinShade} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    {glasses ? (
      <g stroke={COLORS.ink} strokeWidth={3} fill="none">
        <rect x={74} y={76} width={22} height={16} rx={6} />
        <rect x={104} y={76} width={22} height={16} rx={6} />
        <path d="M96 83 L104 83" />
      </g>
    ) : null}
  </svg>
);

/** The Reichstag building (seat of the Bundestag) with its glass dome. */
export const ReichstagIcon: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={(width * 150) / 240} viewBox="0 0 240 150" style={{ display: "block" }}>
    <g stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <line x1={120} y1={6} x2={120} y2={26} />
      <path d="M78 64 A42 40 0 0 1 162 64 Z" fill={COLORS.gold} />
      <path d="M99 64 Q104 36 120 24 Q136 36 141 64" fill="none" strokeWidth={3} />
      <rect x={16} y={64} width={208} height={76} rx={4} fill={COLORS.card} />
      <rect x={10} y={52} width={40} height={88} rx={4} fill={COLORS.card} />
      <rect x={190} y={52} width={40} height={88} rx={4} fill={COLORS.card} />
      <path d="M76 84 L120 64 L164 84 Z" fill={COLORS.card} />
      <line x1={88} y1={90} x2={88} y2={132} />
      <line x1={109} y1={90} x2={109} y2={132} />
      <line x1={131} y1={90} x2={131} y2={132} />
      <line x1={152} y1={90} x2={152} y2={132} />
    </g>
    <rect x={122} y={6} width={22} height={5} fill={COLORS.black} />
    <rect x={122} y={11} width={22} height={5} fill={COLORS.red} />
    <rect x={122} y={16} width={22} height={5} fill={COLORS.gold} />
  </svg>
);

/** Tiny flag chip for headers. */
export const FlagChip: React.FC<{ width: number }> = ({ width }) => (
  <div
    style={{
      width,
      height: width * 0.6,
      borderRadius: 5,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
    }}
  >
    <div style={{ flex: 1, background: COLORS.black }} />
    <div style={{ flex: 1, background: COLORS.red }} />
    <div style={{ flex: 1, background: COLORS.gold }} />
  </div>
);

/** A hand-drawn style cross that draws itself as `p` goes 0 -> 1. */
export const DrawnCross: React.FC<{ size: number; p: number; color?: string }> = ({
  size,
  p,
  color = COLORS.ink,
}) => {
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M9 8 L31 32"
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 2"
        strokeDashoffset={1 - a}
        fill="none"
        opacity={a > 0.001 ? 1 : 0}
      />
      <path
        d="M31 9 L9 31"
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 2"
        strokeDashoffset={1 - b}
        fill="none"
        opacity={b > 0 ? 1 : 0}
      />
    </svg>
  );
};

/** Curved arrow drawn from (x1,y1) to (x2,y2) in the parent SVG's coordinates. */
export const DrawnArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  p: number;
  color?: string;
  width?: number;
}> = ({ x1, y1, x2, y2, bend = 0, p, color = COLORS.ink, width = 5 }) => {
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - my, x2 - mx);
  const head = 16;
  const tip = `M${x2 - head * Math.cos(angle - 0.5)} ${y2 - head * Math.sin(angle - 0.5)} L${x2} ${y2} L${
    x2 - head * Math.cos(angle + 0.5)
  } ${y2 - head * Math.sin(angle + 0.5)}`;
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <path
        d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        pathLength={1}
        strokeDasharray="1 2"
        strokeDashoffset={1 - p}
        opacity={p > 0.001 ? 1 : 0}
      />
      <path d={tip} opacity={p > 0.92 ? 1 : 0} />
    </g>
  );
};
