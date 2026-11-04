import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { GradeStamp, Headline, ReportCard, SectionNumeral } from "./ui";

const CARD = { left: 120, top: 570, width: 840, height: 500, rows: ["HOUSE", "SENATE"] } as const;
const STAMP = 170;

/**
 * "On Tuesday, Democrats won the House and the Senate." Section 04 and the callback (comedy formula,
 * rule 6): the report card from frame 0 comes back with two subjects, HOUSE and SENATE, under
 * DEMOCRATS WON BOTH.; a red F slams onto each subject on "won" (the president's party lost both).
 * The horse sticker is on the card again, still unexplained (rule 10). The scene runs on into "From
 * January," so the grades stay up 2 s (rule 6).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, cue("result", "Democrats") - 8), rise(frame, cue("result", "Democrats") - 4)];
  const card = rise(frame, 1);
  const hits = [cue("result", "won") - 3, cue("result", "won") + 2];
  const stamps = hits.map((t) => progress(frame, t - 6, t, Easing.in(Easing.cubic)));
  const shake = hits.reduce((s, t) => (frame >= t && frame < t + 6 ? s + Math.sin((frame - t) * 2.6) * 6 * (1 - (frame - t) / 6) : s), 0);
  const rowH = (CARD.height - CARD.height * 0.16 - 10) / CARD.rows.length;

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Headline size={118} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        DEMOCRATS
      </Headline>
      <Headline size={130} style={{ top: 250 + 118 * 0.98 + 6, ...riseStyle(head[1], exit, 40) }}>
        WON BOTH.
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, card * 1.2) * (1 - exit), transform: `translate(${shake}px, ${(1 - card) * 260 - exit * 40}px)` }}>
        <ReportCard width={CARD.width} height={CARD.height} rotate={-2} rows={[...CARD.rows]} style={{ left: CARD.left, top: CARD.top }}>
          {CARD.rows.map((row, i) => (
            <GradeStamp key={row} p={stamps[i]} size={STAMP} rotate={-12 + i * 6} style={{ left: CARD.width - CARD.width * 0.07 - STAMP, top: CARD.height * 0.16 + 10 + i * rowH + (rowH - STAMP) / 2 }} />
          ))}
        </ReportCard>
      </div>
    </>
  );
};
