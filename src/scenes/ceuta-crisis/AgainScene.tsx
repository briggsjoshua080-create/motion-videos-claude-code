import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { Meter } from "./Meter";

/** "Could it happen again? This big, not soon." The likelihood gauge comes in and its needle settles at LOW (it stays on for the next scene); THIS BIG? / NOT SOON. */
export const AgainScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 5)];
  const meter = rise(frame, 2);
  const value = 0.5 - 0.36 * progress(frame, cue("again", "This") - 4, cue("again", "soon"), Easing.out(Easing.back(2)));

  return (
    <>
      <Headline size={130} style={{ top: 300, ...riseStyle(head[0], exit, 50) }}>
        THIS BIG?
      </Headline>
      <Headline size={130} style={{ top: 300 + 140, ...riseStyle(head[1], exit, 50) }}>
        <Accent>NOT SOON.</Accent>
      </Headline>
      <Meter value={value} opacity={Math.min(1, meter)} />
    </>
  );
};
