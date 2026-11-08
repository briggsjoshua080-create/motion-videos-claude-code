import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Aside, Headline } from "./ui";
import { Problems } from "./Problems";

/** "Geography: Europe is one short swim away." The first circle (sea blue, a wave) fills; GEOGRAPHY, "one short swim.". */
export const GeoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 1);
  const aside = rise(frame, 6);
  const fill = progress(frame, 2, cue("geo", "Europe"));

  return (
    <>
      <Headline size={115} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        GEOGRAPHY
      </Headline>
      <Aside size={120} style={{ top: 410, ...riseStyle(aside, exit, 30) }}>
        one short swim.
      </Aside>
      <Problems fill={[fill, 0, 0]} show={[1, 1, 1]} active={0} opacity={1 - exit} />
    </>
  );
};
