import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { RU, type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";
import { Slip } from "./RehookScene";

const SLIP = { top: 640, w: 400, h: 500 } as const;

/**
 * "Two ballots: one for a party, one for a local candidate." Loop 4 closed on light paper: TWO
 * BALLOTS stays up the whole beat (rule 6); two generic slips (made up: small print as grey bars),
 * the party list on the left gets a tick on "party", the district ballot (people) on the right on
 * "candidate".
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 4), rise(frame, 8)];
  const slips = [rise(frame, 2), rise(frame, 7)];
  const ticks = [
    progress(frame, cue("ballot", "party") - 2, cue("ballot", "party") + 8),
    progress(frame, cue("ballot", "candidate") - 2, cue("ballot", "candidate") + 8),
  ];
  const focus = progress(frame, cue("ballot", "one#2") - 4, cue("ballot", "one#2") + 4);

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <Headline tone="paper" size={150} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        TWO
      </Headline>
      <Headline tone="paper" size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent tone="paper">BALLOTS</Accent>
      </Headline>
      {[0, 1].map((i) => {
        const lit = i === 0 ? 1 - 0.25 * focus : 0.75 + 0.25 * focus;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i === 0 ? 120 : 560,
              top: SLIP.top + i * 16,
              ...riseStyle(slips[i], exit, 80),
              transform: `${riseStyle(slips[i], exit, 80).transform} rotate(${i === 0 ? -2 : 2}deg) scale(${0.96 + 0.04 * lit})`,
              opacity: Math.min(1, slips[i]) * (1 - exit) * (0.55 + 0.45 * lit),
            }}
          >
            <Slip w={SLIP.w} h={SLIP.h} strip={i === 0 ? RU.red : RU.blue} rows={4} pick={i === 0 ? 2 : 1} tick={ticks[i]} icon={i === 0 ? "party" : "person"} />
          </div>
        );
      })}
    </>
  );
};
