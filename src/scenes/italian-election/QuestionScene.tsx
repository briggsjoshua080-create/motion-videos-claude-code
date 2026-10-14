import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { pop } from "../../components/explainer/motion";
import { bareWord, getSentence } from "../../voiceover/timing";
import { CARD_SHADOW, GOVERNMENTS, PALETTE as C, timing, type SceneProps } from "./constants";
import { GovernmentCount, GovernmentTiles, TILES_WIDTH } from "./GovernmentTiles";

/** The question as spoken, each word with its cue ("the#2" = the second "the"). */
const WORDS = getSentence(timing, "question").words.map((w, i, all) => {
  const bare = bareWord(w.text);
  const nth = all.slice(0, i + 1).filter((x) => bareWord(x.text).toLowerCase() === bare.toLowerCase()).length;
  return { text: w.text, cue: `${bare}#${nth}` };
});
const ACCENT = new Set(["democracy", "change", "election"]);

/**
 * "Is it democracy if the prime minister can change without an election?" + a call to comment.
 * Back to the hook (68 governments). The last scene has no exit: it stays on screen to the end.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const card = pop(frame, 0);
  const mark = pop(frame, 10);
  const cta = pop(frame, cue("question", "election", "end") + 4);

  return (
    <>
      {/* 68 governments ... ? */}
      <div
        style={{
          position: "absolute",
          top: 372,
          left: 120,
          width: 840,
          height: 210,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 40px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, card * 1.4),
          transform: `scale(${0.8 + 0.2 * card})`,
        }}
      >
        <div style={{ width: 200 }}>
          <GovernmentCount value={GOVERNMENTS} label="governments" />
        </div>
        <div style={{ width: TILES_WIDTH }}>
          <GovernmentTiles shown={GOVERNMENTS} today={1} />
        </div>
        <div
          style={{
            position: "absolute",
            right: -18,
            top: -44,
            width: 104,
            height: 104,
            borderRadius: 52,
            background: C.alert,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 800,
            boxShadow: "0 14px 34px rgba(20,32,43,0.2)",
            opacity: Math.min(1, mark * 1.4),
            transform: `scale(${mark}) translateY(${float(frame, 8, 70)}px)`,
          }}
        >
          ?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 650,
          left: 120,
          width: 840,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 22,
          fontFamily: theme.font,
          fontSize: 84,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -2.5,
        }}
      >
        {WORDS.map((w) => {
          const p = pop(frame, cue("question", w.cue) - 3);
          const accent = ACCENT.has(bareWord(w.text).toLowerCase());
          return (
            <span
              key={w.cue}
              style={{
                display: "inline-block",
                color: accent ? C.alert : C.ink,
                opacity: Math.min(1, p * 1.4),
                transform: `translateY(${(1 - p) * 30}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 1130,
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
            background: C.ink,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 14px 34px rgba(20,32,43,0.2)",
          }}
        >
          COMMENT BELOW
        </div>
      </div>
    </>
  );
};
