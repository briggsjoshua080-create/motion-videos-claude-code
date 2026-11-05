import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Aside, Headline, PersonIcon } from "./ui";

const CARD = 260;

/** A round person card (generic outline, no likeness). */
const Card: React.FC<{ left: number; top: number; p: number; fill: string; color: string }> = ({ left, top, p, fill, color }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: CARD,
      height: CARD,
      borderRadius: CARD / 2,
      background: fill,
      border: `6px solid ${CN.white}`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: Math.min(1, Math.max(0, p) * 1.5),
      transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, p))})`,
      boxShadow: "0 0 50px rgba(255,222,0,0.35)",
    }}
  >
    <PersonIcon size={170} color={color} />
  </div>
);

/**
 * "He names the premier, who runs the government." The government: THE PREMIER; the president's
 * card (yellow) sends an arrow to a second card on "names", and "runs the cabinet." from the start (up 2 s).
 */
export const PremierScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 3)];
  const president = pop(frame, 3);
  const arrow = progress(frame, cue("premier", "names") - 4, cue("premier", "names") + 8);
  const premier = pop(frame, cue("premier", "names") + 2);
  const aside = rise(frame, 8);

  return (
    <>
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        THE
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>PREMIER</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Card left={120} top={640} p={president} fill={CN.yellow} color={CN.red} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={410} y1={770} x2={410 + 220 * arrow} y2={770} stroke={CN.white} strokeWidth={12} strokeLinecap="round" />
          {arrow > 0.85 && <path d="M600 740 L640 770 L600 800" fill="none" stroke={CN.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <Card left={680} top={640} p={premier} fill={CN.red} color={CN.white} />
      </div>
      <Aside size={120} style={{ top: 960, ...riseStyle(aside, exit, 30) }}>
        runs the cabinet.
      </Aside>
    </>
  );
};
