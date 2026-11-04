import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MIDTERMS, MIN_TEXT, PASSED, US, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

const COLS = 7;
const CARD = { w: 112, h: 140, gapX: 9, gapY: 14, top: 650 } as const;

/**
 * "Since World War Two, only two presidents passed." The first surprising payoff (rule 3) as a
 * deadpan number: ONLY 2 PASSED. over a wall of 21 small report cards, one per midterm since 1946,
 * that get their red F in one fast wave; on the second "two" the cards for 1998 and 2002 flip to A.
 * The grades are letters at 110 px, so nothing is smaller than rule 6 allows; no years on screen.
 */
export const PassedScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const wave = cue("passed", "World") - 4;
  const flip = cue("passed", "two#2") - 3;
  const two = pop(frame, flip);

  return (
    <>
      <Headline size={175} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        ONLY{" "}
        <span style={{ display: "inline-block", transform: `scale(${1 + 0.18 * Math.max(0, Math.sin(Math.min(1, Math.max(0, two)) * Math.PI))})`, transformOrigin: "50% 60%" }}>
          <Accent>2</Accent>
        </span>
      </Headline>
      <Headline size={150} style={{ top: 250 + 175 * 0.98 + 10, ...riseStyle(head[1], exit, 50) }}>
        PASSED.
      </Headline>

      {MIDTERMS.map((year, i) => {
        const passed = PASSED.includes(year);
        const card = pop(frame, 2 + i * 0.8);
        const stamp = pop(frame, wave + i * 1.6);
        const a = pop(frame, flip + PASSED.indexOf(year) * 3);
        const letter = passed ? a : stamp;
        const x = 120 + (i % COLS) * (CARD.w + CARD.gapX) + 1;
        const y = CARD.top + Math.floor(i / COLS) * (CARD.h + CARD.gapY);
        return (
          <div
            key={year}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 12,
              overflow: "hidden",
              background: US.card,
              boxShadow: passed && a > 0 ? `0 0 0 5px ${US.gold}, 0 0 40px rgba(242,182,50,0.6)` : "0 10px 22px rgba(0,8,30,0.4)",
              opacity: Math.min(1, Math.max(0, card) * 1.5) * (1 - exit),
              transform: `translateY(${(1 - Math.min(1, card)) * 30 - exit * 40}px) rotateY(${passed ? (1 - Math.min(1, Math.max(0, a))) * 180 : 0}deg)`,
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 20, background: US.blue }} />
            <div style={{ position: "absolute", left: 0, top: 20, right: 0, height: 5, background: US.red }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 25,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT.display,
                fontSize: MIN_TEXT,
                lineHeight: 1,
                color: passed ? US.blue : US.red,
                opacity: Math.min(1, Math.max(0, letter) * 2),
                transform: `scale(${1.6 - 0.6 * Math.min(1.1, Math.max(0, letter))}) rotate(${passed ? 0 : -8}deg)`,
              }}
            >
              {passed ? "A" : "F"}
            </div>
          </div>
        );
      })}
    </>
  );
};
