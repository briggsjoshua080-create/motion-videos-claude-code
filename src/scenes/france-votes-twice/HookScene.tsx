import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter, float } from "../../lib/animation";
import { FranceMap } from "../../components/FranceMap";
import { FR, SAFE, SceneFrame, Tricolour, type SceneProps } from "./ui";

/** Title words, each revealed when the voice says it. */
const TITLE: [text: string, spoken: string][] = [
  ["WHY", "Why"],
  ["DOES", "does"],
  ["FRANCE", "France"],
  ["VOTE", "vote"],
  ["TWICE", "twice"],
  ["FOR", "for"],
  ["ITS", "its"],
  ["PRESIDENT?", "President"],
];

const MAP_WIDTH = 560;

export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame duration={duration} fadeIn={false}>
      <div
        style={{
          position: "absolute",
          top: 180,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          fontFamily: theme.font,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 5,
          color: FR.white,
          opacity: ease(frame, [0, 10]),
        }}
      >
        <Tricolour width={56} height={8} />
        FRENCH POLITICS
        <Tricolour width={56} height={8} />
      </div>

      <div style={{ position: "absolute", left: SAFE.center - MAP_WIDTH / 2, top: 260 + float(frame, 8, 120) }}>
        <FranceMap width={MAP_WIDTH} draw={ease(frame, [0, 28])} fill={ease(frame, [20, 46])} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 860,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 24,
          fontFamily: theme.font,
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}
      >
        {TITLE.map(([text, spoken]) => {
          const p = enter(frame, cue("hook", spoken) - 3, { damping: 14, stiffness: 180 });
          const twice = spoken === "twice";
          return (
            <span
              key={text}
              style={{
                display: "inline-block",
                fontSize: twice ? 128 : 88,
                color: twice ? FR.red : FR.white,
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`,
                textShadow: "0 6px 24px rgba(0,0,0,0.35)",
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </SceneFrame>
  );
};
