import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DEAD, type SceneProps } from "./constants";
import { Headline, NightLayer, roll } from "./ui";

/**
 * "But at least 80 people died." A quiet beat: the background darkens, AT LEAST / 80 / DIED. in plain
 * white (no accent block, no pop sound). 80 is Spain's count; other counts are in script.md.
 */
export const DeadScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const night = progress(frame, 0, 10) * (1 - progress(frame, duration - 6, duration + 3));
  const head = [rise(frame, 2), rise(frame, 5), rise(frame, 8)];
  const n = roll(0, DEAD, progress(frame, 4, cue("dead", "80"), Easing.out(Easing.cubic)));

  return (
    <>
      <NightLayer p={night} />
      <Headline size={130} style={{ top: 420, ...riseStyle(head[0], exit, 40) }}>
        AT LEAST
      </Headline>
      <Headline size={340} style={{ top: 420 + 130, ...riseStyle(head[1], exit, 40) }}>
        {n}
      </Headline>
      <Headline size={130} style={{ top: 420 + 470, ...riseStyle(head[2], exit, 40) }}>
        DIED.
      </Headline>
    </>
  );
};
