import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { progress } from "../../components/explainer/motion";
import { BEAT_START, BPM, DURATION, FONT, FPS, H, LEFT, LIGHT_SPANS, MIN_TEXT, SECTIONS, UK, W, WIPE, sceneFrom } from "./constants";

/** Which background a piece of text sits on: the blue backdrop, light paper, or a red re-hook flash. */
export type Tone = "blue" | "paper" | "flash";

/** How far the top of a diagonal wipe edge runs ahead of its bottom, in px. */
const SLANT = 380;
/** Width of the band that leads every wipe: the flag's blue with a red (or white) core, like the flag's stripes. */
const BAND = 96;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Deep Union flag blue with soft drifting glows (white and red) and a vignette. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 85% at 50% 36%, ${UK.bgLight} 0%, ${UK.bg} 48%, ${UK.bgDeep} 100%)` }}>
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
          background: "radial-gradient(circle, rgba(232,71,92,0.13) 0%, rgba(232,71,92,0) 66%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(2,12,40,0.62) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Moving film grain over the whole picture, like the reference video. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="uk-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#uk-grain)" />
    </svg>
  );
};

/** Bottom x of a wipe edge at progress p (0 = the band just touching the top-left corner, 1 = off the right side). */
const edgeAt = (p: number) => -SLANT + p * (W + SLANT + BAND);

/** The band on a wipe edge (`e` = the edge's bottom x); it trails the edge by BAND px: blue with a lighter core. */
const WipeBand: React.FC<{ e: number; width?: number; edge?: number; core?: string }> = ({ e, width = BAND, edge = 0.22, core = UK.red }) => {
  const band = (from: number, to: number, fill: string) => (
    <polygon points={`${e - to + SLANT},0 ${e - from + SLANT},0 ${e - from},${H} ${e - to},${H}`} fill={fill} />
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {band(0, width, UK.blue)}
      {band(width * edge, width * (1 - edge), core)}
    </svg>
  );
};

/**
 * A light background that wipes in from the left behind a blue band when the scene starts (or at
 * `inAt`) and wipes out the same way at its end (or at `outAt`, in scene frames). "paper" is the
 * cream ballot paper; "flash" is the flag's red, used for the re-hooks (rule 5's pattern break).
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
      ? `radial-gradient(120% 80% at 50% 40%, #F7F4EC 0%, ${UK.paper} 55%, ${UK.paperDeep} 100%)`
      : `radial-gradient(120% 85% at 50% 40%, ${UK.redLight} 0%, ${UK.red} 52%, ${UK.redDeep} 100%)`;
  const core = kind === "paper" ? UK.red : UK.white;
  return (
    <>
      {outP < 1 && <AbsoluteFill style={{ clipPath: clip, background: fill }} />}
      {inP > 0 && inP < 1 && <WipeBand e={eIn} core={core} />}
      {outP > 0 && outP < 1 && <WipeBand e={eOut + BAND} core={core} />}
    </>
  );
};

/** A broad blue-and-red band that sweeps once across the whole picture between frames `from` and `from + length`. */
export const Sweep: React.FC<{ from: number; length?: number; width?: number }> = ({ from, length = 16, width = 300 }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, from + length);
  if (p <= 0 || p >= 1) return null;
  return <WipeBand e={-SLANT + p * (W + SLANT + width)} width={width} edge={0.3} />;
};

/** 0 on blue or red, 1 on paper: follows the wipes of the paper scenes (composition frames). */
const lightAmount = (frame: number) =>
  Math.max(
    0,
    ...LIGHT_SPANS.filter((s) => s.kind === "paper").map(({ from, to }) => {
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
  const accent = interpolateColors(light, [0, 1], [UK.white, UK.red]);
  const ruler = { left: 300, width: 480, y: 1858 };
  const done = Math.min(1, frame / DURATION);
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
          const x = ruler.left + (ruler.width * sceneFrom(s.scene)) / DURATION;
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

const headColor = (tone: Tone) => (tone === "paper" ? UK.ink : UK.white);

/** Huge heavy capitals with a soft glow on blue (no glow on paper or red), like the reference headlines. */
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
      textShadow: tone === "blue" ? `0 0 ${Math.round(size * 0.2)}px rgba(255,255,255,0.3), 0 0 2px rgba(255,255,255,0.5)` : tone === "flash" ? "0 6px 30px rgba(90,0,0,0.35)" : "none",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Accent words inside a headline: on blue a red block with white letters and a thin white rim (the
 * flag's three colours); on red a white block with red letters; on paper simply the flag's red.
 */
export const Accent: React.FC<{ tone?: Tone; fill?: string; children: React.ReactNode }> = ({ tone = "blue", fill, children }) =>
  tone === "paper" ? (
    <span style={{ color: fill ?? UK.red }}>{children}</span>
  ) : (
    <span
      style={{
        display: "inline-block",
        padding: "0 0.12em",
        margin: "0 -0.12em",
        lineHeight: 0.92,
        background: fill ?? (tone === "flash" ? UK.white : UK.red),
        color: fill ? UK.white : tone === "flash" ? UK.red : UK.white,
        textShadow: "none",
        borderRadius: "0.06em",
        boxShadow: tone === "flash" && !fill ? "0 10px 30px rgba(90,0,0,0.3)" : `0 0 0 4px rgba(255,255,255,0.9), 0 0 40px ${fill ? "rgba(47,154,99,0.45)" : "rgba(210,40,63,0.45)"}`,
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
      color: tone === "paper" ? UK.inkSoft : tone === "flash" ? UK.white : UK.textSoft,
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
      WebkitTextStroke: `4px ${tone === "paper" ? "rgba(10,49,97,0.5)" : "rgba(255,255,255,0.6)"}`,
      opacity: 0.4 * clamp01(p),
      transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {n}
  </div>
);

/** A rubber stamp that slams in: `p` is its pop progress (0 -> 1, may overshoot); `fade` fades it out with its scene. */
export const Stamp: React.FC<{ p: number; fade?: number; color?: string; fill?: string; size?: number; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  p,
  fade = 1,
  color = UK.white,
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
      opacity: Math.min(1, Math.max(0, p) * 2) * fade,
      transform: `rotate(${rotate}deg) scale(${1.7 - 0.7 * Math.min(1.2, Math.max(0, p))})`,
      textShadow: color === UK.white ? "0 0 24px rgba(255,255,255,0.45)" : "none",
      boxShadow: color === UK.white ? "0 0 30px rgba(255,255,255,0.25), inset 0 0 18px rgba(255,255,255,0.15)" : "0 18px 40px rgba(0,10,40,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * The teacher's grade: a red letter in a red ring, slammed on like a rubber stamp. `p` is its pop
 * progress (0 -> 1, may overshoot); `size` is the ring's diameter (the letter is never under MIN_TEXT).
 */
export const GradeStamp: React.FC<{ p: number; letter?: string; size: number; color?: string; rotate?: number; style?: React.CSSProperties }> = ({
  p,
  letter = "F",
  size,
  color = UK.red,
  rotate = -12,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${Math.round(size * 0.07)}px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.display,
      fontSize: Math.max(MIN_TEXT, size * 0.62),
      lineHeight: 1,
      color,
      opacity: Math.min(1, Math.max(0, p) * 2.2),
      transform: `rotate(${rotate}deg) scale(${1.8 - 0.8 * Math.min(1.15, Math.max(0, p))})`,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {letter}
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

/** A paper plane (send this). */
export const PaperPlane: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ overflow: "visible", filter: "drop-shadow(0 18px 24px rgba(0,8,30,0.45))", ...style }}>
    <path d="M4 36 L96 4 L60 76 L46 50 Z" fill={UK.white} />
    <path d="M46 50 L96 4 L40 44 Z" fill="#C9D6EC" />
    <path d="M46 50 L52 70 L60 58 Z" fill="#9FB3D6" />
  </svg>
);

/** Rolling counter: shows the integer between `from` and `to` at progress `p`. */
export const roll = (from: number, to: number, p: number) => Math.round(from + (to - from) * clamp01(p));


/** A damped swing (degrees) that starts at frame `from`: for signs and badges that settle. */
export const swingAngle = (frame: number, from: number, amount = 14, speed = 0.32, damping = 0.06) =>
  frame < from ? amount : amount * Math.exp(-(frame - from) * damping) * Math.cos((frame - from) * speed);

/**
 * Where the crown tag hangs on the chair, in the chair's own 200 × 220 viewBox (the crown scene's
 * magnifier aims at it). Multiply by width / 200 for pixels.
 */
export const CHAIR_TAG = { x: 186, y: 168, r: 24 } as const;

/** A small gold crown (viewBox 100 × 70), used on the tag and, big, for the King. */
export const Crown: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <svg width={width} height={width * 0.74} viewBox="0 0 100 74" style={{ overflow: "visible", ...style }}>
    <path d="M10 60 L4 18 L28 38 L50 8 L72 38 L96 18 L90 60 Z" fill={UK.gold} stroke={UK.goldDeep} strokeWidth={3} strokeLinejoin="round" />
    <rect x={8} y={58} width={84} height={14} rx={4} fill={UK.gold} stroke={UK.goldDeep} strokeWidth={3} />
    {[
      [4, 18],
      [50, 8],
      [96, 18],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r={6} fill={UK.gold} stroke={UK.goldDeep} strokeWidth={2.5} />
    ))}
    <circle cx={30} cy={65} r={4} fill={UK.red} />
    <circle cx={50} cy={65} r={4.5} fill={UK.blue} />
    <circle cx={70} cy={65} r={4} fill={UK.red} />
  </svg>
);

/**
 * A green House of Commons chair (button-tufted leather, wooden arms and legs): the running prop of
 * musical chairs. `tag` hangs the small gold crown tag on its right arm (the rewatch detail, small on
 * purpose, rule 10); `color` recolours the leather.
 */
export const Chair: React.FC<{ width: number; tag?: boolean; color?: string; style?: React.CSSProperties }> = ({ width, tag = false, color = UK.green, style }) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", filter: "drop-shadow(0 22px 30px rgba(0,8,30,0.45))", ...style }}>
    {/* legs */}
    <rect x={30} y={150} width={14} height={62} rx={4} fill={UK.woodDeep} />
    <rect x={156} y={150} width={14} height={62} rx={4} fill={UK.woodDeep} />
    {/* back with button tufting */}
    <rect x={28} y={8} width={144} height={118} rx={26} fill={color} />
    <rect x={38} y={18} width={124} height={98} rx={20} fill="rgba(255,255,255,0.08)" />
    {[36, 62, 88].map((y, r) =>
      [0, 1, 2, 3].map((c) => <circle key={`${r}-${c}`} cx={58 + c * 28 + (r % 2) * 14 - 7} cy={y + 6} r={3.4} fill="rgba(0,0,0,0.3)" />),
    )}
    {/* seat */}
    <rect x={20} y={112} width={160} height={40} rx={14} fill={color} />
    <rect x={20} y={112} width={160} height={12} rx={6} fill="rgba(255,255,255,0.12)" />
    {/* arms */}
    <rect x={6} y={84} width={30} height={70} rx={12} fill={UK.wood} />
    <rect x={164} y={84} width={30} height={70} rx={12} fill={UK.wood} />
    <rect x={18} y={148} width={164} height={14} rx={5} fill={UK.wood} />
    {tag && (
      <g>
        <path d={`M182 92 Q190 118 ${CHAIR_TAG.x} ${CHAIR_TAG.y - CHAIR_TAG.r}`} fill="none" stroke={UK.goldDeep} strokeWidth={2} />
        <path
          d={`M${CHAIR_TAG.x - 18} ${CHAIR_TAG.y - 16} L${CHAIR_TAG.x} ${CHAIR_TAG.y - 26} L${CHAIR_TAG.x + 18} ${CHAIR_TAG.y - 16} L${CHAIR_TAG.x + 18} ${CHAIR_TAG.y + 22} L${CHAIR_TAG.x - 18} ${CHAIR_TAG.y + 22} Z`}
          fill={UK.gold}
          stroke={UK.goldDeep}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <circle cx={CHAIR_TAG.x} cy={CHAIR_TAG.y - 17} r={2.6} fill={UK.goldDeep} />
        <g transform={`translate(${CHAIR_TAG.x - 12} ${CHAIR_TAG.y - 6})`}>
          <path d="M2 16 L0 4 L7 9 L12 0 L17 9 L24 4 L22 16 Z" fill={UK.goldDeep} />
          <rect x={2} y={15} width={20} height={4} rx={1} fill={UK.goldDeep} />
        </g>
      </g>
    )}
  </svg>
);

/** No. 10's black door (fanlight, knocker), drawn simply; `number` puts a big white 10 on it (only when the door is big). */
export const Door: React.FC<{ width: number; number?: boolean; style?: React.CSSProperties }> = ({ width, number = false, style }) => (
  <div style={{ position: "absolute", width, height: width * 1.6, ...style }}>
    <svg width={width} height={width * 1.6} viewBox="0 0 100 160" style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 18px 28px rgba(0,8,30,0.45))" }}>
      <path d="M4 160 L4 40 A46 40 0 0 1 96 40 L96 160 Z" fill={UK.white} />
      <path d="M12 160 L12 44 A38 32 0 0 1 88 44 L88 160 Z" fill={UK.door} />
      <path d="M16 42 A34 28 0 0 1 84 42 Z" fill="rgba(255,236,170,0.75)" />
      {[30, 50, 70].map((x) => (
        <line key={x} x1={50} y1={42} x2={x} y2={18} stroke={UK.door} strokeWidth={2.5} />
      ))}
      <circle cx={50} cy={92} r={6} fill="none" stroke={UK.gold} strokeWidth={3} />
      <circle cx={78} cy={112} r={3.5} fill={UK.gold} />
    </svg>
    {number && (
      <div style={{ position: "absolute", left: 0, top: width * 0.62, width, textAlign: "center", fontFamily: FONT.display, fontSize: MIN_TEXT, lineHeight: 1, color: UK.white }}>
        10
      </div>
    )}
  </div>
);

/** A party rosette (frilled disc with two ribbon tails) in one colour. */
export const Rosette: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => {
  const frill = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 46 : 40;
    const a = (i * Math.PI) / 16;
    return `${50 + r * Math.cos(a)},${46 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ overflow: "visible", filter: "drop-shadow(0 18px 26px rgba(0,8,30,0.4))", ...style }}>
      <path d="M38 70 L22 136 L34 128 L42 138 L50 76 Z" fill={color} />
      <path d="M62 70 L78 136 L66 128 L58 138 L50 76 Z" fill={color} />
      <polygon points={frill} fill={color} />
      <circle cx={50} cy={46} r={30} fill="rgba(255,255,255,0.22)" />
      <circle cx={50} cy={46} r={20} fill={UK.white} />
      <circle cx={50} cy={46} r={14} fill={color} />
    </svg>
  );
};

/** A ballot box (slot on top); `p` drops a folded ballot paper into it (0 = above, 1 = in). */
export const BallotBox: React.FC<{ width: number; p: number; style?: React.CSSProperties }> = ({ width, p, style }) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", ...style }}>
    <g transform={`translate(0 ${-90 + 120 * clamp01(p)})`} opacity={p >= 1 ? 0 : 1}>
      <rect x={70} y={20} width={60} height={80} rx={4} fill={UK.card} stroke="rgba(14,26,43,0.25)" strokeWidth={2} />
      <path d="M84 52 L96 64 L118 38" fill="none" stroke={UK.pen} strokeWidth={6} strokeLinecap="round" />
    </g>
    <rect x={20} y={80} width={160} height={130} rx={10} fill={UK.white} />
    <rect x={20} y={80} width={160} height={26} rx={8} fill={UK.blue} />
    <rect x={60} y={89} width={80} height={8} rx={4} fill={UK.navy} />
    <rect x={20} y={130} width={160} height={14} fill={UK.red} />
  </svg>
);

/** A neutral person outline (no real likeness). */
export const PersonIcon: React.FC<{ size: number; color?: string; fill?: string }> = ({ size, color = UK.white, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fill} stroke={color} strokeWidth={6} strokeLinecap="round">
    <circle cx={50} cy={32} r={17} />
    <path d="M18 90 C18 66 32 56 50 56 C68 56 82 66 82 90" />
  </svg>
);
