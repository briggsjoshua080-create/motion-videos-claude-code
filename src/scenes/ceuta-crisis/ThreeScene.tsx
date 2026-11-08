import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline, SectionNumeral } from "./ui";
import { Problems } from "./Problems";

/**
 * "Three problems collided." Section 02 (why): three empty circles pop in one after the other (a wave, a
 * gavel, a shop): the diagram that shows how geography, politics and social problems came together.
 */
export const ThreeScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 4)];
  const show: [number, number, number] = [pop(frame, 4), pop(frame, 10), pop(frame, 16)];

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        THREE
      </Headline>
      <Headline size={130} style={{ top: 250 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PROBLEMS</Accent>
      </Headline>
      <Problems fill={[0, 0, 0]} show={show} opacity={1} />
    </>
  );
};
