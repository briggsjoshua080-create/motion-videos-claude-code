import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UK, type SceneProps } from "./constants";
import { Accent, Headline, Rosette } from "./ui";

/**
 * "Labour lost it. To the Greens." The comic button: LOST IT. / TO THE / GREENS (in a green block),
 * and a red rosette that flips over and comes back green on "Greens" (the Gorton and Denton
 * by-election, 26 Feb 2026).
 */
export const GreensScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, cue("greens", "To") - 6), pop(frame, cue("greens", "Greens") - 5)];
  const rosette = pop(frame, 2);
  const flip = progress(frame, cue("greens", "Greens") - 8, cue("greens", "Greens") + 2);
  const turned = flip >= 0.5;
  const scaleX = Math.abs(Math.cos(flip * Math.PI));

  return (
    <>
      <div style={{ position: "absolute", left: 640, top: 250, opacity: Math.min(1, Math.max(0, rosette) * 1.6) * (1 - exit), transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, rosette))}) scaleX(${scaleX})`, transformOrigin: "150px 150px" }}>
        <Rosette size={300} color={turned ? UK.greenLight : UK.red} />
      </div>
      <Headline size={150} style={{ top: 720, ...riseStyle(head[0], exit, 40) }}>
        LOST IT.
      </Headline>
      <Headline size={150} style={{ top: 720 + 150, ...riseStyle(head[1], exit, 40) }}>
        TO THE
      </Headline>
      <Headline size={175} style={{ top: 720 + 300 + 6, opacity: Math.min(1, Math.max(0, head[2]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}>
        <Accent fill={UK.green}>GREENS</Accent>
      </Headline>
    </>
  );
};
