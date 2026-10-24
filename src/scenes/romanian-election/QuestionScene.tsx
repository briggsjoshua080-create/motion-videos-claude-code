import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle } from "../../components/explainer/motion";
import { FONT, RO, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LINE = { top: 380, size: 106, step: 106 } as const;

/** Draws a yellow box around its words when `p` goes 0 -> 1 (the reference's hand-drawn box). */
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
        stroke={RO.yellow}
        strokeWidth={8}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 10px rgba(252,209,22,0.55))" }}
      />
    </svg>
  </span>
);

/**
 * "Should a court ever be allowed to cancel an election?" The closing question, big, with a yellow
 * box drawn around CANCEL, the italic counter-question and two answer buttons inviting comments.
 * Subtitles are off here: the words are already on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 2);
  const lines = [0, 1, 2, 3].map((i) => rise(frame, 4 + i * 4));
  const box = progress(frame, cue("question", "cancel") - 2, cue("question", "election") + 8);
  const aside = rise(frame, cue("question", "allowed") - 2);
  const answers = [pop(frame, cue("question", "election") - 2), pop(frame, cue("question", "election") + 3)];
  const prompt = rise(frame, cue("question", "election") - 6);

  return (
    <>
      <Eyebrow style={{ top: 318, ...riseStyle(kicker, 0, 24) }}>09 — YOUR VERDICT</Eyebrow>
      {["SHOULD A", "COURT EVER", "", "ELECTION?"].map((text, i) => (
        <Headline key={i} size={LINE.size} style={{ top: LINE.top + LINE.step * i, ...riseStyle(lines[i], 0, 50) }}>
          {i === 2 ? (
            <>
              <Boxed p={box}>
                <Accent>CANCEL</Accent>
              </Boxed>{" "}
              AN
            </>
          ) : (
            text
          )}
        </Headline>
      ))}
      <Aside size={54} style={{ top: 830, ...riseStyle(aside, 0, 24) }}>
        …even to protect the vote?
      </Aside>

      <Mono size={21} style={{ position: "absolute", left: 120, top: 950, ...riseStyle(prompt, 0, 20) }}>
        TELL US IN THE COMMENTS
      </Mono>
      <div style={{ position: "absolute", left: 120, top: 1000, display: "flex", gap: 28 }}>
        {[
          { label: "YES", sub: "if it's rigged", fill: RO.yellow, color: RO.ink },
          { label: "NO", sub: "voters decide", fill: "rgba(0,14,48,0.46)", color: RO.white },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 300,
              height: 150,
              borderRadius: 24,
              background: a.fill,
              border: i === 1 ? `2px solid ${RO.glassEdge}` : "none",
              boxShadow: i === 0 ? "0 0 40px rgba(252,209,22,0.35)" : "0 20px 40px rgba(0,10,34,0.3)",
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
