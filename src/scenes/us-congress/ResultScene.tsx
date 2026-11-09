import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { HOUSE, PARTY, RESULT, US, type SceneProps } from "./constants";
import { Accent, Headline, HouseSeats, SectionNumeral, SenateGrid, sweepIn } from "./ui";

/**
 * "On November 3, Democrats took both chats." Section 05, the worked example (3 Nov 2026, AP
 * projections): DEMOCRATS / TOOK / BOTH, while the House hemicycle and the Senate grid recolour
 * from left to right into a Democratic majority (light blue), Republicans in red, races still
 * uncalled in grey. Colours only, no seat numbers on screen (rule 7; counts were still moving).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, cue("result", "Democrats") - 6), rise(frame, cue("result", "took") - 6), pop(frame, cue("result", "both") - 5)];
  const charts = rise(frame, 1);
  const paint = progress(frame, cue("result", "Democrats") - 4, cue("result", "chats", "end"));
  const houseColor = (i: number) => {
    if (sweepIn(paint, i) <= 0) return US.white;
    if (i < RESULT.house.d) return PARTY.d;
    if (i >= HOUSE - RESULT.house.r) return PARTY.r;
    return PARTY.open;
  };
  const senateColor = (i: number) => {
    if (paint * 101 - i <= 0) return US.white;
    if (i < RESULT.senate.d) return PARTY.d;
    if (i >= 100 - RESULT.senate.r) return PARTY.r;
    return PARTY.open;
  };
  // Senate seats ordered so the Democratic seats fill the grid first (state pairs are not real states).

  return (
    <>
      <SectionNumeral n="05" p={numeral * (1 - exit)} />
      <Headline size={120} style={{ top: 220, ...riseStyle(head[0], exit, 40) }}>
        DEMOCRATS
      </Headline>
      <Headline size={130} style={{ top: 220 + 125, ...riseStyle(head[1], exit, 40) }}>
        TOOK
      </Headline>
      <Headline size={175} style={{ top: 220 + 125 + 135, opacity: Math.min(1, Math.max(0, head[2]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}>
        <Accent>BOTH</Accent>
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(charts, exit, 60) }}>
        <div style={{ position: "absolute", left: -95, top: 0, width: 1080, height: 1920, transform: "scale(0.7)", transformOrigin: "300px 1120px" }}>
          <HouseSeats visible={() => 1} fill={houseColor} cy={1120} />
        </div>
        <SenateGrid left={612} top={820} step={30} dot={11} visible={() => 1} fill={senateColor} />
      </div>
    </>
  );
};
