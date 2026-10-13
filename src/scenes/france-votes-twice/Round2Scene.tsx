import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease } from "../../lib/animation";
import { FR, Pill, SAFE, SceneFrame, SceneHeader, pop, span, type SceneProps } from "./ui";

/** Official second-round results, 24 April 2022 (Conseil constitutionnel). */
const MACRON = 58.55;
const LE_PEN = 41.45;
const BAR_TOP = 720;
const BAR_H = 130;

export const Round2Scene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const g = ease(frame, span(cue("r2", "Macron") - 6, cue("r2", "Macron") + 22));
  const win = pop(frame, cue("r2", "won") - 3);
  const columns = [
    { name: "MACRON", pct: MACRON, color: FR.white, left: SAFE.left, align: "flex-start" as const },
    { name: "LE PEN", pct: LE_PEN, color: FR.mist, left: SAFE.center, align: "flex-end" as const },
  ];

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="2022 · ROUND 2" title="The run-off" />

      <div
        style={{
          position: "absolute",
          top: 380,
          left: SAFE.left,
          opacity: win,
          transform: `scale(${win})`,
          transformOrigin: "left center",
        }}
      >
        <Pill size={30}>WINNER</Pill>
      </div>

      {columns.map((c) => (
        <div
          key={c.name}
          style={{
            position: "absolute",
            top: 460,
            left: c.left,
            width: SAFE.width / 2,
            display: "flex",
            flexDirection: "column",
            alignItems: c.align,
            fontFamily: theme.font,
            color: c.color,
            opacity: g,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>{c.name}</div>
          <div style={{ fontSize: 100, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
            {(c.pct * g).toFixed(2)}%
          </div>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: BAR_TOP,
          left: SAFE.left,
          width: SAFE.width,
          height: BAR_H,
          borderRadius: 28,
          background: FR.glass,
          border: `3px solid ${FR.line}`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${MACRON * g}%`, background: FR.white }} />
        <div
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${LE_PEN * g}%`, background: FR.mist, opacity: 0.7 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.center - 2,
          top: BAR_TOP - 30,
          height: BAR_H + 60,
          borderLeft: `4px dashed ${FR.red}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: BAR_TOP + BAR_H + 44,
          left: SAFE.left,
          width: SAFE.width,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 3,
          color: FR.white,
        }}
      >
        50%
      </div>
    </SceneFrame>
  );
};
