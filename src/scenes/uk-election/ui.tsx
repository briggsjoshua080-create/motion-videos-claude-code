import React from "react";
import { theme } from "../../theme";
import { UK as MAP } from "../../components/uk";
import { CARD_SHADOW, PALETTE as C, UK } from "./constants";

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

/** Rounded icon tile used on job cards and fact rows. */
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

/** Map scale: px per map unit for a map drawn `height` px tall. */
export const mapScale = (height: number) => height / MAP.height;

/** The UK with its four nations (Natural Earth outline, see src/components/uk.ts). */
export const UkMap: React.FC<{
  height: number;
  fill: (nation: string) => string;
  stroke?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}> = ({ height, fill, stroke = C.white, strokeWidth = 3, children }) => (
  <svg width={MAP.width * mapScale(height)} height={height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ display: "block", overflow: "visible" }}>
    {MAP.regions.map((r) => (
      <path key={r.name} d={r.d} fill={fill(r.name)} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    ))}
    {children}
  </svg>
);

/** The Elizabeth Tower ("Big Ben") at the Houses of Parliament, as a flat icon. */
export const BigBenIcon: React.FC<{ height: number }> = ({ height }) => (
  <svg width={(height * 70) / 200} height={height} viewBox="0 0 70 200" style={{ display: "block" }}>
    <g stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M35 4 L42 40 L28 40 Z" fill={UK.gold} />
      <path d="M24 40 H46 L50 56 H20 Z" fill={C.card} />
      <rect x={16} y={56} width={38} height={44} rx={3} fill={C.card} />
      <circle cx={35} cy={78} r={14} fill={C.white} />
      <path d="M35 78 V69 M35 78 L41 82" stroke={C.ink} strokeWidth={3} />
      <rect x={18} y={100} width={34} height={96} rx={2} fill={C.card} />
      {[112, 132, 152, 172].map((y) => (
        <path key={y} d={`M27 ${y} V${y + 12} M35 ${y} V${y + 12} M43 ${y} V${y + 12}`} strokeWidth={3} />
      ))}
    </g>
  </svg>
);

const ICON_STROKE = { stroke: C.ink, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** A passport. */
export const PassportIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE}>
      <rect x={14} y={6} width={34} height={48} rx={5} fill={UK.blue} />
      <circle cx={31} cy={26} r={8} fill="none" stroke={UK.gold} strokeWidth={3} />
      <path d="M22 42 H40" stroke={UK.gold} strokeWidth={3} />
    </g>
  </svg>
);

/** A globe. */
export const GlobeIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5} fill="none">
      <circle cx={30} cy={30} r={22} fill={C.card} />
      <ellipse cx={30} cy={30} rx={10} ry={22} />
      <path d="M8 30 H52 M12 19 H48 M12 41 H48" />
    </g>
  </svg>
);

/** A photo ID card. */
export const IdCardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <rect x={6} y={14} width={48} height={34} rx={5} fill={C.card} />
      <circle cx={20} cy={28} r={5} fill={C.muted} strokeWidth={0} />
      <path d="M12 41 C12 35 28 35 28 41" fill={C.muted} strokeWidth={0} />
      <path d="M34 25 H47 M34 32 H47 M34 39 H42" strokeWidth={3} />
    </g>
  </svg>
);

/** A school building. */
export const SchoolIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <path d="M8 26 L30 12 L52 26" fill={UK.goldSoft} />
      <rect x={12} y={26} width={36} height={26} fill={C.card} />
      <rect x={25} y={38} width={10} height={14} fill={UK.gold} />
      <path d="M30 12 V4 L38 7 L30 10" fill={UK.red} strokeWidth={2.5} />
    </g>
  </svg>
);

/** A hospital cross (health). */
export const HealthIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <rect x={8} y={8} width={44} height={44} rx={12} fill={C.card} stroke={C.ink} strokeWidth={3.5} />
    <path d="M25 16 H35 V25 H44 V35 H35 V44 H25 V35 H16 V25 H25 Z" fill={UK.red} />
  </svg>
);

/** An hourglass (a delay). */
export const HourglassIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <g {...ICON_STROKE} strokeWidth={3.5}>
      <path d="M14 6 H46 M14 54 H46" />
      <path d="M18 6 C18 22 30 24 30 30 C30 36 18 38 18 54 H42 C42 38 30 36 30 30 C30 24 42 22 42 6 Z" fill={C.card} />
      <path d="M22 50 C22 44 30 42 30 40 C30 42 38 44 38 50 Z" fill={UK.gold} strokeWidth={0} />
      <path d="M24 14 H36 C34 19 30 21 30 23 C30 21 26 19 24 14 Z" fill={UK.gold} strokeWidth={0} />
    </g>
  </svg>
);
