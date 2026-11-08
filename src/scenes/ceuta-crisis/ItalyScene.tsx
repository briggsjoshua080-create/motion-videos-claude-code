import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

/**
 * "And Italy brought back border checks on travellers from Spain." Politics reaching the rest of Europe
 * (Italy reintroduced checks on air and sea arrivals from Spain for about a month): ITALY / CHECKS, and a
 * striped boom barrier lowers across a road on "checks", with a plane passing above.
 */
export const ItalyScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, cue("italy", "checks") - 8)];
  const scene = rise(frame, 3);
  const boom = progress(frame, cue("italy", "border") - 4, cue("italy", "checks") + 6, Easing.out(Easing.back(1.4)));
  const angle = -80 + 80 * boom;
  const plane = progress(frame, 0, duration, Easing.linear);
  const stripes = 7;

  return (
    <>
      <Headline size={130} style={{ top: 280, ...riseStyle(head[0], exit, 50) }}>
        ITALY
      </Headline>
      <Headline size={175} style={{ top: 280 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>CHECKS</Accent>
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, ...riseStyle(scene, exit, 60) }}>
        {/* A plane crossing from Spain's side. */}
        <g transform={`translate(${-120 + 1320 * plane} ${720 - 60 * plane}) rotate(-6)`} fill={CE.white} opacity={0.9}>
          <path d="M-60 0 L50 -8 C70 -8 80 0 70 6 L-60 10 Z" />
          <path d="M-10 0 L-40 -44 L-20 -44 L20 -2 Z" />
          <path d="M-10 6 L-40 50 L-20 50 L20 8 Z" />
          <path d="M-58 2 L-72 -24 L-62 -24 L-44 2 Z" />
        </g>
        {/* The road and the barrier. */}
        <path d="M120 1170 L960 1170 L780 900 L300 900 Z" fill="rgba(255,255,255,0.10)" />
        <line x1={540} x2={540} y1={920} y2={1160} stroke="rgba(255,255,255,0.35)" strokeWidth={8} strokeDasharray="30 26" />
        <rect x={180} y={880} width={60} height={210} rx={8} fill={CE.white} />
        <g transform={`rotate(${angle} 210 900)`}>
          {Array.from({ length: stripes }, (_, i) => (
            <rect key={i} x={210 + i * 100} y={884} width={100} height={34} fill={i % 2 ? CE.white : CE.orange} />
          ))}
          <rect x={210} y={884} width={stripes * 100} height={34} fill="none" stroke={CE.navy} strokeWidth={3} />
        </g>
        <circle cx={210} cy={900} r={22} fill={CE.navy} stroke={CE.white} strokeWidth={5} />
      </svg>
    </>
  );
};
