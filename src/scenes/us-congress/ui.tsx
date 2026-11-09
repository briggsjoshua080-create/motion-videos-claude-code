import React from "react";
import { AbsoluteFill, interpolateColors, random, useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { progress } from "../../components/explainer/motion";
import { hemicycleSeats } from "../../components/Hemicycle";
import { BEAT_START, BPM, DURATION, FONT, FPS, H, HOUSE, LEFT, LIGHT_SPANS, MIN_TEXT, SECTIONS, US, W, WIPE, sceneFrom } from "./constants";

/** Which background a piece of text sits on: the blue backdrop, light paper, or a red re-hook flash. */
export type Tone = "blue" | "paper" | "flash";

/** How far the top of a diagonal wipe edge runs ahead of its bottom, in px. */
const SLANT = 380;
/** Width of the band that leads every wipe: the flag's blue with a red (or white) core, like the flag's stripes. */
const BAND = 96;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Deep Old Glory blue with soft drifting glows (white and red) and a vignette. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 85% at 50% 36%, ${US.bgLight} 0%, ${US.bg} 48%, ${US.bgDeep} 100%)` }}>
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
      <filter id="usc-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#usc-grain)" />
    </svg>
  );
};

/** Bottom x of a wipe edge at progress p (0 = the band just touching the top-left corner, 1 = off the right side). */
const edgeAt = (p: number) => -SLANT + p * (W + SLANT + BAND);

/** The band on a wipe edge (`e` = the edge's bottom x); it trails the edge by BAND px: blue with a lighter core. */
const WipeBand: React.FC<{ e: number; width?: number; edge?: number; core?: string }> = ({ e, width = BAND, edge = 0.22, core = US.red }) => {
  const band = (from: number, to: number, fill: string) => (
    <polygon points={`${e - to + SLANT},0 ${e - from + SLANT},0 ${e - from},${H} ${e - to},${H}`} fill={fill} />
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {band(0, width, US.blue)}
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
      ? `radial-gradient(120% 80% at 50% 40%, #F7F4EC 0%, ${US.paper} 55%, ${US.paperDeep} 100%)`
      : `radial-gradient(120% 85% at 50% 40%, ${US.redLight} 0%, ${US.red} 52%, ${US.redDeep} 100%)`;
  const core = kind === "paper" ? US.red : US.white;
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
  const accent = interpolateColors(light, [0, 1], [US.white, US.red]);
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

const headColor = (tone: Tone) => (tone === "paper" ? US.ink : US.white);

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
export const Accent: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({ tone = "blue", children }) =>
  tone === "paper" ? (
    <span style={{ color: US.red }}>{children}</span>
  ) : (
    <span
      style={{
        display: "inline-block",
        padding: "0 0.12em",
        margin: "0 -0.12em",
        lineHeight: 0.92,
        background: tone === "flash" ? US.white : US.red,
        color: tone === "flash" ? US.red : US.white,
        textShadow: "none",
        borderRadius: "0.06em",
        boxShadow: tone === "flash" ? "0 10px 30px rgba(90,0,0,0.3)" : "0 0 0 4px rgba(255,255,255,0.9), 0 0 40px rgba(210,40,63,0.45)",
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
      color: tone === "paper" ? US.inkSoft : tone === "flash" ? US.white : US.textSoft,
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

/** A rubber stamp that slams in: `p` is its pop progress (0 -> 1, may overshoot). */
export const Stamp: React.FC<{ p: number; color?: string; fill?: string; size?: number; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  p,
  color = US.white,
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
      textShadow: color === US.white ? "0 0 24px rgba(255,255,255,0.45)" : "none",
      boxShadow: color === US.white ? "0 0 30px rgba(255,255,255,0.25), inset 0 0 18px rgba(255,255,255,0.15)" : "0 18px 40px rgba(0,10,40,0.3)",
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
  color = US.red,
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

/**
 * A horse in side view, facing right (viewBox 200 × 140), drawn from simple shapes. `phase` (radians)
 * swings the legs for a gallop; leave it at 0 for the standing sticker pose.
 */
export const Horse: React.FC<{ width: number; color: string; mane?: string; phase?: number; style?: React.CSSProperties }> = ({ width, color, mane = color, phase, style }) => {
  const gallop = phase !== undefined;
  const swing = (offset: number, amount: number) => (gallop ? Math.sin(phase + offset) * amount : 0);
  const leg = (x: number, y: number, angle: number, key: string) => (
    <g key={key} transform={`rotate(${angle} ${x} ${y})`}>
      <rect x={x - 5} y={y - 4} width={10} height={48} rx={5} fill={color} />
      <rect x={x - 6} y={y + 38} width={12} height={9} rx={3} fill={mane} />
    </g>
  );
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 200 140" style={{ overflow: "visible", ...style }}>
      {/* tail */}
      <path d={`M48 58 Q22 ${54 + swing(0.5, 6)} 14 ${86 + swing(0.5, 8)} Q30 74 50 68 Z`} fill={mane} />
      {/* legs behind the body */}
      {leg(62, 76, 18 + swing(Math.PI, 30), "bl")}
      {leg(130, 76, -14 + swing(Math.PI * 0.4, 32), "fl")}
      {/* body */}
      <ellipse cx={94} cy={64} rx={52} ry={24} fill={color} />
      {/* neck and head */}
      <path d="M122 48 L150 14 L168 22 L150 72 Z" fill={color} />
      <path d="M148 12 L184 28 Q190 33 185 38 L178 41 L154 33 Z" fill={color} />
      <path d="M152 13 L156 1 L161 14 Z" fill={color} />
      <path d="M150 15 Q138 26 126 46 L132 50 Q142 32 156 20 Z" fill={mane} />
      <circle cx={168} cy={27} r={2.6} fill={mane === color ? "rgba(0,0,0,0.35)" : mane} />
      {/* legs in front of the body */}
      {leg(70, 78, -10 + swing(0, 30), "br")}
      {leg(138, 78, 10 + swing(Math.PI * 1.4, 32), "fr")}
    </svg>
  );
};

/** The gold sticker with a horse on it: the rewatch detail, small on purpose (rule 10). */
export const HorseSticker: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const points = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 45;
    const a = (i * Math.PI) / 12;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}>
        <polygon points={points} fill={US.gold} />
        <circle cx={50} cy={50} r={38} fill="none" stroke={US.goldDeep} strokeWidth={3} />
      </svg>
      <Horse width={size * 0.66} color={US.navy} style={{ position: "absolute", left: size * 0.17, top: size * 0.27 }} />
    </div>
  );
};

/**
 * A paper report card (no small text: the fine print is grey bars), with a blue-and-red header and
 * an empty grade circle on the right. `rows` puts big subject names in it instead (the result scene);
 * `sticker` adds the horse sticker in the top-right corner. Children are laid over it (stamps).
 */
export const ReportCard: React.FC<{
  width: number;
  height: number;
  rotate?: number;
  sticker?: boolean;
  rows?: string[];
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, rotate = 0, sticker = true, rows, style, children }) => {
  const header = Math.round(height * 0.16);
  const bars = [0.52, 0.38, 0.46, 0.3];
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 22,
        background: `linear-gradient(180deg, ${US.card} 0%, ${US.paper} 100%)`,
        boxShadow: "0 30px 60px rgba(0,8,30,0.45), inset 0 0 0 2px rgba(14,26,43,0.08)",
        transform: `rotate(${rotate}deg)`,
        overflow: "visible",
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width, height: header, borderRadius: "22px 22px 0 0", background: US.blue }} />
      <div style={{ position: "absolute", left: 0, top: header, width, height: 10, background: US.red }} />
      <div style={{ position: "absolute", left: width * 0.07, top: header * 0.36, width: width * 0.36, height: header * 0.28, borderRadius: 8, background: "rgba(255,255,255,0.85)" }} />
      {rows ? (
        rows.map((label, i) => {
          const rowH = (height - header - 10) / rows.length;
          return (
            <div key={label} style={{ position: "absolute", left: 0, top: header + 10 + i * rowH, width, height: rowH, borderTop: i > 0 ? `3px dashed ${US.inkFaint}` : "none" }}>
              <div style={{ position: "absolute", left: width * 0.07, top: rowH / 2 - MIN_TEXT * 0.52, fontFamily: FONT.display, fontSize: MIN_TEXT, lineHeight: 1, color: US.ink, letterSpacing: -1 }}>{label}</div>
            </div>
          );
        })
      ) : (
        <>
          {bars.map((w, i) => (
            <div key={i} style={{ position: "absolute", left: width * 0.07, top: header + 44 + i * ((height - header - 80) / bars.length), width: width * w, height: 16, borderRadius: 8, background: US.inkFaint }} />
          ))}
          <div
            style={{
              position: "absolute",
              right: width * 0.08,
              top: header + (height - header) / 2 - width * 0.15,
              width: width * 0.3,
              height: width * 0.3,
              borderRadius: "50%",
              border: `4px dashed ${US.inkFaint}`,
              boxSizing: "border-box",
            }}
          />
        </>
      )}
      {sticker && <HorseSticker size={Math.round(width * 0.17)} style={{ right: width * 0.05, top: header * 0.12, transform: "rotate(10deg)" }} />}
      {children}
    </div>
  );
};

/** The Capitol: a white dome on a colonnade (generic outline, no fine detail). */
export const CapitolDome: React.FC<{ size: number; color?: string; line?: string; style?: React.CSSProperties }> = ({ size, color = US.white, line = "rgba(10,49,97,0.35)", style }) => (
  <svg width={size} height={size * 0.82} viewBox="0 0 200 164" style={{ overflow: "visible", ...style }}>
    <rect x={97} y={2} width={6} height={12} rx={2} fill={color} />
    <circle cx={100} cy={4} r={4} fill={color} />
    <rect x={90} y={14} width={20} height={18} rx={3} fill={color} />
    <path d="M52 92 Q52 36 100 32 Q148 36 148 92 Z" fill={color} />
    {[70, 85, 100, 115, 130].map((x) => (
      <path key={x} d={`M${x} 90 Q${x + (x - 100) * 0.1} 52 ${100 + (x - 100) * 0.5} 36`} fill="none" stroke={line} strokeWidth={2} />
    ))}
    <rect x={44} y={90} width={112} height={10} rx={2} fill={color} />
    <rect x={48} y={100} width={104} height={24} fill={color} />
    {[56, 70, 84, 98, 112, 126, 140].map((x) => (
      <rect key={x} x={x} y={103} width={6} height={18} fill={line} />
    ))}
    <rect x={4} y={110} width={192} height={10} rx={2} fill={color} />
    <rect x={10} y={120} width={180} height={28} fill={color} />
    {[22, 40, 58, 136, 154, 172].map((x) => (
      <rect key={x} x={x} y={124} width={6} height={20} fill={line} />
    ))}
    <rect x={0} y={148} width={200} height={12} rx={2} fill={color} />
  </svg>
);

/** A sign on two strings, swinging from a nail: `angle` in degrees. */
export const HangingSign: React.FC<{ left: number; top: number; width: number; height: number; angle: number; children: React.ReactNode }> = ({ left, top, width, height, angle, children }) => (
  <div style={{ position: "absolute", left, top, width, height: height + 120, transformOrigin: `${width / 2}px 0px`, transform: `rotate(${angle}deg)` }}>
    <svg width={width} height={124} viewBox={`0 0 ${width} 124`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M${width * 0.12} 122 L${width / 2} 4 L${width * 0.88} 122`} fill="none" stroke={US.white} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={width / 2} cy={4} r={11} fill={US.navy} stroke={US.white} strokeWidth={4} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 118,
        width,
        height,
        borderRadius: 26,
        background: US.white,
        boxShadow: "0 24px 50px rgba(80,0,10,0.35), inset 0 0 0 10px rgba(10,49,97,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  </div>
);

/** A sheriff's six-point star (gold, with balls on its tips), generic. `p` spins it in. */
export const SheriffStar: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => {
  const outer = (i: number) => -Math.PI / 2 + (i * Math.PI) / 3;
  const pts = Array.from({ length: 12 }, (_, i) => {
    const r = i % 2 === 0 ? 44 : 22;
    const a = -Math.PI / 2 + (i * Math.PI) / 6;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  const q = clamp01(p);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", opacity: Math.min(1, q * 1.6), transform: `scale(${0.4 + 0.6 * Math.min(1.12, Math.max(0, p))}) rotate(${(1 - Math.min(1, p)) * -200}deg)`, filter: "drop-shadow(0 16px 26px rgba(60,0,10,0.4))", ...style }}
    >
      <polygon points={pts} fill={US.gold} stroke={US.goldDeep} strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={50 + 47 * Math.cos(outer(i))} cy={50 + 47 * Math.sin(outer(i))} r={5.5} fill={US.gold} stroke={US.goldDeep} strokeWidth={2} />
      ))}
      <circle cx={50} cy={50} r={15} fill="none" stroke={US.goldDeep} strokeWidth={3} />
      <circle cx={50} cy={50} r={6} fill={US.goldDeep} />
    </svg>
  );
};

/** A law: a rolled paper scroll with grey lines (no text). */
export const Scroll: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 80 100" style={{ overflow: "visible", ...style }}>
    <rect x={10} y={10} width={60} height={80} fill={US.card} />
    {[26, 36, 46, 56, 66].map((y, i) => (
      <rect key={y} x={18} y={y} width={i === 4 ? 26 : 44} height={4} rx={2} fill={US.inkFaint} />
    ))}
    <rect x={4} y={4} width={72} height={12} rx={6} fill={US.paperDeep} stroke="rgba(14,26,43,0.25)" strokeWidth={1.5} />
    <rect x={4} y={84} width={72} height={12} rx={6} fill={US.paperDeep} stroke="rgba(14,26,43,0.25)" strokeWidth={1.5} />
  </svg>
);

/** A gold coin with a dollar sign. */
export const Coin: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #FFE08A 0%, ${US.gold} 55%, ${US.goldDeep} 100%)`,
      boxShadow: `inset 0 0 0 ${size * 0.06}px ${US.goldDeep}, 0 20px 40px rgba(0,8,30,0.4)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.display,
      fontSize: Math.max(MIN_TEXT, size * 0.62),
      lineHeight: 1,
      color: US.goldDeep,
      ...style,
    }}
  >
    $
  </div>
);

/** A state as a square tile with its two-letter code (like the US video's tile map). */
export const StateTile: React.FC<{ code: string; size: number; fill?: string; color?: string; style?: React.CSSProperties }> = ({ code, size, fill = US.white, color = US.blue, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size * 0.14,
      background: fill,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.display,
      fontSize: Math.max(MIN_TEXT, size * 0.46),
      lineHeight: 1,
      color,
      boxShadow: "0 24px 44px rgba(0,8,30,0.4)",
      ...style,
    }}
  >
    {code}
  </div>
);

/** A clipboard with a form (grey bars): the voter registration. */
export const Clipboard: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 80 100" style={{ overflow: "visible", ...style }}>
    <rect x={4} y={8} width={72} height={90} rx={8} fill="#B88A55" />
    <rect x={11} y={16} width={58} height={76} rx={3} fill={US.card} />
    <rect x={26} y={2} width={28} height={14} rx={4} fill="#8D8F96" />
    {[30, 44, 58, 72].map((y) => (
      <g key={y}>
        <rect x={18} y={y} width={8} height={8} rx={1.5} fill="none" stroke={US.inkSoft} strokeWidth={2} />
        <rect x={31} y={y + 2} width={30} height={4} rx={2} fill={US.inkFaint} />
      </g>
    ))}
  </svg>
);

/** A pen (blue body, steel tip), pointing down-left; the tip is at the svg's bottom-left corner. */
export const Pen: React.FC<{ size: number; body?: string; style?: React.CSSProperties }> = ({ size, body = US.pen, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <g transform="rotate(45 50 50)">
      <rect x={42} y={-6} width={16} height={74} rx={6} fill={body} />
      <rect x={42} y={6} width={16} height={8} fill="rgba(255,255,255,0.35)" />
      <path d="M42 68 L58 68 L50 92 Z" fill="#C9CED8" />
      <path d="M48 86 L52 86 L50 92 Z" fill={US.ink} />
    </g>
  </svg>
);

/** A small car in side view, facing right (flip with scaleX(-1)). */
export const Car: React.FC<{ width: number; color: string; style?: React.CSSProperties }> = ({ width, color, style }) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", ...style }}>
    <path d="M14 70 L14 52 Q16 44 30 42 L58 40 L82 18 Q88 14 98 14 L140 14 Q150 14 156 22 L172 42 Q190 46 192 58 L192 70 Z" fill={color} />
    <path d="M90 24 L112 24 L112 40 L72 40 Z" fill="rgba(220,235,255,0.9)" />
    <path d="M120 24 L140 24 Q146 24 150 30 L158 40 L120 40 Z" fill="rgba(220,235,255,0.9)" />
    <rect x={176} y={50} width={14} height={8} rx={3} fill="#FFE28A" />
    {[52, 152].map((x) => (
      <g key={x}>
        <circle cx={x} cy={72} r={17} fill="#141B26" />
        <circle cx={x} cy={72} r={7} fill="#9AA3B2" />
      </g>
    ))}
  </svg>
);

/** A round face; `mood` picks angry (eyebrows down, frown) or sleepy (closed eyes, smile). */
export const Face: React.FC<{ size: number; mood: "angry" | "sleepy"; fill?: string; style?: React.CSSProperties }> = ({ size, mood, fill = US.white, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <circle cx={50} cy={50} r={46} fill={fill} />
    {mood === "angry" ? (
      <>
        <path d="M24 34 L44 42" stroke={US.ink} strokeWidth={7} strokeLinecap="round" />
        <path d="M76 34 L56 42" stroke={US.ink} strokeWidth={7} strokeLinecap="round" />
        <circle cx={36} cy={52} r={6} fill={US.ink} />
        <circle cx={64} cy={52} r={6} fill={US.ink} />
        <path d="M32 78 Q50 64 68 78" fill="none" stroke={US.ink} strokeWidth={7} strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M26 50 Q36 58 46 50" fill="none" stroke={US.ink} strokeWidth={6} strokeLinecap="round" />
        <path d="M54 50 Q64 58 74 50" fill="none" stroke={US.ink} strokeWidth={6} strokeLinecap="round" />
        <path d="M38 70 Q50 78 62 70" fill="none" stroke={US.ink} strokeWidth={6} strokeLinecap="round" />
      </>
    )}
  </svg>
);

/** A couch (seat, back, arms) with a sleeping person lying on it; `breath` (0..1) lifts the chest. */
export const Couch: React.FC<{ width: number; breath?: number; style?: React.CSSProperties }> = ({ width, breath = 0, style }) => (
  <svg width={width} height={width * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible", ...style }}>
    <rect x={20} y={30} width={160} height={50} rx={18} fill="#7A3E48" />
    <path d={`M54 ${66 - breath * 3} Q100 ${52 - breath * 5} 150 64 L150 74 L54 74 Z`} fill="#3E6FB8" />
    <circle cx={160} cy={58} r={14} fill={US.card} />
    <rect x={14} y={62} width={172} height={30} rx={12} fill="#9A4C58" />
    <rect x={4} y={46} width={28} height={50} rx={12} fill="#7A3E48" />
    <rect x={168} y={46} width={28} height={50} rx={12} fill="#7A3E48" />
    <rect x={26} y={92} width={10} height={16} rx={3} fill="#4A2A30" />
    <rect x={164} y={92} width={10} height={16} rx={3} fill="#4A2A30" />
  </svg>
);

/** "Z z" of a sleeper, drawn as strokes (not text); `p` floats them up. */
export const Snore: React.FC<{ size: number; p: number; style?: React.CSSProperties }> = ({ size, p, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    {[0, 1].map((i) => {
      const t = (p + i * 0.5) % 1;
      const s = i === 0 ? 1 : 0.65;
      const x = 20 + i * 38 + t * 10;
      const y = 70 - t * 40 - i * 20;
      return (
        <path
          key={i}
          d={`M${x} ${y} h${22 * s} l${-22 * s} ${22 * s} h${22 * s}`}
          fill="none"
          stroke={US.white}
          strokeWidth={6 * s}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={Math.sin(t * Math.PI)}
        />
      );
    })}
  </svg>
);

/** A neutral person outline (no real likeness). */
export const PersonIcon: React.FC<{ size: number; color?: string; fill?: string }> = ({ size, color = US.white, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fill} stroke={color} strokeWidth={6} strokeLinecap="round">
    <circle cx={50} cy={32} r={17} />
    <path d="M18 90 C18 66 32 56 50 56 C68 56 82 66 82 90" />
  </svg>
);

/** A paper plane (send this). */
export const PaperPlane: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ overflow: "visible", filter: "drop-shadow(0 18px 24px rgba(0,8,30,0.45))", ...style }}>
    <path d="M4 36 L96 4 L60 76 L46 50 Z" fill={US.white} />
    <path d="M46 50 L96 4 L40 44 Z" fill="#C9D6EC" />
    <path d="M46 50 L52 70 L60 58 Z" fill="#9FB3D6" />
  </svg>
);

/** The House: 435 seats as a dot hemicycle (seats ordered left to right), shared by two scenes. */
export const HOUSE_LAYOUT = { cx: 540, cy: 1040, rows: 10, rIn: 170, rOut: 400, dot: 7.2 } as const;
export const HOUSE_SEATS = hemicycleSeats(HOUSE, HOUSE_LAYOUT.rows, HOUSE_LAYOUT.rIn, HOUSE_LAYOUT.rOut);

/** Draws the House. `visible(i)` gives each seat's appearance (0 = hidden, 1 = in) and `fill(i)` its colour. */
export const HouseSeats: React.FC<{ visible: (i: number) => number; fill: (i: number) => string; cy?: number; scale?: number }> = ({ visible, fill, cy = HOUSE_LAYOUT.cy, scale = 1 }) => {
  const { cx, dot } = HOUSE_LAYOUT;
  const r = HOUSE_LAYOUT.rOut + dot * 2;
  return (
    <svg
      width={r * 2}
      height={r + dot * 2}
      viewBox={`${-r} ${-r} ${r * 2} ${r + dot * 2}`}
      style={{ position: "absolute", left: cx - r, top: cy - r, overflow: "visible", transformOrigin: `${r}px ${r}px`, transform: `scale(${scale})` }}
    >
      {HOUSE_SEATS.map((s, i) => {
        const v = clamp01(visible(i));
        if (v <= 0) return null;
        return <circle key={i} cx={s.x} cy={s.y + (1 - v) * 18} r={dot * (0.4 + 0.6 * v)} fill={fill(i)} opacity={v} />;
      })}
    </svg>
  );
};

/** Sweep seats in from left to right: seat i appears as `build` passes i / count. */
export const sweepIn = (build: number, i: number, count = HOUSE) => build * (count + 1) - i;

/** Rolling counter: shows the integer between `from` and `to` at progress `p`. */
export const roll = (from: number, to: number, p: number) => Math.round(from + (to - from) * clamp01(p));

/** A deterministic 0..1 wobble for hand-drawn strokes. */
export const wobble = (seed: string) => random(seed);

/** A damped swing (degrees) that starts at frame `from`: for signs and badges that settle. */
export const swingAngle = (frame: number, from: number, amount = 14, speed = 0.32, damping = 0.06) =>
  frame < from ? amount : amount * Math.exp(-(frame - from) * damping) * Math.cos((frame - from) * speed);

/* ───────────── Group-chat props (USCongress) ───────────── */

/**
 * A chat window (no text: the group name is a grey bar): a white card with an Old Glory blue header,
 * a round avatar with the Capitol in it, and a red rule under the header. Bubbles go in as children
 * (positioned inside the body, which starts at `CHAT_HEADER(height)`).
 */
export const CHAT_HEADER = (height: number) => Math.round(Math.max(64, height * 0.2));
export const ChatWindow: React.FC<{ width: number; height: number; rotate?: number; header?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  width,
  height,
  rotate = 0,
  header = US.blue,
  style,
  children,
}) => {
  const head = CHAT_HEADER(height);
  const avatar = head * 0.66;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 34,
        background: `linear-gradient(180deg, #FFFFFF 0%, #EEF2F8 100%)`,
        boxShadow: "0 30px 70px rgba(0,8,30,0.5), inset 0 0 0 2px rgba(14,26,43,0.06)",
        transform: `rotate(${rotate}deg)`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width, height: head, background: header }} />
      <div style={{ position: "absolute", left: 0, top: head, width, height: 8, background: US.red }} />
      <div
        style={{
          position: "absolute",
          left: head * 0.22,
          top: (head - avatar) / 2,
          width: avatar,
          height: avatar,
          borderRadius: "50%",
          background: US.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CapitolDome size={avatar * 0.72} color={US.blue} line="rgba(255,255,255,0.6)" />
      </div>
      <div style={{ position: "absolute", left: head * 0.22 + avatar + 22, top: head * 0.34, width: width * 0.34, height: head * 0.16, borderRadius: 8, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", left: head * 0.22 + avatar + 22, top: head * 0.6, width: width * 0.2, height: head * 0.1, borderRadius: 6, background: "rgba(255,255,255,0.45)" }} />
      {children}
    </div>
  );
};

/**
 * A chat bubble that pops in (`p`, may overshoot). Incoming bubbles are grey on the left, outgoing
 * ones blue on the right. `kind`: grey text bars, a law scroll, or the three typing dots
 * (`t` = frame, for the dots' bounce).
 */
export const Bubble: React.FC<{
  p: number;
  side?: "left" | "right";
  width: number;
  height?: number;
  kind?: "bars" | "scroll" | "dots" | "none";
  t?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ p, side = "left", width, height = 70, kind = "bars", t = 0, style, children }) => {
  const out = side === "right";
  const fill = out ? "#2F6FDE" : "#E1E6EE";
  const bar = out ? "rgba(255,255,255,0.75)" : "rgba(14,26,43,0.22)";
  const q = Math.max(0, p);
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: Math.min(36, height / 2),
        borderBottomLeftRadius: out ? Math.min(36, height / 2) : 8,
        borderBottomRightRadius: out ? 8 : Math.min(36, height / 2),
        background: fill,
        opacity: Math.min(1, q * 2),
        transform: `scale(${0.5 + 0.5 * Math.min(1.1, q)})`,
        transformOrigin: out ? "100% 100%" : "0% 100%",
        boxShadow: "0 6px 14px rgba(0,8,30,0.12)",
        ...style,
      }}
    >
      {kind === "bars" &&
        [0.78, 0.5].map((w, i) => (
          <div key={i} style={{ position: "absolute", left: height * 0.32, top: height * (0.27 + i * 0.3), width: (width - height * 0.64) * w, height: height * 0.16, borderRadius: 6, background: bar }} />
        ))}
      {kind === "scroll" && <Scroll size={height * 0.78} style={{ position: "absolute", left: (width - height * 0.62) / 2, top: height * 0.11 }} />}
      {kind === "dots" &&
        [0, 1, 2].map((i) => {
          const bounce = Math.max(0, Math.sin(t * 0.32 - i * 0.9));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width / 2 - height * 0.42 + i * height * 0.3,
                top: height / 2 - height * 0.1 - bounce * height * 0.12,
                width: height * 0.2,
                height: height * 0.2,
                borderRadius: "50%",
                background: out ? US.white : "rgba(14,26,43,0.45)",
                opacity: 0.55 + 0.45 * bounce,
              }}
            />
          );
        })}
      {children}
    </div>
  );
};

/** Two little ticks: the message was seen ("read"). */
export const DoubleTick: React.FC<{ size: number; color?: string; p?: number; style?: React.CSSProperties }> = ({ size, color = "#2F6FDE", p = 1, style }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 150 100" style={{ overflow: "visible", ...style }}>
    {[0, 46].map((dx, i) => (
      <path
        key={i}
        d={`M${10 + dx} 52 L${38 + dx} 80 L${92 + dx} 18`}
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - clamp01(p * 2 - i)}
      />
    ))}
  </svg>
);

/** A tax receipt: a paper strip with a zigzag bottom and grey bars. */
export const Receipt: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 70 100" style={{ overflow: "visible", ...style }}>
    <path d="M6 4 H64 V92 L57 86 L50 92 L43 86 L35 92 L28 86 L21 92 L14 86 L6 92 Z" fill={US.card} />
    {[16, 28, 40, 52].map((y, i) => (
      <rect key={y} x={14} y={y} width={i % 2 ? 26 : 40} height={5} rx={2.5} fill={US.inkFaint} />
    ))}
    <rect x={14} y={66} width={42} height={8} rx={3} fill={US.red} />
  </svg>
);

/** A generic figure in a suit (no likeness): round head, dark jacket, red tie. */
export const Figure: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 70 100" style={{ overflow: "visible", ...style }}>
    <circle cx={35} cy={20} r={15} fill="#F2D3B8" />
    <path d="M30 6 Q35 0 44 6 Q50 10 49 16 Q42 8 30 10 Z" fill="#C9C2B4" />
    <path d="M8 98 V58 Q8 40 35 38 Q62 40 62 58 V98 Z" fill={US.navy} />
    <path d="M28 40 L35 52 L42 40 Z" fill={US.white} />
    <path d="M33 46 L37 46 L39 70 L35 76 L31 70 Z" fill={US.red} />
  </svg>
);

/** A wall clock; `turns` spins the hands (1 = the minute hand goes round once). */
export const Clock: React.FC<{ size: number; turns: number; style?: React.CSSProperties }> = ({ size, turns, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,8,30,0.45))", ...style }}>
    <circle cx={50} cy={50} r={46} fill={US.white} stroke={US.red} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return <line key={i} x1={50 + 36 * Math.sin(a)} y1={50 - 36 * Math.cos(a)} x2={50 + 41 * Math.sin(a)} y2={50 - 41 * Math.cos(a)} stroke={US.ink} strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
    })}
    <line x1={50} y1={50} x2={50 + 22 * Math.sin((turns / 12) * 2 * Math.PI)} y2={50 - 22 * Math.cos((turns / 12) * 2 * Math.PI)} stroke={US.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={50} y1={50} x2={50 + 34 * Math.sin(turns * 2 * Math.PI)} y2={50 - 34 * Math.cos(turns * 2 * Math.PI)} stroke={US.red} strokeWidth={4} strokeLinecap="round" />
    <circle cx={50} cy={50} r={5} fill={US.ink} />
  </svg>
);

/** The Senate as 50 states × 2 seats: a 10 × 10 grid of dots, the two seats of a state side by side. */
export const SenateGrid: React.FC<{ left: number; top: number; step: number; dot: number; visible: (i: number) => number; fill: (i: number) => string }> = ({ left, top, step, dot, visible, fill }) => (
  <>
    {Array.from({ length: 100 }, (_, i) => {
      const state = Math.floor(i / 2);
      const col = (state % 5) * 2 + (i % 2);
      const row = Math.floor(state / 5);
      const v = clamp01(visible(i));
      if (v <= 0) return null;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: left + col * step + (state % 5) * step * 0.35 - dot,
            top: top + row * step - dot,
            width: dot * 2,
            height: dot * 2,
            borderRadius: "50%",
            background: fill(i),
            opacity: v,
            transform: `scale(${0.4 + 0.6 * v})`,
          }}
        />
      );
    })}
  </>
);
