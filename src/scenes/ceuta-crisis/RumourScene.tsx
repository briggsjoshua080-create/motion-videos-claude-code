import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, FONT, type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";

/**
 * "Now it gets strange: on Facebook, that ruling became a rumour: the border is open." Re-hook 2 (rule 5,
 * about 33 s) on a full orange flash: THE / RUMOUR up from the start; a generic social post (no real logo)
 * pops up, BORDER OPEN!, and share arrows fly out of it. Closes re-hook 1 (why they thought it was open).
 */
export const RumourScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, 6)];
  const post = pop(frame, cue("rumour", "Facebook") - 4);
  const shares = progress(frame, cue("rumour", "border"), duration);
  const top = 760;

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={130} tone="flash" style={{ top: 280, ...riseStyle(head[0], exit, 40) }}>
        THE
      </Headline>
      <Headline
        size={170}
        tone="flash"
        style={{ top: 280 + 135, opacity: Math.min(1, Math.max(0, head[1]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.08, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}
      >
        <Accent tone="flash">RUMOUR</Accent>
      </Headline>
      {/* Share arrows flying up and out of the post. */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {Array.from({ length: 12 }, (_, i) => {
          const t = Math.min(1, Math.max(0, shares * 1.8 - (i % 6) * 0.1 - Math.floor(i / 6) * 0.35));
          if (t <= 0) return null;
          const side = i % 2 ? 1 : -1;
          const x = 540 + side * (380 + 60 * t + (i % 3) * 30);
          const y = top + 330 - 200 * t - (i % 4) * 26;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${side * 25}) scale(${0.9 + 0.5 * t})`} opacity={1 - t * 0.7}>
              <path d="M0 -26 L22 0 L8 0 L8 24 L-8 24 L-8 0 L-22 0 Z" fill={CE.white} stroke={CE.navy} strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 190,
          top,
          width: 700,
          height: 380,
          borderRadius: 34,
          background: CE.card,
          boxShadow: "0 30px 70px rgba(80,30,0,0.35)",
          opacity: Math.min(1, Math.max(0, post) * 1.5) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, Math.max(0, post))) * 120}px) scale(${0.7 + 0.3 * Math.min(1.06, Math.max(0, post))})`,
          transformOrigin: "350px 190px",
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 34, width: 70, height: 70, borderRadius: 35, background: CE.bgLight }} />
        <div style={{ position: "absolute", left: 130, top: 44, width: 260, height: 20, borderRadius: 10, background: "rgba(15,30,43,0.5)" }} />
        <div style={{ position: "absolute", left: 130, top: 78, width: 160, height: 14, borderRadius: 7, background: CE.inkFaint }} />
        <div style={{ position: "absolute", left: 40, top: 118, fontFamily: FONT.display, fontSize: 110, lineHeight: 1, color: CE.navy, whiteSpace: "nowrap" }}>
          BORDER
        </div>
        <div style={{ position: "absolute", left: 40, top: 228, fontFamily: FONT.display, fontSize: 110, lineHeight: 1, color: CE.orangeDeep, whiteSpace: "nowrap" }}>
          OPEN!
        </div>
      </div>
    </>
  );
};
