import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, FONT, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";
import { CENTRE, Problems } from "./Problems";

/**
 * "On Facebook, that ruling became a rumour: the border is open." All three circles are full; where
 * they overlap, a spark ignites on "rumour", and a generic social post (no real logo) pops out of the
 * centre: BORDER OPEN, with share arrows multiplying. This closes re-hook 1 and loop 2 (why that week).
 */
export const RumourScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 1);
  const spark = progress(frame, cue("rumour", "rumour") - 8, cue("rumour", "rumour") + 16);
  const post = pop(frame, cue("rumour", "border") - 10);
  const shares = progress(frame, cue("rumour", "border"), duration);

  return (
    <>
      <Headline size={150} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        <Accent>RUMOUR</Accent>
      </Headline>
      <Problems fill={[1, 1, 1]} show={[1, 1, 1]} spark={spark} opacity={(1 - exit) * (1 - 0.45 * Math.min(1, Math.max(0, post)))} />
      <div
        style={{
          position: "absolute",
          left: 190,
          top: CENTRE.y - 190,
          width: 700,
          height: 380,
          borderRadius: 34,
          background: CE.card,
          boxShadow: "0 30px 70px rgba(2,12,24,0.45)",
          opacity: Math.min(1, Math.max(0, post) * 1.5) * (1 - exit),
          transform: `scale(${0.3 + 0.7 * Math.min(1.06, Math.max(0, post))})`,
          transformOrigin: `350px 190px`,
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
      {/* Share arrows flying out of the post. */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {Array.from({ length: 10 }, (_, i) => {
          const t = Math.min(1, Math.max(0, shares * 1.6 - i * 0.08));
          if (t <= 0) return null;
          const a = -Math.PI / 2 + (i - 4.5) * 0.32;
          const d = 240 + 260 * t;
          const x = 540 + Math.cos(a) * d * 1.1;
          const y = CENTRE.y + 40 + Math.sin(a) * d * 0.6 + 260;
          return (
            <g key={i} transform={`translate(${x} ${y - 300}) rotate(${(a * 180) / Math.PI + 90}) scale(${0.8 + 0.4 * t})`} opacity={1 - t * 0.6}>
              <path d="M0 -26 L22 0 L8 0 L8 24 L-8 24 L-8 0 L-22 0 Z" fill={CE.orange} stroke={CE.white} strokeWidth={3} />
            </g>
          );
        })}
      </svg>
    </>
  );
};
