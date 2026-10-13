import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { starPath } from "./icons";
import type { ExplainerPalette } from "./palette";

/**
 * Persistent white background: a faint drifting dot grid, two soft colour glows and the flag
 * as a thin bar along the top edge. Mount it once behind all scenes; it never transitions.
 */
export const Paper: React.FC<{ palette: ExplainerPalette }> = ({ palette: c }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: c.paper, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="paper-dots" width={36} height={36} patternUnits="userSpaceOnUse">
            <circle cx={18} cy={18} r={1.6} fill={c.ink} opacity={0.07} />
          </pattern>
          <radialGradient id="paper-vignette" cx="50%" cy="45%" r="75%">
            <stop offset="60%" stopColor={c.paper} stopOpacity={0} />
            <stop offset="100%" stopColor={c.paperDeep} stopOpacity={0.9} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#paper-dots)" transform={`translate(0 ${(frame * 0.15) % 36})`} />
        <rect width={1080} height={1920} fill="url(#paper-vignette)" />
      </svg>
      {/* Soft glows as radial gradients: same look as a blur, far cheaper to render. */}
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -760 + float(frame, 40, 300),
          top: -40 + float(frame, 50, 260, 70),
          background: `radial-gradient(circle, ${c.glows[0]} 0%, rgba(255,255,255,0) 62%)`,
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -720 + float(frame, 40, 280, 120),
          top: 880 + float(frame, 40, 240),
          background: `radial-gradient(circle, ${c.glows[1]} 0%, rgba(255,255,255,0) 62%)`,
          opacity: 0.12,
        }}
      />
      {c.emblem === "eu" ? (
        <svg width={1080} height={22} style={{ position: "absolute", top: 0, left: 0, filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.05))" }}>
          <rect width={1080} height={22} fill={c.flag[0]} />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={starPath(45 + i * 90, 11, 6.5)} fill={c.accent} />
          ))}
        </svg>
      ) : c.emblem === "uk" ? (
        // The Union flag's horizontal arm: a red stripe edged in white, on blue.
        <svg width={1080} height={24} style={{ position: "absolute", top: 0, left: 0, filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.05))" }}>
          <rect width={1080} height={24} fill={c.flag[0]} />
          <rect y={7} width={1080} height={10} fill={c.flag[1]} />
          <rect y={9} width={1080} height={6} fill={c.flag[2]} />
        </svg>
      ) : (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: c.flagVertical ? "row" : "column",
          height: c.flagVertical ? 24 : undefined,
          boxShadow: "0 2px 0 rgba(0,0,0,0.05)",
        }}
      >
        {c.flag.map((color, i) => (
          <div key={`${color}-${i}`} style={{ flex: 1, height: c.flagVertical ? undefined : 12, background: color }} />
        ))}
      </div>
      )}
    </AbsoluteFill>
  );
};
