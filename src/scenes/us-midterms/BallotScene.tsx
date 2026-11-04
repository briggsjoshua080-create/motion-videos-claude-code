import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MIN_TEXT, US, type SceneProps } from "./constants";
import { Headline, Pen, WipeLayer } from "./ui";

/** The ballot card and its three races (made-up layout: race names big, candidates as ovals only). */
const CARD = { left: 120, top: 560, width: 840, height: 590 } as const;
const RACES = ["HOUSE", "SENATE", "SHERIFF"] as const;
const ROW = { top: 112, height: 156, oval: { w: 96, h: 60 }, ovalX: [600, 720] } as const;
/** Which candidate's oval gets filled in each race. */
const PICK = [0, 1, 0] as const;

/**
 * "It's all one ballot: one oval per race." The heart of the vote (standing brief): a paper wipe, ONE
 * OVAL PER RACE., and one ballot with three races (the House, the Senate and, yes, the sheriff); a pen
 * fills in one oval per race, on "ballot", "oval" and "race". No joke here (comedy formula: keep the
 * explanation clean). The fine print is grey bars (rule 6).
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 4), rise(frame, 7)];
  const card = rise(frame, 6);
  const fills = [cue("ballot", "ballot"), cue("ballot", "oval"), cue("ballot", "race")].map((t) => t - 4);
  const fillP = fills.map((t) => progress(frame, t, t + 7, Easing.out(Easing.quad)));
  // The pen hops from oval to oval, arriving just as each one is filled.
  const ovalCentre = (i: number) => ({
    x: CARD.left + ROW.ovalX[PICK[i]] + ROW.oval.w / 2,
    y: CARD.top + ROW.top + i * ROW.height + ROW.height / 2,
  });
  const pts = [0, 1, 2].map(ovalCentre);
  const penX = interpolate(frame, [fills[0] - 8, fills[0], fills[1] - 2, fills[1] + 2, fills[2] - 2, fills[2] + 8], [pts[0].x + 80, pts[0].x, pts[0].x, pts[1].x, pts[2].x, pts[2].x + 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const penY = interpolate(frame, [fills[0] - 8, fills[0], fills[1] - 2, fills[1] + 2, fills[2] - 2, fills[2] + 8], [pts[0].y - 120, pts[0].y, pts[0].y, pts[1].y, pts[2].y, pts[2].y - 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scribble = Math.sin(frame * 2.4) * 6 * Math.max(...fillP.map((p) => (p > 0 && p < 1 ? 1 : 0)));

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <Headline size={140} tone="paper" style={{ top: 240, ...riseStyle(head[0], exit, 40) }}>
        ONE OVAL
      </Headline>
      <Headline size={134} tone="paper" style={{ top: 240 + 140 * 0.98 + 8, ...riseStyle(head[1], exit, 40), color: US.red }}>
        PER RACE.
      </Headline>

      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: CARD.height,
          borderRadius: 18,
          background: US.card,
          boxShadow: "0 24px 50px rgba(30,24,10,0.22), inset 0 0 0 2px rgba(14,26,43,0.1)",
          ...riseStyle(card, exit, 60),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 86, borderRadius: "18px 18px 0 0", background: US.blue }} />
        <div style={{ position: "absolute", left: 40, top: 30, width: 300, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.8)" }} />
        <div style={{ position: "absolute", left: 0, top: 86, right: 0, height: 8, background: US.red }} />
        {RACES.map((race, i) => (
          <div key={race} style={{ position: "absolute", left: 0, top: ROW.top + i * ROW.height, width: CARD.width, height: ROW.height, borderTop: i > 0 ? `3px solid ${US.inkFaint}` : "none" }}>
            <div style={{ position: "absolute", left: 40, top: ROW.height / 2 - MIN_TEXT * 0.5, fontFamily: FONT.display, fontSize: MIN_TEXT, lineHeight: 1, color: US.ink, letterSpacing: -1 }}>{race}</div>
            {ROW.ovalX.map((x, j) => (
              <div key={x} style={{ position: "absolute", left: x, top: ROW.height / 2 - ROW.oval.h / 2, width: ROW.oval.w, height: ROW.oval.h }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `5px solid ${US.ink}`, boxSizing: "border-box" }} />
                {PICK[i] === j && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 7,
                      borderRadius: "50%",
                      background: US.pen,
                      transformOrigin: "20% 50%",
                      transform: `scaleX(${fillP[i]})`,
                      opacity: fillP[i] > 0 ? 1 : 0,
                    }}
                  />
                )}
                <div style={{ position: "absolute", left: 18, top: ROW.oval.h + 10, width: ROW.oval.w - 36, height: 10, borderRadius: 5, background: US.inkFaint }} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {frame >= fills[0] - 8 && (
        // The pen's tip sits at (20.3%, 79.7%) of its box (see Pen), so the box is offset to put the tip on the oval.
        <Pen size={210} style={{ position: "absolute", left: penX - 43 + scribble, top: penY - 167, opacity: 1 - exit, filter: "drop-shadow(0 16px 18px rgba(30,24,10,0.3))" }} />
      )}
    </>
  );
};
