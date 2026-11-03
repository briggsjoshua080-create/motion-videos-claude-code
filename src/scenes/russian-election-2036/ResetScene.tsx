import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RU, TERMS_BEFORE, type SceneProps } from "./constants";
import { Aside, Headline, SectionNumeral, Stamp, roll } from "./ui";

/**
 * "In 2020, a rule change reset his terms to zero." Section 01, the first payoff (rule 3) and a
 * partial answer to loop 1: "in 2020." and HIS TERMS from the start, a huge counter that shows his
 * four terms and rolls down to 0 between "reset" and "zero", and a RESET stamp that lands on
 * "change" (so it stays up over 2 s, rule 6).
 */
export const ResetScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const aside = rise(frame, 1);
  const head = [rise(frame, 3), rise(frame, 6)];
  const count = rise(frame, 6);
  const roll0 = progress(frame, cue("reset", "reset"), cue("reset", "zero", "end") - 2, Easing.inOut(Easing.cubic));
  const settle = pop(frame, cue("reset", "zero", "end") - 2);
  const stamp = pop(frame, cue("reset", "change") - 4);

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Aside size={125} style={{ top: 250, ...riseStyle(aside, exit, 30) }}>
        in 2020,
      </Aside>
      <Headline size={160} style={{ top: 390, ...riseStyle(head[0], exit, 50) }}>
        HIS
      </Headline>
      <Headline size={160} style={{ top: 390 + 157, ...riseStyle(head[1], exit, 50) }}>
        TERMS
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 730,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: RU.white,
          textShadow: "0 0 60px rgba(213,43,30,0.9), 0 0 4px rgba(255,255,255,0.6)",
          ...riseStyle(count, exit, 60),
          transform: `${riseStyle(count, exit, 60).transform} scale(${1 + 0.08 * Math.max(0, settle - 1)})`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(TERMS_BEFORE, 0, roll0)}
      </div>
      <Stamp p={stamp} color={RU.white} fill={RU.red} size={130} rotate={-8} style={{ left: 450, top: 820, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        RESET
      </Stamp>
    </>
  );
};
