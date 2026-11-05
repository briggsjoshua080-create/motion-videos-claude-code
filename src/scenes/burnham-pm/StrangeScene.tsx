import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Chair, Headline, WipeLayer } from "./ui";

/**
 * "Now it gets strange: an MP quit, to hand him his seat." Re-hook 2 (rule 5, at 29 s) on a full
 * red flash: AN MP / GAVE HIM / HIS SEAT (up from the first frames); on "hand" the green chair
 * slides in from the right and lands with a little bounce, musical chairs in reverse.
 */
export const StrangeScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4), pop(frame, cue("strange", "strange") - 2)];
  const slideAt = cue("strange", "hand") - 8;
  const slide = progress(frame, slideAt, slideAt + 10, Easing.out(Easing.back(1.6)));
  const x = interpolate(slide, [0, 1], [1100, 390]);

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={150} tone="flash" style={{ top: 260, ...riseStyle(head[0], exit, 40) }}>
        AN MP
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 260 + 150, ...riseStyle(head[1], exit, 40) }}>
        GAVE HIM
      </Headline>
      <Headline
        size={150}
        tone="flash"
        style={{ top: 260 + 300 + 6, opacity: Math.min(1, Math.max(0, head[2]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}
      >
        <Accent tone="flash">HIS SEAT</Accent>
      </Headline>
      {slide > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
          <Chair width={300} tag style={{ position: "absolute", left: x, top: 790, transform: `rotate(${(1 - Math.min(1, slide)) * 12}deg)` }} />
        </div>
      )}
    </>
  );
};
