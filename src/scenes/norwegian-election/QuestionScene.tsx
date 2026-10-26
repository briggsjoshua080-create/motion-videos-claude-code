import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { FONT, NO, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 380, size: 104, step: 104 } as const;

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
        stroke={NO.white}
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
 * "And Norway's parliament can never be dissolved. No early elections. Stability, or democracy on
 * pause?" The closing statement and question, big: NO EARLY ELECTIONS. under an underlined
 * "dissolve", then STABILITY, OR DEMOCRACY ON PAUSE? with a box drawn around ON PAUSE, and two
 * answer buttons inviting comments. Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const statement = rise(frame, cue("question", "parliament") - 6);
  const strike = progress(frame, cue("question", "dissolved") - 2, cue("question", "dissolved", "end"));
  const lines = [rise(frame, cue("question", "No") - 6), rise(frame, cue("question", "early") - 4)];
  const q = [rise(frame, cue("question", "Stability") - 6), rise(frame, cue("question", "democracy") - 6), rise(frame, cue("question", "on") - 6)];
  const box = progress(frame, cue("question", "on") - 2, cue("question", "pause", "end") + 6);
  const answers = [pop(frame, cue("question", "pause") - 2), pop(frame, cue("question", "pause") + 3)];
  const prompt = rise(frame, cue("question", "pause") - 6);

  return (
    <>
      <Eyebrow style={{ top: 318, ...riseStyle(kicker, 0, 24) }}>09 — YOUR VERDICT</Eyebrow>
      <Mono size={24} color={NO.white} style={{ position: "absolute", left: 120, top: 372, letterSpacing: 4, ...riseStyle(statement, 0, 20) }}>
        THE STORTING CAN NEVER BE{" "}
        <span style={{ position: "relative", fontFamily: FONT.mono }}>
          DISSOLVED
          <span style={{ position: "absolute", left: 0, bottom: -6, height: 4, width: `${strike * 100}%`, background: NO.white, borderRadius: 2 }} />
        </span>
      </Mono>
      {["NO EARLY", "ELECTIONS."].map((text, i) => (
        <Headline key={text} size={LINE.size} style={{ top: 430 + LINE.step * i, ...riseStyle(lines[i], 0, 50) }}>
          {i === 1 ? <Accent>{text}</Accent> : text}
        </Headline>
      ))}
      {["STABILITY,", "OR DEMOCRACY", ""].map((text, i) => (
        <Headline key={i} size={86} style={{ top: 690 + 102 * i, ...riseStyle(q[i], 0, 40) }}>
          {i === 2 ? (
            <>
              <Boxed p={box}>ON PAUSE?</Boxed>
            </>
          ) : (
            text
          )}
        </Headline>
      ))}

      <Mono size={21} style={{ position: "absolute", left: 120, top: 1036, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 1084, display: "flex", gap: 28 }}>
        {[
          { label: "STABLE", sub: "4 calm years", fill: NO.white, color: NO.red },
          { label: "PAUSED", sub: "voters wait", fill: NO.blue, color: NO.white },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 300,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: i === 1 ? `2px solid ${NO.white}` : "none",
              boxShadow: i === 0 ? "0 0 40px rgba(255,255,255,0.3)" : "0 20px 40px rgba(20,0,6,0.3)",
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
