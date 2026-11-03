import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, BallotBox, Headline, Padlock } from "./ui";

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): two big lines, one accent block, then smaller lines.
 */
export const BLOCK = { top: 300, big: 130, accent: 175, small: 118 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.big * 0.98 + 8;
  const t3 = t2 + BLOCK.accent * 0.98 + 14;
  const t4 = t3 + BLOCK.small * 0.98;
  return [t0, t1, t2, t3, t4];
})();

/** The ballot box under the hook line (the question's YES / NO buttons sit in the same place). */
const BOX = { left: 360, top: 990, size: 360 } as const;
const LOCK = { size: 150, left: BOX.left + BOX.size / 2 - 75, top: 1036 } as const;

/**
 * "Elections are banned in Ukraine." Rule 1: frame 0 already shows the whole hook line, huge, with
 * BANNED in a yellow block (it works on mute, with no title card and no logo). An open padlock hangs
 * over a ballot box and snaps shut on "banned". No subtitles here: the line is already on screen.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const slam = cue("hook", "banned");
  const drop = progress(frame, slam - 7, slam - 1, Easing.in(Easing.cubic));
  const shut = progress(frame, slam - 1, slam + 3);
  const shake = frame >= slam - 1 && frame < slam + 5 ? Math.sin((frame - slam) * 2.4) * 7 * (1 - (frame - slam + 1) / 6) : 0;
  const glow = progress(frame, slam - 2, slam + 3) * (1 - progress(frame, slam + 6, slam + 20));
  const zoom = 1 + 0.02 * progress(frame, 0, duration, Easing.linear);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          ELECTIONS
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[1] }}>
          ARE
        </Headline>
        <Headline size={BLOCK.accent} style={{ top: BLOCK_TOPS[2], filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(255,215,0,0.8))` : undefined }}>
          <Accent>BANNED</Accent>
        </Headline>
        <Headline size={BLOCK.small} style={{ top: BLOCK_TOPS[3] }}>
          IN UKRAINE.
        </Headline>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${exit * 80 + shake}px)` }}>
        <BallotBox size={BOX.size} style={{ position: "absolute", left: BOX.left, top: BOX.top, filter: "drop-shadow(0 26px 40px rgba(0,10,40,0.45))" }} />
        <Padlock
          size={LOCK.size}
          closed={shut}
          style={{ position: "absolute", left: LOCK.left, top: LOCK.top - 130 * (1 - drop), filter: "drop-shadow(0 14px 22px rgba(0,10,40,0.45))" }}
        />
      </div>
    </>
  );
};
