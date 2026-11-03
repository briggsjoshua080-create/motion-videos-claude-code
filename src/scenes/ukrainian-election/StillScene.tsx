import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTED, FONT, NOW_YEAR, UA, type SceneProps } from "./constants";
import { Aside, Columns, Headline, SectionNumeral, StarBadge, roll } from "./ui";

/**
 * "Its president and parliament were elected in 2019, and they're still there." Section 01. The
 * strongest fact early (rule 3): a star (the president) and a parliament building pop on their
 * words, ELECTED rises, a huge year counter rolls back from 2026 to 2019, and "and still there."
 * comes in with the year (so it stays up 2 s, rule 6).
 */
export const StillScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const star = pop(frame, cue("still", "president") - 4);
  const house = pop(frame, cue("still", "parliament") - 4);
  const head = rise(frame, cue("still", "elected") - 6);
  const year = rise(frame, cue("still", "in") - 8);
  const count = progress(frame, cue("still", "in"), cue("still", "2019", "end") - 4, Easing.out(Easing.cubic));
  const settle = pop(frame, cue("still", "2019", "end") - 4);
  const aside = rise(frame, cue("still", "2019") - 4);

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <div style={{ position: "absolute", left: 120, top: 250, display: "flex", gap: 40, opacity: 1 - exit }}>
        <StarBadge size={150} p={star} />
        <div style={{ opacity: Math.min(1, Math.max(0, house) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.1, Math.max(0, house))})` }}>
          <Columns size={150} />
        </div>
      </div>
      <Headline size={150} style={{ top: 440, ...riseStyle(head, exit, 50) }}>
        ELECTED
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 600,
          fontFamily: FONT.display,
          fontSize: 290,
          lineHeight: 0.92,
          letterSpacing: -4,
          color: UA.yellow,
          textShadow: "0 0 60px rgba(255,215,0,0.45)",
          ...riseStyle(year, exit, 60),
          transform: `${riseStyle(year, exit, 60).transform} scale(${1 + 0.06 * Math.max(0, settle - 1)})`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(NOW_YEAR, ELECTED, count)}
      </div>
      <Aside size={125} style={{ top: 930, ...riseStyle(aside, exit, 30) }}>
        and still there.
      </Aside>
    </>
  );
};
