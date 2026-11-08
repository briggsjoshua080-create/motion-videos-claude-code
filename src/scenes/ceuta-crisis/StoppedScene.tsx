import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, type SceneProps } from "./constants";
import { Headline, SectionNumeral, Stamp } from "./ui";

/** A police shield (generic badge shape, no insignia). */
const Shield: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -50 L40 -36 L40 2 C40 28 22 44 0 54 C-22 44 -40 28 -40 2 L-40 -36 Z" fill={CE.white} stroke={CE.navy} strokeWidth={5} />
    <path d="M0 -30 L22 -22 L22 2 C22 16 12 26 0 32 C-12 26 -22 16 -22 2 L-22 -22 Z" fill={CE.bgLight} />
  </g>
);

/**
 * "Morocco sent thousands of police, and stopped it." Section 04 (could it happen again?): a line of
 * shields closes along a stretch of beach in front of the waves, then STOPPED slams in on "stopped".
 */
export const StoppedScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 2);
  const stamp = pop(frame, cue("stopped", "stopped") - 4);
  const cols = 7;

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 300, ...riseStyle(head, exit, 50) }}>
        MOROCCO
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {/* Sea and beach. */}
        <path d={`M0 1010 C180 ${990 + 8 * Math.sin(frame / 8)} 360 1030 540 1010 C720 ${990 - 8 * Math.sin(frame / 8)} 900 1030 1080 1010 L1080 1200 L0 1200 Z`} fill="rgba(255,255,255,0.12)" />
        <rect x={0} y={1120} width={1080} height={80} fill="rgba(230,216,184,0.25)" />
        {Array.from({ length: 2 }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const p = pop(frame, 4 + (r * cols + c) * 1.6);
            const x = 150 + c * 130 + (r ? 65 : 0);
            const y = 760 + r * 110;
            return (
              <g key={`${r}-${c}`} opacity={Math.min(1, Math.max(0, p) * 1.6)} transform={`translate(0 ${(1 - Math.min(1, Math.max(0, p))) * 40})`}>
                <Shield x={x} y={y} s={1.05} />
              </g>
            );
          }),
        )}
      </svg>
      <Stamp p={stamp} color={CE.orange} fill="rgba(10,32,54,0.55)" size={120} rotate={-7} style={{ left: 200, top: 560, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        STOPPED
      </Stamp>
    </>
  );
};
