import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UK, type SceneProps } from "./constants";
import { Accent, Chair, Headline, Stamp, WipeLayer } from "./ui";

/**
 * "But here's the weird part: Labour's leader needs a seat in Parliament. He had none." Re-hook 1
 * (rule 5, at 14 s) on a full red flash: the chair (crown tag and all) stands at the top, LEADER /
 * NEEDS A / SEAT below; on "none" the chair is yanked off to the left, musical-chairs style, and a
 * NO SEAT stamp lands where it stood.
 */
export const RehookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const chairIn = pop(frame, 2);
  const yankAt = cue("rehook", "He") - 4;
  const yank = progress(frame, yankAt, yankAt + 8, Easing.in(Easing.cubic));
  const stamp = progress(frame, yankAt + 2, yankAt + 8, Easing.in(Easing.cubic));
  const head = [rise(frame, cue("rehook", "Labour's") - 8), rise(frame, cue("rehook", "needs") - 6), pop(frame, cue("rehook", "seat") - 5)];

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: Math.min(1, Math.max(0, chairIn) * 2) * (1 - exit),
          transform: `translate(${-yank * 900}px, ${(1 - Math.min(1, chairIn)) * -300}px) rotate(${-yank * 25}deg)`,
          transformOrigin: "540px 400px",
        }}
      >
        <Chair width={300} tag style={{ position: "absolute", left: 390, top: 180 }} />
      </div>
      <Stamp p={stamp} fade={1 - exit} color={UK.white} size={130} rotate={-8} style={{ left: 250, top: 300 }}>
        NO SEAT
      </Stamp>
      <Headline size={150} tone="flash" style={{ top: 640, ...riseStyle(head[0], exit, 40) }}>
        LEADER
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 640 + 150, ...riseStyle(head[1], exit, 40) }}>
        NEEDS A
      </Headline>
      <Headline
        size={190}
        tone="flash"
        style={{ top: 640 + 300 + 6, opacity: Math.min(1, Math.max(0, head[2]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}
      >
        <Accent tone="flash">SEAT</Accent>
      </Headline>
    </>
  );
};
