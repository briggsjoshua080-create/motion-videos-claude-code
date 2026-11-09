import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, sceneExit, progress } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Bubble, ChatWindow, Headline } from "./ui";

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): a 130 px row, a 112 px row, a red accent row and a white row
 * at 175 px, then one italic line. "AMERICA'S" (788 px at 130) and "MOST HATED" (814 px at 112) fit
 * x 120–960 (measured with fontTools).
 */
export const BLOCK = { top: 230, big: 130, mid: 112, accent: 175, aside: 120 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.mid * 0.98 + 12;
  const t3 = t2 + BLOCK.accent * 0.98 + 14;
  const t4 = t3 + BLOCK.accent * 0.98 + 4;
  return [t0, t1, t2, t3, t4];
})();

/** The chat window under the hook (the question's YES / NO bubbles sit in the same window). */
export const CHAT = { left: 190, top: 1010, width: 700, height: 450, rotate: -3 } as const;

/**
 * "America's most hated group chat writes every law." Rule 1: frame 0 already shows the whole hook
 * line, huge, with GROUP in a red block (it works on mute; no title card, no logo). Under it, the
 * group chat: grey message bubbles, a law scroll that arrives on "law", and a small "typing…"
 * bubble at the bottom that is never mentioned: the rewatch detail (rule 10), explained at the
 * end. No subtitles here.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const law = pop(frame, cue("hook", "law") - 4);
  const zoom = 1 + 0.02 * progress(frame, 0, duration);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          AMERICA&apos;S
        </Headline>
        <Headline size={BLOCK.mid} style={{ top: BLOCK_TOPS[1] }}>
          MOST HATED
        </Headline>
        <Headline size={BLOCK.accent} style={{ top: BLOCK_TOPS[2] }}>
          <Accent>GROUP</Accent>
        </Headline>
        <Headline size={BLOCK.accent} style={{ top: BLOCK_TOPS[3] }}>
          CHAT
        </Headline>
        <Aside size={BLOCK.aside} style={{ top: BLOCK_TOPS[4] }}>
          writes every law.
        </Aside>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${exit * 80}px)` }}>
        <HookChat frame={frame} law={law} />
      </div>
    </>
  );
};

/** The frame-0 chat window with its bubbles; `law` pops the scroll bubble (the dots scene reuses it). */
export const HookChat: React.FC<{ frame: number; law: number; style?: React.CSSProperties }> = ({ frame, law, style }) => (
  <ChatWindow width={CHAT.width} height={CHAT.height} rotate={CHAT.rotate} style={{ left: CHAT.left, top: CHAT.top, ...style }}>
    <Bubble p={1} width={400} style={{ left: 30, top: 116 }} />
    <Bubble p={1} side="right" width={320} style={{ right: 30, top: 200 }} />
    <Bubble p={law} side="right" width={170} height={88} kind="scroll" style={{ right: 30, top: 284 }} />
    <Bubble p={1} width={116} height={52} kind="dots" t={frame} style={{ left: 30, top: 380 }} />
  </ChatWindow>
);
