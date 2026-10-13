import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import type { Cue } from "../../voiceover/timing";

/** Every scene gets the voice-over cue function and its own length in frames. */
export type SceneProps = { cue: Cue; duration: number };

/** Dutch flag colours (red, white, blue), the national orange, and the navy background. */
export const NL = {
  red: "#AE1C28",
  redBright: "#E5404B",
  white: "#FFFFFF",
  blue: "#21468B",
  sky: "#8FB1F2",
  top: "#173A85",
  navy: "#0B1F4D",
  deep: "#040C22",
  orange: "#FF7F00",
  orangeLight: "#FFB15C",
  gold: "#FFC23D",
  mist: "#AFC1EA",
  seat: "#3E5AA5",
  paper: "#F7F3EA",
  ink: "#14213D",
  inkSoft: "#5B6785",
  glass: "rgba(255,255,255,0.08)",
  line: "rgba(255,255,255,0.28)",
} as const;

/** Content stays inside x 120–960: clear of the TikTok/Reels/Shorts buttons on the right. */
export const SAFE = { left: 120, width: 840, center: 540 } as const;

/** A frame range interpolate() always accepts, even if the cues come out equal. */
export const span = (a: number, b: number): [number, number] => [a, Math.max(a + 1, b)];

/** A snappier spring for things that pop in. */
export const pop = (frame: number, at: number) => enter(frame, at, { damping: 12, stiffness: 170 });

/** 0 -> 1 between two frames, clamped. */
export const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, span(from, to), [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Persistent background: deep blue with soft orange and red glows and slowly drifting specks. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${NL.top} 0%, ${NL.navy} 45%, ${NL.deep} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Soft glows as radial gradients: same look as a blur, far cheaper to render. */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          right: -700 + float(frame, 40, 260),
          top: -620 + float(frame, 30, 210, 50),
          background: "radial-gradient(circle, rgba(255,127,0,0.32) 0%, rgba(255,127,0,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -680 + float(frame, 40, 240, 90),
          bottom: -260 + float(frame, 30, 200),
          background: "radial-gradient(circle, rgba(174,28,40,0.30) 0%, rgba(174,28,40,0) 60%)",
        }}
      />
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const y = (random(`y${i}`) * 2100 - frame * (0.3 + random(`s${i}`) * 0.5)) % 2100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + float(frame, 12, 120, i * 13),
              top: y < -40 ? y + 2100 : y,
              width: 6 + random(`r${i}`) * 6,
              height: 6 + random(`r${i}`) * 6,
              borderRadius: "50%",
              background: i % 3 === 0 ? NL.orangeLight : NL.white,
              opacity: 0.08 + random(`o${i}`) * 0.12,
            }}
          />
        );
      })}
      {/* Dutch tricolour along the top edge. */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 18, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, background: NL.red }} />
        <div style={{ flex: 1, background: NL.white }} />
        <div style={{ flex: 1, background: NL.blue }} />
      </div>
    </AbsoluteFill>
  );
};

/** Fades a scene in and out so back-to-back scenes swap cleanly. */
export const SceneFrame: React.FC<{ duration: number; fadeIn?: boolean; children: React.ReactNode }> = ({
  duration,
  fadeIn = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, duration - 6, duration], [fadeIn ? 0 : 1, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Small Dutch flag: red, white and blue stripes. */
export const FlagChip: React.FC<{ width: number }> = ({ width }) => (
  <div
    style={{
      width,
      height: width * 0.66,
      borderRadius: width * 0.12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    }}
  >
    <div style={{ flex: 1, background: NL.red }} />
    <div style={{ flex: 1, background: NL.white }} />
    <div style={{ flex: 1, background: NL.blue }} />
  </div>
);

/** Small kicker line (with a flag) plus a big title at the top of a scene. */
export const SceneHeader: React.FC<{ kicker: string; title: string; delay?: number; titleSize?: number }> = ({
  kicker,
  title,
  delay = 0,
  titleSize = 76,
}) => {
  const frame = useCurrentFrame();
  const a = enter(frame, delay);
  const b = enter(frame, delay + 4);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: SAFE.left,
        width: SAFE.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        fontFamily: theme.font,
        color: NL.white,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 4,
          color: NL.orangeLight,
          opacity: a,
          transform: `translateY(${(1 - a) * 20}px)`,
        }}
      >
        <FlagChip width={44} />
        {kicker}
      </div>
      <div
        style={{
          fontSize: titleSize,
          fontWeight: 900,
          letterSpacing: -1.5,
          lineHeight: 1.05,
          opacity: b,
          transform: `translateY(${(1 - b) * 30}px)`,
          textShadow: "0 6px 24px rgba(0,0,0,0.35)",
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  border?: string;
  style?: React.CSSProperties;
}> = ({ children, bg = NL.orange, color = NL.white, size = 36, border = "none", style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      padding: `${size * 0.28}px ${size * 0.7}px`,
      borderRadius: 999,
      background: bg,
      border,
      color,
      fontFamily: theme.font,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: size * 0.04,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A rubber stamp that slams in (p: 0 -> 1). */
export const Stamp: React.FC<{ text: string; p: number; size?: number; rotate?: number; color?: string }> = ({
  text,
  p,
  size = 64,
  rotate = -10,
  color = NL.redBright,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.22}px ${size * 0.55}px`,
      border: `${size * 0.12}px solid ${color}`,
      borderRadius: size * 0.35,
      background: "rgba(4,12,34,0.92)",
      color,
      fontFamily: theme.font,
      fontSize: size,
      fontWeight: 900,
      letterSpacing: size * 0.04,
      whiteSpace: "nowrap",
      opacity: Math.min(1, p * 1.5),
      transform: `rotate(${rotate}deg) scale(${1.8 - 0.8 * p})`,
      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
    }}
  >
    {text}
  </div>
);

/** Royal crown in gold and the national orange. `id` keeps the SVG gradient ids unique. */
export const Crown: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 120 94">
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={NL.gold} />
        <stop offset="100%" stopColor={NL.orange} />
      </linearGradient>
    </defs>
    <path d="M12 70 L18 22 L40 48 L60 10 L80 48 L102 22 L108 70 Z" fill={`url(#${id}-g)`} stroke={NL.orange} strokeWidth={3} strokeLinejoin="round" />
    <rect x={8} y={66} width={104} height={22} rx={7} fill={`url(#${id}-g)`} stroke={NL.orange} strokeWidth={3} />
    <circle cx={18} cy={20} r={7} fill={NL.white} />
    <circle cx={60} cy={9} r={8} fill={NL.white} />
    <circle cx={102} cy={20} r={7} fill={NL.white} />
    <circle cx={36} cy={77} r={5.5} fill={NL.red} />
    <circle cx={60} cy={77} r={6.5} fill={NL.blue} />
    <circle cx={84} cy={77} r={5.5} fill={NL.red} />
  </svg>
);

/** Generic head-and-shoulders figure (no real likenesses). */
export const Person: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={19} fill={color} />
    <path d="M14 96c0-22 16-38 36-38s36 16 36 38z" fill={color} />
  </svg>
);

/** A round portrait badge with a generic figure inside. */
export const Medallion: React.FC<{ r: number; ring: string; id: string; dim?: boolean }> = ({ r, ring, id, dim = false }) => (
  <svg width={r * 2} height={r * 2} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id={`${id}-bg`} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor={dim ? NL.seat : NL.sky} />
        <stop offset="100%" stopColor={NL.blue} />
      </radialGradient>
      <clipPath id={`${id}-clip`}>
        <circle cx={100} cy={100} r={92} />
      </clipPath>
    </defs>
    <circle cx={100} cy={100} r={96} fill={`url(#${id}-bg)`} stroke={ring} strokeWidth={8} />
    <g clipPath={`url(#${id}-clip)`}>
      <circle cx={100} cy={80} r={34} fill={NL.white} opacity={dim ? 0.55 : 0.95} />
      <path d="M36 200c0-42 28-70 64-70s64 28 64 70z" fill={NL.white} opacity={dim ? 0.55 : 0.95} />
    </g>
  </svg>
);

/** A path that draws itself (p: 0 -> 1). */
export const DrawnPath: React.FC<{ d: string; p: number; color: string; width: number }> = ({ d, p, color, width }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="1"
    strokeDashoffset={1 - Math.min(1, Math.max(0, p))}
  />
);

/** Big number that counts up with `p` (0 -> 1). */
export const countTo = (target: number, p: number) => Math.round(target * Math.min(1, Math.max(0, p)));
