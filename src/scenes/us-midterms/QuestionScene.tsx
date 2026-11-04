import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { BLOCK, BLOCK_TOPS } from "./HookScene";

/**
 * "So, should America scrap midterms?" Rules 8 and 9: one YES/NO question in exactly the hook's
 * layout (same rows, sizes, red block and position), so the last frame flows straight back into
 * frame 0 ("THE PRESIDENT JUST FAILED HIS MIDTERM") when TikTok loops the video. Two answer buttons
 * sit where the hook's report card is. It holds for 1.2 s. No subtitles: the words are on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "So") - 6),
    rise(frame, cue("question", "should") - 6),
    rise(frame, cue("question", "America") - 6),
    pop(frame, cue("question", "scrap") - 5),
    rise(frame, cue("question", "midterms") - 6),
  ];
  const answers = [pop(frame, cue("question", "midterms") - 2), pop(frame, cue("question", "midterms") + 3)];
  const style = (p: number, i: number): React.CSSProperties => ({
    top: BLOCK_TOPS[i],
    opacity: Math.min(1, Math.max(0, p) * 1.4),
    transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
  });

  return (
    <>
      <Headline size={BLOCK.big} style={style(words[0], 0)}>
        SO,
      </Headline>
      <Headline size={BLOCK.big} style={style(words[1], 1)}>
        SHOULD
      </Headline>
      <Headline size={BLOCK.big} style={style(words[2], 2)}>
        AMERICA
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[3], 3), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[3]))})`, transformOrigin: "0 50%" }}>
        <Accent>SCRAP</Accent>
      </Headline>
      <Headline size={BLOCK.small} style={style(words[4], 4)}>
        MIDTERMS?
      </Headline>

      <div style={{ position: "absolute", left: 120, top: 1100, display: "flex", gap: 40 }}>
        {[
          { label: "YES", fill: US.red, color: US.white },
          { label: "NO", fill: US.white, color: US.blue },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 400,
              height: 180,
              borderRadius: 90,
              background: a.fill,
              boxShadow: i === 0 ? "0 0 0 5px rgba(255,255,255,0.9), 0 0 50px rgba(210,40,63,0.45)" : "0 20px 40px rgba(0,10,30,0.3)",
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
