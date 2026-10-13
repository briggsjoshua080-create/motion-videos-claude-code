import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../../compositions/german-election/constants";
import { float } from "../../lib/animation";

/**
 * Persistent background: warm paper, a faint dot grid, two slow-drifting colour glows
 * and the black-red-gold flag bar along the top edge. Never takes part in transitions.
 */
export const Paper: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dots" width={36} height={36} patternUnits="userSpaceOnUse">
            <circle cx={18} cy={18} r={1.6} fill={COLORS.ink} opacity={0.07} />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
            <stop offset="60%" stopColor={COLORS.paper} stopOpacity={0} />
            <stop offset="100%" stopColor={COLORS.paperDeep} stopOpacity={0.9} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#dots)" transform={`translate(0 ${(frame * 0.15) % 36})`} />
        <rect width={1080} height={1920} fill="url(#vignette)" />
      </svg>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -380 + float(frame, 40, 300),
          top: 160 + float(frame, 50, 260, 70),
          background: COLORS.gold,
          opacity: 0.1,
          filter: "blur(160px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          right: -360 + float(frame, 40, 280, 120),
          top: 1040 + float(frame, 40, 240),
          background: COLORS.red,
          opacity: 0.06,
          filter: "blur(160px)",
        }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 12, background: COLORS.black }} />
        <div style={{ height: 12, background: COLORS.red }} />
        <div style={{ height: 12, background: COLORS.gold }} />
      </div>
    </AbsoluteFill>
  );
};
