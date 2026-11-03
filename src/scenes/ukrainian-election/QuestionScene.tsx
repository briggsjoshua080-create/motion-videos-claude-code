import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise } from "../../components/explainer/motion";
import { FONT, UA, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { BLOCK, BLOCK_TOPS } from "./HookScene";

/**
 * "Should Ukraine vote before the war ends?" Rules 8 and 9: one YES/NO question in exactly the hook's
 * layout (same sizes, same accent block, same position), so the last frame flows straight back into
 * frame 0 ("ELECTIONS ARE BANNED IN UKRAINE.") when TikTok loops the video. Two answer buttons sit
 * where the hook's ballot box is. It holds for 1.2 s. No subtitles: the words are on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "Should") - 6),
    rise(frame, cue("question", "Ukraine") - 6),
    pop(frame, cue("question", "vote") - 5),
    rise(frame, cue("question", "before") - 6),
    rise(frame, cue("question", "war") - 6),
  ];
  const answers = [pop(frame, cue("question", "ends") - 2), pop(frame, cue("question", "ends") + 3)];
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
        UKRAINE
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[2], 2), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[2]))})`, transformOrigin: "0 50%" }}>
        <Accent>VOTE</Accent>
      </Headline>
      <Headline size={BLOCK.small} style={style(words[3], 3)}>
        BEFORE THE
      </Headline>
      <Headline size={BLOCK.small} style={style(words[4], 4)}>
        WAR ENDS?
      </Headline>

      <div style={{ position: "absolute", left: 120, top: 1050, display: "flex", gap: 40 }}>
        {[
          { label: "YES", fill: UA.yellow, color: UA.navy },
          { label: "NO", fill: UA.white, color: UA.blue },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 400,
              height: 180,
              borderRadius: 90,
              background: a.fill,
              boxShadow: i === 0 ? "0 0 50px rgba(255,215,0,0.4)" : "0 20px 40px rgba(0,10,30,0.3)",
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
