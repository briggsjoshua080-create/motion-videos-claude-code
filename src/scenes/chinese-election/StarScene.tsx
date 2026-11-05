import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CENTRAL_COMMITTEE, CN, FONT, PYRAMID_HOOK, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral, roll } from "./ui";
import { Pyramid, starCentre } from "./Pyramid";

const ZOOM = 3.4;
const TARGET = { x: 790, y: 760 } as const;
const STAR = starCentre(PYRAMID_HOOK);

/**
 * "And the star above the pyramid? The Communist Party. Its top 205 members pick the real boss: Xi."
 * The rewatch payoff (rule 10) and the answer to loop 3: the hook's pyramid comes back, the camera
 * rises and zooms into the small star that floated above its tip from frame 0, and it lights up.
 * THE STAR? turns into THE PARTY on "Communist"; a counter runs to 205 from "Its" and "pick the
 * boss." comes in on "205" (both up over 2.5 s) (the Central Committee chose Xi as party leader).
 */
export const StarScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const show = progress(frame, 0, 10);
  const z = progress(frame, cue("star", "star") - 6, cue("star", "pyramid") + 4, Easing.inOut(Easing.cubic));
  const glow = z * (0.75 + 0.25 * Math.sin(frame / 3.2));
  const swapAt = cue("star", "Communist") - 6;
  const swap = progress(frame, swapAt - 4, swapAt + 2);
  const q = rise(frame, cue("star", "star") - 8);
  const party = [rise(frame, swapAt), rise(frame, swapAt + 3)];
  const big = pop(frame, cue("star", "Its") - 4);
  const count = progress(frame, cue("star", "Its") - 2, cue("star", "205", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, cue("star", "205") - 4);
  const s = 1 + (ZOOM - 1) * z;
  const dx = (TARGET.x - STAR.x) * z;
  const dy = (TARGET.y - STAR.y) * z;

  return (
    <>
      <SectionNumeral n="06" p={numeral * (1 - exit)} style={{ opacity: 0.4 * numeral * (1 - exit) * (1 - z * 0.6) }} />
      <div style={{ position: "absolute", inset: 0, opacity: show * (1 - exit) }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${STAR.x}px ${STAR.y}px`, transform: `translate(${dx}px, ${dy}px) scale(${s})` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - z }}>
            <Pyramid layout={PYRAMID_HOOK} star={0} />
          </div>
          <Pyramid layout={PYRAMID_HOOK} build={() => 0} glow={glow} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
        <Headline size={150} style={{ top: 250, ...riseStyle(q, 0, 40) }}>
          THE
        </Headline>
        <Headline size={175} style={{ top: 250 + 147, ...riseStyle(q, 0, 40) }}>
          <Accent>STAR?</Accent>
        </Headline>
      </div>
      <Headline size={150} style={{ top: 250, ...riseStyle(party[0], exit, 40) }}>
        THE
      </Headline>
      <Headline size={175} style={{ top: 250 + 147, ...riseStyle(party[1], exit, 40) }}>
        <Accent>PARTY</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 640,
          fontFamily: FONT.display,
          fontSize: 230,
          lineHeight: 0.92,
          letterSpacing: -4,
          color: CN.white,
          textShadow: "0 0 60px rgba(255,222,0,0.6), 0 0 4px rgba(255,255,255,0.6)",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))})`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(0, CENTRAL_COMMITTEE, count)}
      </div>
      <Aside size={120} style={{ top: 1020, ...riseStyle(aside, exit, 30) }}>
        pick the boss.
      </Aside>
    </>
  );
};
