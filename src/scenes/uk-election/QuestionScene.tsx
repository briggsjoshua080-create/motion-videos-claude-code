import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { pop, progress } from "../../components/explainer/motion";
import { bareWord, getSentence } from "../../voiceover/timing";
import { COMMONS_TOTAL, PALETTE as C, UK, WINNER, timing, type SceneProps } from "./constants";

/** The question as spoken, each word with its cue ("of#2" = the second "of"). */
const WORDS = getSentence(timing, "question").words.map((w, i, all) => {
  const bare = bareWord(w.text);
  const nth = all.slice(0, i + 1).filter((x) => bareWord(x.text).toLowerCase() === bare.toLowerCase()).length;
  return { text: w.text, cue: `${bare}#${nth}` };
});
const ACCENT = new Set(["fair", "third", "two-thirds"]);
const SHARES = [
  { label: "of the votes", value: Math.round(WINNER.votes), color: UK.gold },
  { label: "of the seats", value: Math.round((100 * WINNER.seats) / COMMONS_TOTAL), color: UK.blue },
];

/**
 * "Is it fair that a third of the votes can win almost two-thirds of the seats?" + a call to comment.
 * The last scene has no exit: it stays on screen to the end (TikTok loops back to the hook).
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const shares = pop(frame, 0);
  const fill = progress(frame, 2, 22);
  const mark = pop(frame, 10);
  const cta = pop(frame, cue("question", "seats", "end") + 4);

  return (
    <>
      {/* 34% of the votes ... 63% of the seats? */}
      <div
        style={{
          position: "absolute",
          top: 372,
          left: 120,
          width: 840,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 56,
          fontFamily: theme.font,
          opacity: Math.min(1, shares * 1.4),
          transform: `scale(${0.8 + 0.2 * shares})`,
        }}
      >
        {SHARES.map((s, i) => (
          <React.Fragment key={s.label}>
            {i === 1 ? (
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 52,
                  marginBottom: 70,
                  background: C.alert,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 76,
                  fontWeight: 800,
                  boxShadow: "0 14px 34px rgba(14,26,58,0.2)",
                  opacity: Math.min(1, mark * 1.4),
                  transform: `scale(${mark}) translateY(${float(frame, 8, 70)}px)`,
                }}
              >
                ?
              </div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, color: C.ink, lineHeight: 1 }}>{Math.round(s.value * fill)}%</div>
              <div style={{ width: 220, height: 30, borderRadius: 10, background: C.paperDeep, overflow: "hidden" }}>
                <div style={{ width: `${s.value * fill}%`, height: "100%", borderRadius: 10, background: s.color }} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft }}>{s.label}</div>
            </div>
          </React.Fragment>
        ))}
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
            boxShadow: "0 14px 34px rgba(14,26,58,0.2)",
          }}
        >
          COMMENT BELOW
        </div>
      </div>
    </>
  );
};
