import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Aside, Headline } from "./ui";
import { Problems } from "./Problems";

/**
 * "Social: in Fnideq next door, jobs vanished with the border trade." The circles return with geography
 * and politics filled; the third (red) fills and its shop's shutter rolls down on "border trade closed"; SOCIAL,
 * "no jobs.".
 */
export const JobsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 1);
  const aside = rise(frame, cue("jobs", "jobs") - 6);
  const back = rise(frame, 0);
  const fill = progress(frame, 4, cue("jobs", "Fnideq"));
  const shutter = progress(frame, cue("jobs", "border") - 4, cue("jobs", "closed"));

  return (
    <>
      <Headline size={130} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        SOCIAL
      </Headline>
      <Aside size={120} style={{ top: 420, ...riseStyle(aside, exit, 30) }}>
        no jobs.
      </Aside>
      <Problems fill={[1, back, fill]} show={[back, back, back]} active={2} shutter={shutter} opacity={1 - exit} />
    </>
  );
};
