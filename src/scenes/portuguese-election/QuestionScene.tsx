import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { BallotBoxIcon } from "../../components/explainer/icons";
import { pop } from "../../components/explainer/motion";
import { bareWord, getSentence } from "../../voiceover/timing";
import { CARD_SHADOW, ELECTIONS, PALETTE as C, PT, timing, type SceneProps } from "./constants";
import { President } from "./characters";
import { QuestionMark } from "./ui";

/** The question as spoken, each word with its cue ("a#2" = the second "a"). */
const WORDS = getSentence(timing, "question").words.map((w, i, all) => {
  const bare = bareWord(w.text);
  const nth = all.slice(0, i + 1).filter((x) => bareWord(x.text).toLowerCase() === bare.toLowerCase()).length;
  return { text: w.text, cue: `${bare}#${nth}` };
});
const ACCENT = new Set(["one", "person", "polls"]);

/**
 * "Should one person be able to send a whole country back to the polls?" + a call to comment.
 * Back to the hook: one President and the three elections that followed his dissolutions. The last
 * scene has no exit: it stays to the end.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const card = pop(frame, 0);
  const mark = pop(frame, 10);
  const cta = pop(frame, cue("question", "polls", "end") + 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 120,
          width: 840,
          height: 240,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, card * 1.4),
          transform: `scale(${0.8 + 0.2 * card})`,
        }}
      >
        <President size={150} id="pres-question" />
        <svg width={70} height={40} viewBox="0 0 60 40">
          <path d="M4 20 H50 M38 8 L52 20 L38 32" fill="none" stroke={C.muted} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {ELECTIONS.map((e) => (
          <div key={e.year} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BallotBoxIcon size={100} palette={C} mark={PT.red} />
            <div style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>{e.year}</div>
          </div>
        ))}
        <QuestionMark size={104} p={mark} style={{ right: -18, top: -44, transform: `scale(${Math.max(0, mark)}) translateY(${float(frame, 8, 70)}px)` }} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 660,
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
          top: 1150,
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
