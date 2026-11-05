import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UK, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

const CAL = { left: 330, top: 220, width: 420, height: 380 } as const;

/**
 * "Four days later, Starmer quit." A tear-off calendar page flips from 18 (the by-election, 18 June)
 * to 22 (Starmer's resignation, 22 June) on "later"; STARMER / QUIT. below. The next scene starts
 * on "need", so this stays up 2.5 s.
 */
export const QuitScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const cal = pop(frame, 1);
  const flip = progress(frame, 2, cue("quit", "later", "end") + 2);
  const head = [rise(frame, cue("quit", "Starmer") - 6), pop(frame, cue("quit", "quit") - 4)];
  const day = flip < 0.5 ? "18" : "22";
  const page = Math.abs(Math.cos(flip * Math.PI));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CAL.left,
          top: CAL.top,
          width: CAL.width,
          height: CAL.height,
          borderRadius: 24,
          background: UK.card,
          boxShadow: "0 30px 60px rgba(0,8,30,0.45)",
          overflow: "hidden",
          opacity: Math.min(1, Math.max(0, cal) * 1.6) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.06, Math.max(0, cal))}) translateY(${-exit * 40}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: CAL.width, height: 90, background: UK.red }} />
        {[110, 210, 310].map((x) => (
          <div key={x} style={{ position: "absolute", left: x - 10, top: 30, width: 20, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.85)" }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 100,
            width: CAL.width,
            height: CAL.height - 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.display,
            fontSize: 220,
            lineHeight: 1,
            color: UK.ink,
            transform: `scaleY(${page})`,
          }}
        >
          {day}
        </div>
      </div>
      <Headline size={150} style={{ top: 720, ...riseStyle(head[0], exit, 40) }}>
        STARMER
      </Headline>
      <Headline
        size={190}
        style={{ top: 720 + 160, opacity: Math.min(1, Math.max(0, head[1]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}
      >
        <Accent>QUIT.</Accent>
      </Headline>
    </>
  );
};
