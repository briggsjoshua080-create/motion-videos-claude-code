import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Aside, Bubble, ChatWindow, Headline } from "./ui";
import { BLOCK, BLOCK_TOPS, CHAT } from "./HookScene";

/**
 * "So, should the Senate scrap the sixty-vote rule?" Rules 8 and 9: one YES/NO question in exactly
 * the hook's layout (same rows, sizes, red block and position) over the same chat window, where
 * YES and NO arrive as two reply bubbles. So the last frame flows straight back into frame 0
 * ("AMERICA'S MOST HATED GROUP CHAT") when TikTok loops the video. It holds 1.2 s. No subtitles.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "should") - 8),
    rise(frame, cue("question", "Senate") - 6),
    pop(frame, cue("question", "scrap") - 5),
    rise(frame, cue("question", "sixty-vote") - 6),
    rise(frame, cue("question", "rule") - 6),
  ];
  const window = rise(frame, 0);
  const answers = [pop(frame, cue("question", "rule") - 4), pop(frame, cue("question", "rule") + 2)];
  const style = (p: number, i: number): React.CSSProperties => ({
    top: BLOCK_TOPS[i],
    opacity: Math.min(1, Math.max(0, p) * 1.4),
    transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
  });
  const label: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 120, lineHeight: 1 };

  return (
    <>
      <Headline size={BLOCK.big} style={style(words[0], 0)}>
        SHOULD
      </Headline>
      <Headline size={BLOCK.mid} style={style(words[1], 1)}>
        THE SENATE
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[2], 2), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[2]))})`, transformOrigin: "0 50%" }}>
        <Accent>SCRAP</Accent>
      </Headline>
      <Headline size={BLOCK.accent} style={style(words[3], 3)}>
        60-VOTE
      </Headline>
      <Aside size={BLOCK.aside} style={style(words[4], 4)}>
        rules?
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, window * 1.5), transform: `translateY(${(1 - window) * 60}px)` }}>
        <ChatWindow width={CHAT.width} height={CHAT.height} rotate={CHAT.rotate} style={{ left: CHAT.left, top: CHAT.top }}>
          <Bubble p={answers[0]} side="right" width={330} height={150} kind="none" style={{ right: 30, top: 108 }}>
            <div style={{ ...label, color: US.white }}>YES</div>
          </Bubble>
          <Bubble p={answers[1]} width={290} height={150} kind="none" style={{ left: 30, top: 276 }}>
            <div style={{ ...label, color: US.blue }}>NO</div>
          </Bubble>
        </ChatWindow>
      </div>
    </>
  );
};
