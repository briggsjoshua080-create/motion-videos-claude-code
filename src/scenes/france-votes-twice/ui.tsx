import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import type { Cue } from "../../voiceover/timing";

/** Every scene gets the voice-over cue function and its own length in frames. */
export type SceneProps = { cue: Cue; duration: number };

/** French flag colours plus the navy used for the background. */
export const FR = {
  blue: "#0055a4",
  red: "#ef4135",
  white: "#ffffff",
  navy: "#00174d",
  deep: "#000a26",
  mist: "#9fb2e6",
  glass: "rgba(255,255,255,0.08)",
  line: "rgba(255,255,255,0.3)",
} as const;

/** Content stays inside x 140–940: clear of the TikTok/Reels/Shorts buttons on the right. */
export const SAFE = { left: 140, width: 800, center: 540 } as const;

/** A frame range interpolate() always accepts, even if the cues come out equal. */
export const span = (a: number, b: number): [number, number] => [a, Math.max(a + 1, b)];

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A snappier spring for things that pop in. */
export const pop = (frame: number, at: number) => enter(frame, at, { damping: 12, stiffness: 170 });

export const FlagBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, #062a80 0%, ${FR.navy} 45%, ${FR.deep} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 950,
          height: 950,
          borderRadius: "50%",
          left: -320 + float(frame, 40, 260),
          top: -280 + float(frame, 30, 210, 50),
          background: FR.blue,
          opacity: 0.45,
          filter: "blur(170px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          right: -360 + float(frame, 40, 240, 90),
          bottom: 260 + float(frame, 30, 200),
          background: FR.red,
          opacity: 0.18,
          filter: "blur(170px)",
        }}
      />
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

export const Tricolour: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <div style={{ display: "flex", width, height, borderRadius: height / 2, overflow: "hidden", flexShrink: 0 }}>
    <div style={{ flex: 1, background: FR.blue }} />
    <div style={{ flex: 1, background: FR.white }} />
    <div style={{ flex: 1, background: FR.red }} />
  </div>
);

/** Small kicker line plus a big title at the top of a scene. */
export const SceneHeader: React.FC<{ kicker: string; title: string; delay?: number }> = ({
  kicker,
  title,
  delay = 0,
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
        color: FR.white,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 4,
          opacity: a,
          transform: `translateY(${(1 - a) * 20}px)`,
        }}
      >
        <Tricolour width={48} height={8} />
        {kicker}
        <Tricolour width={48} height={8} />
      </div>
      <div
        style={{
          fontSize: 70,
          fontWeight: 900,
          letterSpacing: -1.5,
          lineHeight: 1.05,
          opacity: b,
          transform: `translateY(${(1 - b) * 30}px)`,
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
}> = ({ children, bg = FR.red, color = FR.white, size = 34, border = "none", style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: `${size * 0.28}px ${size * 0.7}px`,
      borderRadius: 999,
      background: bg,
      border,
      color,
      fontFamily: theme.font,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: size * 0.05,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Simple head-and-shoulders icon for a (generic) candidate. */
export const PersonIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={19} fill={color} />
    <path d="M14 94c0-22 16-38 36-38s36 16 36 38z" fill={color} />
  </svg>
);
