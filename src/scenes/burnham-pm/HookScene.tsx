import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Chair, Headline } from "./ui";

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): three rows, one accent row, then a smaller row.
 * "WON UNDER" (≈ 821 px at 120 px) and "VOTERS" (797 px at 175 px) fit x 120–960.
 */
export const BLOCK = { top: 280, big: 120, accent: 175, small: 112 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.big * 0.98;
  const t3 = t2 + BLOCK.big * 0.98 + 10;
  const t4 = t3 + BLOCK.accent * 0.98 + 14;
  return [t0, t1, t2, t3, t4];
})();

/** The green Commons chair under the hook line (the question's YES / NO buttons sit in the same place). */
export const CHAIR = { left: 370, top: 990, width: 340 } as const;

/**
 * "Britain's new PM won under 25,000 votes." Rule 1: frame 0 already shows the whole hook line,
 * huge, with 25,000 in a red block (works on mute; no title card, no logo). Under it stands a green
 * House of Commons chair, the musical-chairs prop; the small gold crown tag on its arm is the
 * rewatch detail (rule 10), never mentioned until the end. The number glows and the chair jolts on
 * "25,000". No subtitles here.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const hitAt = cue("hook", "25,000");
  const hit = frame >= hitAt && frame < hitAt + 8 ? 1 - (frame - hitAt) / 8 : 0;
  const shake = hit > 0 ? Math.sin((frame - hitAt) * 2.6) * 8 * hit : 0;
  const glow = progress(frame, hitAt - 2, hitAt + 3) * (1 - progress(frame, hitAt + 8, hitAt + 24));
  const zoom = 1 + 0.02 * progress(frame, 0, duration, Easing.linear);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          BRITAIN&apos;S
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[1] }}>
          NEW PM
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[2] }}>
          WON UNDER
        </Headline>
        <Headline size={BLOCK.accent} style={{ top: BLOCK_TOPS[3], filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(255,90,100,0.85))` : undefined }}>
          <Accent>25,000</Accent>
        </Headline>
        <Headline size={BLOCK.small} style={{ top: BLOCK_TOPS[4] }}>
          VOTES.
        </Headline>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translate(${shake}px, ${exit * 80}px)` }}>
        <Chair width={CHAIR.width} tag style={{ position: "absolute", left: CHAIR.left, top: CHAIR.top }} />
      </div>
    </>
  );
};
