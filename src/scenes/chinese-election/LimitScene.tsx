import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Aside, Headline, Stamp } from "./ui";

const BAR = { top: 780, h: 120, w: 255, xs: [120, 395, 700] } as const;
const WALL = { x: 668, top: 730, h: 220 } as const;

/**
 * "In 2018, it scrapped his two-term limit." TERM LIMIT with "in 2018,": two five-year term blocks
 * run up to a white wall (the old two-term limit); on "scrapped" the wall falls away, a GONE stamp
 * lands and a third, striped block runs on past where the wall was.
 */
export const LimitScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const aside = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 5)];
  const bars = [progress(frame, 4, 14, Easing.out(Easing.cubic)), progress(frame, 10, 20, Easing.out(Easing.cubic))];
  const wall = rise(frame, 12);
  // Lands just after "2018", ahead of "scrapped", so the stamp stays up over 2 s (rule 6).
  const hit = cue("limit", "2018") + 6;
  const fall = progress(frame, hit - 2, hit + 12, Easing.in(Easing.quad));
  const third = progress(frame, hit + 4, hit + 18, Easing.out(Easing.cubic));
  const stamp = pop(frame, hit);

  return (
    <>
      <Aside size={125} style={{ top: 250, ...riseStyle(aside, exit, 30) }}>
        in 2018,
      </Aside>
      <Headline size={150} style={{ top: 385, ...riseStyle(head[0], exit, 50) }}>
        TERM
      </Headline>
      <Headline size={175} style={{ top: 385 + 150, ...riseStyle(head[1], exit, 50) }}>
        <Accent>LIMIT</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: BAR.xs[i],
              top: BAR.top,
              width: BAR.w * bars[i],
              height: BAR.h,
              borderRadius: 18,
              background: CN.yellow,
              boxShadow: "0 0 30px rgba(255,222,0,0.35)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: BAR.xs[2],
            top: BAR.top,
            width: BAR.w * third,
            height: BAR.h,
            borderRadius: 18,
            border: `5px solid ${CN.yellow}`,
            boxSizing: "border-box",
            background: `repeating-linear-gradient(-45deg, ${CN.yellow} 0 14px, rgba(255,222,0,0.35) 14px 28px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: WALL.x,
            top: WALL.top,
            width: 18,
            height: WALL.h,
            borderRadius: 9,
            background: CN.white,
            boxShadow: "0 0 24px rgba(255,255,255,0.6)",
            opacity: Math.min(1, wall) * (1 - fall),
            transformOrigin: "50% 100%",
            transform: `translateY(${(1 - Math.min(1, wall)) * 40 + fall * 160}px) rotate(${fall * 70}deg)`,
          }}
        />
      </div>
      <Stamp p={stamp} color={CN.red} fill={CN.white} size={130} rotate={-8} style={{ left: 330, top: 990, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit), border: `12px solid ${CN.red}` }}>
        GONE
      </Stamp>
    </>
  );
};
