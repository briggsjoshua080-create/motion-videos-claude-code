import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UK, type SceneProps } from "./constants";
import { Aside, Chair, Headline, SectionNumeral, Stamp } from "./ui";

/**
 * "He was Manchester's mayor, and his party blocked his first try." Section 02: MAYOR / of
 * Manchester.; a free chair (the February by-election seat) behind a red rope; on "blocked" a red
 * BLOCKED stamp slams across it.
 */
export const BlockedScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const line = rise(frame, 4);
  const chair = pop(frame, cue("blocked", "and") - 6);
  const slam = cue("blocked", "blocked") - 2;
  const stamp = progress(frame, slam - 6, slam, Easing.in(Easing.cubic));
  const shake = frame >= slam && frame < slam + 6 ? Math.sin((frame - slam) * 2.6) * 7 * (1 - (frame - slam) / 6) : 0;

  return (
    <>
      <SectionNumeral n="02" p={numeral * (1 - exit)} />
      <Headline size={175} style={{ top: 280, ...riseStyle(head, exit, 50) }}>
        MAYOR
      </Headline>
      <Aside size={120} style={{ top: 470, ...riseStyle(line, exit, 30) }}>
        of Manchester.
      </Aside>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, chair) * 1.6) * (1 - exit), transform: `translate(${shake}px, ${(1 - Math.min(1, Math.max(0, chair))) * 60}px)` }}>
        <Chair width={300} style={{ position: "absolute", left: 390, top: 700 }} />
        {/* a red rope on two brass posts in front of the chair */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[250, 830].map((x) => (
            <g key={x}>
              <rect x={x - 10} y={900} width={20} height={200} rx={8} fill={UK.gold} />
              <circle cx={x} cy={896} r={18} fill={UK.gold} stroke={UK.goldDeep} strokeWidth={3} />
              <rect x={x - 40} y={1096} width={80} height={16} rx={6} fill={UK.goldDeep} />
            </g>
          ))}
          <path d="M250 910 Q540 1010 830 910" fill="none" stroke={UK.red} strokeWidth={16} strokeLinecap="round" />
        </svg>
      </div>
      <Stamp p={stamp} fade={1 - exit} color={UK.red} fill="rgba(255,255,255,0.94)" size={140} rotate={-10} style={{ left: 175, top: 820 }}>
        BLOCKED
      </Stamp>
    </>
  );
};
