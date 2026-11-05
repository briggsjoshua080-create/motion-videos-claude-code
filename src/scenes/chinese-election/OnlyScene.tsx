import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, BallotBox, Headline, WipeLayer } from "./ui";

/**
 * "Now it gets strange: that's the only vote you get." Re-hook 2 (rule 5) on a yellow flash: a
 * ballot box pops in, one single slip drops into it on "only", and YOUR ONLY VOTE is up from the start.
 */
export const OnlyScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const box = pop(frame, 3);
  const drop = progress(frame, cue("only", "only") - 10, cue("only", "only") + 4, Easing.in(Easing.quad));
  const head = [rise(frame, 0), rise(frame, 3), rise(frame, 6)];

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <div style={{ position: "absolute", left: 330, top: 250, opacity: Math.min(1, Math.max(0, box) * 1.5) * (1 - exit), transform: `scale(${0.7 + 0.3 * Math.min(1.05, box)})` }}>
        <div
          style={{
            position: "absolute",
            left: 160,
            top: -120 + drop * 200,
            width: 100,
            height: 130,
            borderRadius: 8,
            background: CN.white,
            border: `4px solid ${CN.maroon}`,
            boxSizing: "border-box",
            opacity: drop < 1 ? 1 : 0,
          }}
        />
        <BallotBox size={420} style={{ position: "relative", filter: "drop-shadow(0 26px 40px rgba(120,60,0,0.35))" }} />
      </div>
      <Headline size={150} tone="flash" style={{ top: 700, ...riseStyle(head[0], exit, 40) }}>
        YOUR
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 700 + 147, ...riseStyle(head[1], exit, 40) }}>
        ONLY
      </Headline>
      <Headline size={175} tone="flash" style={{ top: 700 + 300, ...riseStyle(head[2], exit, 40) }}>
        <Accent tone="flash">VOTE</Accent>
      </Headline>
    </>
  );
};
