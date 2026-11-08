import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline } from "./ui";
import { Meter } from "./Meter";

/**
 * "Smaller swims? Almost surely: the jobs and the sea haven't changed." The same gauge (no re-entry, it
 * carries on from the last scene) swings to HIGH on "surely"; SMALLER / SWIMS?, "almost surely.".
 */
export const SmallerScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const aside = rise(frame, cue("smaller", "Almost") - 6);
  const value = 0.14 + 0.74 * progress(frame, cue("smaller", "Almost") - 2, cue("smaller", "surely", "end") + 4, Easing.out(Easing.back(1.6)));

  return (
    <>
      <Headline size={130} style={{ top: 260, ...riseStyle(head[0], exit, 50) }}>
        SMALLER
      </Headline>
      <Headline size={175} style={{ top: 260 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>SWIMS?</Accent>
      </Headline>
      <Aside size={120} style={{ top: 590, ...riseStyle(aside, exit, 30) }}>
        almost surely.
      </Aside>
      <Meter value={value} opacity={1 - exit} />
    </>
  );
};
