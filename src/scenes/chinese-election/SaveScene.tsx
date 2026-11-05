import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Bookmark, Headline } from "./ui";

/** "Save this for 2027." Rule 9's save reason (the party congress that picks its leader is due in 2027): SAVE THIS, a bookmark that drops in, and "for 2027.". */
export const SaveScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const mark = pop(frame, cue("save", "Save") - 2);
  const aside = rise(frame, 5);

  return (
    <>
      <Headline size={230} style={{ top: 420, ...riseStyle(head[0], exit, 50) }}>
        SAVE
      </Headline>
      <Headline size={230} style={{ top: 420 + 225, ...riseStyle(head[1], exit, 50) }}>
        <Accent>THIS</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 770, top: 640, opacity: 1 - exit }}>
        <Bookmark size={250} p={mark} />
      </div>
      <Aside size={124} style={{ top: 930, ...riseStyle(aside, exit, 30) }}>
        for 2027.
      </Aside>
    </>
  );
};
