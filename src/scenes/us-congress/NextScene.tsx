import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Bubble, ChatWindow, DoubleTick, Headline } from "./ui";

/**
 * "Now every law needs both parties. Expect a lot of 'left on read'." The sincere beat (comedy
 * formula rule 7), said plainly: EVERY LAW / NEEDS / BOTH (a Democratic Congress, a Republican
 * president). Then the comic button: a law bubble in the chat gets two grey "seen" ticks and no
 * answer, and LEFT ON / READ pops in (vetoes).
 */
export const NextScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4), pop(frame, cue("next", "both") - 5)];
  const swap = cue("next", "Expect") - 6;
  const out = progress(frame, swap, swap + 8);
  const win = rise(frame, swap + 2);
  const bubble = pop(frame, swap + 6);
  const ticks = progress(frame, cue("next", "lot") - 2, cue("next", "of"));
  const stamp = rise(frame, cue("next", "left") - 6);
  const stamp2 = pop(frame, cue("next", "read") - 5);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        <Headline size={130} style={{ top: 280, ...riseStyle(head[0], 0, 40) }}>
          EVERY LAW
        </Headline>
        <Headline size={130} style={{ top: 280 + 135, ...riseStyle(head[1], 0, 40) }}>
          NEEDS
        </Headline>
        <Headline size={175} style={{ top: 280 + 270, opacity: Math.min(1, Math.max(0, head[2]) * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))})`, transformOrigin: "0 50%" }}>
          <Accent>BOTH</Accent>
        </Headline>
        <Headline size={130} style={{ top: 280 + 270 + 185, ...riseStyle(head[1], 0, 40) }}>
          PARTIES.
        </Headline>
      </div>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(win, exit, 60) }}>
        <ChatWindow width={700} height={520} style={{ left: 190, top: 270 }}>
          <Bubble p={bubble} side="right" width={300} height={170} kind="scroll" style={{ right: 36, top: 150 }} />
          <div style={{ position: "absolute", right: 40, top: 340 }}>
            <DoubleTick size={70} color="#8A94A6" p={ticks} />
          </div>
        </ChatWindow>
      </div>
      <Headline size={150} style={{ top: 860, ...riseStyle(Math.min(1, Math.max(0, stamp)), exit, 40) }}>
        LEFT ON
      </Headline>
      <Headline size={175} style={{ top: 860 + 150, opacity: Math.min(1, Math.max(0, stamp2) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, stamp2))})`, transformOrigin: "0 50%" }}>
        <Accent>READ</Accent>
      </Headline>
    </>
  );
};
