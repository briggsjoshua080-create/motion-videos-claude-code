import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 392, size: 112, step: 112 } as const;

/** Draws a red box around its words when `p` goes 0 -> 1 (the reference's hand-drawn box). */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <svg style={{ position: "absolute", left: -18, top: -6, width: "calc(100% + 36px)", height: "calc(100% + 4px)", overflow: "visible", transform: "rotate(-1.5deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={14}
        fill="none"
        stroke={US.redBright}
        strokeWidth={8}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 10px rgba(240,71,94,0.55))" }}
      />
    </svg>
  </span>
);

/**
 * "Should the candidate with the most votes always win?" The closing question, big, with a red box
 * drawn around ALWAYS WIN?, the italic reminder that it happened twice since 2000, and two answer
 * buttons inviting comments. Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const lines = [0, 1, 2].map((i) => rise(frame, 4 + i * 4));
  const box = progress(frame, cue("question", "always") - 2, cue("question", "win") + 10);
  const aside = rise(frame, cue("question", "most") - 2);
  const answers = [pop(frame, cue("question", "win") - 2), pop(frame, cue("question", "win") + 3)];
  const prompt = rise(frame, cue("question", "always") - 4);

  return (
    <>
      <Eyebrow style={{ top: 330, ...riseStyle(kicker, 0, 24) }}>08 — YOUR VERDICT</Eyebrow>
      <Headline size={LINE.size} style={{ top: LINE.top, ...riseStyle(lines[0], 0, 50) }}>
        SHOULD THE
      </Headline>
      <Headline size={LINE.size} style={{ top: LINE.top + LINE.step, ...riseStyle(lines[1], 0, 50) }}>
        MOST VOTES
      </Headline>
      <Headline size={LINE.size} style={{ top: LINE.top + LINE.step * 2, ...riseStyle(lines[2], 0, 50) }}>
        <Boxed p={box}>
          <Accent>ALWAYS WIN?</Accent>
        </Boxed>
      </Headline>
      <Aside size={50} style={{ top: 770, ...riseStyle(aside, 0, 24) }}>
        In 2000 and 2016, the winner had fewer votes nationwide.
      </Aside>

      <Mono size={21} style={{ position: "absolute", left: 120, top: 926, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 976, display: "flex", gap: 28 }}>
        {[
          { label: "YES", sub: "most votes wins", fill: US.red, color: US.white },
          { label: "NO", sub: "keep the electors", fill: US.glass, color: US.white },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 300,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: i === 1 ? `2px solid ${US.glassEdge}` : "none",
              boxShadow: i === 0 ? "0 0 40px rgba(240,71,94,0.35)" : "0 20px 40px rgba(0,10,28,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: a.color,
              opacity: Math.min(1, Math.max(0, answers[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * answers[i]})`,
            }}
          >
            <div style={{ fontFamily: FONT.display, fontSize: 64, lineHeight: 1 }}>{a.label}</div>
            <div style={{ marginTop: 8, fontFamily: FONT.body, fontSize: 24, fontWeight: 600, opacity: 0.85 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </>
  );
};
