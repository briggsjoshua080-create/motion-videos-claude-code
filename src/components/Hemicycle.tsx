import React from "react";

/** One seat of a parliament half-circle. x/y are relative to the centre of the base line. */
export type Seat = { x: number; y: number; theta: number; r: number };

/**
 * Classic parliament layout: `rows` arcs between radius `rIn` and `rOut`, seats per row
 * proportional to the row's length, ordered left to right (so the first N seats form a
 * wedge on the left, the last N a wedge on the right, and the middle seat is the majority line).
 */
export const hemicycleSeats = (total: number, rows: number, rIn: number, rOut: number): Seat[] => {
  const radii = Array.from({ length: rows }, (_, i) => rIn + (i * (rOut - rIn)) / Math.max(1, rows - 1));
  const sum = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.max(2, Math.round((total * r) / sum)));
  counts[rows - 1] += total - counts.reduce((a, b) => a + b, 0);
  const seats: Seat[] = [];
  radii.forEach((r, i) => {
    for (let j = 0; j < counts[i]; j++) {
      const theta = Math.PI * (1 - j / (counts[i] - 1));
      seats.push({ x: r * Math.cos(theta), y: -r * Math.sin(theta), theta, r });
    }
  });
  return seats.sort((a, b) => b.theta - a.theta || a.r - b.r);
};

/**
 * Draws seats from `hemicycleSeats()` as dots. `fill(i)` gives each seat's colour and
 * `visible(i)` its appearance progress (0 = hidden, 1 = fully in), so scenes can sweep seats in
 * or recolour party blocks frame by frame.
 */
export const Hemicycle: React.FC<{
  seats: Seat[];
  /** Centre of the base line, in px on the canvas. */
  cx: number;
  cy: number;
  dot: number;
  fill: (index: number) => string;
  visible?: (index: number) => number;
}> = ({ seats, cx, cy, dot, fill, visible = () => 1 }) => {
  const rOut = Math.max(...seats.map((s) => s.r)) + dot * 2;
  return (
    <svg
      width={rOut * 2}
      height={rOut + dot * 2}
      viewBox={`${-rOut} ${-rOut} ${rOut * 2} ${rOut + dot * 2}`}
      style={{ position: "absolute", left: cx - rOut, top: cy - rOut, overflow: "visible" }}
    >
      {seats.map((s, i) => {
        const v = Math.min(1, Math.max(0, visible(i)));
        if (v <= 0) return null;
        return <circle key={i} cx={s.x} cy={s.y + (1 - v) * 18} r={dot * (0.4 + 0.6 * v)} fill={fill(i)} opacity={v} />;
      })}
    </svg>
  );
};
