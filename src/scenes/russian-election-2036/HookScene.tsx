import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { Timeline } from "./Timeline";

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): two big lines, one accent block, then smaller lines.
 */
export const BLOCK = { top: 300, big: 130, accent: 175, small: 110 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.big * 0.98 + 8;
  const t3 = t2 + BLOCK.accent * 0.98 + 14;
  const t4 = t3 + BLOCK.small * 0.98;
  return [t0, t1, t2, t3, t4];
})();

/**
 * "Putin can legally rule until 2036." Rule 1: frame 0 already shows the whole hook line, huge,
 * with 2036 in a red block (it works on mute; no title card, no logo). Under it, the timeline of
 * his years at the top runs from 2000 to 2036; its 2008–12 stretch is hollow and is not mentioned
 * (the rewatch detail, explained at the end). The 2036 end glows on "2036". No subtitles here.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const hit = cue("hook", "2036");
  const pulse = progress(frame, hit - 2, hit + 4) * (1 - progress(frame, hit + 10, hit + 26));
  const zoom = 1 + 0.02 * progress(frame, 0, duration, Easing.linear);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          PUTIN CAN
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[1] }}>
          RULE TO
        </Headline>
        <Headline
          size={BLOCK.accent}
          style={{ top: BLOCK_TOPS[2], transform: `scale(${1 + 0.05 * pulse})`, transformOrigin: "0 50%", filter: pulse > 0 ? `drop-shadow(0 0 ${30 * pulse}px rgba(255,255,255,0.7))` : undefined }}
        >
          <Accent>2036</Accent>
        </Headline>
        <Headline size={BLOCK.small} style={{ top: BLOCK_TOPS[3] }}>
          LEGALLY.
        </Headline>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${exit * 80}px)` }}>
        <Timeline pulse={pulse} />
      </div>
    </>
  );
};
