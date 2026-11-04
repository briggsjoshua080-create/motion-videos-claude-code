import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline, SheriffStar, WipeLayer } from "./ui";

/**
 * "Now it gets strange: Americans even elect their sheriffs." Re-hook 2 (rule 5, at about 29 s) on a
 * full red flash, as an escalation (comedy formula): IT GETS STRANGE, a sheriff's star that spins in
 * on "strange", and SHERIFFS?! right after it (so it stays 2 s, before the voice gets there).
 * Sheriffs are elected in 46 states; the ballot that follows has them on it.
 */
export const StrangeScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const star = pop(frame, cue("strange", "strange") - 6);
  const punch = rise(frame, cue("strange", "strange", "end") + 1);
  const wobbleDeg = Math.sin(frame / 5) * 4;

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={150} tone="flash" style={{ top: 240, ...riseStyle(head[0], exit, 40) }}>
        IT GETS
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 240 + 150 * 0.98 + 8, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">STRANGE</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 330, top: 580, width: 420, height: 420, opacity: 1 - exit, transform: `rotate(${wobbleDeg}deg)` }}>
        <SheriffStar size={420} p={star} />
      </div>
      <Headline size={130} tone="flash" style={{ top: 1030, ...riseStyle(punch, exit, 30) }}>
        SHERIFFS?!
      </Headline>
    </>
  );
};
