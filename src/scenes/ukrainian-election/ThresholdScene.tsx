import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, PARTIES, THRESHOLD, UA, type SceneProps } from "./constants";
import { Aside, Mark } from "./ui";

const BASE = 1150;
const PX_PER_POINT = 9;
const BAR = { left: 150, step: 160, w: 120 } as const;

/**
 * "Parties need 5% to win seats." How votes turn into seats, kept to one number (rule 7): a huge 5%,
 * "to win seats.", five made-up parties' bars, a dashed 5% line drawn on "5%", and the two bars under
 * it greyed out and crossed on "seats" (the rest share the 450 seats by their vote).
 */
export const ThresholdScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const big = pop(frame, 1);
  const aside = rise(frame, 5);
  const grow = progress(frame, 2, 16, Easing.out(Easing.cubic));
  const line = progress(frame, cue("threshold", "5%") - 4, cue("threshold", "5%") + 8);
  const out = progress(frame, cue("threshold", "seats") - 6, cue("threshold", "seats") + 4);
  const lineY = BASE - THRESHOLD * PX_PER_POINT;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 250,
          fontFamily: FONT.display,
          fontSize: 300,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: UA.yellow,
          textShadow: "0 0 70px rgba(255,215,0,0.5)",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, big))})`,
          transformOrigin: "0 50%",
        }}
      >
        {THRESHOLD}%
      </div>
      <Aside size={120} style={{ top: 570, ...riseStyle(aside, exit, 30) }}>
        to win seats.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {PARTIES.map((p, i) => {
          const under = p.share < THRESHOLD;
          const h = p.share * PX_PER_POINT * grow;
          const x = BAR.left + i * BAR.step;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: BASE - h,
                  width: BAR.w,
                  height: h,
                  borderRadius: "14px 14px 0 0",
                  background: under ? `rgba(255,255,255,${0.9 - 0.65 * out})` : p.color,
                  boxShadow: under ? "none" : "0 0 30px rgba(255,255,255,0.18)",
                }}
              />
              {under && (
                <div style={{ position: "absolute", left: x + BAR.w / 2 - 45, top: lineY - 120, opacity: out }}>
                  <Mark ok={false} size={90} p={out} color={UA.yellow} width={10} />
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 130, top: BASE, width: 820, height: 4, background: "rgba(255,255,255,0.5)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={130} x2={130 + 820 * line} y1={lineY} y2={lineY} stroke={UA.yellow} strokeWidth={6} strokeDasharray="18 12" />
        </svg>
      </div>
    </>
  );
};
