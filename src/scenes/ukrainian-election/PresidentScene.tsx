import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline, StarBadge } from "./ui";

/**
 * "The president leads the army." What the office does, in a few words (standing brief): THE
 * PRESIDENT, a commander's star that spins in on "leads", and "leads the army."
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 4)];
  const star = pop(frame, cue("role", "leads") - 6);
  const aside = rise(frame, 4);

  return (
    <>
      <Headline size={132} style={{ top: 300, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={132} style={{ top: 300 + 130, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 390, top: 630, opacity: 1 - exit }}>
        <StarBadge size={300} p={star} />
      </div>
      <Aside size={125} style={{ top: 990, ...riseStyle(aside, exit, 30) }}>
        leads the army.
      </Aside>
    </>
  );
};
