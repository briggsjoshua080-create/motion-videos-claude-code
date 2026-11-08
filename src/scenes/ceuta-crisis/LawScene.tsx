import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, type SceneProps } from "./constants";
import { Aside, Headline, Stamp, WipeLayer } from "./ui";

/**
 * "Politics: Spain's top court ruled swimmers can't be sent straight back." Paper wipe: a generic court
 * ruling (small print as grey bars, a seal) slides up and gets a NO RETURN stamp on "sent"; POLITICS,
 * "Spain's top court.". The real ruling: Supreme Court, 29 June 2026 (see script.md).
 */
export const LawScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 3);
  const aside = rise(frame, 8);
  const doc = rise(frame, 6);
  const stamp = pop(frame, cue("law", "sent") - 4);

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <Headline size={130} tone="paper" style={{ top: 260, ...riseStyle(head, exit, 50) }}>
        POLITICS
      </Headline>
      <Aside size={120} tone="paper" style={{ top: 400, ...riseStyle(aside, exit, 30) }}>
        Spain&apos;s top court.
      </Aside>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 600,
          width: 700,
          height: 560,
          borderRadius: 14,
          background: CE.card,
          boxShadow: "0 30px 60px rgba(10,32,54,0.25)",
          transform: `rotate(-2deg) translateY(${(1 - doc) * 120 - exit * 60}px)`,
          opacity: Math.min(1, doc * 1.4) * (1 - exit),
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 40, background: CE.navy }} />
        <div style={{ position: "absolute", left: 300, top: 70, width: 100, height: 100, borderRadius: 50, border: `6px solid ${CE.navy}`, boxSizing: "border-box" }} />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 60, top: 210 + i * 40, width: i % 3 === 2 ? 380 : 580, height: 16, borderRadius: 8, background: CE.inkFaint }} />
        ))}
        <div style={{ position: "absolute", left: 60, top: 220 + 8 * 40, width: 240, height: 20, borderRadius: 10, background: "rgba(15,30,43,0.5)" }} />
      </div>
      <Stamp p={stamp} color={CE.orangeDeep} size={110} rotate={-9} style={{ left: 200, top: 820, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        NO RETURN
      </Stamp>
    </>
  );
};
