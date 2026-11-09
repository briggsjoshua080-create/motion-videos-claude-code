import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { APPROVAL, FONT, US, type SceneProps } from "./constants";
import { Headline, Stamp, roll } from "./ui";

/**
 * "Approval: 14%. Ouch." The first payoff (rule 3), as a deadpan number: APPROVAL, then a counter
 * that rolls DOWN from 100% to 14% (Gallup, Oct 2026), and a red OUCH. stamp that slams in on the
 * (slower, flatter) "Ouch."
 */
export const ApprovalScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 1);
  const num = rise(frame, 3);
  const fall = progress(frame, cue("approval", "Approval") + 4, cue("approval", "14%", "end"), Easing.out(Easing.cubic));
  const stampAt = cue("approval", "Ouch") - 3;
  const stamp = pop(frame, stampAt);
  const hit = frame >= stampAt + 4 && frame < stampAt + 11 ? Math.sin((frame - stampAt - 4) * 2.6) * 8 * (1 - (frame - stampAt - 4) / 7) : 0;

  return (
    <>
      <Headline size={150} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        APPROVAL
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120 + hit,
          top: 450,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: US.white,
          textShadow: "0 0 60px rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
          ...riseStyle(num, exit, 60),
        }}
      >
        {roll(100, APPROVAL, fall)}%
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Stamp p={stamp} size={175} color={US.white} fill={US.red} rotate={-9} style={{ left: 240, top: 860 }}>
          OUCH.
        </Stamp>
      </div>
    </>
  );
};
