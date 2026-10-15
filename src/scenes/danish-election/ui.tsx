import React from "react";
import { theme } from "../../theme";
import { DENMARK as MAP } from "../../components/denmark";
import { CARD_SHADOW, PALETTE as C, DK } from "./constants";

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
      background: ok ? C.ink : DK.red,
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
 * Denmark (Natural Earth outline, see src/components/denmark.ts) filled with the Dannebrog: red with
 * the white Nordic cross, Copenhagen marked.
 */
export const DenmarkFlagMap: React.FC<{ width: number; id: string; stroke?: number; capital?: boolean }> = ({ width, id, stroke = 6, capital = true }) => {
  const height = (width * MAP.height) / MAP.width;
  const k = MAP.width / width;
  // The cross runs through Jutland/Funen: upright at ~40% of the width, bar at ~55% of the height.
  const bar = MAP.height * 0.11;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={MAP.d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width={MAP.width} height={MAP.height} fill={C.flag[0]} />
        <rect x={MAP.width * 0.36} width={bar} height={MAP.height} fill={C.flag[1]} />
        <rect y={MAP.height * 0.55} width={MAP.width} height={bar} fill={C.flag[1]} />
      </g>
      <path d={MAP.d} fill="none" stroke={C.ink} strokeWidth={stroke * k} strokeLinejoin="round" />
      {capital ? <circle cx={MAP.copenhagen[0]} cy={MAP.copenhagen[1]} r={10 * k} fill={C.ink} stroke={C.white} strokeWidth={5 * k} /> : null}
    </svg>
  );
};

const ICON_STROKE = { stroke: C.ink, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** An ID card with a red band. */
export const IdCardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={6} y={14} width={48} height={34} rx={5} fill={C.card} />
      <path d="M6 21 H54" stroke={DK.red} strokeWidth={4} />
      <circle cx={19} cy={34} r={5} fill={C.muted} strokeWidth={0} />
      <path d="M11 46 C11 40 27 40 27 46" fill={C.muted} strokeWidth={0} />
      <path d="M34 32 H47 M34 39 H44" strokeWidth={3} />
    </g>
  </svg>
);

/** A house with a ballot going into a slot (voting at home). */
export const HomeVoteIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <path d="M8 28 L30 10 L52 28" fill="none" />
      <path d="M14 24 V52 H46 V24" fill={C.card} />
      <rect x={21} y={34} width={18} height={18} rx={2} fill={C.paperDeep} />
      <path d="M25 34 L27 24 H35 L37 34" fill={C.card} strokeWidth={3} />
      <path d="M29 28 L31 31 L34 26" stroke={DK.red} strokeWidth={2.5} fill="none" />
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
      <rect x={30} y={34} width={26} height={18} rx={3} fill={DK.redSoft} />
      <path d="M30 36 L43 45 L56 36" fill="none" />
    </g>
  </svg>
);

/** A calendar page with a number on it. */
export const CalendarIcon: React.FC<{ size: number; label: string }> = ({ size, label }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={8} y={12} width={44} height={40} rx={6} fill={C.card} />
      <path d="M8 24 H52" />
      <rect x={8} y={12} width={44} height={12} rx={6} fill={DK.red} strokeWidth={0} />
      <path d="M20 6 V16 M40 6 V16" />
    </g>
    <text x={30} y={46} textAnchor="middle" fontSize={20} fontWeight={900} fontFamily="sans-serif" fill={C.ink}>
      {label}
    </text>
  </svg>
);

/** The government: a cabinet table seen from above, with chairs. */
export const CabinetIcon: React.FC<{ size: number; chairs?: string }> = ({ size, chairs = C.muted }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g stroke={C.ink} strokeWidth={3}>
      {[
        [30, 9],
        [30, 51],
        [12, 22],
        [12, 38],
        [48, 22],
        [48, 38],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={5.5} fill={chairs} />
      ))}
      <rect x={19} y={16} width={22} height={28} rx={8} fill={C.card} />
    </g>
  </svg>
);
