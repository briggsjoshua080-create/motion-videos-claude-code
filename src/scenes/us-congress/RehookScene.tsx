import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Figure, Headline, StateTile, WipeLayer } from "./ui";

/**
 * "But here's the weird part: Wyoming gets as many senators as California!" Re-hook 1 (rule 5) on
 * a full red flash: WEIRD / PART., then a small WY tile and a huge CA tile drop in, each with two
 * senators under it, and a big = between them on "California" (loop 4, opened and answered at once).
 */
export const RehookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const drop = (at: number) => progress(frame, at, at + 8, Easing.in(Easing.quad));
  const wy = drop(cue("rehook", "Wyoming") - 8);
  const ca = drop(cue("rehook", "California") - 10);
  const eq = pop(frame, cue("rehook", "senators") - 2);
  const sen = [pop(frame, cue("rehook", "senators") - 6), pop(frame, cue("rehook", "senators") - 2)];
  const land = (p: number, at: number) => (p >= 1 && frame < at + 16 ? Math.sin((frame - at - 8) * 2.2) * 6 * Math.max(0, 1 - (frame - at - 8) / 8) : 0);
  const fig = (p: number): React.CSSProperties => ({ opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, p))})`, transformOrigin: "50% 100%" });

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={175} tone="flash" style={{ top: 220, ...riseStyle(head[0], exit, 40) }}>
        <Accent tone="flash">WEIRD</Accent>
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 220 + 175 * 0.98 + 14, ...riseStyle(head[1], exit, 40) }}>
        PART:
      </Headline>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {wy > 0 && <StateTile code="WY" size={240} fill={US.white} color={US.red} style={{ left: 130 + land(wy, cue("rehook", "Wyoming") - 8), top: 700 - (1 - wy) * 700, opacity: Math.min(1, wy * 3), transform: "rotate(-5deg)" }} />}
        {ca > 0 && <StateTile code="CA" size={330} fill={US.white} color={US.blue} style={{ left: 620, top: 640 - (1 - ca) * 800, opacity: Math.min(1, ca * 3), transform: `rotate(${4 + land(ca, cue("rehook", "California") - 10)}deg)` }} />}
        <div
          style={{
            position: "absolute",
            left: 418,
            top: 680,
            fontFamily: FONT.display,
            fontSize: 220,
            lineHeight: 1,
            color: US.white,
            opacity: Math.min(1, Math.max(0, eq) * 1.5),
            transform: `scale(${0.4 + 0.6 * Math.min(1.12, Math.max(0, eq))})`,
          }}
        >
          =
        </div>
        <div style={{ position: "absolute", left: 150, top: 960, display: "flex", gap: 14, ...fig(sen[0]) }}>
          <Figure size={150} />
          <Figure size={150} />
        </div>
        <div style={{ position: "absolute", left: 680, top: 990, display: "flex", gap: 14, ...fig(sen[1]) }}>
          <Figure size={150} />
          <Figure size={150} />
        </div>
      </div>
    </>
  );
};
