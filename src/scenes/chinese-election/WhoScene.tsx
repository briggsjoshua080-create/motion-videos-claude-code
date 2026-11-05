import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, FONT, VOTING_AGE, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral, roll } from "./ui";

/**
 * "Every citizen from 18 can, but only for a local congress." Section 02, the Vote step, opens with
 * who can vote (short, rule 3) and closes loop 4: WHO CAN VOTE?, a huge 18+ that counts up on "18",
 * and "local congress only." from "can" on (up over 2 s).
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 5)];
  const age = rise(frame, cue("who", "from") - 8);
  const count = progress(frame, cue("who", "from") - 2, cue("who", "18", "end"), Easing.out(Easing.cubic));
  const plus = pop(frame, cue("who", "18", "end") - 2);
  const aside = rise(frame, cue("who", "can") - 2);

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 270, ...riseStyle(head[0], exit, 50) }}>
        WHO CAN
      </Headline>
      <Headline size={150} style={{ top: 270 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>VOTE?</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 610,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: CN.white,
          textShadow: "0 0 60px rgba(255,222,0,0.6), 0 0 4px rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
          ...riseStyle(age, exit, 60),
        }}
      >
        {roll(0, VOTING_AGE, count)}
        <span style={{ display: "inline-block", color: CN.yellow, textShadow: "0 0 30px rgba(255,222,0,0.5)", opacity: Math.min(1, Math.max(0, plus) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, plus))})` }}>+</span>
      </div>
      <Aside size={118} style={{ top: 960, ...riseStyle(aside, exit, 30) }}>
        local congress only.
      </Aside>
    </>
  );
};
