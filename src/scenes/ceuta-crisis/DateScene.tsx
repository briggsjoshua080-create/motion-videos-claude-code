import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, FONT, type SceneProps } from "./constants";
import { Accent, Headline, SectionNumeral } from "./ui";

/**
 * "Then a new rumour named a date: 15 August." Section 04 (could it happen again?): A NEW / DATE up from
 * the start, then a calendar page drops in on "date": AUGUST / 15.
 */
export const DateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 2), pop(frame, 6)];
  const page = pop(frame, cue("date", "date") - 8);

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 280, ...riseStyle(head[0], exit, 40) }}>
        A NEW
      </Headline>
      <Headline
        size={200}
        style={{ top: 280 + 135, opacity: Math.min(1, Math.max(0, head[1]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.08, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}
      >
        <Accent>DATE</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 700,
          width: 600,
          height: 520,
          borderRadius: 30,
          background: CE.card,
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(2,12,24,0.45)",
          opacity: Math.min(1, Math.max(0, page) * 1.5) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, Math.max(0, page))) * -260}px) rotate(${3 * (1 - Math.min(1, Math.max(0, page)))}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 160, background: CE.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 110, color: CE.white }}>
          AUGUST
        </div>
        <div style={{ position: "absolute", left: 0, top: 160, width: 600, height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 300, color: CE.orangeDeep, lineHeight: 1 }}>
          15
        </div>
      </div>
    </>
  );
};
