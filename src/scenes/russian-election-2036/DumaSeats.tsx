import React from "react";
import { hemicycleSeats } from "../../components/Hemicycle";
import { DUMA } from "./constants";

/** The 450-seat State Duma as a dot hemicycle (seats ordered left to right), shared by three scenes. */
export const DUMA_LAYOUT = { cx: 540, cy: 1000, rows: 10, rIn: 170, rOut: 395, dot: 7.3 } as const;
export const DUMA_SEATS = hemicycleSeats(DUMA, DUMA_LAYOUT.rows, DUMA_LAYOUT.rIn, DUMA_LAYOUT.rOut);

/**
 * Draws the hemicycle. `visible(i)` gives each seat's appearance (0 = hidden, 1 = in) and `fill(i)`
 * its colour; `hollow(i)` draws a seat as a ring. `cy` moves the base line.
 */
export const DumaSeats: React.FC<{ visible: (i: number) => number; fill: (i: number) => string; hollow?: (i: number) => boolean; cy?: number }> = ({
  visible,
  fill,
  hollow,
  cy = DUMA_LAYOUT.cy,
}) => {
  const { cx, dot } = DUMA_LAYOUT;
  const r = DUMA_LAYOUT.rOut + dot * 2;
  return (
    <svg width={r * 2} height={r + dot * 2} viewBox={`${-r} ${-r} ${r * 2} ${r + dot * 2}`} style={{ position: "absolute", left: cx - r, top: cy - r, overflow: "visible" }}>
      {DUMA_SEATS.map((s, i) => {
        const v = Math.min(1, Math.max(0, visible(i)));
        if (v <= 0) return null;
        const y = s.y + (1 - v) * 18;
        const size = dot * (0.4 + 0.6 * v);
        return hollow?.(i) ? (
          <circle key={i} cx={s.x} cy={y} r={size - 1.4} fill="none" stroke={fill(i)} strokeWidth={2.4} opacity={v} />
        ) : (
          <circle key={i} cx={s.x} cy={y} r={size} fill={fill(i)} opacity={v} />
        );
      })}
    </svg>
  );
};

/** Sweep seats in from left to right: seat i appears as `build` passes i / total. */
export const sweepIn = (build: number, i: number, from = 0, count = DUMA) => build * (count + 1) - (i - from);
