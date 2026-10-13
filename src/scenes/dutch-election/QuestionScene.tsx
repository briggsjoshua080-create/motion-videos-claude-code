import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import { Crown, NL, Pill, SAFE, SceneFrame, pop, type SceneProps } from "./ui";

/** Question words, each revealed when the voice says it ("of" appears once, so no "#2" needed). */
const WORDS: [text: string, spoken: string][] = [
  ["IS", "Is"],
  ["IT", "it"],
  ["REALLY", "really"],
  ["DEMOCRACY", "democracy"],
  ["IF", "if"],
  ["YOU", "you"],
  ["DON'T", "don't"],
  ["VOTE", "vote"],
  ["FOR", "for"],
  ["YOUR", "your"],
  ["HEAD", "head"],
  ["OF", "of"],
  ["STATE?", "state"],
];
const ACCENT = new Set(["democracy", "vote"]);

const BallotBox: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x={62} y={18} width={86} height={96} rx={8} fill={NL.paper} transform="rotate(8 105 66)" />
    <circle cx={96} cy={56} r={14} fill={NL.redBright} transform="rotate(8 105 66)" />
    <rect x={20} y={88} width={160} height={100} rx={18} fill={NL.blue} stroke={NL.white} strokeWidth={6} />
    <rect x={56} y={80} width={88} height={14} rx={7} fill={NL.deep} />
    <rect x={20} y={88} width={160} height={22} rx={10} fill={NL.white} opacity={0.2} />
  </svg>
);

/** "Is it really democracy if you don't vote for your head of state?" */
export const QuestionScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const icons = pop(frame, 0);
  const cta = pop(frame, cue("question", "state", "end") + 4);

  return (
    <SceneFrame duration={duration}>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          opacity: Math.min(1, icons * 1.4),
          transform: `scale(${0.7 + 0.3 * icons})`,
        }}
      >
        <div style={{ transform: `translateY(${float(frame, 8, 70)}px) rotate(-6deg)` }}>
          <Crown size={210} id="question-crown" />
        </div>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: NL.orange,
            color: NL.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.font,
            fontSize: 96,
            fontWeight: 900,
            boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
          }}
        >
          ?
        </div>
        <div style={{ transform: `translateY(${float(frame, 8, 70, 35)}px) rotate(6deg)` }}>
          <BallotBox size={210} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 24,
          fontFamily: theme.font,
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}
      >
        {WORDS.map(([text, spoken]) => {
          const p = enter(frame, cue("question", spoken) - 3, { damping: 14, stiffness: 180 });
          const accent = ACCENT.has(spoken);
          return (
            <span
              key={text}
              style={{
                display: "inline-block",
                fontSize: spoken === "democracy" ? 108 : undefined,
                color: accent ? NL.orangeLight : NL.white,
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
          top: 1190,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          opacity: cta,
          transform: `scale(${cta})`,
        }}
      >
        <Pill size={44} bg={NL.redBright}>
          COMMENT BELOW
        </Pill>
      </div>
    </SceneFrame>
  );
};
