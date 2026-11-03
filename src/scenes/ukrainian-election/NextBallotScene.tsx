import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BALLOT_PICK, BALLOT_ROWS, FONT, UA, WRITTEN_NUMBER, type SceneProps } from "./constants";
import { Accent, Headline, Mark, SectionNumeral, WipeLayer } from "./ui";

const SLIP = { left: 130, top: 680, w: 820, h: 480 } as const;
const ROW = { top: 34, h: 146 } as const;
const TICK = { left: 400, size: 96 } as const;
const NUM = { left: 640, w: 160, h: 112 } as const;
const COLORS = ["#7A4FB3", "#2E9AD6", "#E0A21B"] as const;

/**
 * "When martial law ends, you'll tick a party and can write in a candidate's number." Section 05 on
 * paper, the payoff of loop 3 (what comes next) and the full answer to loop 1: the Rada ballot of
 * the 2019 Electoral Code, never used yet (generic, made-up parties): one row per party with a
 * square to tick and a "№" box. A tick lands on "tick" and a hand writes a number on "write".
 */
export const NextBallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 2);
  const head = [rise(frame, 4), rise(frame, 8)];
  const slip = rise(frame, 6);
  const tick = progress(frame, cue("next", "tick") - 1, cue("next", "tick") + 8);
  const write = progress(frame, cue("next", "write") - 1, cue("next", "number") + 2);
  const hi = progress(frame, cue("next", "write") - 6, cue("next", "write"));

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <SectionNumeral n="05" tone="paper" p={numeral * (1 - exit)} />
      <Headline tone="paper" size={190} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        NEW
      </Headline>
      <Headline tone="paper" size={190} style={{ top: 250 + 186, ...riseStyle(head[1], exit, 50) }}>
        <Accent tone="paper">BALLOT</Accent>
      </Headline>

      <div style={{ position: "absolute", left: SLIP.left, top: SLIP.top, width: SLIP.w, height: SLIP.h, borderRadius: 14, background: UA.card, boxShadow: "0 24px 50px rgba(20,30,50,0.18)", ...riseStyle(slip, exit, 80), transform: `${riseStyle(slip, exit, 80).transform} rotate(-1.2deg)` }}>
        {Array.from({ length: BALLOT_ROWS }, (_, i) => {
          const y = ROW.top + i * ROW.h;
          const on = i === BALLOT_PICK;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, width: SLIP.w, height: ROW.h }}>
              <div style={{ position: "absolute", left: 34, top: 22, width: 22, height: ROW.h - 44, borderRadius: 6, background: COLORS[i] }} />
              <div style={{ position: "absolute", left: 80, top: 40, width: 270, height: 30, borderRadius: 15, background: on ? "rgba(14,26,43,0.55)" : UA.inkFaint }} />
              <div style={{ position: "absolute", left: 80, top: 86, width: 190, height: 18, borderRadius: 9, background: UA.inkFaint }} />
              <div style={{ position: "absolute", left: TICK.left, top: (ROW.h - TICK.size) / 2, width: TICK.size, height: TICK.size, border: `5px solid ${on ? UA.ink : "rgba(14,26,43,0.45)"}`, borderRadius: 8, boxSizing: "border-box", background: "#fff" }} />
              {on && (
                <div style={{ position: "absolute", left: TICK.left - 8, top: (ROW.h - TICK.size) / 2 - 16 }}>
                  <Mark ok size={TICK.size + 20} p={tick} color={UA.pen} width={10} />
                </div>
              )}
              <div style={{ position: "absolute", left: 508, top: (ROW.h - 110) / 2 - 4, fontFamily: FONT.body, fontWeight: 800, fontSize: 110, lineHeight: 1, letterSpacing: -6, color: on ? UA.ink : "rgba(14,26,43,0.5)" }}>№</div>
              <div
                style={{
                  position: "absolute",
                  left: NUM.left,
                  top: (ROW.h - NUM.h) / 2,
                  width: NUM.w,
                  height: NUM.h,
                  border: `5px solid ${on ? UA.ink : "rgba(14,26,43,0.45)"}`,
                  borderRadius: 8,
                  boxSizing: "border-box",
                  background: on ? `rgba(255,215,0,${0.35 * hi})` : "#fff",
                }}
              />
              {on && (
                <div
                  style={{
                    position: "absolute",
                    left: NUM.left + 18,
                    top: (ROW.h - NUM.h) / 2 - 18,
                    fontFamily: FONT.serif,
                    fontStyle: "italic",
                    fontSize: 130,
                    lineHeight: 1,
                    color: UA.pen,
                    clipPath: `inset(0 ${100 - write * 100}% 0 0)`,
                  }}
                >
                  {WRITTEN_NUMBER}
                </div>
              )}
              {i < BALLOT_ROWS - 1 && <div style={{ position: "absolute", left: 30, right: 30, bottom: 0, height: 2, background: "rgba(14,26,43,0.1)" }} />}
            </div>
          );
        })}
      </div>
    </>
  );
};
