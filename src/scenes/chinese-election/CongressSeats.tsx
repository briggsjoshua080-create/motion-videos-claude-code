import React from "react";
import { hemicycleSeats } from "../../components/Hemicycle";
import { NPC_SIZE } from "./constants";

/** The 2,977-seat National People's Congress as a dot hemicycle (seats ordered left to right). */
export const NPC_LAYOUT = { cx: 540, cy: 990, rows: 22, rIn: 130, rOut: 410, dot: 3.4 } as const;
export const NPC_SEATS = hemicycleSeats(NPC_SIZE, NPC_LAYOUT.rows, NPC_LAYOUT.rIn, NPC_LAYOUT.rOut);

/** Draws the hemicycle. `visible(i)` gives each seat's appearance (0 = hidden, 1 = in) and `fill(i)` its colour. */
export const CongressSeats: React.FC<{ visible: (i: number) => number; fill: (i: number) => string }> = ({ visible, fill }) => {
  const { cx, cy, dot } = NPC_LAYOUT;
  const r = NPC_LAYOUT.rOut + dot * 2;
  return (
    <svg width={r * 2} height={r + dot * 2} viewBox={`${-r} ${-r} ${r * 2} ${r + dot * 2}`} style={{ position: "absolute", left: cx - r, top: cy - r, overflow: "visible" }}>
      {NPC_SEATS.map((s, i) => {
        const v = Math.min(1, Math.max(0, visible(i)));
        if (v <= 0) return null;
        return <circle key={i} cx={s.x} cy={s.y + (1 - v) * 14} r={dot * (0.4 + 0.6 * v)} fill={fill(i)} opacity={v} />;
      })}
    </svg>
  );
};

/** Sweep seats in from left to right: seat i appears as `build` passes i / total. */
export const sweepIn = (build: number, i: number, count = NPC_SIZE) => (build * (count + 60) - i) / 60;
