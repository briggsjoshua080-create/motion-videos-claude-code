import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { BallotBoxIcon, CrownIcon } from "../../components/explainer/icons";
import { pop } from "../../components/explainer/motion";
import { PALETTE as C, type SceneProps } from "./constants";

/** Question words, each revealed when the voice says it. */
const WORDS: [text: string, spoken: string][] = [
  ["Is", "Is"],
  ["it", "it"],
  ["really", "really"],
  ["democracy", "democracy"],
  ["if", "if"],
  ["you", "you"],
  ["don't", "don't"],
  ["vote", "vote"],
  ["for", "for"],
  ["your", "your"],
  ["head", "head"],
  ["of", "of"],
  ["state?", "state"],
];
const ACCENT = new Set(["democracy", "vote"]);

/**
 * "Is it really democracy if you don't vote for your head of state?" + a call to comment.
 * The last scene has no exit: it stays on screen to the end (TikTok loops back to the title).
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const icons = pop(frame, 0);
  const cta = pop(frame, cue("question", "state", "end") + 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 370,
          left: 120,
          width: 840,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          opacity: Math.min(1, icons * 1.4),
          transform: `scale(${0.7 + 0.3 * icons})`,
        }}
      >
        <div style={{ transform: `translateY(${float(frame, 8, 70)}px) rotate(-6deg)` }}>
          <CrownIcon size={200} palette={C} />
        </div>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            background: C.accent,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.font,
            fontSize: 92,
            fontWeight: 800,
            boxShadow: "0 14px 34px rgba(20,33,61,0.2)",
          }}
        >
          ?
        </div>
        <div style={{ transform: `translateY(${float(frame, 8, 70, 35)}px) rotate(6deg)` }}>
          <BallotBoxIcon size={200} palette={C} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 120,
          width: 840,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 24,
          fontFamily: theme.font,
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -2.5,
        }}
      >
        {WORDS.map(([text, spoken]) => {
          const p = pop(frame, cue("question", spoken) - 3);
          return (
            <span
              key={text}
              style={{
                display: "inline-block",
                color: ACCENT.has(spoken) ? C.accentDeep : C.ink,
                opacity: Math.min(1, p * 1.4),
                transform: `translateY(${(1 - p) * 30}px)`,
              }}
            >
              {text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 1210,
          left: 120,
          width: 840,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, cta * 1.4),
          transform: `scale(${cta})`,
        }}
      >
        <div
          style={{
            padding: "16px 40px",
            borderRadius: 999,
            background: C.alert,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 14px 34px rgba(20,33,61,0.2)",
          }}
        >
          COMMENT BELOW
        </div>
      </div>
    </>
  );
};
