import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline, Lifebuoy } from "./ui";

/** "Save this for the next border crisis." Rule 9's save reason: SAVE / THIS, a lifebuoy that drops in and spins, "for the next crisis.". */
export const SaveScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const buoy = pop(frame, cue("save", "Save") - 2);
  const aside = rise(frame, 5);
  const b = Math.min(1.1, Math.max(0, buoy));

  return (
    <>
      <Headline size={230} style={{ top: 420, ...riseStyle(head[0], exit, 50) }}>
        SAVE
      </Headline>
      <Headline size={230} style={{ top: 420 + 225, ...riseStyle(head[1], exit, 50) }}>
        <Accent>THIS</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 430, top: 1080, opacity: Math.min(1, b * 1.5) * (1 - exit), transform: `translateY(${(1 - Math.min(1, b)) * -80}px) rotate(${frame * 2}deg) scale(${0.6 + 0.4 * b})` }}>
        <Lifebuoy size={220} />
      </div>
      <Aside size={120} style={{ top: 930, ...riseStyle(aside, exit, 30) }}>
        for the next crisis.
      </Aside>
    </>
  );
};
