import React from "react";
import { random, useCurrentFrame } from "remotion";
import { rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";

const COLS = 14;
const ROWS = 9;
const GRID = { left: 130, top: 250, step: 60 } as const;

/**
 * "But here's the weird part: this year, a billion people vote." Re-hook 1 (rule 5) on a full yellow
 * flash: a crowd of dots floods the top of the screen from the centre outwards, and A BILLION
 * VOTERS is up from the first frames (so it stays 2 s).
 */
export const RehookScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 3)];

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {Array.from({ length: COLS * ROWS }, (_, k) => {
          const c = k % COLS;
          const r = Math.floor(k / COLS);
          const d = Math.hypot(c - (COLS - 1) / 2, (r - (ROWS - 1) / 2) * 1.3);
          const t = Math.min(1, Math.max(0, (frame - 4 - d * 2.2 - random(`cn-crowd-${k}`) * 6) / 6));
          if (t <= 0) return null;
          const x = GRID.left + c * GRID.step + (r % 2) * 20;
          const y = GRID.top + r * GRID.step;
          const s = 0.4 + 0.6 * t;
          return (
            <g key={k} opacity={t} transform={`translate(${x} ${y}) scale(${s})`}>
              <circle cx={0} cy={-10} r={9} fill={CN.red} />
              <path d="M-16 20 C-16 6 -8 2 0 2 C8 2 16 6 16 20 Z" fill={CN.red} />
            </g>
          );
        })}
      </svg>
      <Headline size={130} tone="flash" style={{ top: 860, ...riseStyle(head[0], exit, 40) }}>
        A BILLION
      </Headline>
      <Headline size={165} tone="flash" style={{ top: 860 + 140, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">VOTERS</Accent>
      </Headline>
    </>
  );
};
