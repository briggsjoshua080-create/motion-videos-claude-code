import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral } from "./ui";

/**
 * "Not the public: just under 3,000 lawmakers." Section 01, the first payoff (rule 3) and a partial
 * answer to loop 1: NOT THE PUBLIC from the start, a huge counter that rolls up to 3,000 as the
 * number is spoken, "lawmakers only.".
 */
export const FewScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 4)];
  const count = rise(frame, cue("few", "just") - 6);
  const roll = progress(frame, cue("few", "just") - 2, cue("few", "3,000", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, cue("few", "just") - 2);
  const n = Math.round(3000 * roll);

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        NOT THE
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PUBLIC</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 660,
          fontFamily: FONT.display,
          fontSize: 230,
          lineHeight: 0.92,
          letterSpacing: -4,
          color: CN.white,
          textShadow: "0 0 60px rgba(255,222,0,0.6), 0 0 4px rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
          ...riseStyle(count, exit, 60),
        }}
      >
        {n.toLocaleString("en-US")}
      </div>
      <Aside size={120} style={{ top: 900, ...riseStyle(aside, exit, 30) }}>
        lawmakers only.
      </Aside>
    </>
  );
};
