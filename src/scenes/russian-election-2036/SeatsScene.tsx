import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { LIST_SEATS, RU, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { DumaSeats, sweepIn } from "./DumaSeats";

/**
 * "Half the seats go to parties over 5%, half to district winners." How votes turn into seats, one
 * idea at a time (rule 7): the 450-dot hemicycle builds its left half in red with PARTIES / OVER 5%,
 * then on the second "half" its right half in white with DISTRICT / WINNERS (each caption up 2 s).
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const second = cue("seats", "half#2") - 8;
  const left = progress(frame, 2, 22, Easing.out(Easing.quad));
  const right = progress(frame, second, second + 20, Easing.out(Easing.quad));
  const swap = progress(frame, second - 4, second + 2);
  const a = [rise(frame, 1), rise(frame, 5)];
  const b = [rise(frame, second), rise(frame, second + 4)];
  const halfA = { opacity: 1 - swap, transform: `translateY(${-swap * 40}px)` };

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...halfA }}>
        <Headline size={130} style={{ top: 260, ...riseStyle(a[0], 0, 40) }}>
          PARTIES
        </Headline>
        <Headline size={130} style={{ top: 260 + 135, ...riseStyle(a[1], 0, 40) }}>
          <Accent>OVER 5%</Accent>
        </Headline>
      </div>
      <Headline size={130} style={{ top: 260, ...riseStyle(b[0], exit, 40) }}>
        DISTRICT
      </Headline>
      <Headline size={130} style={{ top: 260 + 135, ...riseStyle(b[1], exit, 40) }}>
        <Accent>WINNERS</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <DumaSeats
          visible={(i) => (i < LIST_SEATS ? sweepIn(left, i, 0, LIST_SEATS) : sweepIn(right, i, LIST_SEATS, LIST_SEATS))}
          fill={(i) => (i < LIST_SEATS ? RU.red : RU.white)}
        />
      </div>
    </>
  );
};
