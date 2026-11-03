import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { LIST_SEATS, RU, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral } from "./ui";
import { DumaSeats } from "./DumaSeats";

/**
 * "That's the State Duma. It makes the laws." Section 03 and what the house does (standing brief):
 * the same hemicycle stays, its two halves merge into one white house, STATE DUMA replaces the
 * captions and "makes the laws." comes in with it (up 2 s).
 */
export const DumaScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 2);
  const head = [rise(frame, 0), rise(frame, 4)];
  const merge = progress(frame, 4, 18);
  const aside = rise(frame, 8);
  const red = (k: number) => `rgb(${Math.round(213 + 42 * k)},${Math.round(43 + 212 * k)},${Math.round(30 + 225 * k)})`;

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 255, ...riseStyle(head[0], exit, 40) }}>
        STATE
      </Headline>
      <Headline size={150} style={{ top: 255 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>DUMA</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <DumaSeats visible={() => 1} fill={(i) => (i < LIST_SEATS ? red(merge) : RU.white)} />
      </div>
      <Aside size={120} style={{ top: 1030, ...riseStyle(aside, exit, 30) }}>
        makes the laws.
      </Aside>
    </>
  );
};
