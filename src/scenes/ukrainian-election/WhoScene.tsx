import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UA, type SceneProps } from "./constants";
import { Accent, Aside, Globe, Headline, SectionNumeral, roll } from "./ui";

/**
 * "Every citizen from 18 can vote, even from abroad." Section 02, the Vote step, opens with who can
 * vote (short, rule 3): WHO CAN VOTE?, a huge 18+ that counts up on "18", and "even from abroad."
 * with a turning globe on "abroad".
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 5)];
  const age = rise(frame, cue("who", "from") - 6);
  const count = progress(frame, cue("who", "from"), cue("who", "18", "end"), Easing.out(Easing.cubic));
  const plus = pop(frame, cue("who", "18", "end") - 2);
  const aside = rise(frame, cue("who", "18") - 4);
  const globe = pop(frame, cue("who", "abroad") - 4);

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 270, ...riseStyle(head[0], exit, 50) }}>
        WHO CAN
      </Headline>
      <Headline size={150} style={{ top: 270 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>VOTE?</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 720, top: 430, opacity: Math.min(1, Math.max(0, globe) * 1.5) * (1 - exit), transform: `scale(${0.6 + 0.4 * Math.min(1.1, Math.max(0, globe))})` }}>
        <Globe size={150} spin={frame * 0.6} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 610,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: UA.yellow,
          textShadow: "0 0 60px rgba(255,215,0,0.45)",
          whiteSpace: "nowrap",
          ...riseStyle(age, exit, 60),
        }}
      >
        {roll(0, 18, count)}
        <span style={{ display: "inline-block", opacity: Math.min(1, Math.max(0, plus) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, plus))})` }}>+</span>
      </div>
      <Aside size={118} style={{ top: 960, ...riseStyle(aside, exit, 30) }}>
        even from abroad.
      </Aside>
    </>
  );
};
