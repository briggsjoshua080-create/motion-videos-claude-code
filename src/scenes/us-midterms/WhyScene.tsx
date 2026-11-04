import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Couch, Face, Headline, SectionNumeral, Snore } from "./ui";

/**
 * "(Why?) Angry voters show up. Happy ones stay on the couch." Section 05 closes loop 3 (why almost
 * every president fails) with a two-step contrast (comedy formula): ANGRY / SHOW UP with an angry
 * face that pops on "Angry", HAPPY / STAY HOME with a sleeper on a couch that slides in on "Happy".
 * Both captions are up from the start, so each stays 3 s (rule 6).
 */
export const WhyScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 3), rise(frame, 6), rise(frame, 8)];
  const angry = pop(frame, cue("why", "Angry") - 5);
  const couch = pop(frame, cue("why", "Happy") - 6);
  const shake = angry > 0.9 ? Math.sin(frame * 1.9) * 3 : 0;
  const breath = (Math.sin(frame / 9) + 1) / 2;

  return (
    <>
      <SectionNumeral n="05" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        ANGRY
      </Headline>
      <Headline size={118} style={{ top: 250 + 130 * 0.98 + 6, ...riseStyle(head[1], exit, 40) }}>
        <Accent>SHOW UP</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 730, top: 230, width: 230, height: 230, opacity: Math.min(1, Math.max(0, angry) * 1.5) * (1 - exit), transform: `translate(${shake}px, 0) scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, angry))})` }}>
        <Face size={230} mood="angry" fill="#FFD6D9" />
      </div>

      <Headline size={130} style={{ top: 640, ...riseStyle(head[2], exit, 40) }}>
        HAPPY
      </Headline>
      <Headline size={118} style={{ top: 640 + 130 * 0.98 + 6, ...riseStyle(head[3], exit, 40) }}>
        STAY HOME
      </Headline>
      <div style={{ position: "absolute", left: 300, top: 880, width: 500, height: 300, opacity: Math.min(1, Math.max(0, couch) * 1.5) * (1 - exit), transform: `translateX(${(1 - Math.min(1, Math.max(0, couch))) * 300}px)` }}>
        <Couch width={500} breath={breath} />
        <Snore size={170} p={(frame / 40) % 1} style={{ position: "absolute", left: 380, top: -10 }} />
      </div>
    </>
  );
};
