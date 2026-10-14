import React from "react";
import { theme } from "../../theme";
import { ITALY as MAP } from "../../components/italy";
import { CARD_SHADOW, IT, PALETTE as C } from "./constants";

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

/** Round tick or cross badge. */
export const Badge: React.FC<{ size: number; ok: boolean; p: number; style?: React.CSSProperties }> = ({ size, ok, p, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: ok ? IT.green : IT.red,
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
      ...style,
    }}
  >
    {ok ? "✓" : "✕"}
  </div>
);

/** Map scale: px per map unit for a map drawn `height` px tall. */
export const mapScale = (height: number) => height / MAP.height;
export const mapWidth = (height: number) => MAP.width * mapScale(height);

/** Italy (Natural Earth outline, see src/components/italy.ts), with optional overlays in map units. */
export const ItalyMap: React.FC<{
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}> = ({ height, fill, stroke = C.white, strokeWidth = 3, children }) => (
  <svg width={mapWidth(height)} height={height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ display: "block", overflow: "visible" }}>
    <path d={MAP.d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    {children}
  </svg>
);

const ICON_STROKE = { stroke: C.ink, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** An Italian ID card (green band). */
export const IdCardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={6} y={14} width={48} height={34} rx={5} fill={C.card} />
      <path d="M6 22 H54" stroke={IT.green} strokeWidth={5} />
      <circle cx={19} cy={33} r={5} fill={C.muted} strokeWidth={0} />
      <path d="M11 45 C11 39 27 39 27 45" fill={C.muted} strokeWidth={0} />
      <path d="M34 31 H47 M34 38 H44" strokeWidth={3} />
    </g>
  </svg>
);

/** The voter card (tessera elettorale): a folded card with stamp boxes. */
export const VoterCardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={8} y={10} width={44} height={40} rx={5} fill={C.card} />
      <path d="M30 10 V50" strokeWidth={2.5} />
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => <rect key={`${row}-${col}`} x={34 + col * 8} y={17 + row * 10} width={6} height={7} rx={1.5} fill={row === 0 && col === 0 ? IT.green : C.paperDeep} strokeWidth={2} />),
      )}
      <path d="M13 20 H25 M13 27 H25 M13 34 H21" strokeWidth={3} />
    </g>
  </svg>
);

/** A globe with a letter (voting by post from abroad). */
export const AbroadIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5} fill="none">
      <circle cx={26} cy={28} r={20} fill={C.card} />
      <ellipse cx={26} cy={28} rx={9} ry={20} />
      <path d="M6 28 H46 M10 18 H42 M10 38 H42" />
    </g>
    <g {...ICON_STROKE} strokeWidth={3}>
      <rect x={30} y={34} width={26} height={18} rx={3} fill={IT.goldSoft} />
      <path d="M30 36 L43 45 L56 36" fill="none" />
    </g>
  </svg>
);

/** A calendar page. */
export const CalendarIcon: React.FC<{ size: number; label: string }> = ({ size, label }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={8} y={12} width={44} height={40} rx={6} fill={C.card} />
      <path d="M8 24 H52" />
      <rect x={8} y={12} width={44} height={12} rx={6} fill={IT.red} strokeWidth={0} />
      <path d="M20 6 V16 M40 6 V16" />
    </g>
    <text x={30} y={46} textAnchor="middle" fontSize={20} fontWeight={900} fontFamily="sans-serif" fill={C.ink}>
      {label}
    </text>
  </svg>
);

/** A mini half-circle of seats (icon size). */
export const SeatsIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    {[14, 21, 28].flatMap((r, row) => {
      const n = 5 + row * 2;
      return Array.from({ length: n }, (_, i) => {
        const a = Math.PI * (1 - i / (n - 1));
        return <circle key={`${row}-${i}`} cx={30 + r * Math.cos(a)} cy={46 - r * Math.sin(a)} r={2.8} fill={color} />;
      });
    })}
  </svg>
);

/** A plus badge (bonus seats). */
export const BonusIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <circle cx={30} cy={30} r={22} fill={IT.green} stroke={C.ink} strokeWidth={3.5} />
    <path d="M30 19 V41 M19 30 H41" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
  </svg>
);
