import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { FONT, MX, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 430, size: 92, step: 96 } as const;

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
        stroke={MX.white}
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
 * "So, should 54% of the votes win 73% of the seats?" The closing question, big: a reminder of the
 * 2024 numbers, then SHOULD 54% OF THE VOTES WIN 73% OF THE SEATS? line by line with each spoken
 * phrase, a box drawn around THE SEATS?, and two answer buttons inviting comments.
 * Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const statement = rise(frame, -2);
  const under = progress(frame, cue("question", "So"), cue("question", "54%"));
  const lines = [
    rise(frame, cue("question", "should") - 6),
    rise(frame, cue("question", "54%") - 6),
    rise(frame, cue("question", "win") - 6),
    rise(frame, cue("question", "73%") - 6),
    rise(frame, cue("question", "seats") - 6),
  ];
  const box = progress(frame, cue("question", "seats") - 4, cue("question", "seats", "end") + 6);
  const answers = [pop(frame, cue("question", "seats") - 2), pop(frame, cue("question", "seats") + 3)];
  const prompt = rise(frame, cue("question", "seats") - 6);

  const texts: React.ReactNode[] = [
    "SHOULD 54%",
    "OF THE VOTES",
    "WIN",
    <Accent key="share">73% OF</Accent>,
    <Boxed key="seats2" p={box}>
      <Accent>THE SEATS?</Accent>
    </Boxed>,
  ];

  return (
    <>
      <Eyebrow style={{ top: 318, ...riseStyle(kicker, 0, 24) }}>08 — YOUR VERDICT</Eyebrow>
      <Mono size={24} color={MX.white} style={{ position: "absolute", left: 120, top: 372, letterSpacing: 4, ...riseStyle(statement, 0, 20) }}>
        2024: THE ALLIANCE'S{" "}
        <span style={{ position: "relative", fontFamily: FONT.mono }}>
          SEATS VS VOTES
          <span style={{ position: "absolute", left: 0, bottom: -6, height: 4, width: `${under * 100}%`, background: MX.red, borderRadius: 2 }} />
        </span>
      </Mono>
      {texts.map((t, i) => (
        <Headline key={i} size={LINE.size} style={{ top: LINE.top + LINE.step * i + (i >= 3 ? 10 : 0) + (i >= 4 ? 14 : 0), ...riseStyle(lines[i], 0, 40) }}>
          {t}
        </Headline>
      ))}

      <Mono size={21} style={{ position: "absolute", left: 120, top: 990, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 1038, display: "flex", gap: 28 }}>
        {[
          { label: "YES", sub: "a clear mandate", fill: MX.white, color: MX.red },
          { label: "NO", sub: "seats = votes", fill: MX.red, color: MX.white },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 300,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: i === 1 ? `2px solid ${MX.white}` : "none",
              boxShadow: i === 0 ? "0 0 40px rgba(255,255,255,0.3)" : "0 20px 40px rgba(0,10,30,0.3)",
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
