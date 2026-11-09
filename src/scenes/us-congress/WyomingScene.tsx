import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, POP_RATIO, US, type SceneProps } from "./constants";
import { Aside, StateTile } from "./ui";

/**
 * "With 68 times fewer people." The re-hook's answer as a deadpan number: 68× slams in, "fewer
 * people.", then one dot for Wyoming against a block of 68 dots for California (each dot = the
 * same number of people).
 */
export const WyomingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const num = pop(frame, cue("wyoming", "68") - 4);
  const aside = rise(frame, cue("wyoming", "fewer") - 6);
  const tiles = rise(frame, 2);
  const dotsAt = cue("wyoming", "times") - 4;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 220,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: US.white,
          textShadow: "0 0 60px rgba(255,255,255,0.35)",
          opacity: Math.min(1, Math.max(0, num) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, num))})`,
          transformOrigin: "0 50%",
        }}
      >
        {POP_RATIO}×
      </div>
      <Aside size={120} style={{ top: 550, ...riseStyle(aside, exit, 30) }}>
        fewer people.
      </Aside>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(tiles, exit, 50) }}>
        <StateTile code="WY" size={240} fill={US.white} color={US.red} style={{ left: 120, top: 720 }} />
        <div style={{ position: "absolute", left: 222, top: 1000, width: 36, height: 36, borderRadius: "50%", background: US.white, boxShadow: "0 0 16px rgba(255,255,255,0.6)" }} />
        <StateTile code="CA" size={240} fill={US.white} color={US.blue} style={{ left: 620, top: 680 }} />
        {Array.from({ length: POP_RATIO }, (_, i) => {
          const v = Math.min(1, Math.max(0, (frame - dotsAt) * 2.4 - i) / 3);
          if (v <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 470 + (i % 12) * 40,
                top: 940 + Math.floor(i / 12) * 40,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: US.white,
                opacity: v,
                transform: `scale(${0.4 + 0.6 * v})`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};
