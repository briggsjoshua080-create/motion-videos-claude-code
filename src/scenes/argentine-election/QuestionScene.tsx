import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { AR, FONT, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 430, size: 100, step: 104 } as const;

/** Draws a white box around its words when `p` goes 0 -> 1 (the reference's hand-drawn box). */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <svg style={{ position: "absolute", left: -18, top: -8, width: "calc(100% + 36px)", height: "calc(100% + 8px)", overflow: "visible", transform: "rotate(-1.5deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={14}
        fill="none"
        stroke={AR.white}
        strokeWidth={8}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
      />
    </svg>
  </span>
);

/**
 * "So, should 16-year-olds help choose who runs a country?" The closing question, big: a reminder of
 * the start (votes from 16), then SHOULD 16-YEAR-OLDS CHOOSE WHO RUNS A COUNTRY? line by line with
 * each spoken word, a box drawn around COUNTRY?, and two answer buttons inviting comments.
 * Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const statement = rise(frame, -2);
  const under = progress(frame, cue("question", "So"), cue("question", "16-year-olds"));
  const lines = [
    rise(frame, cue("question", "should") - 6),
    rise(frame, cue("question", "16-year-olds") - 6),
    rise(frame, cue("question", "help") - 6),
    rise(frame, cue("question", "runs") - 6),
    rise(frame, cue("question", "country") - 6),
  ];
  const box = progress(frame, cue("question", "country") - 3, cue("question", "country", "end") + 8);
  const answers = [pop(frame, cue("question", "country") - 2), pop(frame, cue("question", "country") + 3)];
  const prompt = rise(frame, cue("question", "country") - 6);

  const texts: React.ReactNode[] = [
    "SHOULD",
    <Accent key="age">16-YEAR-OLDS</Accent>,
    "HELP CHOOSE",
    "WHO RUNS A",
    <Boxed key="country" p={box}>
      COUNTRY?
    </Boxed>,
  ];

  return (
    <>
      <Eyebrow style={{ top: 318, ...riseStyle(kicker, 0, 24) }}>08 — YOUR VERDICT</Eyebrow>
      <Mono size={24} color={AR.white} style={{ position: "absolute", left: 120, top: 372, letterSpacing: 4, ...riseStyle(statement, 0, 20) }}>
        ARGENTINA:{" "}
        <span style={{ position: "relative", fontFamily: FONT.mono }}>
          YOU CAN VOTE AT 16
          <span style={{ position: "absolute", left: 0, bottom: -6, height: 4, width: `${under * 100}%`, background: AR.sun, borderRadius: 2 }} />
        </span>
      </Mono>
      {texts.map((t, i) => (
        <Headline key={i} size={LINE.size} style={{ top: LINE.top + LINE.step * i + (i >= 2 ? 8 : 0) + (i >= 4 ? 14 : 0), ...riseStyle(lines[i], 0, 40) }}>
          {t}
        </Headline>
      ))}

      <Mono size={21} style={{ position: "absolute", left: 120, top: 1000, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 1046, display: "flex", gap: 28 }}>
        {[
          { label: "YES", sub: "it's their future too", fill: AR.sun, color: AR.navy },
          { label: "NO", sub: "too young", fill: AR.white, color: AR.blueDeep },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 300,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: `2px solid ${AR.white}`,
              boxShadow: i === 0 ? "0 0 40px rgba(246,180,14,0.35)" : "0 20px 40px rgba(0,10,30,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: a.color,
              opacity: Math.min(1, Math.max(0, answers[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * answers[i]})`,
            }}
          >
            <div style={{ fontFamily: FONT.display, fontSize: 56, lineHeight: 1 }}>{a.label}</div>
            <div style={{ marginTop: 8, fontFamily: FONT.body, fontSize: 24, fontWeight: 600, opacity: 0.85 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </>
  );
};
