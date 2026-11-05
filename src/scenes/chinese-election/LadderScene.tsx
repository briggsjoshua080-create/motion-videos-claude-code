import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, PYRAMID_BIG, TIERS, type SceneProps } from "./constants";
import { Accent, Headline, SectionNumeral } from "./ui";
import { Pyramid, tierBox } from "./Pyramid";

const WORDS = ["county", "city", "province", "nation"] as const;

/**
 * "Each congress elects the one above: county, city, province, nation." Section 03 explains the
 * hook's pyramid and closes loop 5: LEVEL BY LEVEL; the pyramid comes back large (its two solid
 * bottom tiers are the congresses voters elect), and on each spoken level a yellow arrow jumps up
 * one tier and fills the hollow tier above. The floating star stays hidden here (it is the ending's reveal).
 */
export const LadderScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 4)];
  const hits = WORDS.map((w) => cue("ladder", w));
  const build = (i: number) => progress(frame, 2 + i * 3, 12 + i * 3);
  // Tier i (2..4) fills on the word that names it (city, province, nation).
  const lit = (i: number) => (i < 2 ? 0 : progress(frame, hits[i - 1] - 3, hits[i - 1] + 5));
  const active = hits.reduce((cur, h, k) => (frame >= h - 3 ? k + 1 : cur), 0);
  const arrow = active >= 1 ? pop(frame, hits[active - 1] - 3) : 0;

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        LEVEL BY
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>LEVEL</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Pyramid layout={PYRAMID_BIG} build={build} lit={lit} star={0} />
        {active >= 1 && active < TIERS && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {(() => {
              const box = tierBox(PYRAMID_BIG, active);
              const x = PYRAMID_BIG.cx + box.wBottom / 2 + 36;
              const y = (box.top + box.bottom) / 2 + PYRAMID_BIG.tierH * 0.6 * (1 - Math.min(1, arrow));
              return (
                <g opacity={Math.min(1, Math.max(0, arrow) * 1.5)} transform={`translate(${Math.min(x, 980)} ${y})`}>
                  <path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" fill="none" stroke={CN.yellow} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })()}
          </svg>
        )}
      </div>
    </>
  );
};
