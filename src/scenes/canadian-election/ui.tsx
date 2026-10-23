import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { progress } from "../../components/explainer/motion";
import {
  BEAT_START,
  BPM,
  FONT,
  FPS,
  LIGHT_SCENES,
  CA,
  SECTIONS,
  CANADIAN_ELECTION_DURATION,
  WIPE,
  sceneEnd,
  sceneFrom,
} from "./constants";

const W = 1080;
const H = 1920;
/** How far the top of a diagonal wipe edge runs ahead of its bottom, in px. */
const SLANT = 380;
/** Width of the red band that leads every wipe. */
const BAND = 96;

/** Deep Canadian red with soft drifting white glows and a vignette (the Belgian video's black, in the Canadian flag's red). */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 85% at 50% 36%, ${CA.bgLight} 0%, ${CA.bg} 48%, ${CA.bgDeep} 100%)` }}>
      <div
        style={{
          position: "absolute",
          left: -260 + float(frame, 40, 300),
          top: -220 + float(frame, 30, 360, 60),
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -320 + float(frame, 50, 340, 120),
          bottom: 120 + float(frame, 40, 280),
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,214,206,0.14) 0%, rgba(255,214,206,0) 66%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,0,4,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Moving film grain over the whole picture, like the reference video. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="ca-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#ca-grain)" />
    </svg>
  );
};

/** Bottom x of a wipe edge at progress p (0 = the band just touching the top-left corner, 1 = off the right side). */
const edgeAt = (p: number) => -SLANT + p * (W + SLANT + BAND);

/** The red band on a wipe edge (`e` = the edge's bottom x); it trails the edge by BAND px. */
const WipeBand: React.FC<{ e: number; width?: number; color?: string }> = ({ e, width = BAND, color = CA.red }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <polygon points={`${e - width + SLANT},0 ${e + SLANT},0 ${e},${H} ${e - width},${H}`} fill={color} />
  </svg>
);

/**
 * Light paper background for the ballot and result scenes. It wipes in from the left behind a
 * red band when the scene starts and wipes out the same way into the next (red) scene.
 */
export const PaperLayer: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const inP = progress(frame, 0, WIPE);
  const outP = progress(frame, duration - WIPE + 3, duration + 3);
  const eIn = edgeAt(inP);
  const eOut = edgeAt(outP);
  const clip =
    outP > 0
      ? `polygon(${eOut + SLANT}px 0, ${W}px 0, ${W}px ${H}px, ${eOut}px ${H}px)`
      : `polygon(0 0, ${eIn + SLANT}px 0, ${eIn}px ${H}px, 0 ${H}px)`;
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip, background: `radial-gradient(120% 80% at 50% 40%, #F7F4EC 0%, ${CA.paper} 55%, ${CA.paperDeep} 100%)` }} />
      {inP > 0 && inP < 1 && <WipeBand e={eIn} />}
      {outP > 0 && outP < 1 && <WipeBand e={eOut + BAND} />}
    </>
  );
};

/** A broad white band that sweeps once across the whole picture between frames `from` and `from + length`. */
export const Sweep: React.FC<{ from: number; length?: number; width?: number }> = ({ from, length = 16, width = 300 }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, from + length);
  if (p <= 0 || p >= 1) return null;
  return <WipeBand e={-SLANT + p * (W + SLANT + width)} width={width} color={CA.white} />;
};

const mono: React.CSSProperties = { fontFamily: FONT.mono, fontSize: 21, letterSpacing: 4, whiteSpace: "nowrap" };

/** 0 on red, 1 on paper: follows the paper wipes of the light scenes. */
const lightAmount = (frame: number) =>
  Math.max(
    ...LIGHT_SCENES.map((id) => {
      const on = progress(frame, sceneFrom(id) + WIPE / 2 - 3, sceneFrom(id) + WIPE / 2 + 3);
      const off = progress(frame, sceneEnd(id) - WIPE / 2, sceneEnd(id) - WIPE / 2 + 6);
      return on * (1 - off);
    }),
  );

const timecode = (frame: number) => {
  const two = (n: number) => String(n).padStart(2, "0");
  const s = Math.floor(frame / FPS);
  return `TC 00:00:${two(s)}:${two(frame % FPS)}`;
};

/**
 * The broadcast frame from the reference video: corner marks, the series label and a running
 * timecode on top; the section label, a progress ruler with one tick per section and BPM dots that
 * blink with the music at the bottom. Decoration only: TikTok's own buttons may cover parts of it.
 */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const light = lightAmount(frame);
  const color = interpolateColors(light, [0, 1], ["rgba(255,240,238,0.85)", "rgba(42,13,16,0.78)"]);
  const faint = interpolateColors(light, [0, 1], ["rgba(255,240,238,0.34)", "rgba(42,13,16,0.25)"]);
  const accent = interpolateColors(light, [0, 1], [CA.white, CA.red]);
  const section = [...SECTIONS].reverse().find((s) => frame >= sceneFrom(s.scene)) ?? SECTIONS[0];

  const ruler = { left: 496, width: 290, y: 1858 };
  const done = Math.min(1, frame / CANADIAN_ELECTION_DURATION);
  const beatLength = (60 / BPM) * FPS;
  const beat = frame >= BEAT_START * FPS ? Math.floor((frame - BEAT_START * FPS) / beatLength) % 4 : -1;

  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M${x} ${y + dy * 40} V${y} H${x + dx * 40}`} fill="none" stroke={color} strokeWidth={2.5} />
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {corner(36, 36, 1, 1)}
        {corner(W - 36, 36, -1, 1)}
        {corner(36, H - 36, 1, -1)}
        {corner(W - 36, H - 36, -1, -1)}
        <line x1={ruler.left} x2={ruler.left + ruler.width} y1={ruler.y} y2={ruler.y} stroke={faint} strokeWidth={2} />
        <line x1={ruler.left} x2={ruler.left + ruler.width * done} y1={ruler.y} y2={ruler.y} stroke={color} strokeWidth={2.5} />
        {SECTIONS.map((s) => {
          const x = ruler.left + (ruler.width * sceneFrom(s.scene)) / CANADIAN_ELECTION_DURATION;
          return <line key={s.n} x1={x} x2={x} y1={ruler.y - 7} y2={ruler.y + 7} stroke={frame >= sceneFrom(s.scene) ? color : faint} strokeWidth={2} />;
        })}
        <line x1={ruler.left + ruler.width * done} x2={ruler.left + ruler.width * done} y1={ruler.y - 11} y2={ruler.y + 11} stroke={accent} strokeWidth={3} />
      </svg>
      <div style={{ ...mono, position: "absolute", left: 76, top: 58, color }}>CANADA — HOW THE VOTE WORKS</div>
      <div style={{ ...mono, position: "absolute", right: 76, top: 58, color }}>{timecode(frame)}</div>
      <div style={{ ...mono, position: "absolute", left: 76, top: 1846, color }}>
        {section.n} — {section.label}
      </div>
      <div style={{ ...mono, position: "absolute", right: 76, top: 1846, color, display: "flex", alignItems: "center", gap: 10 }}>
        {BPM} BPM
        <span style={{ display: "inline-flex", gap: 8, marginLeft: 6 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === beat ? accent : faint }} />
          ))}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** "03 — THE BALLOT": the numbered section label above each headline. */
export const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean; style?: React.CSSProperties }> = ({ children, light, style }) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      fontFamily: FONT.mono,
      fontWeight: 700,
      fontSize: 27,
      letterSpacing: 6,
      color: light ? CA.inkSoft : CA.textSoft,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Huge heavy capitals with a soft glow on red (no glow on paper), like the reference headlines. */
export const Headline: React.FC<{ size: number; light?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size,
  light,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      fontFamily: FONT.display,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -size * 0.012,
      color: light ? CA.ink : CA.white,
      textShadow: light ? "none" : `0 0 ${Math.round(size * 0.2)}px rgba(255,255,255,0.3), 0 0 2px rgba(255,255,255,0.5)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Accent words inside a headline. On red they sit in a white block in flag red, like the flag's
 * white square with its red leaf; on paper they are simply flag red.
 */
export const Accent: React.FC<{ light?: boolean; children: React.ReactNode }> = ({ light, children }) =>
  light ? (
    <span style={{ color: CA.red }}>{children}</span>
  ) : (
    <span
      style={{
        display: "inline-block",
        padding: "0 0.12em",
        margin: "0 -0.12em",
        lineHeight: 0.92,
        background: CA.white,
        color: CA.red,
        textShadow: "none",
        borderRadius: "0.06em",
        boxShadow: "0 0 34px rgba(255,255,255,0.28)",
      }}
    >
      {children}
    </span>
  );

/** The italic serif aside under a headline. */
export const Aside: React.FC<{ size?: number; light?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 50,
  light,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      width: 840,
      fontFamily: FONT.serif,
      fontStyle: "italic",
      fontSize: size,
      lineHeight: 1.1,
      color: light ? CA.inkSoft : CA.textSoft,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small spaced-out mono label. */
export const Mono: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 24,
  color = CA.textSoft,
  style,
  children,
}) => <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: size, letterSpacing: size * 0.2, color, whiteSpace: "nowrap", ...style }}>{children}</div>;

/** Dark glass card with a short accent tick on its top edge, as in the reference's stat cards. */
export const Glass: React.FC<{
  left?: number;
  top: number;
  width?: number;
  height: number;
  tick?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ left = 120, top, width = 840, height, tick, style, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 24,
      background: CA.glass,
      border: `1.5px solid ${CA.glassEdge}`,
      boxShadow: "0 26px 60px rgba(40,0,6,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
      boxSizing: "border-box",
      fontFamily: FONT.body,
      ...style,
    }}
  >
    {tick && <div style={{ position: "absolute", left: 34, top: -3, width: 70, height: 6, borderRadius: 3, background: tick }} />}
    {children}
  </div>
);

/** A rubber stamp that slams in: `p` is its pop progress (0 -> 1, may overshoot). */
export const Stamp: React.FC<{ p: number; color?: string; size?: number; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  p,
  color = CA.white,
  size = 64,
  rotate = -6,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      padding: `${size * 0.12}px ${size * 0.34}px`,
      border: `${Math.round(size * 0.1)}px solid ${color}`,
      borderRadius: size * 0.18,
      color,
      fontFamily: FONT.display,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: size * 0.02,
      whiteSpace: "nowrap",
      opacity: Math.min(1, Math.max(0, p) * 2),
      transform: `rotate(${rotate}deg) scale(${1.7 - 0.7 * Math.min(1.2, Math.max(0, p))})`,
      textShadow: color === CA.white ? "0 0 24px rgba(255,255,255,0.4)" : "none",
      boxShadow: color === CA.white ? "0 0 30px rgba(255,255,255,0.2), inset 0 0 18px rgba(255,255,255,0.12)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
);


/** The Canadian flag's maple leaf (11 points), in a 0 0 4800 4800 box. */
export const LEAF_PATH =
  "m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z";

export const MapleLeaf: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = CA.red, style }) => (
  <svg width={size} height={size} viewBox="0 0 4800 4800" style={{ overflow: "visible", ...style }}>
    <path d={LEAF_PATH} fill={color} />
  </svg>
);

/** The title's flag bar: the Canadian flag stood on end (red, white with the leaf, red); `p` draws it in from the top. */
export const FlagBar: React.FC<{ height: number; p: number; style?: React.CSSProperties }> = ({ height, p, style }) => {
  const w = 60;
  const band = height / 4;
  return (
    <svg width={w} height={height} style={{ position: "absolute", overflow: "visible", ...style }}>
      <defs>
        <clipPath id="ca-flagbar">
          <rect x={0} y={0} width={w} height={height * p} rx={3} />
        </clipPath>
      </defs>
      <g clipPath="url(#ca-flagbar)" style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.25))" }}>
        <rect x={0} y={0} width={w} height={height} rx={3} fill={CA.white} />
        <rect x={0} y={0} width={w} height={band} rx={3} fill={CA.red} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <rect x={0} y={height - band} width={w} height={band} rx={3} fill={CA.red} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <svg x={4} y={height / 2 - (w - 8) / 2} width={w - 8} height={w - 8} viewBox="0 0 4800 4800">
          <path d={LEAF_PATH} fill={CA.red} />
        </svg>
      </g>
    </svg>
  );
};

/** A neutral person outline (no real likeness). */
export const PersonIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CA.white }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round">
    <circle cx={50} cy={32} r={17} />
    <path d="M18 90 C18 66 32 56 50 56 C68 56 82 66 82 90" />
  </svg>
);

/** Tick or cross drawn as strokes; `p` draws it in. */
export const Mark: React.FC<{ ok: boolean; size: number; p: number; color: string; width?: number }> = ({ ok, size, p, color, width = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", flexShrink: 0 }}>
    {ok ? (
      <path d="M14 54 L40 78 L88 20" fill="none" stroke={color} strokeWidth={width * 1.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    ) : (
      <>
        <path d="M18 18 L82 82" stroke={color} strokeWidth={width * 1.2} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p * 2)} />
        <path d="M82 18 L18 82" stroke={color} strokeWidth={width * 1.2} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
      </>
    )}
  </svg>
);
