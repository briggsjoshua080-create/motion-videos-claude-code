import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline, SectionNumeral } from "./ui";
import { StraitMap } from "./maps";

/**
 * "This is Ceuta: Spain, but in Africa." Section 01 (what happened): the real outline map of Spain and
 * Morocco (Natural Earth) zooms in on Ceuta, an orange pulsing point on the African coast; SPAIN, /
 * IN AFRICA.
 */
export const WhereScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, cue("where", "Spain") - 8)];
  const k = 1.5 + 3.6 * progress(frame, 0, duration, Easing.inOut(Easing.cubic));
  const pulse = (frame % 30) / 30;
  const mapIn = progress(frame, 0, 8);

  return (
    <>
      <StraitMap k={k} cx={560} cy={1020} pulse={pulse} opacity={mapIn * (1 - exit)} />
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 300, ...riseStyle(head[0], exit, 50) }}>
        SPAIN,
      </Headline>
      <Headline size={130} style={{ top: 300 + 140, ...riseStyle(head[1], exit, 50) }}>
        <Accent>IN AFRICA</Accent>
      </Headline>
    </>
  );
};
