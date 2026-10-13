import React from "react";
import { theme } from "../../theme";
import { starPath } from "../../components/explainer/icons";
import { CARD_SHADOW, EU, FLAGS, PALETTE as C } from "./constants";

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
}) => <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color, ...style }}>{children}</div>;

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

/** A small rectangular flag from stripes (Germany, Malta, ...). Malta gets its George Cross. */
export const MiniFlag: React.FC<{ country: keyof typeof FLAGS; width: number }> = ({ country, width }) => {
  const f = FLAGS[country];
  const h = width * 0.64;
  return (
    <svg width={width} height={h} viewBox={`0 0 100 64`} style={{ display: "block", borderRadius: 6, boxShadow: `0 0 0 2px ${C.line}`, flexShrink: 0 }}>
      {f.stripes.map((color, i) =>
        f.vertical ? (
          <rect key={i} x={(i * 100) / f.stripes.length} y={0} width={100 / f.stripes.length + 0.5} height={64} fill={color} />
        ) : (
          <rect key={i} x={0} y={(i * 64) / f.stripes.length} width={100} height={64 / f.stripes.length + 0.5} fill={color} />
        ),
      )}
      {country === "malta" ? <path d="M12 8 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6 Z" fill="#A7A9AC" stroke="#CF142B" strokeWidth={0.8} /> : null}
    </svg>
  );
};

/** The ring of 12 yellow stars. `p(i)` gives each star's pop-in progress. */
export const StarRing: React.FC<{ size: number; star: number; p?: (i: number) => number; color?: string }> = ({
  size,
  star,
  p = () => 1,
  color = EU.yellow,
}) => {
  const r = size / 2 - star;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const v = Math.max(0, p(i));
        if (v <= 0) return null;
        const x = r * Math.sin(a);
        const y = -r * Math.cos(a);
        return (
          <path
            key={i}
            d={starPath(0, 0, star)}
            fill={color}
            stroke={EU.yellowDeep}
            strokeWidth={1.5}
            transform={`translate(${x} ${y}) scale(${v})`}
            opacity={Math.min(1, v * 1.4)}
          />
        );
      })}
    </svg>
  );
};

/** Simple person glyph (head + shoulders) for counts. */
export const PersonGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 40 50" style={{ display: "block" }}>
    <circle cx={20} cy={13} r={10} fill={color} />
    <path d="M2 50 C2 34 10 27 20 27 C30 27 38 34 38 50 Z" fill={color} />
  </svg>
);

/** The European Commission: a modern office block with the EU flag on top. */
export const CommissionIcon: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={(width * 170) / 240} viewBox="0 0 240 170" style={{ display: "block" }}>
    <g stroke={C.ink} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <line x1={120} y1={4} x2={120} y2={36} />
      <rect x={40} y={36} width={160} height={118} rx={8} fill={C.card} />
      <rect x={14} y={150} width={212} height={14} rx={4} fill={C.card} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect key={`${row}-${col}`} x={56 + col * 27} y={50 + row * 22} width={18} height={13} rx={2} fill={row === 3 && col === 2 ? C.ink : EU.bluePale} strokeWidth={3} />
        )),
      )}
    </g>
    <rect x={123} y={4} width={36} height={24} fill={EU.blue} />
    {Array.from({ length: 12 }, (_, i) => (
      <circle key={i} cx={141 + 8 * Math.sin((i * Math.PI) / 6)} cy={16 - 8 * Math.cos((i * Math.PI) / 6)} r={1.4} fill={EU.yellow} />
    ))}
  </svg>
);

/** Round icon tile used on job cards and fact rows. */
export const IconTile: React.FC<{ size: number; bg?: string; children: React.ReactNode }> = ({ size, bg = C.paperDeep, children }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

/** A white card with an icon and a short label (what an institution does). */
export const JobCard: React.FC<{
  left: number;
  top: number;
  width: number;
  icon: React.ReactNode;
  label: React.ReactNode;
  p: number;
  out?: number;
  height?: number;
  fontSize?: number;
}> = ({ left, top, width, icon, label, p, out = 0, height = 128, fontSize = 36 }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 24,
      background: C.card,
      boxShadow: CARD_SHADOW,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "0 26px",
      boxSizing: "border-box",
      fontFamily: theme.font,
      fontSize,
      fontWeight: 800,
      lineHeight: 1.12,
      letterSpacing: -0.5,
      color: C.ink,
      opacity: Math.min(1, Math.max(0, p) * 1.4) * (1 - out),
      transform: `translateY(${(1 - p) * 30 - out * 30}px) scale(${0.9 + 0.1 * p})`,
    }}
  >
    {icon}
    <div>{label}</div>
  </div>
);

/** A round tick or cross badge. */
export const MarkBadge: React.FC<{ size: number; kind: "yes" | "no"; p: number }> = ({ size, kind, p }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: kind === "yes" ? EU.blue : EU.no,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 24px rgba(15,27,61,0.22)",
      opacity: Math.min(1, Math.max(0, p) * 1.4),
      transform: `scale(${p})`,
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 40 40">
      {kind === "yes" ? (
        <path d="M7 21 L16 30 L33 10" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M10 10 L30 30 M30 10 L10 30" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
      )}
    </svg>
  </div>
);

/** A tilted rubber stamp ("NO DIRECT VOTE", "EU LAW"). `p` drives a slam-in from big to normal size. */
export const Stamp: React.FC<{ text: string; color: string; p: number; size?: number; rotate?: number }> = ({
  text,
  color,
  p,
  size = 54,
  rotate = -8,
}) => (
  <div
    style={{
      padding: `${size * 0.22}px ${size * 0.5}px`,
      border: `${Math.max(5, size * 0.11)}px solid ${color}`,
      borderRadius: size * 0.3,
      color,
      fontFamily: theme.font,
      fontSize: size,
      fontWeight: 900,
      letterSpacing: size * 0.06,
      whiteSpace: "nowrap",
      background: "rgba(255,255,255,0.92)",
      opacity: Math.min(1, Math.max(0, p) * 2),
      transform: `rotate(${rotate}deg) scale(${1 + (1 - Math.min(1, Math.max(0, p))) * 0.8})`,
    }}
  >
    {text}
  </div>
);
