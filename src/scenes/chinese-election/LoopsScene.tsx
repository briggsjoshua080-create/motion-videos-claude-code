import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

const SIZE = 215;
const TOP = 330;
const QUESTIONS = ["WHO?", "WHY?", "BOSS?"] as const;

/**
 * "Who voted? Why did nobody say no? And who really runs China?" Rule 2's three open loops, as three
 * huge words that are all up within a quarter of a second (so each stays at least 2 s, rule 6); the
 * yellow block jumps to the question being asked.
 */
export const LoopsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const starts = [cue("loops", "Who"), cue("loops", "Why"), cue("loops", "And")];
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
              top: TOP + i * SIZE * 0.98,
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
