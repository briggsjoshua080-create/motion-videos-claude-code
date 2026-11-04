import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline, PaperPlane } from "./ui";

/**
 * "Send this to someone who skipped it." Rule 9's share reason, as a gentle tease (comedy formula):
 * SEND THIS with a paper plane that flies in on "Send", and "to someone / who skipped it." No
 * subtitles: the words are on screen. The scene runs on into "And the" so it stays up 2 s (rule 6).
 */
export const ShareScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const fly = progress(frame, cue("share", "Send") - 6, cue("share", "this") + 6, Easing.out(Easing.cubic));
  const lines = [rise(frame, 5), rise(frame, 8)];
  const bob = Math.sin(frame / 6) * 8 * fly;

  return (
    <>
      <Headline size={230} style={{ top: 360, ...riseStyle(head[0], exit, 50) }}>
        SEND
      </Headline>
      <Headline size={230} style={{ top: 360 + 225, ...riseStyle(head[1], exit, 50) }}>
        <Accent>THIS</Accent>
      </Headline>
      <div style={{ position: "absolute", left: -300 + fly * 960, top: 700 - fly * 520 + bob, opacity: Math.min(1, fly * 3) * (1 - exit), transform: `rotate(${-14 + fly * 8}deg)` }}>
        <PaperPlane size={240} />
      </div>
      <Aside size={118} style={{ top: 900, ...riseStyle(lines[0], exit, 30) }}>
        to someone
      </Aside>
      <Aside size={118} style={{ top: 1020, ...riseStyle(lines[1], exit, 30) }}>
        who skipped it.
      </Aside>
    </>
  );
};
