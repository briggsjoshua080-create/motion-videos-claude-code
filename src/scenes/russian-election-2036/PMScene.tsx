import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { RU, type SceneProps } from "./constants";
import { Accent, Headline, PersonIcon, SectionNumeral, Stamp, StarBadge } from "./ui";

/**
 * "The president picks the PM; the Duma says yes." Section 04, the government, closing loop 2 (who
 * else has power: all of it runs through the president): THE PM, the president's star sends an arrow
 * to a person card on "picks", and the Duma's YES stamp lands with "picks" (up 2 s). Generic outline, no likeness.
 */
export const PMScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const star = pop(frame, 4);
  const arrow = progress(frame, cue("pm", "picks") - 4, cue("pm", "picks") + 8);
  const person = pop(frame, cue("pm", "picks") + 2);
  // Lands just after "picks", so it stays up over 2 s (rule 6).
  const stamp = pop(frame, cue("pm", "picks") + 2);

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Headline size={185} style={{ top: 270, ...riseStyle(head, exit, 50) }}>
        THE <Accent>PM</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <StarBadge size={250} p={star} style={{ position: "absolute", left: 120, top: 560 }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={400} y1={685} x2={400 + 200 * arrow} y2={685} stroke={RU.white} strokeWidth={12} strokeLinecap="round" />
          {arrow > 0.85 && <path d="M590 655 L630 685 L590 715" fill="none" stroke={RU.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 660,
            top: 545,
            width: 280,
            height: 280,
            borderRadius: 140,
            background: RU.red,
            border: `6px solid ${RU.white}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, Math.max(0, person) * 1.5),
            transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, person))})`,
            boxShadow: "0 0 50px rgba(213,43,30,0.5)",
          }}
        >
          <PersonIcon size={190} color={RU.white} />
        </div>
      </div>
      <Stamp p={stamp} color={RU.white} fill={RU.red} size={150} rotate={-7} style={{ left: 330, top: 900, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        YES
      </Stamp>
    </>
  );
};
