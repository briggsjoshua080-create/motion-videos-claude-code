import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import { FR, Pill, SAFE, SceneFrame, pop, type SceneProps } from "./ui";

/** Question words, each revealed when the voice says it. */
const WORDS: [text: string, spoken: string][] = [
  ["SO,", "So"],
  ["SHOULD", "should"],
  ["YOUR", "your"],
  ["COUNTRY", "country"],
  ["VOTE", "vote"],
  ["TWICE?", "twice"],
];
const DOT_COLORS = [FR.blue, FR.mist, FR.red];

export const QuestionScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const bubble = pop(frame, 0);
  const cta = pop(frame, cue("question", "twice", "end") + 4);

  return (
    <SceneFrame duration={duration}>
      <div
        style={{
          position: "absolute",
          left: SAFE.center - 170,
          top: 300 + float(frame, 10, 90),
          opacity: bubble,
          transform: `scale(${bubble})`,
        }}
      >
        <svg width={340} height={260} viewBox="0 0 340 260">
          <path
            d="M40 20h260a30 30 0 0 1 30 30v120a30 30 0 0 1-30 30H140l-70 50 10-50H40a30 30 0 0 1-30-30V50a30 30 0 0 1 30-30z"
            fill={FR.white}
          />
          {DOT_COLORS.map((color, i) => (
            <circle
              key={color}
              cx={110 + i * 60}
              cy={110 - 16 * Math.max(0, Math.sin((frame - i * 6) / 5))}
              r={18}
              fill={color}
            />
          ))}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: 660,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 24,
          fontFamily: theme.font,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}
      >
        {WORDS.map(([text, spoken]) => {
          const p = enter(frame, cue("question", spoken) - 3, { damping: 14, stiffness: 180 });
          const twice = spoken === "twice";
          return (
            <span
              key={text}
              style={{
                display: "inline-block",
                fontSize: twice ? 124 : undefined,
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

      <div
        style={{
          position: "absolute",
          top: 1230,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          opacity: cta,
          transform: `scale(${cta})`,
        }}
      >
        <Pill size={40}>COMMENT BELOW</Pill>
      </div>
    </SceneFrame>
  );
};
