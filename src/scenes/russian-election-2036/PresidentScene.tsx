import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RU, TERM_YEARS, type SceneProps } from "./constants";
import { Headline, SectionNumeral, Stamp, roll } from "./ui";

const BAR = { left: 140, top: 780, w: 800, h: 120 } as const;

/**
 * "He's elected for six years: over half wins, or a run-off." Section 05, the head of state: a
 * counter to 6 next to YEARS, then a vote bar with a dashed 50% line that fills to just short of
 * it, and a RUN-OFF stamp that lands on "years" (so it stays up 2 s).
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const big = pop(frame, 2);
  const count = progress(frame, 2, cue("president", "six", "end"), Easing.out(Easing.cubic));
  const head = rise(frame, 6);
  const bar = rise(frame, cue("president", "six") - 6);
  const fill = progress(frame, cue("president", "six"), cue("president", "years", "end") + 4, Easing.out(Easing.cubic));
  const stamp = pop(frame, cue("president", "years") - 2);
  const half = BAR.left + BAR.w / 2;

  return (
    <>
      <SectionNumeral n="05" p={numeral * (1 - exit)} />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 250,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          color: RU.white,
          textShadow: "0 0 60px rgba(213,43,30,0.9), 0 0 4px rgba(255,255,255,0.6)",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))})`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(1, TERM_YEARS, count)}
      </div>
      <Headline size={150} style={{ left: 400, top: 400, ...riseStyle(head, exit, 40) }}>
        YEARS
      </Headline>
      <div style={{ position: "absolute", inset: 0, ...riseStyle(bar, exit, 40) }}>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w, height: BAR.h, borderRadius: 20, background: "rgba(255,255,255,0.1)", border: `3px solid ${RU.line}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w * (0.08 + 0.38 * fill), height: BAR.h, borderRadius: 20, background: RU.red, boxShadow: "0 0 30px rgba(213,43,30,0.5)" }} />
        <div style={{ position: "absolute", left: half - 3, top: BAR.top - 30, width: 6, height: BAR.h + 60, borderRadius: 3, background: RU.white }} />
        <div style={{ position: "absolute", left: half + 20, top: BAR.top - 145, fontFamily: FONT.display, fontSize: 112, lineHeight: 1, color: RU.white }}>50%</div>
      </div>
      <Stamp p={stamp} color={RU.white} fill={RU.red} size={125} rotate={-6} style={{ left: 250, top: 960, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        RUN-OFF
      </Stamp>
    </>
  );
};
