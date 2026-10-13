import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { bareWord } from "../../voiceover/timing";
import { pop } from "../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "./constants";

export type QuestionSceneProps = SceneProps & {
  /** The sentence id of the closing question in the voice-over. */
  sentence: string;
  /** The question as shown; each word appears when it is spoken. */
  text: string;
  /** Words (without punctuation, lower case) shown in the accent colour. */
  accent: string[];
  /** Icons above the question. */
  icons: React.ReactNode;
  /** Optional teaser under "COMMENT BELOW" (e.g. "Part 2: ..."). */
  teaser?: React.ReactNode;
};

/**
 * The closing question, word by word with the voice, then "COMMENT BELOW" (and a teaser for the
 * next part). The last scene has no exit: it stays to the end (TikTok loops back to the title).
 */
export const QuestionScene: React.FC<QuestionSceneProps> = ({ cue, sentence, text, accent, icons, teaser }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const iconsIn = pop(frame, 0);
  const end = cue(sentence, undefined, "end");
  const cta = pop(frame, end + 4);
  const tease = pop(frame, end + 14);
  const seen = new Map<string, number>();

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 120,
          width: 840,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          opacity: Math.min(1, iconsIn * 1.4),
          transform: `scale(${0.7 + 0.3 * iconsIn})`,
        }}
      >
        {icons}
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
          columnGap: 22,
          fontFamily: theme.font,
          fontSize: 86,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -2.5,
        }}
      >
        {words.map((word, i) => {
          const bare = bareWord(word);
          const nth = (seen.get(bare.toLowerCase()) ?? 0) + 1;
          seen.set(bare.toLowerCase(), nth);
          const p = pop(frame, cue(sentence, `${bare}#${nth}`) - 3);
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                color: accent.includes(bare.toLowerCase()) ? EU.blue : C.ink,
                opacity: Math.min(1, p * 1.4),
                transform: `translateY(${(1 - p) * 30}px)`,
              }}
            >
              {word}
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
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            padding: "16px 40px",
            borderRadius: 999,
            background: EU.blue,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 14px 34px rgba(15,27,61,0.2)",
            opacity: Math.min(1, cta * 1.4),
            transform: `scale(${cta})`,
          }}
        >
          COMMENT BELOW
        </div>
        {teaser ? <div style={{ opacity: Math.min(1, tease * 1.4), transform: `scale(${0.7 + 0.3 * tease})` }}>{teaser}</div> : null}
      </div>
    </>
  );
};
