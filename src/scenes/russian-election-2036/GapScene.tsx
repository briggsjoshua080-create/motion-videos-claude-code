import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BAR, TIMELINE, type SceneProps, yearX } from "./constants";
import { Accent, Aside, Headline, SectionNumeral } from "./ui";
import { Timeline } from "./Timeline";

const ZOOM = 5;
const TARGET = { x: 540, y: 770 } as const;
const GAP = { x: (yearX(TIMELINE.gapFrom) + yearX(TIMELINE.gapTo)) / 2, y: BAR.top + BAR.height / 2 } as const;

/**
 * "And the gap in the timeline? Two terms in a row was the limit, so in 2008 he became PM." The
 * rewatch payoff (rule 10) and the full answer to loop 1: the hook's timeline comes back, the camera
 * zooms into the hollow 2008–12 stretch that was there from frame 0, it lights up, THE GAP?, "two
 * terms in a row." and PM fills the gap on "so" (the old limit, and how he stayed in power).
 */
export const GapScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const show = progress(frame, 0, 10);
  const z = progress(frame, cue("gap", "gap") - 6, cue("gap", "timeline") + 6, Easing.inOut(Easing.cubic));
  const glow = z * (0.7 + 0.3 * Math.sin(frame / 3.2));
  const head = [rise(frame, cue("gap", "gap") - 8)];
  const aside = rise(frame, cue("gap", "Two") - 6);
  const pm = progress(frame, cue("gap", "so") - 6, cue("gap", "so") + 4);
  const s = 1 + (ZOOM - 1) * z;
  const dx = (TARGET.x - GAP.x) * z;
  const dy = (TARGET.y - GAP.y) * z;

  return (
    <>
      <SectionNumeral n="06" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        THE <Accent>GAP?</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: show * (1 - exit) }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${GAP.x}px ${GAP.y}px`, transform: `translate(${dx}px, ${dy}px) scale(${s})` }}>
          <Timeline glow={glow} pm={pm} label={1 - z} />
        </div>
      </div>
      <Aside size={118} style={{ top: 1030, ...riseStyle(aside, exit, 30) }}>
        two terms in a row.
      </Aside>
    </>
  );
};
