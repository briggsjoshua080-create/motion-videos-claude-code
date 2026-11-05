import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral } from "./ui";
import { LocalBallot } from "./BallotScene";

/**
 * "It elects the president, with one name on the ballot." Section 04, the head of state, and the
 * answer to loop 2 (why nobody said no: there was only one candidate): "for president:", ONE NAME,
 * and a generic ballot with a single row that gets its tick on "one".
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const aside = rise(frame, 1);
  const head = [rise(frame, 3), rise(frame, 6)];
  const ballot = pop(frame, cue("president", "with") - 6);
  const tick = progress(frame, cue("president", "one") - 2, cue("president", "one") + 8);

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Aside size={125} style={{ top: 250, ...riseStyle(aside, exit, 30) }}>
        for president:
      </Aside>
      <Headline size={150} style={{ top: 385, ...riseStyle(head[0], exit, 50) }}>
        ONE
      </Headline>
      <Headline size={175} style={{ top: 385 + 150, ...riseStyle(head[1], exit, 50) }}>
        <Accent>NAME</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 820,
          opacity: Math.min(1, Math.max(0, ballot) * 1.5) * (1 - exit),
          transform: `rotate(-2deg) scale(${0.7 + 0.3 * Math.min(1.06, Math.max(0, ballot))}) translateY(${-exit * 40}px)`,
        }}
      >
        <LocalBallot w={760} rows={1} kinds={["yes"]} marks={[tick]} writeIn={false} />
      </div>
    </>
  );
};
