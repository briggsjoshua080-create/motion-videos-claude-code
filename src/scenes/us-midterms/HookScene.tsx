import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, GradeStamp, Headline, ReportCard } from "./ui";

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): three big rows, one accent row, then a smaller row.
 * "PRESIDENT" (816 px at 130 px) and "HIS MIDTERM" (831 px at 112 px) just fit x 120–960.
 */
export const BLOCK = { top: 280, big: 130, accent: 175, small: 112 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.big * 0.98;
  const t3 = t2 + BLOCK.big * 0.98 + 10;
  const t4 = t3 + BLOCK.accent * 0.98 + 14;
  return [t0, t1, t2, t3, t4];
})();

/** The report card under the hook line (the question's YES / NO buttons sit in the same place). */
export const CARD = { left: 270, top: 1030, width: 540, height: 360, rotate: -4 } as const;
/** Where the F lands on the card's grade circle (card-relative), and the stamp's size. */
export const CARD_STAMP = { left: 306, top: 99, size: 220 } as const;

/**
 * "The president just failed his midterm." Rule 1: frame 0 already shows the whole hook line, huge,
 * with FAILED in a red block (it works on mute; no title card, no logo). Under it sits a paper
 * report card; a red F slams onto it on "failed". The card's small gold horse sticker is the
 * rewatch detail (rule 10): it is never mentioned until the end. No subtitles here.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const slam = cue("hook", "failed");
  const stamp = progress(frame, slam - 6, slam, Easing.in(Easing.cubic));
  const hit = frame >= slam && frame < slam + 7 ? (1 - (frame - slam) / 7) : 0;
  const shake = hit > 0 ? Math.sin((frame - slam) * 2.6) * 9 * hit : 0;
  const glow = progress(frame, slam - 2, slam + 3) * (1 - progress(frame, slam + 6, slam + 20));
  const zoom = 1 + 0.02 * progress(frame, 0, duration, Easing.linear);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          THE
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[1] }}>
          PRESIDENT
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[2] }}>
          JUST
        </Headline>
        <Headline size={BLOCK.accent} style={{ top: BLOCK_TOPS[3], filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(255,90,100,0.85))` : undefined }}>
          <Accent>FAILED</Accent>
        </Headline>
        <Headline size={BLOCK.small} style={{ top: BLOCK_TOPS[4] }}>
          HIS MIDTERM
        </Headline>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translate(${shake}px, ${exit * 80 + Math.abs(shake) * 0.4}px)` }}>
        <ReportCard width={CARD.width} height={CARD.height} rotate={CARD.rotate} style={{ left: CARD.left, top: CARD.top }}>
          <GradeStamp p={stamp} size={CARD_STAMP.size} style={{ left: CARD_STAMP.left, top: CARD_STAMP.top }} />
        </ReportCard>
      </div>
    </>
  );
};
