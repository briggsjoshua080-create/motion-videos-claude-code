import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { US, type SceneProps } from "./constants";
import { Accent, Bubble, ChatWindow, Figure, Headline, Mark, SectionNumeral } from "./ui";

/**
 * "The president? Not even in the chat." Section 03: PRESIDENT?; a generic figure (no likeness)
 * walks up to the group chat, bumps off its edge on "Not", and a red cross lands on him; NOT IN /
 * THE CHAT. (He can't even introduce a bill: only members can.)
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const bumpAt = cue("president", "Not") - 2;
  const walk = progress(frame, 2, bumpAt, Easing.in(Easing.quad));
  const back = progress(frame, bumpAt, bumpAt + 10, Easing.out(Easing.cubic));
  const x = -80 + walk * 260 - back * 90;
  const tilt = frame >= bumpAt && frame < bumpAt + 12 ? Math.sin((frame - bumpAt) * 1.4) * 10 * (1 - (frame - bumpAt) / 12) : 0;
  const shake = frame >= bumpAt && frame < bumpAt + 8 ? Math.sin((frame - bumpAt) * 2.8) * 7 * (1 - (frame - bumpAt) / 8) : 0;
  const cross = progress(frame, bumpAt + 2, bumpAt + 12);
  const lines = [rise(frame, cue("president", "Not") - 4), pop(frame, cue("president", "chat") - 6)];

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={120} style={{ top: 230, ...riseStyle(head, exit, 50) }}>
        PRESIDENT?
      </Headline>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <ChatWindow width={520} height={380} style={{ left: 440 + shake, top: 450 }}>
          <Bubble p={1} width={300} style={{ left: 26, top: 104 }} />
          <Bubble p={1} side="right" width={260} style={{ right: 26, top: 190 }} />
          <Bubble p={1} width={200} style={{ left: 26, top: 276 }} />
        </ChatWindow>
        <div style={{ position: "absolute", left: x, top: 520, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}>
          <Figure size={300} />
          {cross > 0 && (
            <div style={{ position: "absolute", left: -20, top: 30 }}>
              <Mark ok={false} size={250} p={cross} color={US.red} width={12} />
            </div>
          )}
        </div>
      </div>

      <Headline size={130} style={{ top: 900, ...riseStyle(lines[0], exit, 40) }}>
        NOT IN
      </Headline>
      <Headline size={130} style={{ top: 900 + 135, opacity: Math.min(1, Math.max(0, lines[1]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, lines[1]))})`, transformOrigin: "0 50%" }}>
        <Accent>THE CHAT</Accent>
      </Headline>
    </>
  );
};
