import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { US, type SceneProps } from "./constants";
import { Bubble, ChatWindow, Coin, Headline, Receipt, Scroll, SectionNumeral } from "./ui";

const ICONS = [
  { x: 190, word: "law" },
  { x: 450, word: "tax" },
  { x: 710, word: "dollar" },
] as const;

/**
 * "Every law, every tax, every dollar: through this chat." Section 02, why Congress matters, read
 * fast and excited: EVERY LAW / EVERY TAX / EVERY $ pop in on their words, each with a prop (a
 * scroll, a tax receipt, a coin); on "through" the three props drop into the group chat and arrive
 * as bubbles.
 */
export const PowerScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const rows = ICONS.map((icon) => pop(frame, cue("power", icon.word) - 5));
  const fly = progress(frame, cue("power", "through") - 4, cue("power", "chat") + 2, Easing.in(Easing.cubic));
  const win = rise(frame, cue("power", "dollar") - 2);
  const bubbles = [0, 1, 2].map((i) => pop(frame, cue("power", "chat") - 2 + i * 3));
  const row = (p: number): React.CSSProperties => ({ opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - exit), transform: `translateX(${(1 - Math.min(1, p)) * -60}px) translateY(${-exit * 40}px)` });

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 220, ...row(rows[0]) }}>
        EVERY LAW
      </Headline>
      <Headline size={130} style={{ top: 220 + 140, ...row(rows[1]) }}>
        EVERY TAX
      </Headline>
      <Headline size={130} style={{ top: 220 + 280, ...row(rows[2]) }}>
        EVERY <span style={{ color: US.gold }}>$</span>
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(win, exit, 60) }}>
        <ChatWindow width={700} height={330} style={{ left: 190, top: 850 }}>
          <Bubble p={bubbles[0]} side="right" width={150} height={84} kind="scroll" style={{ right: 30, top: 96 }} />
          <Bubble p={bubbles[1]} side="right" width={300} style={{ right: 30, top: 170 }} />
          <Bubble p={bubbles[2]} side="right" width={220} style={{ right: 30, top: 236 }} />
        </ChatWindow>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {ICONS.map((icon, i) => {
          const p = Math.max(0, rows[i]);
          const f = fly;
          if (f >= 1) return null;
          const x = icon.x + (540 - icon.x) * f;
          const y = 680 + (980 - 680) * f;
          const style: React.CSSProperties = {
            position: "absolute",
            left: x - 80,
            top: y - 80,
            opacity: Math.min(1, p * 1.5) * (1 - f * 0.9),
            transform: `scale(${(0.5 + 0.5 * Math.min(1.1, p)) * (1 - f * 0.6)}) rotate(${(i - 1) * 8}deg)`,
            filter: "drop-shadow(0 18px 26px rgba(0,8,30,0.45))",
          };
          return (
            <div key={icon.word} style={style}>
              {i === 0 && <Scroll size={160} />}
              {i === 1 && <Receipt size={160} style={{ marginLeft: 24 }} />}
              {i === 2 && <Coin size={160} style={{ position: "relative" }} />}
            </div>
          );
        })}
      </div>
    </>
  );
};
