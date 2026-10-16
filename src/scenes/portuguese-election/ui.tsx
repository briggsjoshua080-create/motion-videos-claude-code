import React from "react";
import { theme } from "../../theme";
import { PORTUGAL as MAP } from "../../components/portugal";
import { CARD_SHADOW, PALETTE as C, PT } from "./constants";

/** White card with soft shadow, absolutely positioned. */
export const Card: React.FC<{
  left?: number;
  top: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ left = 120, top, width = 840, height, style, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 28,
      background: C.card,
      boxShadow: CARD_SHADOW,
      fontFamily: theme.font,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small spaced-out capitals used as card titles. */
export const CardTitle: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.muted,
  style,
}) => <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color, whiteSpace: "nowrap", ...style }}>{children}</div>;

/** Rounded label. `p` is its pop-in progress (0 -> 1, may overshoot). */
export const Pill: React.FC<{
  p: number;
  bg?: string;
  color?: string;
  border?: string;
  size?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ p, bg = C.paperDeep, color = C.ink, border, size = 34, style, children }) => (
  <div
    style={{
      padding: `${Math.round(size * 0.36)}px ${Math.round(size * 0.8)}px`,
      borderRadius: 999,
      background: bg,
      border: border ? `2.5px solid ${border}` : undefined,
      color,
      fontFamily: theme.font,
      fontSize: size,
      fontWeight: 800,
      whiteSpace: "nowrap",
      opacity: Math.min(1, Math.max(0, p) * 1.4),
      transform: `scale(${0.6 + 0.4 * p})`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rounded icon tile used on fact rows. */
export const IconTile: React.FC<{ size: number; bg?: string; children: React.ReactNode }> = ({ size, bg = C.paperDeep, children }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontFamily: theme.font,
    }}
  >
    {children}
  </div>
);

/** Round tick (dark ink) or cross (flag red) badge. */
export const Badge: React.FC<{ size: number; ok: boolean; p: number; style?: React.CSSProperties }> = ({ size, ok, p, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: ok ? C.ink : PT.red,
      color: C.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.font,
      fontSize: size * 0.62,
      fontWeight: 900,
      boxShadow: "0 8px 20px rgba(20,32,43,0.2)",
      opacity: Math.min(1, Math.max(0, p) * 1.4),
      transform: `scale(${Math.max(0, p)})`,
      flexShrink: 0,
      ...style,
    }}
  >
    {ok ? "✓" : "✕"}
  </div>
);

/** The big red "?" bubble of the hook and the closing question. */
export const QuestionMark: React.FC<{ size: number; p: number; style?: React.CSSProperties }> = ({ size, p, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size / 2,
      background: C.alert,
      color: C.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.font,
      fontSize: size * 0.74,
      fontWeight: 800,
      boxShadow: "0 14px 34px rgba(20,32,43,0.25)",
      opacity: Math.min(1, Math.max(0, p) * 1.4),
      ...style,
    }}
  >
    ?
  </div>
);

/**
 * Mainland Portugal (Natural Earth outline, see src/components/portugal.ts) filled with the flag:
 * green (2/5) and red (3/5) side by side, with a gold disc for the armillary sphere. Lisbon marked.
 */
export const PortugalFlagMap: React.FC<{ height: number; id: string; stroke?: number; capital?: boolean; fill?: "flag" | "plain" }> = ({
  height,
  id,
  stroke = 6,
  capital = true,
  fill = "flag",
}) => {
  const width = (height * MAP.width) / MAP.height;
  const k = MAP.height / height;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={MAP.d} />
        </clipPath>
      </defs>
      {fill === "flag" ? (
        <g clipPath={`url(#${id}-clip)`}>
          <rect width={MAP.width} height={MAP.height} fill={PT.red} />
          <rect width={MAP.width * 0.4} height={MAP.height} fill={PT.green} />
          <circle cx={MAP.width * 0.4} cy={MAP.height * 0.47} r={MAP.width * 0.11} fill={PT.gold} stroke={C.white} strokeWidth={4 * k} />
        </g>
      ) : (
        <path d={MAP.d} fill={PT.greenSoft} />
      )}
      <path d={MAP.d} fill="none" stroke={C.ink} strokeWidth={stroke * k} strokeLinejoin="round" />
      {capital ? <circle cx={MAP.lisbon[0]} cy={MAP.lisbon[1]} r={10 * k} fill={C.ink} stroke={C.white} strokeWidth={5 * k} /> : null}
    </svg>
  );
};

const ICON_STROKE = { stroke: C.ink, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** An ID card with a green band. */
export const IdCardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={6} y={14} width={48} height={34} rx={5} fill={C.card} />
      <path d="M6 21 H54" stroke={PT.green} strokeWidth={4} />
      <circle cx={19} cy={34} r={5} fill={C.muted} strokeWidth={0} />
      <path d="M11 46 C11 40 27 40 27 46" fill={C.muted} strokeWidth={0} />
      <path d="M34 32 H47 M34 39 H44" strokeWidth={3} />
    </g>
  </svg>
);

/** A globe with a letter (voting from abroad). */
export const AbroadIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5} fill="none">
      <circle cx={26} cy={28} r={20} fill={C.card} />
      <ellipse cx={26} cy={28} rx={9} ry={20} />
      <path d="M6 28 H46 M10 18 H42 M10 38 H42" />
    </g>
    <g {...ICON_STROKE} strokeWidth={3}>
      <rect x={30} y={34} width={26} height={18} rx={3} fill={PT.greenSoft} />
      <path d="M30 36 L43 45 L56 36" fill="none" />
    </g>
  </svg>
);

/** A simple Brazil flag (green, yellow rhombus, blue disc). */
export const BrazilFlag: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={width * 0.7} viewBox="0 0 100 70" style={{ display: "block" }}>
    <rect width={100} height={70} rx={8} fill="#009C3B" />
    <path d="M50 8 L92 35 L50 62 L8 35 Z" fill="#FFDF00" />
    <circle cx={50} cy={35} r={15} fill="#002776" />
    <path d="M36 32 Q50 26 64 36" stroke={C.white} strokeWidth={3} fill="none" />
  </svg>
);
