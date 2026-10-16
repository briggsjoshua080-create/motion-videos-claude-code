import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { pop } from "../../components/explainer/motion";
import { bareWord, getSentence } from "../../voiceover/timing";
import { CARD_SHADOW, FIRST, PALETTE as C, PSOE, timing, type SceneProps } from "./constants";
import { Badge, QuestionMark } from "./ui";

/** The question as spoken, each word with its cue ("a#2" = the second "a"). */
const WORDS = getSentence(timing, "question").words.map((w, i, all) => {
  const bare = bareWord(w.text);
  const nth = all.slice(0, i + 1).filter((x) => bareWord(x.text).toLowerCase() === bare.toLowerCase()).length;
  return { text: w.text, cue: `${bare}#${nth}` };
});
const ACCENT = new Set(["most", "votes", "govern"]);

const ROWS = [
  { party: FIRST, label: "People's Party", place: "1st", governs: false },
  { party: PSOE, label: "Socialists", place: "2nd", governs: true },
] as const;

/**
 * "Should the party with the most votes always get to govern?" + a call to comment.
 * Back to the hook: the People's Party came 1st with 137 seats but is in opposition (cross); the
 * Socialists came 2nd with 121 and govern (tick). The last scene has no exit: it stays to the end.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const card = pop(frame, 0);
  const mark = pop(frame, 10);
  const cta = pop(frame, cue("question", "govern", "end") + 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 120,
          width: 840,
          height: 230,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          padding: "0 44px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, card * 1.4),
          transform: `scale(${0.8 + 0.2 * card})`,
        }}
      >
        {ROWS.map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: r.party.color }} />
            <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>
              {r.label} <span style={{ color: C.inkSoft, fontWeight: 700 }}>· {r.place} · {r.party.seats}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: r.governs ? C.ink : C.inkSoft, whiteSpace: "nowrap" }}>{r.governs ? "governs" : "opposition"}</div>
            <Badge size={48} ok={r.governs} p={1} />
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
