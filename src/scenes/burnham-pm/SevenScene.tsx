import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PMS_IN_TEN_YEARS, UK, type SceneProps } from "./constants";
import { Accent, Aside, Chair, Door, Headline } from "./ui";

/**
 * "Swap the leader, swap the PM. Seven in ten years." Still section 01: SWAP in a red block; two
 * chairs (red and green) trade places in a hop, like musical chairs; then, on "Seven", seven black
 * doors pop up in a row, one per prime minister since 2016, with 7 PMs / in ten years. (the first
 * surprising payoff, rule 3).
 */
export const SevenScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 1);
  const swap = progress(frame, cue("seven", "Swap") - 2, cue("seven", "swap#2") + 4, Easing.inOut(Easing.cubic));
  /** The doors and 7 PMs come in on "PM", so they stay up over 2 s (the next scene starts on "weird"). */
  const sevenAt = cue("seven", "PM") - 2;
  const chairsOut = progress(frame, sevenAt - 8, sevenAt);
  const count = rise(frame, sevenAt - 4);
  const line = rise(frame, cue("seven", "Seven") - 2);
  const hop = Math.sin(swap * Math.PI) * 120;

  return (
    <>
      <Headline size={200} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        <Accent>SWAP</Accent>
      </Headline>

      {chairsOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: (1 - chairsOut) * (1 - exit) * Math.min(1, head) }}>
          <Chair width={280} color={UK.red} style={{ position: "absolute", left: interpolate(swap, [0, 1], [130, 670]), top: 620 - hop }} />
          <Chair width={280} style={{ position: "absolute", left: interpolate(swap, [0, 1], [670, 130]), top: 620 + hop * 0.3 }} />
        </div>
      )}

      {Array.from({ length: PMS_IN_TEN_YEARS }, (_, i) => {
        const p = pop(frame, sevenAt - 6 + i * 2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: Math.min(1, Math.max(0, p) * 1.6) * (1 - exit),
              transform: `translateY(${(1 - Math.min(1, Math.max(0, p))) * 50}px)`,
            }}
          >
            <Door width={100} style={{ left: 130 + i * 118, top: 580 }} />
          </div>
        );
      })}
      <Headline size={200} style={{ top: 800, ...riseStyle(count, exit, 40) }}>
        7 PMs
      </Headline>
      <Aside size={120} style={{ top: 1010, ...riseStyle(line, exit, 30) }}>
        in ten years.
      </Aside>
    </>
  );
};
