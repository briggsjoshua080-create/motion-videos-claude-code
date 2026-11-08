import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { Problems } from "./Problems";

/**
 * "All three met in one week." The payoff of the why-section (the user's "how the problems came
 * together"): the three full circles return and a spark ignites where they overlap; ALL THREE / ONE WEEK.
 */
export const SparkScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const back = rise(frame, 0);
  const spark = progress(frame, cue("spark", "met") - 6, cue("spark", "week") + 6);

  return (
    <>
      <Headline size={130} style={{ top: 260, ...riseStyle(head[0], exit, 50) }}>
        ALL THREE
      </Headline>
      <Headline size={130} style={{ top: 260 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>ONE WEEK</Accent>
      </Headline>
      <Problems fill={[back, back, back]} show={[back, back, back]} spark={spark} opacity={1 - exit} />
    </>
  );
};
