import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { WIPE, type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";
import { ChartView } from "./maps";
import { FENCE_VIEW } from "./FenceScene";

/**
 * "So in late July, tens of thousands swam around it." The first surprising payoff (rule 3, about
 * 12 s): on the same chart, swimmers stream from Fnideq's beach around the end of the fence and a
 * crowd builds on Tarajal beach while the view zooms in a little; THEY / SWAM. The paper wipes out
 * at the end into the orange re-hook.
 */
export const SwimScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 6)];
  const amount = progress(frame, 0, cue("swim", "thousands"));
  const crowd = progress(frame, cue("swim", "tens") - 4, duration);
  const z = progress(frame, 0, duration);
  const [x, y, w, h] = FENCE_VIEW.vb;
  const vb: [number, number, number, number] = [x + 90 * z, y + 90 * z, w - 160 * z, h - 104 * z];

  return (
    <>
      <WipeLayer duration={duration} kind="paper" inAt={-WIPE} />
      <ChartView tone="paper" top={FENCE_VIEW.top} vb={vb} swimFrame={frame} swimAmount={amount} crowd={crowd} barrier={0} opacity={1 - exit} />
      <Headline size={130} tone="paper" style={{ top: 270, ...riseStyle(head[0], exit, 50) }}>
        THEY
      </Headline>
      <Headline size={230} tone="paper" style={{ top: 270 + 120, ...riseStyle(head[1], exit, 50) }}>
        <Accent tone="paper">SWAM</Accent>
      </Headline>
    </>
  );
};
