import React from "react";
import { hemicycleSeats } from "../../components/Hemicycle";
import { EMPTY_2019, RADA, SOP_2019, UA } from "./constants";

/** The 450-seat Rada of 2019 as a dot hemicycle, shared by the parliament scene and the rewatch payoff. */
export const RADA_LAYOUT = { cx: 540, cy: 850, rows: 10, rIn: 175, rOut: 400, dot: 7.4 } as const;
export const RADA_SEATS = hemicycleSeats(RADA, RADA_LAYOUT.rows, RADA_LAYOUT.rIn, RADA_LAYOUT.rOut);

/** Seats are ordered left to right: Servant of the People first, then everyone else, then the 26 empty seats at the far right. */
export const isEmptySeat = (i: number) => i >= RADA - EMPTY_2019;

/** Where the 26 empty seats sit on the canvas (their centre), for the zoom in the rewatch payoff. */
export const EMPTY_CENTRE = (() => {
  const empty = RADA_SEATS.filter((_, i) => isEmptySeat(i));
  const x = empty.reduce((s, p) => s + p.x, 0) / empty.length;
  const y = empty.reduce((s, p) => s + p.y, 0) / empty.length;
  return { x: RADA_LAYOUT.cx + x, y: RADA_LAYOUT.cy + y };
})();

/**
 * The hemicycle. Filled dots are MPs (yellow: Servant of the People; white: everyone else); the 26
 * seats nobody could vote for in 2019 are drawn as hollow grey rings, so they look empty but are
 * easy to miss (the rewatch detail). `build` sweeps the seats in from left to right; `dim` fades the
 * filled seats and `glow` lights up the rings (both only in the payoff).
 */
export const RadaSeats: React.FC<{ build: number; dim?: number; glow?: number }> = ({ build, dim = 0, glow = 0 }) => {
  const { cx, cy, dot } = RADA_LAYOUT;
  const r = RADA_LAYOUT.rOut + dot * 2;
  return (
    <svg width={r * 2} height={r + dot * 2} viewBox={`${-r} ${-r} ${r * 2} ${r + dot * 2}`} style={{ position: "absolute", left: cx - r, top: cy - r, overflow: "visible" }}>
      {RADA_SEATS.map((s, i) => {
        const v = Math.min(1, Math.max(0, build * (RADA + 1) - i));
        if (v <= 0) return null;
        const y = s.y + (1 - v) * 18;
        const size = dot * (0.4 + 0.6 * v);
        if (isEmptySeat(i)) {
          const stroke = glow > 0 ? `rgba(255,${Math.round(255 - 40 * glow)},${Math.round(255 - 255 * glow)},${0.45 + 0.55 * glow})` : UA.empty;
          return <circle key={i} cx={s.x} cy={y} r={size - 1.4} fill="none" stroke={stroke} strokeWidth={2.4 + 0.6 * glow} opacity={v} />;
        }
        const fill = i < SOP_2019 ? `rgba(255,215,0,${1 - 0.82 * dim})` : `rgba(255,255,255,${0.9 - 0.75 * dim})`;
        return <circle key={i} cx={s.x} cy={y} r={size} fill={fill} opacity={v} />;
      })}
    </svg>
  );
};
