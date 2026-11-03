import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { RU, type SceneProps } from "./constants";
import { Accent, BallotBox, Headline, Mark, WipeLayer } from "./ui";

/**
 * "Now it gets strange: the upper house isn't elected." Re-hook 2 (rule 5) on a red flash: a ballot
 * box with a building behind it gets crossed out on "isn't", and NOT ELECTED is up from the start.
 */
export const StrangerScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const box = pop(frame, 3);
  const cross = progress(frame, cue("stranger", "isn't") - 4, cue("stranger", "isn't") + 6);
  const head = [rise(frame, 0), rise(frame, 3)];

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <div style={{ position: "absolute", left: 330, top: 330, opacity: Math.min(1, Math.max(0, box) * 1.5) * (1 - exit), transform: `scale(${0.7 + 0.3 * Math.min(1.05, box)})` }}>
        <BallotBox size={420} style={{ filter: "drop-shadow(0 26px 40px rgba(60,0,0,0.4))" }} />
        <div style={{ position: "absolute", left: 30, top: -40 }}>
          <Mark ok={false} size={380} p={cross} color={RU.white} width={13} />
        </div>
      </div>
      <Headline size={150} tone="flash" style={{ top: 820, ...riseStyle(head[0], exit, 40) }}>
        NOT
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 820 + 150, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">ELECTED</Accent>
      </Headline>
    </>
  );
};
