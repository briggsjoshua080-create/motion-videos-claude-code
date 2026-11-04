import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MAJORITY, US, type SceneProps } from "./constants";
import { Accent, Aside, HOUSE_LAYOUT, Headline, HouseSeats, Mark, PersonIcon, roll, sweepIn } from "./ui";

/** Three made-up candidates in one district: how far each bar grows (the middle one wins). */
const BARS = [0.5, 0.86, 0.36] as const;
const WINNER = 1;
const BAR = { left: 300, top: 640, height: 96, gap: 40, max: 640 } as const;

/**
 * "Most votes wins each district. 218 wins the House." How votes turn into seats, kept clean (no
 * joke): MOST VOTES WINS over three candidate bars in one district, the longest gets a tick on
 * "district"; then the House returns and fills seat by seat up to the dashed halfway line, with a
 * 218 counter and "wins the House.". Each caption stays up 2 s (rule 6).
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const grow = progress(frame, cue("seats", "Most") - 2, cue("seats", "district") - 2, Easing.out(Easing.cubic));
  const tick = progress(frame, cue("seats", "district") - 2, cue("seats", "district") + 8);
  const swap = cue("seats", "218") - 6;
  const out = progress(frame, swap, swap + 9);
  const second = [rise(frame, swap + 2), rise(frame, swap + 6)];
  const build = progress(frame, swap, swap + 10);
  const count = progress(frame, cue("seats", "218"), cue("seats", "218", "end"), Easing.out(Easing.cubic));
  const lineP = pop(frame, cue("seats", "218", "end") - 4);
  const { cx, rOut } = HOUSE_LAYOUT;
  const seatsCy = 1100;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        <Headline size={115} style={{ top: 250, ...riseStyle(head[0], 0, 40) }}>
          MOST VOTES
        </Headline>
        <Headline size={175} style={{ top: 250 + 115 * 0.98 + 10, ...riseStyle(head[1], 0, 40) }}>
          <Accent>WINS</Accent>
        </Headline>
        {BARS.map((share, i) => {
          const top = BAR.top + i * (BAR.height + BAR.gap);
          const win = i === WINNER;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top, width: "100%", height: BAR.height, opacity: Math.min(1, Math.max(0, rise(frame, 2 + i * 3)) * 1.4) }}>
              <div style={{ position: "absolute", left: 120, top: 0 }}>
                <PersonIcon size={BAR.height} color={win && tick > 0 ? US.white : "rgba(255,255,255,0.75)"} fill={win && tick > 0.5 ? "rgba(255,255,255,0.18)" : "none"} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left - 60,
                  top: 10,
                  height: BAR.height - 20,
                  width: BAR.max * share * grow,
                  borderRadius: 14,
                  background: win ? US.white : US.grey,
                  boxShadow: win && tick > 0 ? "0 0 36px rgba(255,255,255,0.45)" : "none",
                }}
              />
              {win && tick > 0 && (
                <div style={{ position: "absolute", left: BAR.left - 60 + BAR.max * share + 20, top: 4 }}>
                  <Mark ok size={88} p={tick} color={US.white} width={11} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: out * (1 - exit), transform: `translateY(${-exit * 40}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 190,
            fontFamily: FONT.display,
            fontSize: 340,
            lineHeight: 0.92,
            letterSpacing: -6,
            color: US.white,
            textShadow: "0 0 60px rgba(255,255,255,0.35)",
            ...riseStyle(second[0], 0, 60),
          }}
        >
          {roll(0, MAJORITY, count)}
        </div>
        <Aside size={118} style={{ top: 530, ...riseStyle(second[1], 0, 30) }}>
          wins the House.
        </Aside>
        <HouseSeats visible={(i) => sweepIn(build, i)} fill={(i) => (i < MAJORITY * count ? US.white : "rgba(255,255,255,0.26)")} cy={seatsCy} />
        <svg width={40} height={rOut + 60} style={{ position: "absolute", left: cx - 20, top: seatsCy - rOut - 40, overflow: "visible", opacity: Math.min(1, Math.max(0, lineP) * 1.5) }}>
          <line x1={20} x2={20} y1={0} y2={rOut + 50} stroke={US.redLight} strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
};
