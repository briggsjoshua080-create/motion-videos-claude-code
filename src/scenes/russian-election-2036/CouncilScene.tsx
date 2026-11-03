import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COUNCIL_PRESIDENT, FONT, RU, type SceneProps } from "./constants";
import { Accent, Aside, Headline, StarBadge, roll } from "./ui";

const CHAMBER = { left: 120, top: 600, w: 840, h: 250 } as const;
const TILES = 5;
const TILE = { top: 900, w: 100, h: 84, step: 130 } as const;
const STAR = { left: 790, top: 880, size: 140 } as const;

/**
 * "Regions send two each, the president adds 30, and it approves every law." The upper house (the
 * Federation Council) and what it does: UPPER HOUSE, a row of region tiles that each send two dots up
 * into the chamber on "two", a star (the president) that pops on "president" with +30 counting up on
 * "30", and "approves every law." from "president" on (so it stays up 2 s).
 */
export const CouncilScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 4)];
  const chamber = rise(frame, 3);
  const tiles = rise(frame, cue("council", "Regions") - 6);
  const send = cue("council", "two") - 4;
  const star = pop(frame, cue("council", "president") - 4);
  const plus = pop(frame, cue("council", "adds") - 2);
  const count = progress(frame, cue("council", "adds"), cue("council", "30", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, cue("council", "president") - 2);

  return (
    <>
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        UPPER
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>HOUSE</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: CHAMBER.left,
          top: CHAMBER.top,
          width: CHAMBER.w,
          height: CHAMBER.h,
          borderRadius: 28,
          background: RU.glass,
          border: `2px solid ${RU.glassEdge}`,
          ...riseStyle(chamber, exit, 50),
        }}
      >
        <div style={{ position: "absolute", right: 40, top: 40, fontFamily: FONT.display, fontSize: 150, lineHeight: 1, color: RU.white, textShadow: "0 0 40px rgba(213,43,30,0.9)", opacity: Math.min(1, Math.max(0, plus) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, plus))})`, transformOrigin: "100% 50%" }}>
          +{roll(0, COUNCIL_PRESIDENT, count)}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {Array.from({ length: TILES }, (_, i) => {
          const x = 120 + i * TILE.step;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x, top: TILE.top + (1 - tiles) * 40, width: TILE.w, height: TILE.h, borderRadius: 14, background: "rgba(255,255,255,0.16)", border: `3px solid ${RU.white}`, boxSizing: "border-box", opacity: Math.min(1, tiles) }} />
              {[0, 1].map((k) => {
                const t = progress(frame, send + i * 2 + k, send + i * 2 + k + 12, Easing.inOut(Easing.cubic));
                const x0 = x + 30 + k * 40;
                const y0 = TILE.top + 42;
                const x1 = CHAMBER.left + 60 + i * 56 + (k % 2) * 26;
                const y1 = CHAMBER.top + 110 + k * 46;
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: x0 + (x1 - x0) * t - 15,
                      top: y0 + (y1 - y0) * t - 15 - Math.sin(t * Math.PI) * 60,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      background: RU.white,
                      boxShadow: "0 0 16px rgba(255,255,255,0.6)",
                      opacity: t > 0 ? 1 : 0,
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
        <StarBadge size={STAR.size} p={star} style={{ position: "absolute", left: STAR.left, top: STAR.top }} />
      </div>
      <Aside size={118} style={{ top: 1050, ...riseStyle(aside, exit, 30) }}>
        approves every law.
      </Aside>
    </>
  );
};
