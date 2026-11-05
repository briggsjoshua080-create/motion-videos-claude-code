import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Aside, Headline } from "./ui";
import { CongressSeats, sweepIn } from "./CongressSeats";

/**
 * "At the top, the National People's Congress passes the laws." The top of the pyramid and what it
 * does (standing brief): NATIONAL CONGRESS, a hemicycle of just under 3,000 dots that sweeps in
 * from left to right, and "passes the laws." from "National" on (up over 2 s). Loop 1 is now answered:
 * these are the 3,000 who voted.
 */
export const NpcScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 4)];
  const build = progress(frame, 3, cue("npc", "Congress", "end"), Easing.out(Easing.quad));
  const aside = rise(frame, cue("npc", "National") - 4);

  return (
    <>
      <Headline size={130} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        NATIONAL
      </Headline>
      <Headline size={130} style={{ top: 250 + 135, ...riseStyle(head[1], exit, 40) }}>
        <Accent>CONGRESS</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <CongressSeats visible={(i) => sweepIn(build, i)} fill={() => CN.yellow} />
      </div>
      <Aside size={120} style={{ top: 1030, ...riseStyle(aside, exit, 30) }}>
        passes the laws.
      </Aside>
    </>
  );
};
