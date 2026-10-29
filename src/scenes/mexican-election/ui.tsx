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
  MX,
  SECTIONS,
  MEXICAN_ELECTION_DURATION,
  WIPE,
  sceneEnd,
  sceneFrom,
} from "./constants";

const W = 1080;
const H = 1920;
/** How far the top of a diagonal wipe edge runs ahead of its bottom, in px. */
const SLANT = 380;
/** Width of the red band that leads every wipe (with a white edge on each side: the flag's green, white and red). */
const BAND = 96;

/** Deep Mexican green with soft drifting glows and a vignette (the Belgian video's black, in the Mexican flag's green). */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 85% at 50% 36%, ${MX.bgLight} 0%, ${MX.bg} 48%, ${MX.bgDeep} 100%)` }}>
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
          background: "radial-gradient(circle, rgba(206,17,38,0.2) 0%, rgba(206,17,38,0) 66%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,22,14,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Moving film grain over the whole picture, like the reference video. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="mx-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#mx-grain)" />
    </svg>
  );
};

/** Bottom x of a wipe edge at progress p (0 = the band just touching the top-left corner, 1 = off the right side). */
const edgeAt = (p: number) => -SLANT + p * (W + SLANT + BAND);

/** The band on a wipe edge (`e` = the edge's bottom x); it trails the edge by BAND px: red with a white edge each side. */
const WipeBand: React.FC<{ e: number; width?: number; edge?: number }> = ({ e, width = BAND, edge = 0.22 }) => {
  const band = (from: number, to: number, fill: string) => (
    <polygon points={`${e - to + SLANT},0 ${e - from + SLANT},0 ${e - from},${H} ${e - to},${H}`} fill={fill} />
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {band(0, width, MX.white)}
      {band(width * edge, width * (1 - edge), MX.red)}
    </svg>
  );
};

/**
 * Light paper background for the ballot and result scenes. It wipes in from the left behind a
 * red-and-white band when the scene starts and wipes out the same way into the next (green) scene.
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
      <AbsoluteFill style={{ clipPath: clip, background: `radial-gradient(120% 80% at 50% 40%, #F7F4EC 0%, ${MX.paper} 55%, ${MX.paperDeep} 100%)` }} />
      {inP > 0 && inP < 1 && <WipeBand e={eIn} />}
      {outP > 0 && outP < 1 && <WipeBand e={eOut + BAND} />}
    </>
  );
};

/** A broad red-and-white band that sweeps once across the whole picture between frames `from` and `from + length`. */
export const Sweep: React.FC<{ from: number; length?: number; width?: number }> = ({ from, length = 16, width = 300 }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, from + length);
  if (p <= 0 || p >= 1) return null;
  return <WipeBand e={-SLANT + p * (W + SLANT + width)} width={width} edge={0.3} />;
};

const mono: React.CSSProperties = { fontFamily: FONT.mono, fontSize: 21, letterSpacing: 4, whiteSpace: "nowrap" };

/** 0 on green, 1 on paper: follows the paper wipes of the light scenes. */
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
  const color = interpolateColors(light, [0, 1], ["rgba(242,246,255,0.85)", "rgba(8,20,48,0.78)"]);
  const faint = interpolateColors(light, [0, 1], ["rgba(242,246,255,0.34)", "rgba(8,20,48,0.25)"]);
  const accent = interpolateColors(light, [0, 1], [MX.white, MX.red]);
  const section = [...SECTIONS].reverse().find((s) => frame >= sceneFrom(s.scene)) ?? SECTIONS[0];

  const ruler = { left: 496, width: 290, y: 1858 };
  const done = Math.min(1, frame / MEXICAN_ELECTION_DURATION);
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
          const x = ruler.left + (ruler.width * sceneFrom(s.scene)) / MEXICAN_ELECTION_DURATION;
          return <line key={s.n} x1={x} x2={x} y1={ruler.y - 7} y2={ruler.y + 7} stroke={frame >= sceneFrom(s.scene) ? color : faint} strokeWidth={2} />;
        })}
        <line x1={ruler.left + ruler.width * done} x2={ruler.left + ruler.width * done} y1={ruler.y - 11} y2={ruler.y + 11} stroke={accent} strokeWidth={3} />
      </svg>
      <div style={{ ...mono, position: "absolute", left: 76, top: 58, color }}>MEXICO — HOW THE VOTE WORKS</div>
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
      color: light ? MX.inkSoft : MX.textSoft,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Huge heavy capitals with a soft glow on green (no glow on paper), like the reference headlines. */
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
      color: light ? MX.ink : MX.white,
      textShadow: light ? "none" : `0 0 ${Math.round(size * 0.2)}px rgba(255,255,255,0.32), 0 0 2px rgba(255,255,255,0.55)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Accent words inside a headline. On green they sit in a flag-red block with a thin white rim
 * (the flag's green, white and red together); on paper they are simply flag red.
 */
export const Accent: React.FC<{ light?: boolean; children: React.ReactNode }> = ({ light, children }) =>
  light ? (
    <span style={{ color: MX.red }}>{children}</span>
  ) : (
    <span
      style={{
        display: "inline-block",
        padding: "0 0.12em",
        margin: "0 -0.12em",
        lineHeight: 0.92,
        background: MX.red,
        color: MX.white,
        textShadow: "none",
        borderRadius: "0.06em",
        boxShadow: `0 0 0 0.04em ${MX.white}, 0 0 34px rgba(206,17,38,0.45)`,
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
      color: light ? MX.inkSoft : MX.textSoft,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small spaced-out mono label. */
export const Mono: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 24,
  color = MX.textSoft,
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
      background: MX.glass,
      border: `1.5px solid ${MX.glassEdge}`,
      boxShadow: "0 26px 60px rgba(0,10,30,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
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
  color = MX.white,
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
      textShadow: color === MX.white ? "0 0 24px rgba(255,255,255,0.5)" : "none",
      boxShadow: color === MX.white ? "0 0 30px rgba(255,255,255,0.25), inset 0 0 18px rgba(255,255,255,0.15)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A hand-drawn box that draws itself around something (the reference's red box, here in white). */
export const DrawBox: React.FC<{ x: number; y: number; w: number; h: number; p: number; color?: string; rotate?: number }> = ({
  x,
  y,
  w,
  h,
  p,
  color = MX.white,
  rotate = -1.6,
}) => (
  <svg
    width={w + 40}
    height={h + 40}
    style={{ position: "absolute", left: x - 20, top: y - 20, overflow: "visible", transform: `rotate(${rotate}deg)`, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.45))" }}
  >
    <rect
      x={20}
      y={20}
      width={w}
      height={h}
      rx={12}
      fill="none"
      stroke={color}
      strokeWidth={7}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
      opacity={p > 0.01 ? 1 : 0}
    />
  </svg>
);

/** The title's flag bar: Mexico's tricolour (green, white, red) stood on end; `p` draws it in from the top. */
export const FlagBar: React.FC<{ height: number; p: number; style?: React.CSSProperties }> = ({ height, p, style }) => (
  <svg width={60} height={height} style={{ position: "absolute", overflow: "visible", ...style }}>
    <defs>
      <clipPath id="mx-flagbar">
        <rect x={0} y={0} width={60} height={height * p} rx={3} />
      </clipPath>
    </defs>
    <g clipPath="url(#mx-flagbar)" style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.3))" }}>
      <rect x={0} y={0} width={60} height={height} rx={3} fill={MX.red} />
      <rect x={0} y={0} width={60} height={height / 3} rx={3} fill={MX.green} stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} />
      <rect x={0} y={height / 3} width={60} height={height / 3} fill={MX.white} />
    </g>
  </svg>
);

/**
 * The coat of arms, simplified: a white disc with a green-and-red wreath, a green prickly-pear
 * cactus on a rock, and a brown eagle with raised wings perched on it. `p` pops it in.
 */
export const Emblem: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.1, Math.max(0, p))})`, filter: "drop-shadow(0 0 16px rgba(255,255,255,0.35))", ...style }}
  >
    <circle cx={50} cy={50} r={48} fill={MX.white} />
    {/* The wreath: oak (green) and laurel, tied with a red-white-green ribbon at the bottom. */}
    <path d="M22 30 C10 46 12 70 32 84" fill="none" stroke={MX.green} strokeWidth={6} strokeLinecap="round" strokeDasharray="7 3" />
    <path d="M78 30 C90 46 88 70 68 84" fill="none" stroke={MX.green} strokeWidth={6} strokeLinecap="round" strokeDasharray="7 3" />
    <path d="M38 86 Q50 92 62 86" fill="none" stroke={MX.red} strokeWidth={4} strokeLinecap="round" />
    {/* The rock and the cactus pads. */}
    <ellipse cx={50} cy={80} rx={14} ry={4} fill={MX.brown} opacity={0.6} />
    <ellipse cx={50} cy={70} rx={6} ry={9} fill={MX.cactus} />
    <ellipse cx={40} cy={66} rx={5} ry={7} fill={MX.cactus} transform="rotate(-25 40 66)" />
    <ellipse cx={60} cy={66} rx={5} ry={7} fill={MX.cactus} transform="rotate(25 60 66)" />
    <circle cx={39} cy={60} r={1.8} fill={MX.red} />
    <circle cx={61} cy={60} r={1.8} fill={MX.red} />
    {/* The eagle: body, raised wings, head turned left, a snake in its beak. */}
    <path d="M44 60 C42 50 44 40 50 36 C56 40 58 50 56 60 Z" fill={MX.brown} />
    <path d="M46 44 C38 40 30 30 28 18 C36 24 42 28 48 38 Z" fill={MX.brown} />
    <path d="M54 44 C62 40 70 30 72 18 C64 24 58 28 52 38 Z" fill={MX.brown} />
    <circle cx={46} cy={34} r={5} fill={MX.brown} />
    <path d="M42 33 L36 35 L42 37 Z" fill={MX.gold} />
    <path d="M36 36 C32 40 36 44 32 48" fill="none" stroke={MX.cactus} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

/** A neutral person outline (no real likeness). */
export const PersonIcon: React.FC<{ size: number; color?: string }> = ({ size, color = MX.white }) => (
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
