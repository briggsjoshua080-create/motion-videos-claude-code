import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, HOUSE, SENATE, SENATE_TERM, SENATE_UP, US, type SceneProps } from "./constants";
import { Accent, Aside, Headline, HouseSeats, SectionNumeral, roll, sweepIn, wobble } from "./ui";

/** The Senate as a 10 × 10 grid of dots; a third (35 seats in 2026) light up, the rest stay dim. */
const GRID = { left: 306, top: 670, step: 52, dot: 18 } as const;
const UP = new Set(
  Array.from({ length: SENATE }, (_, i) => i)
    .sort((a, b) => wobble(`senate-${a}`) - wobble(`senate-${b}`))
    .slice(0, SENATE_UP),
);

/**
 * "All 435 seats, every two years. Senators get six." Section 02: a huge 435 rolls up while the
 * House builds as a 435-dot hemicycle, then "every two years."; just before "Senators" the House
 * gives way to SENATE / 6 YEARS over a 100-dot grid where only about a third light up (the seats on
 * the 2026 ballot). The scene runs on into "Together, they" so the Senate stays up 2 s (rule 6).
 */
export const HouseScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const count = progress(frame, cue("house", "All"), cue("house", "435", "end"), Easing.out(Easing.cubic));
  const number = rise(frame, 1);
  const build = progress(frame, 3, cue("house", "seats", "end"), Easing.out(Easing.quad));
  const aside = rise(frame, cue("house", "every") - 4);
  const swap = cue("house", "Senators") - 8;
  const out = progress(frame, swap, swap + 9);
  const senate = [rise(frame, swap + 2), rise(frame, swap + 5)];
  const grid = progress(frame, swap + 2, swap + 16);
  const lit = progress(frame, swap + 10, swap + 24);

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />

      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 180,
            fontFamily: FONT.display,
            fontSize: 340,
            lineHeight: 0.92,
            letterSpacing: -6,
            color: US.white,
            textShadow: "0 0 60px rgba(255,255,255,0.35)",
            ...riseStyle(number, 0, 60),
          }}
        >
          {roll(0, HOUSE, count)}
        </div>
        <Aside size={118} style={{ top: 520, ...riseStyle(aside, 0, 30) }}>
          every two years.
        </Aside>
        <HouseSeats visible={(i) => sweepIn(build, i)} fill={() => US.white} cy={1090} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Headline size={150} style={{ top: 220, ...riseStyle(senate[0], exit, 50) }}>
          SENATE
        </Headline>
        <Headline size={150} style={{ top: 220 + 150 * 0.98 + 10, ...riseStyle(senate[1], exit, 50) }}>
          <Accent>{SENATE_TERM}</Accent> YEARS
        </Headline>
        {grid > 0 &&
          Array.from({ length: SENATE }, (_, i) => {
            const col = i % 10;
            const row = Math.floor(i / 10);
            const v = Math.min(1, Math.max(0, grid * 12 - (col + row) * 0.6));
            const on = UP.has(i) ? Math.min(1, Math.max(0, lit * 10 - wobble(`lit-${i}`) * 8)) : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: GRID.left + col * GRID.step - GRID.dot,
                  top: GRID.top + row * GRID.step - GRID.dot,
                  width: GRID.dot * 2,
                  height: GRID.dot * 2,
                  borderRadius: "50%",
                  background: on > 0 ? `rgba(255,255,255,${0.28 + 0.72 * on})` : "rgba(255,255,255,0.22)",
                  boxShadow: on > 0.5 ? "0 0 16px rgba(255,255,255,0.55)" : "none",
                  opacity: v,
                  transform: `scale(${0.4 + 0.6 * v + 0.15 * on})`,
                }}
              />
            );
          })}
      </div>
    </>
  );
};
