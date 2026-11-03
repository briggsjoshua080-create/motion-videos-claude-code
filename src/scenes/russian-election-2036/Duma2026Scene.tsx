import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DUMA, FONT, RU, UR_2026, type SceneProps } from "./constants";
import { Aside, Stamp, WipeLayer, roll } from "./ui";
import { DumaSeats, sweepIn } from "./DumaSeats";

const CY = 1060;

/**
 * "In 2026, his party won 349 seats. A liberal rival was barred." Loop 3 closed, on paper: a
 * counter to 349 with "of 450 seats." while the hemicycle fills (his party's seats in red, the rest
 * grey, built in the first 0.7 s so it stays up 2.5 s); then, after "349", the hemicycle fades behind a made-up party card that gets a BARRED stamp
 * on "seats" (up 2.5 s). Only the one number that matters is on screen (rule 7).
 */
export const Duma2026Scene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const big = pop(frame, 4);
  const count = progress(frame, cue("duma2026", "his") - 2, cue("duma2026", "349", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, 8);
  const build = progress(frame, 4, 26, Easing.out(Easing.quad));
  const swap = progress(frame, cue("duma2026", "349", "end") - 4, cue("duma2026", "349", "end") + 4);
  const card = rise(frame, cue("duma2026", "349", "end") - 2);
  const stamp = pop(frame, cue("duma2026", "seats") - 2);
  const others = DUMA - UR_2026;

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 230,
          fontFamily: FONT.display,
          fontSize: 300,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: RU.red,
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))})`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(0, UR_2026, count)}
      </div>
      <Aside tone="paper" size={120} style={{ top: 530, ...riseStyle(aside, exit, 30) }}>
        of 450 seats.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: (1 - 0.85 * swap) * (1 - exit) }}>
        <DumaSeats cy={CY} visible={(i) => sweepIn(build, i)} fill={(i) => (i >= others ? RU.red : "rgba(14,26,36,0.28)")} />
      </div>

      {/* A made-up party card (generic: a colour square and grey bars). */}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 760,
          width: 700,
          height: 280,
          borderRadius: 22,
          background: RU.card,
          boxShadow: "0 24px 50px rgba(20,30,50,0.2)",
          ...riseStyle(card, exit, 60),
          opacity: Math.min(1, Math.max(0, card)) * (1 - exit),
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 60, width: 160, height: 160, borderRadius: 24, background: "#3FA34D" }} />
        <div style={{ position: "absolute", left: 240, top: 88, width: 380, height: 40, borderRadius: 20, background: "rgba(14,26,36,0.55)" }} />
        <div style={{ position: "absolute", left: 240, top: 156, width: 280, height: 26, borderRadius: 13, background: RU.inkFaint }} />
      </div>
      <Stamp p={stamp} color={RU.red} fill="rgba(255,255,255,0.88)" size={150} rotate={-9} style={{ left: 220, top: 800, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit), border: `13px solid ${RU.red}` }}>
        BARRED
      </Stamp>
    </>
  );
};
