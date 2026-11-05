import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UK, type SceneProps } from "./constants";
import { Accent, CHAIR_TAG, Chair, Crown, Headline, SectionNumeral } from "./ui";

/** The chair as it stands in this scene, and the tag's centre on screen. */
const SEAT = { left: 300, top: 640, width: 400 } as const;
const K = SEAT.width / 200;
const TAG = { x: SEAT.left + CHAIR_TAG.x * K, y: SEAT.top + CHAIR_TAG.y * K, r: CHAIR_TAG.r * K } as const;
/** Where the magnifier ends up and how big; inside it the chair is magnified ZOOM times. */
const LENS = { x: 540, y: 860, r: 270 } as const;
const ZOOM = 4.5;

/**
 * "And the crown tag? MPs can't quit. So that MP took a do-nothing Crown job." Section 06, the
 * rewatch payoff (rule 10): the chair comes back and a magnifying glass zooms onto the small crown
 * tag (there since frame 0, never mentioned); MPs CAN'T / QUIT; on "So" the tag turns into a big gold
 * label, CHILTERN / HUNDREDS (the Crown office an MP takes to leave the Commons; Josh Simons took it
 * in May 2026 to free Makerfield for Burnham).
 */
export const CrownScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const chairIn = rise(frame, 0);
  const z = progress(frame, 2, cue("crown", "tag", "end") + 4, Easing.inOut(Easing.cubic));
  const swapAt = cue("crown", "So") - 6;
  const lensOut = progress(frame, swapAt, swapAt + 8);
  const label = pop(frame, swapAt + 2);
  const head = [rise(frame, cue("crown", "MPs") - 6), pop(frame, cue("crown", "quit") - 5)];
  const s = 1 + (ZOOM - 1) * z;
  const lens = {
    x: interpolate(z, [0, 1], [TAG.x, LENS.x]),
    y: interpolate(z, [0, 1], [TAG.y, LENS.y]),
    r: interpolate(z, [0, 1], [TAG.r * 1.4, LENS.r]),
  };
  const chair = <Chair width={SEAT.width} tag style={{ position: "absolute", left: SEAT.left, top: SEAT.top }} />;

  return (
    <>
      <SectionNumeral n="06" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 260, ...riseStyle(head[0], exit, 40) }}>
        MPs CAN&apos;T
      </Headline>
      <Headline
        size={175}
        style={{ top: 260 + 135, opacity: Math.min(1, Math.max(0, head[1]) * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}
      >
        <Accent>QUIT</Accent>
      </Headline>

      {lensOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, chairIn) * (1 - lensOut), transform: `scale(${1 - 0.25 * lensOut})`, transformOrigin: `${lens.x}px ${lens.y}px` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - z }}>{chair}</div>
          <div style={{ position: "absolute", inset: 0, clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)`, background: `radial-gradient(circle at ${lens.x}px ${lens.y}px, ${UK.bgLight} 0%, ${UK.bg} 100%)` }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${TAG.x}px ${TAG.y}px`, transform: `translate(${lens.x - TAG.x}px, ${lens.y - TAG.y}px) scale(${s})` }}>{chair}</div>
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={lens.x + lens.r * 0.72} y1={lens.y + lens.r * 0.72} x2={lens.x + lens.r * 1.08} y2={lens.y + lens.r * 1.08} stroke={UK.goldDeep} strokeWidth={Math.max(8, lens.r * 0.16)} strokeLinecap="round" />
            <circle cx={lens.x} cy={lens.y} r={lens.r} fill="none" stroke={UK.white} strokeWidth={Math.max(4, lens.r * 0.05)} />
          </svg>
        </div>
      )}

      {label > 0 && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 650,
            width: 840,
            height: 470,
            borderRadius: 34,
            background: `linear-gradient(180deg, #FFD266 0%, ${UK.gold} 60%, ${UK.goldDeep} 100%)`,
            boxShadow: "0 30px 60px rgba(0,8,30,0.45), inset 0 0 0 6px rgba(255,255,255,0.35)",
            opacity: Math.min(1, label * 1.6) * (1 - exit),
            transform: `scale(${0.5 + 0.5 * Math.min(1.06, label)}) rotate(${(1 - Math.min(1, label)) * 8}deg)`,
          }}
        >
          <Crown width={150} style={{ position: "absolute", left: 345, top: 30, filter: "brightness(0.85)" }} />
          <div style={{ position: "absolute", left: 0, top: 160, width: 840, textAlign: "center", fontFamily: FONT.display, fontSize: 120, lineHeight: 1.02, color: UK.navy, letterSpacing: -1 }}>
            CHILTERN
            <br />
            HUNDREDS
          </div>
        </div>
      )}
    </>
  );
};
