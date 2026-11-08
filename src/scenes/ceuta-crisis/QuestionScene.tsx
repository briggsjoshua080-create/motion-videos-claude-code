import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise } from "../../components/explainer/motion";
import { CE, FONT, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { BLOCK, BLOCK_TOPS } from "./HookScene";

/**
 * "Should Spain send swimmers back at once?" Rules 8 and 9: one YES/NO question in exactly the hook's
 * layout (same sizes, same orange block, same position): SEND / SWIMMERS / BACK / AT ONCE?, so the last
 * frame flows straight back into frame 0 ("A CITY OF 83,000. 72,000 ARRIVED.") when TikTok loops it.
 * YES / NO sit where the hook's chart is. It holds for 1.2 s. No subtitles: the words are on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "Should") - 6),
    rise(frame, cue("question", "swimmers") - 6),
    pop(frame, cue("question", "back") - 5),
    rise(frame, cue("question", "at") - 6),
  ];
  const answers = [pop(frame, cue("question", "once") - 2), pop(frame, cue("question", "once") + 3)];
  const style = (p: number, i: number): React.CSSProperties => ({
    top: BLOCK_TOPS[i],
    opacity: Math.min(1, Math.max(0, p) * 1.4),
    transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
  });

  return (
    <>
      <Headline size={BLOCK.big} style={style(words[0], 0)}>
        SEND
      </Headline>
      <Headline size={BLOCK.big} style={style(words[1], 1)}>
        SWIMMERS
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[2], 2), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[2]))})`, transformOrigin: "0 50%" }}>
        <Accent>BACK</Accent>
      </Headline>
      <Headline size={BLOCK.small} style={style(words[3], 3)}>
        AT ONCE?
      </Headline>

      <div style={{ position: "absolute", left: 120, top: 1010, display: "flex", gap: 40 }}>
        {[
          { label: "YES", fill: CE.orange, color: CE.navy },
          { label: "NO", fill: CE.white, color: CE.navy },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 400,
              height: 170,
              borderRadius: 85,
              background: a.fill,
              border: i === 0 ? `4px solid ${CE.white}` : "none",
              boxSizing: "border-box",
              boxShadow: i === 0 ? "0 0 50px rgba(255,106,19,0.5)" : "0 20px 40px rgba(2,12,24,0.3)",
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
