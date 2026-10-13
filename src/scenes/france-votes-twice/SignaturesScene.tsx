import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter } from "../../lib/animation";
import { FR, Pill, SAFE, SceneFrame, SceneHeader, pop, span, type SceneProps } from "./ui";

/** 25 x 20 = 500 dots, one per signature. */
const COLS = 25;
const ROWS = 20;
const PITCH = 24;
const DOT = 14;
const GRID_TOP = 700;
const GRID_LEFT = SAFE.center - (COLS * PITCH - (PITCH - DOT)) / 2;

export const SignaturesScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const count = interpolate(
    frame,
    span(cue("signatures", "500") - 4, cue("signatures", "officials", "end")),
    [0, 500],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const numberIn = enter(frame, cue("signatures", "need") - 4);
  const fromIn = ease(frame, span(cue("signatures", "elected") - 2, cue("signatures", "elected") + 10));
  const mayors = pop(frame, cue("signatures", "like") - 2);

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="STEP 1" title="Get on the ballot" />

      <div
        style={{
          position: "absolute",
          top: 340,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: theme.font,
          color: FR.white,
          opacity: numberIn,
          transform: `scale(${0.85 + 0.15 * numberIn})`,
        }}
      >
        <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1, letterSpacing: -6, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(count)}
        </div>
        <div style={{ marginTop: 6, fontSize: 40, fontWeight: 800, letterSpacing: 10 }}>SIGNATURES</div>
        <div style={{ marginTop: 10, fontSize: 32, fontWeight: 600, color: FR.mist, opacity: fromIn }}>
          from elected officials
        </div>
      </div>

      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const on = Math.max(0, Math.min(1, count - i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: GRID_LEFT + (i % COLS) * PITCH,
              top: GRID_TOP + Math.floor(i / COLS) * PITCH,
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              background: FR.white,
              opacity: (0.12 + 0.88 * on) * numberIn,
              transform: `scale(${0.6 + 0.4 * on})`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 900,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          opacity: mayors,
          transform: `scale(${mayors})`,
        }}
      >
        <Pill size={48}>LIKE MAYORS</Pill>
      </div>
    </SceneFrame>
  );
};
