import React from "react";
import { FRANCE_PATH, FRANCE_SIZE } from "./franceOutline";

/**
 * Outline of mainland France that draws itself (`draw` 0 -> 1) and then fills
 * with the flag's three bands from left to right (`fill` 0 -> 1).
 */
export const FranceMap: React.FC<{
  width: number;
  draw: number;
  fill: number;
  stroke?: string;
  colors?: [string, string, string];
  /** Unique per map on screen (used for the SVG clip path). */
  id?: string;
}> = ({ width, draw, fill, stroke = "#ffffff", colors = ["#0055a4", "#ffffff", "#ef4135"], id = "france" }) => {
  const { width: w, height: h } = FRANCE_SIZE;
  const band = w / 3;
  return (
    <svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={FRANCE_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {colors.map((color, i) => (
          <rect
            key={color}
            x={band * i}
            y={0}
            width={Math.min(band + 1, Math.max(0, fill * w - band * i))}
            height={h}
            fill={color}
          />
        ))}
      </g>
      <path
        d={FRANCE_PATH}
        fill="none"
        stroke={stroke}
        strokeWidth={7}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};
