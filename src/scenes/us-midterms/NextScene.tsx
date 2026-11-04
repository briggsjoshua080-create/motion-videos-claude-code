import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { US, type SceneProps } from "./constants";
import { Accent, Car, Headline, Stamp } from "./ui";

/**
 * "(From January,) every law needs both parties. Hello, gridlock." The sincere beat (comedy formula,
 * rule 7) and its button: EVERY LAW NEEDS BOTH, a red car and a blue car (the two parties) that
 * drive in from both sides and stop nose to nose on "parties", and a GRIDLOCK stamp on "Hello".
 */
export const NextScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4), pop(frame, 7)];
  const drive = progress(frame, cue("next", "both") - 8, cue("next", "parties"), Easing.out(Easing.cubic));
  const meet = cue("next", "parties");
  const bump = frame >= meet && frame < meet + 8 ? Math.sin((frame - meet) * 2) * 10 * (1 - (frame - meet) / 8) : 0;
  const stamp = pop(frame, cue("next", "Hello") - 4);
  const carY = 820;

  return (
    <>
      <Headline size={128} style={{ top: 240, ...riseStyle(head[0], exit, 40) }}>
        EVERY LAW
      </Headline>
      <Headline size={128} style={{ top: 240 + 128 * 0.98, ...riseStyle(head[1], exit, 40) }}>
        NEEDS
      </Headline>
      <Headline
        size={175}
        style={{ top: 240 + 128 * 0.98 * 2 + 10, opacity: Math.min(1, Math.max(0, head[2]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[2]))}) translateY(${-exit * 40}px)`, transformOrigin: "0 50%" }}
      >
        <Accent>BOTH</Accent>
      </Headline>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Car width={400} color={US.red} style={{ position: "absolute", left: -420 + drive * 560 - bump, top: carY, filter: "drop-shadow(0 18px 20px rgba(0,8,30,0.45))" }} />
        <Car width={400} color="#3E7BD6" style={{ position: "absolute", left: 1100 - drive * 560 + bump, top: carY, transform: "scaleX(-1)", filter: "drop-shadow(0 18px 20px rgba(0,8,30,0.45))" }} />
        <Stamp p={stamp} size={118} color={US.white} fill={US.red} rotate={-7} style={{ left: 190, top: 1040 }}>
          GRIDLOCK
        </Stamp>
      </div>
    </>
  );
};
