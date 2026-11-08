import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

const SIZE = 195;
const TOP = 360;
const QUESTIONS = ["HOW?", "WHY?", "AGAIN?"] as const;

/**
 * "How? Why that week? And could it happen again?" Rule 2's three open loops, as three huge words
 * that are all up within a quarter of a second (so each stays at least 2 s, rule 6); the orange
 * block jumps to the question being asked.
 */
export const LoopsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const starts = [cue("loops", "How"), cue("loops", "Why"), cue("loops", "And")];
  const active = starts.reduce((current, s, i) => (frame >= s - 2 ? i : current), 0);

  return (
    <>
      {QUESTIONS.map((q, i) => {
        const p = pop(frame, starts[0] - 6 + i * 4);
        return (
          <Headline
            key={q}
            size={SIZE}
            style={{
              top: TOP + i * SIZE * 1.02,
              opacity: Math.min(1, Math.max(0, p) * 1.6) * (1 - exit),
              transform: `translateX(${(1 - Math.min(1, p)) * -80}px) scale(${0.85 + 0.15 * Math.min(1.08, p)}) translateY(${-exit * 50}px)`,
              transformOrigin: "0 50%",
            }}
          >
            {i === active ? <Accent>{q}</Accent> : q}
          </Headline>
        );
      })}
    </>
  );
};
