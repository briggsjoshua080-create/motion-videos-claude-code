import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise } from "../../components/explainer/motion";
import { FONT, UK, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { BLOCK, BLOCK_TOPS } from "./HookScene";

/**
 * "Should a new PM face voters first?" Rules 8 and 9: one YES/NO question in exactly the hook's
 * layout (same rows, sizes, red block and position), so the last frame flows straight back into
 * frame 0 ("BRITAIN'S NEW PM WON UNDER 25,000 VOTES.") when TikTok loops the video. Two answer
 * buttons sit where the hook's chair stood. It holds for 1 s. No subtitles: the words are on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "Should") - 6),
    rise(frame, cue("question", "new") - 6),
    rise(frame, cue("question", "face") - 6),
    pop(frame, cue("question", "voters") - 5),
    rise(frame, cue("question", "first") - 6),
  ];
  const answers = [pop(frame, cue("question", "first") - 2), pop(frame, cue("question", "first") + 3)];
  const style = (p: number, i: number): React.CSSProperties => ({
    top: BLOCK_TOPS[i],
    opacity: Math.min(1, Math.max(0, p) * 1.4),
    transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
  });

  return (
    <>
      <Headline size={BLOCK.big} style={style(words[0], 0)}>
        SHOULD
      </Headline>
      <Headline size={BLOCK.big} style={style(words[1], 1)}>
        A NEW PM
      </Headline>
      <Headline size={BLOCK.big} style={style(words[2], 2)}>
        FACE
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[3], 3), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[3]))})`, transformOrigin: "0 50%" }}>
        <Accent>VOTERS</Accent>
      </Headline>
      <Headline size={BLOCK.small} style={style(words[4], 4)}>
        FIRST?
      </Headline>

      <div style={{ position: "absolute", left: 120, top: 1100, display: "flex", gap: 40 }}>
        {[
          { label: "YES", fill: UK.red, color: UK.white },
          { label: "NO", fill: UK.white, color: UK.blue },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 400,
              height: 180,
              borderRadius: 90,
              background: a.fill,
              boxShadow: i === 0 ? "0 0 0 5px rgba(255,255,255,0.9), 0 0 50px rgba(207,20,43,0.45)" : "0 20px 40px rgba(0,10,30,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.display,
              fontSize: 120,
              lineHeight: 1,
              color: a.color,
              opacity: Math.min(1, Math.max(0, answers[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, answers[i]))})`,
            }}
          >
            {a.label}
          </div>
        ))}
      </div>
    </>
  );
};
