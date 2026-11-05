import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UK, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral, roll } from "./ui";

/** The line that runs along and then drops off a cliff (local elections, May 2026). */
const LINE = "M120 560 L300 540 L460 575 L600 548 L690 560 L760 900";

/**
 * "Then Labour crashed in May's elections. Nearly 100 MPs told Starmer to go." Section 03, why now:
 * CRASHED. over a line that drops off a cliff on "crashed"; then, on "Nearly", NEARLY / 100 MPs
 * (counting up) / said: go.
 */
export const MayScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const draw = progress(frame, 2, cue("may", "elections", "end"), Easing.inOut(Easing.cubic));
  const nearly = cue("may", "Nearly");
  const second = [rise(frame, nearly - 6), rise(frame, cue("may", "100") - 4), rise(frame, cue("may", "told") - 4)];
  const count = progress(frame, cue("may", "100") - 4, cue("may", "MPs", "end"), Easing.out(Easing.cubic));
  const lineOut = progress(frame, nearly - 8, nearly);

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 270, ...riseStyle(head, exit, 50) }}>
        CRASHED.
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: (1 - lineOut) * (1 - exit) }}>
        <line x1={120} x2={960} y1={920} y2={920} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeDasharray="14 12" />
        <path d={LINE} fill="none" stroke={UK.red} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {draw > 0.98 && <circle cx={760} cy={900} r={20} fill={UK.white} stroke={UK.red} strokeWidth={8} />}
      </svg>
      <Headline size={130} style={{ top: 520, ...riseStyle(second[0], exit, 40) }}>
        NEARLY
      </Headline>
      <Headline size={175} style={{ top: 520 + 140, ...riseStyle(second[1], exit, 40) }}>
        <Accent>{roll(0, 100, count)} MPs</Accent>
      </Headline>
      <Aside size={120} style={{ top: 520 + 140 + 200, ...riseStyle(second[2], exit, 30) }}>
        told him: go.
      </Aside>
    </>
  );
};
