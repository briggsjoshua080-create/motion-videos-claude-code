import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, FONT, XI_VOTES, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral, Stamp, WipeLayer } from "./ui";

/**
 * "That's how Xi got a third term in 2023." Section 05, the worked example and the full answer to
 * loop 1, on light paper: the hook's 2,952 counts up again in red, TO ZERO under it, and a 3RD TERM
 * stamp that lands on "Xi" (up over 2 s). A callback to frame 0.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 2);
  const aside = rise(frame, 2);
  const big = pop(frame, 4);
  const count = progress(frame, 4, 34, Easing.out(Easing.cubic));
  const head = rise(frame, 14);
  const stamp = pop(frame, cue("result", "Xi") - 2);

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <SectionNumeral n="05" tone="paper" p={numeral * (1 - exit)} />
      <Aside tone="paper" size={125} style={{ top: 250, ...riseStyle(aside, exit, 30) }}>
        in 2023,
      </Aside>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 390,
          fontFamily: FONT.display,
          fontSize: 260,
          lineHeight: 0.92,
          letterSpacing: -5,
          color: CN.red,
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))})`,
          transformOrigin: "0 50%",
        }}
      >
        {Math.round(XI_VOTES * count).toLocaleString("en-US")}
      </div>
      <Headline tone="paper" size={150} style={{ top: 660, ...riseStyle(head, exit, 40) }}>
        TO <Accent tone="paper">ZERO</Accent>
      </Headline>
      <Stamp p={stamp} color={CN.red} fill="rgba(255,255,255,0.9)" size={115} rotate={-7} style={{ left: 170, top: 900, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit), border: `11px solid ${CN.red}` }}>
        3RD TERM
      </Stamp>
    </>
  );
};
