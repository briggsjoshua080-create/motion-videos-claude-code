import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter } from "../../lib/animation";
import { FR, SAFE, SceneFrame, SceneHeader, pop, span, type SceneProps } from "./ui";

/** How far the example candidate's bar fills: just past half. */
const FILL = 0.58;
const BAR_TOP = 660;
const BAR_H = 120;

export const RuleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const barIn = enter(frame, 4);
  const fill = ease(frame, span(cue("rule", "win") - 2, cue("rule", "votes", "end")), [0, FILL]);
  const half = pop(frame, cue("rule", "half") - 4);
  // Lands on "...you win outright".
  const stamp = enter(frame, cue("rule", "you") - 2, { damping: 10, stiffness: 220 });

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="ROUND 1" title="Over half wins" />

      <div
        style={{
          position: "absolute",
          top: 360,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: theme.font,
          color: FR.white,
          opacity: half,
          transform: `scale(${0.7 + 0.3 * half})`,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 8, color: FR.mist }}>MORE THAN</div>
        <div style={{ fontSize: 190, fontWeight: 900, lineHeight: 1, letterSpacing: -6 }}>50%</div>
      </div>

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
          opacity: barIn,
        }}
      >
        <div style={{ width: `${fill * 100}%`, height: "100%", background: fill > 0.5 ? FR.red : FR.white }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.center - 2,
          top: BAR_TOP - 30,
          height: BAR_H + 60,
          borderLeft: `4px dashed ${FR.white}`,
          opacity: barIn,
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
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 3,
          color: FR.white,
          opacity: barIn,
        }}
      >
        HALF OF THE VOTES
      </div>

      <div
        style={{
          position: "absolute",
          top: 950,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, stamp * 1.5),
          transform: `rotate(-6deg) scale(${1.8 - 0.8 * stamp})`,
        }}
      >
        <div
          style={{
            padding: "16px 40px",
            border: `8px solid ${FR.red}`,
            borderRadius: 24,
            background: "rgba(0,10,38,0.6)",
            color: FR.red,
            fontFamily: theme.font,
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: 2,
            whiteSpace: "nowrap",
          }}
        >
          WINS OUTRIGHT
        </div>
      </div>
    </SceneFrame>
  );
};
