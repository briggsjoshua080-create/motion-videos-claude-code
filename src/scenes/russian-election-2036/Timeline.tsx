import React from "react";
import { BAR, FONT, RU, TIMELINE, yearX } from "./constants";

/**
 * The hook's timeline of Putin's years at the top, 2000 → 2036: red where he is (or can be)
 * president, striped from now to 2036, and a hollow, dashed stretch for 2008–12 that is never
 * mentioned until the end (the rewatch detail, rule 10: he was prime minister then). `pulse`
 * glows the 2036 end; `glow` lights up the gap and `pm` writes "PM" into it (rewatch payoff only).
 */
export const Timeline: React.FC<{ pulse?: number; glow?: number; pm?: number; label?: number }> = ({ pulse = 0, glow = 0, pm = 0, label = 1 }) => {
  const { top, height } = BAR;
  const seg = (from: number, to: number, style: React.CSSProperties, key: string) => (
    <div key={key} style={{ position: "absolute", left: yearX(from), top, width: yearX(to) - yearX(from), height, boxSizing: "border-box", ...style }} />
  );
  const gapW = yearX(TIMELINE.gapTo) - yearX(TIMELINE.gapFrom);
  return (
    <>
      {seg(TIMELINE.from, TIMELINE.gapFrom, { background: RU.red, borderRadius: "16px 0 0 16px", border: `4px solid ${RU.white}`, borderRight: "none" }, "a")}
      {seg(
        TIMELINE.gapFrom,
        TIMELINE.gapTo,
        {
          border: `4px dashed ${glow > 0 ? `rgba(255,255,255,${0.5 + 0.5 * glow})` : RU.gap}`,
          background: `rgba(255,255,255,${0.22 * glow})`,
          boxShadow: glow > 0 ? `0 0 ${40 * glow}px rgba(255,255,255,${0.6 * glow})` : "none",
        },
        "gap",
      )}
      {seg(TIMELINE.gapTo, TIMELINE.now, { background: RU.red, border: `4px solid ${RU.white}`, borderLeft: "none", borderRight: "none" }, "b")}
      {seg(
        TIMELINE.now,
        TIMELINE.to,
        {
          background: `repeating-linear-gradient(-45deg, ${RU.red} 0 14px, rgba(213,43,30,0.45) 14px 28px)`,
          borderRadius: "0 16px 16px 0",
          border: `4px solid ${RU.white}`,
          borderLeft: "none",
          boxShadow: pulse > 0 ? `0 0 ${50 * pulse}px rgba(255,255,255,${0.8 * pulse})` : "none",
        },
        "c",
      )}
      {/* The PM years, written into the gap in the payoff (tiny on the full bar, large once zoomed in). */}
      <div
        style={{
          position: "absolute",
          left: yearX(TIMELINE.gapFrom),
          top,
          width: gapW,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT.display,
          fontSize: 34,
          color: RU.white,
          opacity: pm,
          transform: `scale(${0.6 + 0.4 * pm})`,
        }}
      >
        PM
      </div>
      <div style={{ position: "absolute", left: BAR.left, top: top + height + 20, fontFamily: FONT.display, fontSize: 110, lineHeight: 1, color: RU.textSoft, opacity: label }}>
        {TIMELINE.from}
      </div>
    </>
  );
};
