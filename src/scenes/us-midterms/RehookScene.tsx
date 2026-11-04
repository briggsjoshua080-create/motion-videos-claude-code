import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, HangingSign, Headline, WipeLayer, swingAngle } from "./ui";

/**
 * "But here's the weird part: the whole House reapplies for its job." Re-hook 1 (rule 5, at about
 * 14 s) on a full red flash, as an absurd reframe (comedy formula): THE WHOLE HOUSE REAPPLIES. (up
 * from the first frames, so it stays 3.5 s) under a NOW HIRING sign that drops in on "weird" and
 * swings until it settles.
 */
export const RehookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const dropAt = cue("rehook", "weird") - 4;
  const drop = pop(frame, dropAt);
  const head = [rise(frame, 1), rise(frame, 4), rise(frame, 7)];
  const angle = swingAngle(frame, dropAt + 6, 12, 0.3, 0.055);

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, drop) * 2) * (1 - exit), transform: `translateY(${(1 - Math.min(1, drop)) * -620 - exit * 40}px)` }}>
        <HangingSign left={190} top={140} width={700} height={340} angle={angle}>
          <div style={{ fontFamily: FONT.display, fontSize: 130, lineHeight: 1, color: US.red, letterSpacing: -1 }}>NOW</div>
          <div style={{ fontFamily: FONT.display, fontSize: 130, lineHeight: 1.02, color: US.blue, letterSpacing: -1 }}>HIRING</div>
        </HangingSign>
      </div>
      <Headline size={126} tone="flash" style={{ top: 660, ...riseStyle(head[0], exit, 40) }}>
        THE WHOLE
      </Headline>
      <Headline size={175} tone="flash" style={{ top: 660 + 126 * 0.98 + 6, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">HOUSE</Accent>
      </Headline>
      <Headline size={128} tone="flash" style={{ top: 660 + 126 * 0.98 + 6 + 175 * 0.98 + 14, ...riseStyle(head[2], exit, 40) }}>
        REAPPLIES.
      </Headline>
    </>
  );
};
