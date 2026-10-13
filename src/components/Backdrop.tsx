import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { float } from "../lib/animation";

/** Animated gradient background with drifting colour blobs. Reusable across scenes. */
export const Backdrop: React.FC<{ hue?: "blue" | "pink" }> = ({ hue = "blue" }) => {
  const frame = useCurrentFrame();
  const a = hue === "blue" ? theme.colors.accent : theme.colors.accent2;
  const b = hue === "blue" ? theme.colors.accent2 : theme.colors.accent;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 20%, ${theme.colors.bgAlt}, ${theme.colors.bg} 70%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -150 + float(frame, 60, 240),
          top: -250 + float(frame, 40, 200, 40),
          background: a,
          opacity: 0.22,
          filter: "blur(140px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          right: -150 + float(frame, 50, 220, 80),
          bottom: -250 + float(frame, 40, 180),
          background: b,
          opacity: 0.2,
          filter: "blur(140px)",
        }}
      />
    </AbsoluteFill>
  );
};
