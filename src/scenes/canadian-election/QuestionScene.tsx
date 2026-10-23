import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { CA, FONT, TWIST, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 384, size: 96, step: 98 } as const;
const LINES = ["SHOULD AN MP", "WHO SWITCHES", "PARTIES FACE", "THE VOTERS"] as const;

/** Draws a white box around its words when `p` goes 0 -> 1 (the reference's hand-drawn box). */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <svg style={{ position: "absolute", left: -18, top: -10, width: "calc(100% + 36px)", height: "calc(100% + 18px)", overflow: "visible", transform: "rotate(-1.5deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={14}
        fill="none"
        stroke={CA.white}
        strokeWidth={8}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55))" }}
      />
    </svg>
  </span>
);

/**
 * "Should an MP who switches parties have to face the voters again?" The closing question, big,
 * with a white box drawn around AGAIN?, the reminder that five MPs switched without a vote, and two
 * answer buttons inviting comments. Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const lines = [0, 1, 2, 3, 4].map((i) => rise(frame, 4 + i * 4));
  const box = progress(frame, cue("question", "again") - 2, cue("question", "again", "end") + 12);
  const aside = rise(frame, cue("question", "switches") - 2);
  const answers = [pop(frame, cue("question", "again") - 2), pop(frame, cue("question", "again") + 3)];
  const prompt = rise(frame, cue("question", "voters") - 4);

  return (
    <>
      <Eyebrow style={{ top: 316, ...riseStyle(kicker, 0, 24) }}>10 — YOUR VERDICT</Eyebrow>
      {LINES.map((l, i) => (
        <Headline key={l} size={LINE.size} style={{ top: LINE.top + i * LINE.step, ...riseStyle(lines[i], 0, 50) }}>
          {l}
        </Headline>
      ))}
      <Headline size={LINE.size} style={{ top: LINE.top + 4 * LINE.step + 8, left: 138, ...riseStyle(lines[4], 0, 50) }}>
        <Boxed p={box}>
          <Accent>AGAIN?</Accent>
        </Boxed>
      </Headline>
      <Aside size={44} style={{ top: 912, ...riseStyle(aside, 0, 24) }}>
        In 2025–26, {TWIST.switched} MPs switched — none faced a vote.
      </Aside>

      <Mono size={21} style={{ position: "absolute", left: 120, top: 1000, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 1046, display: "flex", gap: 28 }}>
        {[
          { label: "YES", sub: "a by-election first", fill: CA.white, color: CA.red },
          { label: "NO", sub: "MPs are free to switch", fill: CA.glass, color: CA.white },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 330,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: i === 1 ? `2px solid ${CA.glassEdge}` : "none",
              boxShadow: i === 0 ? "0 0 40px rgba(255,255,255,0.3)" : "0 20px 40px rgba(40,0,6,0.3)",
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
