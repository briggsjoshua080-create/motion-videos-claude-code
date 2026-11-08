import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";
import { ChartView } from "./maps";

/** The chart view shared by the fence and swim scenes (they sit on one paper span). */
export const FENCE_VIEW = { top: 600, vb: [200, 150, 720, 470] as [number, number, number, number] };

/**
 * "Its fence with Morocco stops at the sea." Chart paper wipes in; the double fence draws from Benzú
 * (north) down to Tarajal and stops at its breakwater, whose end in the water glows orange; STOPS AT
 * / THE SEA. The paper stays on for the swim scene (no wipe out here).
 */
export const FenceScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const head = [rise(frame, 3), rise(frame, cue("fence", "stops") - 6)];
  const fence = progress(frame, 6, cue("fence", "stops"));
  const glow = progress(frame, cue("fence", "sea") - 6, cue("fence", "sea") + 4);
  const mapIn = progress(frame, 4, 14);

  return (
    <>
      <WipeLayer duration={duration} kind="paper" outAt={duration + 1000} />
      <ChartView tone="paper" top={FENCE_VIEW.top} vb={FENCE_VIEW.vb} fence={fence} endGlow={glow} barrier={0} opacity={mapIn} />
      <Headline size={130} tone="paper" style={{ top: 270, ...riseStyle(head[0], 0, 50) }}>
        STOPS AT
      </Headline>
      <Headline size={160} tone="paper" style={{ top: 270 + 135, ...riseStyle(head[1], 0, 50) }}>
        <Accent tone="paper">THE SEA</Accent>
      </Headline>
    </>
  );
};
