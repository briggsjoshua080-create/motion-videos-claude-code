import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, PRES_2024, RU, type SceneProps } from "./constants";
import { Aside, Headline } from "./ui";

/**
 * "In 2024, he won 87%." The first half of loop 3's answer: "in 2024," and PUTIN from the start, and
 * a huge counter that runs up to 87% as the number is spoken (no likeness of him).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const aside = rise(frame, 0);
  const name = rise(frame, 3);
  const big = pop(frame, cue("result", "he") - 4);
  const count = progress(frame, cue("result", "he") - 2, cue("result", "87%") + 4, Easing.out(Easing.cubic));

  return (
    <>
      <Aside size={125} style={{ top: 260, ...riseStyle(aside, exit, 30) }}>
        in 2024,
      </Aside>
      <Headline size={130} style={{ top: 400, ...riseStyle(name, exit, 40) }}>
        PUTIN WON
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 580,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: RU.white,
          textShadow: "0 0 70px rgba(213,43,30,0.95), 0 0 4px rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))}) translateY(${-exit * 50}px)`,
          transformOrigin: "0 50%",
        }}
      >
        {roll87(count)}
        <span style={{ color: RU.red, textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>%</span>
      </div>
    </>
  );
};

const roll87 = (p: number) => Math.round(PRES_2024 * Math.min(1, Math.max(0, p)));
