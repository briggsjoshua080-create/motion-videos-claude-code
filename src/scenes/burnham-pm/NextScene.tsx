import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, BallotBox, Headline } from "./ui";

/**
 * "Everyone else votes by 2029." The one sincere beat (comedy formula): the rest of the country gets
 * its say at the next general election, due by 2029. EVERYONE / ELSE: / BY 2029, and a ballot paper
 * that drops into a ballot box on "votes".
 */
export const NextScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 3), pop(frame, cue("next", "2029") - 5)];
  const box = pop(frame, 3);
  const drop = progress(frame, 6, 22, Easing.in(Easing.quad));

  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        EVERYONE
      </Headline>
      <Headline size={130} style={{ top: 270 + 130, ...riseStyle(head[1], exit, 40) }}>
        ELSE:
      </Headline>
      <Headline
        size={175}
        style={{ top: 270 + 260 + 10, opacity: Math.min(1, Math.max(0, head[2]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}
      >
        <Accent>BY 2029</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 375, top: 800, opacity: Math.min(1, Math.max(0, box) * 1.6) * (1 - exit), transform: `translateY(${(1 - Math.min(1, Math.max(0, box))) * 60}px)` }}>
        <BallotBox width={330} p={drop} />
      </div>
    </>
  );
};
