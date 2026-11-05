import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Crown, Headline } from "./ui";

/**
 * "On 20 July, the King made him PM." The formal step (the scene starts on "King", so RIVALS: 0
 * stays up): a gold crown that pops in, and THE KING / MADE HIM / PM (red block on "PM"). The King appoints whoever leads the
 * Commons' majority; he does not choose.
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const crown = pop(frame, 1);
  const head = [rise(frame, 2), rise(frame, cue("king", "made") - 5), pop(frame, cue("king", "PM") - 5)];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 400,
          opacity: Math.min(1, Math.max(0, crown) * 1.6) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, Math.max(0, crown))) * -120}px) rotate(${(1 - Math.min(1, Math.max(0, crown))) * -20}deg)`,
          filter: "drop-shadow(0 20px 30px rgba(0,8,30,0.45))",
        }}
      >
        <Crown width={320} />
      </div>
      <Headline size={150} style={{ top: 690, ...riseStyle(head[0], exit, 40) }}>
        THE KING
      </Headline>
      <Headline size={130} style={{ top: 850, ...riseStyle(head[1], exit, 40) }}>
        MADE HIM
      </Headline>
      <Headline
        size={175}
        style={{ top: 985, opacity: Math.min(1, Math.max(0, head[2]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}
      >
        <Accent>PM</Accent>
      </Headline>
    </>
  );
};
