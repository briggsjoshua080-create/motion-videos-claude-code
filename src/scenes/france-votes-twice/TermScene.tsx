import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease } from "../../lib/animation";
import { FR, Pill, SAFE, SceneFrame, SceneHeader, pop, span, type SceneProps } from "./ui";

const ROW_TOP = [420, 610, 800];
const ROW_H = 150;

/** One five-year term: a white block with a small segment per year. */
const TermBlock: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: SAFE.width,
      borderRadius: 28,
      background: FR.white,
      fontFamily: theme.font,
      color: FR.navy,
    }}
  >
    <div style={{ position: "absolute", left: 40, top: 28, fontSize: 48, fontWeight: 900, letterSpacing: -1 }}>{label}</div>
    <div style={{ position: "absolute", right: 40, top: 34, fontSize: 40, fontWeight: 800 }}>5 YEARS</div>
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 26, display: "flex", gap: 12 }}>
      {[0, 1, 2, 3, 4].map((year) => (
        <div key={year} style={{ flex: 1, height: 14, borderRadius: 7, background: FR.blue, opacity: 0.35 }} />
      ))}
    </div>
  </div>
);

export const TermScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const terms = [
    { label: "TERM 1", at: cue("term", "five") },
    { label: "TERM 2", at: cue("term", "two") },
  ];
  // The crossed-out third term lands on "...two terms in a row".
  const third = pop(frame, cue("term", "terms") - 2);
  const cross = ease(frame, span(cue("term", "in") - 2, cue("term", "in") + 10));

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="THE TERM" title="5 years, max 2 in a row" />

      {terms.map((t, i) => (
        <div
          key={t.label}
          style={{
            position: "absolute",
            top: ROW_TOP[i],
            left: SAFE.left,
            width: SAFE.width * ease(frame, span(t.at - 4, t.at + 14)),
            height: ROW_H,
            borderRadius: 28,
            overflow: "hidden",
          }}
        >
          <TermBlock label={t.label} />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: ROW_TOP[2],
          left: SAFE.left,
          width: SAFE.width,
          height: ROW_H,
          boxSizing: "border-box",
          borderRadius: 28,
          border: `5px dashed ${FR.mist}`,
          fontFamily: theme.font,
          color: FR.mist,
          opacity: third,
          transform: `scale(${0.9 + 0.1 * third})`,
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 24, fontSize: 48, fontWeight: 900, letterSpacing: -1 }}>TERM 3</div>
        {/* Red X, centred to the right of the label */}
        {[14, -14].map((angle) => (
          <div
            key={angle}
            style={{
              position: "absolute",
              left: 480 - 170,
              top: ROW_H / 2 - 15,
              width: 340,
              height: 20,
              borderRadius: 10,
              background: FR.red,
              transform: `rotate(${angle}deg) scaleX(${cross})`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: ROW_TOP[2] + ROW_H + 40,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          opacity: third,
          transform: `scale(${third})`,
        }}
      >
        <Pill size={36}>NOT 3 IN A ROW</Pill>
      </div>
    </SceneFrame>
  );
};
