import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Headline, Mark, WipeLayer } from "./ui";

/**
 * A generic local ballot (made up: the small print is grey bars). One row per candidate with a
 * yes and a no box, and a blank write-in row at the bottom. `marks[i]` draws row i's mark (a tick
 * for yes on row 0, a cross for no on row 1), `write` draws the handwritten name in the last row.
 */
export const LocalBallot: React.FC<{ w: number; rows: number; marks?: number[]; write?: number; kinds?: ("yes" | "no" | null)[]; writeIn?: boolean }> = ({
  w,
  rows,
  marks = [],
  write = 0,
  kinds = [],
  writeIn = true,
}) => {
  const rowH = 118;
  const h = 56 + rows * rowH + (writeIn ? rowH : 0) + 20;
  const box = 64;
  const boxX = [w - 2 * box - 70, w - box - 36];
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 16, background: CN.card, boxShadow: "0 24px 50px rgba(40,20,10,0.25)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 34, background: CN.red }} />
      {Array.from({ length: rows }, (_, i) => {
        const y = 56 + i * rowH;
        const kind = kinds[i] ?? null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, width: w, height: rowH, borderBottom: `2px solid ${CN.inkFaint}` }}>
            <div style={{ position: "absolute", left: 30, top: rowH / 2 - 22, width: 240 - (i % 2) * 50, height: 24, borderRadius: 12, background: "rgba(31,18,16,0.5)" }} />
            <div style={{ position: "absolute", left: 30, top: rowH / 2 + 12, width: 150, height: 14, borderRadius: 7, background: CN.inkFaint }} />
            {boxX.map((x, k) => (
              <div key={k} style={{ position: "absolute", left: x, top: (rowH - box) / 2, width: box, height: box, border: `4px solid ${k === 0 ? "rgba(31,18,16,0.55)" : "rgba(222,41,16,0.6)"}`, borderRadius: k === 0 ? 32 : 6, boxSizing: "border-box" }} />
            ))}
            {kind && (
              <div style={{ position: "absolute", left: boxX[kind === "yes" ? 0 : 1] - 6, top: (rowH - box) / 2 - 10 }}>
                <Mark ok={kind === "yes"} size={box + 14} p={marks[i] ?? 0} color={CN.pen} width={10} />
              </div>
            )}
          </div>
        );
      })}
      {writeIn && (
        <div style={{ position: "absolute", left: 0, top: 56 + rows * rowH, width: w, height: rowH }}>
          <div style={{ position: "absolute", left: 30, right: boxX[0] - 20 > 0 ? w - boxX[0] + 20 : 30, top: rowH / 2 + 26, height: 0, borderTop: `4px dashed rgba(31,18,16,0.4)` }} />
          <svg width={w} height={rowH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d="M40 66 C55 30 65 30 70 62 C76 34 88 30 96 60 C104 36 118 34 124 58 C134 40 150 38 158 56 C168 44 184 42 192 58 C204 42 222 44 232 60"
              fill="none"
              stroke={CN.pen}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - write}
            />
          </svg>
          <div style={{ position: "absolute", left: boxX[0], top: (rowH - box) / 2, width: box, height: box, border: "4px solid rgba(31,18,16,0.55)", borderRadius: 32, boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: boxX[0] - 6, top: (rowH - box) / 2 - 10 }}>
            <Mark ok size={box + 14} p={progress(write, 0.75, 1)} color={CN.pen} width={10} />
          </div>
        </div>
      )}
    </div>
  );
};

const WORDS = ["YES,", "NO,", "OR WRITE"] as const;

/**
 * "You back or reject each name, or write in someone else." How the local vote works, on light
 * paper: a generic ballot with two candidates and a write-in row; a tick lands on "back", a cross on
 * "reject" and a name is written in on "write". The caption YES, / NO, / OR WRITE is up from the
 * start (each line over 2 s, rule 6).
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const ballot = rise(frame, 2);
  const marks = [
    progress(frame, cue("ballot", "back") - 2, cue("ballot", "back") + 8),
    progress(frame, cue("ballot", "reject") - 2, cue("ballot", "reject") + 8),
  ];
  const write = progress(frame, cue("ballot", "write") - 2, cue("ballot", "else", "end"));
  const words = [rise(frame, 3), rise(frame, 7), rise(frame, 11)];

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        {WORDS.map((word, i) => (
          <Headline key={word} tone="paper" size={130} style={{ top: 240 + i * 128, ...riseStyle(words[i], exit, 40), color: i === 1 ? CN.red : CN.ink }}>
            {word}
          </Headline>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, top: 660, transform: `rotate(-1.5deg)`, ...riseStyle(ballot, exit, 80) }}>
        <LocalBallot w={760} rows={2} kinds={["yes", "no"]} marks={marks} write={write} />
      </div>
    </>
  );
};
