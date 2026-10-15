import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { float } from "../../lib/animation";
import { pop } from "../../components/explainer/motion";
import { bareWord, getSentence } from "../../voiceover/timing";
import { CARD_SHADOW, DK, GOVERNMENT_SEATS, MAJORITY, PALETTE as C, TOTAL, timing, type SceneProps } from "./constants";
import { Badge, CabinetIcon, QuestionMark } from "./ui";

/** The question as spoken, each word with its cue ("a#2" = the second "a"). */
const WORDS = getSentence(timing, "question").words.map((w, i, all) => {
  const bare = bareWord(w.text);
  const nth = all.slice(0, i + 1).filter((x) => bareWord(x.text).toLowerCase() === bare.toLowerCase()).length;
  return { text: w.text, cue: `${bare}#${nth}` };
});
const ACCENT = new Set(["without", "majority"]);

/**
 * "Should a government rule without a majority behind it?" + a call to comment.
 * Back to the hook: 82 of 179 seats, short of 90 (cross), and still in power (tick). The last scene
 * has no exit: it stays to the end.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const card = pop(frame, 0);
  const mark = pop(frame, 10);
  const cta = pop(frame, cue("question", "it", "end") + 4);

  return (
    <>
      {/* 82 seats, no majority ✕ -> governs ✓ ... ? */}
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
          justifyContent: "center",
          gap: 30,
          padding: "0 44px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, card * 1.4),
          transform: `scale(${0.8 + 0.2 * card})`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: DK.red }}>{GOVERNMENT_SEATS}</div>
            <Badge size={50} ok={false} p={1} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>
            of {TOTAL} seats (majority {MAJORITY})
          </div>
        </div>
        <svg width={56} height={40} viewBox="0 0 60 40">
          <path d="M4 20 H50 M38 8 L52 20 L38 32" fill="none" stroke={C.muted} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: DK.redSoft, border: `5px solid ${DK.red}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CabinetIcon size={52} chairs={DK.red} />
            </div>
            <Badge size={50} ok p={1} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>governs</div>
        </div>
        <QuestionMark size={104} p={mark} style={{ right: -18, top: -44, transform: `scale(${Math.max(0, mark)}) translateY(${float(frame, 8, 70)}px)` }} />
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
