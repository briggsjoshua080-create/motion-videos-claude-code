import React from "react";
import { AbsoluteFill, interpolateColors, random, useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { progress } from "../../components/explainer/motion";
import {
  BEAT_START,
  BPM,
  FONT,
  FPS,
  H,
  LEFT,
  LIGHT_SPANS,
  MIN_TEXT,
  SECTIONS,
  UA,
  UKRAINIAN_ELECTION_DURATION,
  W,
  WIPE,
  sceneFrom,
} from "./constants";

/** Which background a piece of text sits on: the blue backdrop, light paper, or a yellow re-hook flash. */
export type Tone = "blue" | "paper" | "flash";

/** How far the top of a diagonal wipe edge runs ahead of its bottom, in px. */
const SLANT = 380;
/** Width of the band that leads every wipe: the flag's blue with a yellow (or white) core. */
const BAND = 96;

/** Deep Ukrainian blue with soft drifting glows (white and yellow) and a vignette. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 85% at 50% 36%, ${UA.bgLight} 0%, ${UA.bg} 48%, ${UA.bgDeep} 100%)` }}>
      <div
        style={{
          position: "absolute",
          left: -260 + float(frame, 40, 300),
          top: -220 + float(frame, 30, 360, 60),
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 68%)",
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
          background: "radial-gradient(circle, rgba(150,200,255,0.16) 0%, rgba(150,200,255,0) 66%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(2,16,44,0.62) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Moving film grain over the whole picture, like the reference video. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="ua-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#ua-grain)" />
    </svg>
  );
};

/** Bottom x of a wipe edge at progress p (0 = the band just touching the top-left corner, 1 = off the right side). */
const edgeAt = (p: number) => -SLANT + p * (W + SLANT + BAND);

/** The band on a wipe edge (`e` = the edge's bottom x); it trails the edge by BAND px: blue with a lighter core. */
const WipeBand: React.FC<{ e: number; width?: number; edge?: number; core?: string }> = ({ e, width = BAND, edge = 0.22, core = UA.yellow }) => {
  const band = (from: number, to: number, fill: string) => (
    <polygon points={`${e - to + SLANT},0 ${e - from + SLANT},0 ${e - from},${H} ${e - to},${H}`} fill={fill} />
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {band(0, width, UA.blue)}
      {band(width * edge, width * (1 - edge), core)}
    </svg>
  );
};

/**
 * A light background that wipes in from the left behind a blue band when the scene starts (or at
 * `inAt`) and wipes out the same way at its end (or at `outAt`, in scene frames). "paper" is the
 * cream ballot paper; "flash" is the flag's yellow, used for the re-hooks (rule 5's pattern break).
 */
export const WipeLayer: React.FC<{ duration: number; kind: "paper" | "flash"; inAt?: number; outAt?: number }> = ({ duration, kind, inAt = 0, outAt }) => {
  const frame = useCurrentFrame();
  const end = outAt ?? duration;
  const inP = progress(frame, inAt, inAt + WIPE);
  const outP = progress(frame, end - WIPE + 3, end + 3);
  const eIn = edgeAt(inP);
  const eOut = edgeAt(outP);
  if (inP <= 0) return null;
  const clip =
    outP > 0
      ? `polygon(${eOut + SLANT}px 0, ${W}px 0, ${W}px ${H}px, ${eOut}px ${H}px)`
      : `polygon(0 0, ${eIn + SLANT}px 0, ${eIn}px ${H}px, 0 ${H}px)`;
  const fill =
    kind === "paper"
      ? `radial-gradient(120% 80% at 50% 40%, #F7F4EC 0%, ${UA.paper} 55%, ${UA.paperDeep} 100%)`
      : `radial-gradient(120% 85% at 50% 40%, #FFE44D 0%, ${UA.yellow} 52%, ${UA.yellowDeep} 100%)`;
  const core = kind === "paper" ? UA.yellow : UA.white;
  return (
    <>
      {outP < 1 && <AbsoluteFill style={{ clipPath: clip, background: fill }} />}
      {inP > 0 && inP < 1 && <WipeBand e={eIn} core={core} />}
      {outP > 0 && outP < 1 && <WipeBand e={eOut + BAND} core={core} />}
    </>
  );
};

/** A darker night-blue layer for a mood change on the blue background (fades in and out). */
export const NightLayer: React.FC<{ p: number }> = ({ p }) => (
  <AbsoluteFill style={{ opacity: p, background: `radial-gradient(120% 85% at 50% 40%, ${UA.bgDeep} 0%, ${UA.bgNight} 70%, #020F28 100%)` }} />
);

/** A broad blue-and-yellow band that sweeps once across the whole picture between frames `from` and `from + length`. */
export const Sweep: React.FC<{ from: number; length?: number; width?: number }> = ({ from, length = 16, width = 300 }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, from + length);
  if (p <= 0 || p >= 1) return null;
  return <WipeBand e={-SLANT + p * (W + SLANT + width)} width={width} edge={0.3} />;
};

/** 0 on blue, 1 on paper or yellow: follows the wipes of the light scenes (composition frames). */
const lightAmount = (frame: number) =>
  Math.max(
    0,
    ...LIGHT_SPANS.map(({ from, to }) => {
      const on = progress(frame, from + WIPE / 2 - 3, from + WIPE / 2 + 3);
      const off = progress(frame, to - WIPE / 2, to - WIPE / 2 + 6);
      return on * (1 - off);
    }),
  );

/**
 * The broadcast frame from the reference video, without its small text (rule 6): corner marks, a
 * progress ruler with one tick per numbered section, and four dots that blink with the music.
 * Decoration only: TikTok's own buttons may cover parts of it.
 */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const light = lightAmount(frame);
  const color = interpolateColors(light, [0, 1], ["rgba(242,246,255,0.85)", "rgba(6,22,56,0.78)"]);
  const faint = interpolateColors(light, [0, 1], ["rgba(242,246,255,0.32)", "rgba(6,22,56,0.25)"]);
  const accent = interpolateColors(light, [0, 1], [UA.yellow, UA.blue]);
  const ruler = { left: 300, width: 480, y: 1858 };
  const done = Math.min(1, frame / UKRAINIAN_ELECTION_DURATION);
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
          const x = ruler.left + (ruler.width * sceneFrom(s.scene)) / UKRAINIAN_ELECTION_DURATION;
          return <line key={s.n} x1={x} x2={x} y1={ruler.y - 7} y2={ruler.y + 7} stroke={frame >= sceneFrom(s.scene) ? color : faint} strokeWidth={2} />;
        })}
        <line x1={ruler.left + ruler.width * done} x2={ruler.left + ruler.width * done} y1={ruler.y - 11} y2={ruler.y + 11} stroke={accent} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={ruler.left + ruler.width + 40 + i * 18} cy={ruler.y} r={4.5} fill={i === beat ? accent : faint} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const headColor = (tone: Tone) => (tone === "paper" ? UA.ink : tone === "flash" ? UA.navy : UA.white);

/** Huge heavy capitals with a soft glow on blue (no glow on paper or yellow), like the reference headlines. */
export const Headline: React.FC<{ size: number; tone?: Tone; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size,
  tone = "blue",
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: LEFT,
      fontFamily: FONT.display,
      fontSize: Math.max(MIN_TEXT, size),
      lineHeight: 0.98,
      letterSpacing: -size * 0.012,
      color: headColor(tone),
      textShadow: tone === "blue" ? `0 0 ${Math.round(size * 0.2)}px rgba(255,255,255,0.3), 0 0 2px rgba(255,255,255,0.5)` : "none",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Accent words inside a headline: on blue a yellow block with dark blue letters (the flag's two
 * colours); on yellow the reverse; on paper simply the flag's blue.
 */
export const Accent: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({ tone = "blue", children }) =>
  tone === "paper" ? (
    <span style={{ color: UA.blue }}>{children}</span>
  ) : (
    <span
      style={{
        display: "inline-block",
        padding: "0 0.12em",
        margin: "0 -0.12em",
        lineHeight: 0.92,
        background: tone === "flash" ? UA.navy : UA.yellow,
        color: tone === "flash" ? UA.yellow : UA.navy,
        textShadow: "none",
        borderRadius: "0.06em",
        boxShadow: tone === "flash" ? "none" : "0 0 40px rgba(255,215,0,0.32)",
      }}
    >
      {children}
    </span>
  );

/** The italic serif line under a headline (never under MIN_TEXT). */
export const Aside: React.FC<{ size?: number; tone?: Tone; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 120,
  tone = "blue",
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: LEFT,
      fontFamily: FONT.serif,
      fontStyle: "italic",
      fontSize: Math.max(MIN_TEXT, size),
      lineHeight: 1.02,
      color: tone === "paper" ? UA.inkSoft : tone === "flash" ? UA.navy : UA.textSoft,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** The numbered section as a huge outlined numeral behind the content (replaces the small "03 — …" labels). */
export const SectionNumeral: React.FC<{ n: string; p: number; tone?: Tone; style?: React.CSSProperties }> = ({ n, p, tone = "blue", style }) => (
  <div
    style={{
      position: "absolute",
      right: -30,
      top: 120,
      fontFamily: FONT.display,
      fontSize: 520,
      lineHeight: 0.8,
      letterSpacing: -10,
      color: "transparent",
      WebkitTextStroke: `4px ${tone === "paper" ? "rgba(0,87,183,0.5)" : tone === "flash" ? "rgba(10,37,82,0.45)" : "rgba(255,215,0,0.55)"}`,
      opacity: 0.4 * Math.min(1, Math.max(0, p)),
      transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {n}
  </div>
);

/** A rubber stamp that slams in: `p` is its pop progress (0 -> 1, may overshoot). */
export const Stamp: React.FC<{ p: number; color?: string; fill?: string; size?: number; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  p,
  color = UA.white,
  fill = "transparent",
  size = MIN_TEXT,
  rotate = -6,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      padding: `${size * 0.1}px ${size * 0.28}px`,
      border: `${Math.round(size * 0.09)}px solid ${color}`,
      borderRadius: size * 0.16,
      color,
      background: fill,
      fontFamily: FONT.display,
      fontSize: Math.max(MIN_TEXT, size),
      lineHeight: 1,
      letterSpacing: size * 0.01,
      whiteSpace: "nowrap",
      opacity: Math.min(1, Math.max(0, p) * 2),
      transform: `rotate(${rotate}deg) scale(${1.7 - 0.7 * Math.min(1.2, Math.max(0, p))})`,
      textShadow: color === UA.white ? "0 0 24px rgba(255,255,255,0.45)" : "none",
      boxShadow: color === UA.white ? "0 0 30px rgba(255,255,255,0.25), inset 0 0 18px rgba(255,255,255,0.15)" : "0 18px 40px rgba(0,10,40,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
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

/** A ballot box seen from the front, with a slot on top and a small blue-and-yellow flag panel. */
export const BallotBox: React.FC<{ size: number; style?: React.CSSProperties; dark?: boolean }> = ({ size, style, dark }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 200 170" style={{ overflow: "visible", ...style }}>
    <path d="M28 38 L172 38 L192 60 L8 60 Z" fill={dark ? "#C9D4E6" : "#E9EEF7"} />
    <rect x={66} y={45} width={68} height={8} rx={4} fill={UA.navy} />
    <rect x={8} y={60} width={184} height={106} rx={10} fill={dark ? "#AFC0DA" : "#FFFFFF"} />
    <rect x={8} y={60} width={184} height={106} rx={10} fill="none" stroke="rgba(10,37,82,0.25)" strokeWidth={2} />
    <rect x={72} y={90} width={56} height={22} fill={UA.blue} />
    <rect x={72} y={112} width={56} height={22} fill={UA.yellow} />
  </svg>
);

/** A padlock (shackle + body + keyhole); `closed` lowers the shackle into the body. */
export const Padlock: React.FC<{ size: number; closed?: number; style?: React.CSSProperties }> = ({ size, closed = 1, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", ...style }}>
    <path
      d={`M28 ${58 - (1 - closed) * 16} V36 a22 22 0 0 1 44 0 V${58 - (1 - closed) * 16}`}
      fill="none"
      stroke={UA.yellow}
      strokeWidth={11}
      strokeLinecap="round"
      transform={`translate(0 ${-(1 - closed) * 16})`}
    />
    <rect x={12} y={52} width={76} height={62} rx={12} fill={UA.yellow} stroke={UA.navy} strokeWidth={3} />
    <circle cx={50} cy={78} r={8} fill={UA.navy} />
    <rect x={46} y={80} width={8} height={18} rx={3} fill={UA.navy} />
  </svg>
);

/** A chain of oval links from (x1,y1) to (x2,y2), drawn link by link as `p` goes 0 -> 1. */
export const Chain: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; links?: number; color?: string }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  links = 11,
  color = "#D9E2F0",
}) => {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const len = Math.hypot(x2 - x1, y2 - y1) / links;
  return (
    <g>
      {Array.from({ length: links }, (_, i) => {
        const t = (i + 0.5) / links;
        const v = Math.min(1, Math.max(0, p * links - i));
        if (v <= 0) return null;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        // Links alternate between seen flat-on and edge-on, like a real chain.
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={len * 0.64}
            ry={i % 2 === 0 ? len * 0.34 : len * 0.12}
            fill="none"
            stroke={color}
            strokeWidth={len * 0.17}
            opacity={v}
            transform={`rotate(${angle} ${x} ${y})`}
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}
          />
        );
      })}
    </g>
  );
};

/** An old TV set (body, screen, two antennas, two knobs); its screen shows `children`, with optional static. */
export const TVFrame: React.FC<{ left: number; top: number; width: number; height: number; staticAmount?: number; tone?: Tone; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  left,
  top,
  width,
  height,
  staticAmount = 0,
  tone = "blue",
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const body = tone === "flash" ? UA.navy : "#0B1E44";
  return (
    <div style={{ position: "absolute", left, top, width, height, ...style }}>
      <svg width={width} height={90} viewBox={`0 0 ${width} 90`} style={{ position: "absolute", left: 0, top: -84, overflow: "visible" }}>
        <path d={`M${width / 2} 86 L${width / 2 - 120} 6`} stroke={body} strokeWidth={9} strokeLinecap="round" />
        <path d={`M${width / 2} 86 L${width / 2 + 110} 14`} stroke={body} strokeWidth={9} strokeLinecap="round" />
        <circle cx={width / 2} cy={86} r={14} fill={body} />
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 46, background: body, boxShadow: "0 30px 60px rgba(0,10,40,0.35)" }} />
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 34,
          width: width - 170,
          height: height - 68,
          borderRadius: 34,
          overflow: "hidden",
          background: "radial-gradient(120% 120% at 40% 35%, #2A64C4 0%, #0C3478 70%, #071F4C 100%)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {staticAmount > 0 && (
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: staticAmount }}>
            <filter id="ua-tv-static">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 9} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#ua-tv-static)" />
          </svg>
        )}
        {children}
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", right: 44, top: 70 + i * 110, width: 62, height: 62, borderRadius: 31, background: UA.yellow, boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.2)" }} />
      ))}
      <div style={{ position: "absolute", right: 48, bottom: 60, width: 54, height: 120, borderRadius: 12, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 8px, transparent 8px 18px)" }} />
    </div>
  );
};

/** A military-style star in a ring: the president as commander-in-chief (generic, no real insignia). */
export const StarBadge: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 38 : 16;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.1, Math.max(0, p))}) rotate(${(1 - Math.min(1, p)) * -40}deg)`, filter: "drop-shadow(0 0 22px rgba(255,215,0,0.45))", ...style }}
    >
      <circle cx={50} cy={50} r={47} fill="none" stroke={UA.yellow} strokeWidth={5} />
      <circle cx={50} cy={50} r={40} fill="rgba(255,215,0,0.12)" />
      <polygon points={pts} fill={UA.yellow} />
    </svg>
  );
};

/** A simple globe (abroad). */
export const Globe: React.FC<{ size: number; spin?: number; color?: string; style?: React.CSSProperties }> = ({ size, spin = 0, color = UA.yellow, style }) => {
  const shift = (spin % 40) - 20;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id="ua-globe">
          <circle cx={50} cy={50} r={44} />
        </clipPath>
      </defs>
      <circle cx={50} cy={50} r={44} fill="rgba(255,215,0,0.12)" stroke={color} strokeWidth={5} />
      <g clipPath="url(#ua-globe)" stroke={color} strokeWidth={3.5} fill="none">
        <line x1={0} y1={50} x2={100} y2={50} />
        <path d="M8 30 H92 M8 70 H92" />
        {[-40, 0, 40].map((dx) => (
          <ellipse key={dx} cx={50 + dx + shift} cy={50} rx={16} ry={44} />
        ))}
      </g>
    </svg>
  );
};

/** A bookmark ribbon (save this). */
export const Bookmark: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => (
  <svg width={size * 0.75} height={size} viewBox="0 0 75 100" style={{ overflow: "visible", opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `translateY(${(1 - Math.min(1, p)) * -60}px) scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, p))})`, filter: "drop-shadow(0 0 24px rgba(255,215,0,0.5))", ...style }}>
    <path d="M6 4 H69 V96 L37.5 72 L6 96 Z" fill={UA.yellow} stroke={UA.navy} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

/** A neutral person outline (no real likeness). */
export const PersonIcon: React.FC<{ size: number; color?: string; fill?: string }> = ({ size, color = UA.white, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fill} stroke={color} strokeWidth={6} strokeLinecap="round">
    <circle cx={50} cy={32} r={17} />
    <path d="M18 90 C18 66 32 56 50 56 C68 56 82 66 82 90" />
  </svg>
);

/** A parliament building (pediment and columns), generic. */
export const Columns: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = UA.white, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M8 34 L50 10 L92 34 Z" fill={color} />
    <rect x={12} y={38} width={76} height={6} fill={color} />
    {[18, 34, 50, 66, 82].map((x) => (
      <rect key={x} x={x - 4} y={48} width={8} height={36} fill={color} />
    ))}
    <rect x={8} y={86} width={84} height={8} fill={color} />
  </svg>
);

/** Rolling counter: shows the integer between `from` and `to` at progress `p`. */
export const roll = (from: number, to: number, p: number) => Math.round(from + (to - from) * Math.min(1, Math.max(0, p)));

/** A deterministic 0..1 wobble for hand-drawn strokes. */
export const wobble = (seed: string) => random(seed);
