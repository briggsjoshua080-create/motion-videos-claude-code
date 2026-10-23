import React from "react";
import { FONT, STATES, type StateTile } from "./constants";

/**
 * The 50 states and DC as square tiles on an 11 × 8 grid, each with its code and electoral votes.
 * Every tile's look comes from `style(state, index)`, so scenes can pop tiles in, light one up or
 * colour them by result frame by frame.
 */
export const TileMap: React.FC<{
  left: number;
  top: number;
  tile: number;
  gap: number;
  style: (s: StateTile, i: number) => { fill: string; text: string; opacity: number; scale?: number; split?: { fill: string; share: number }; ring?: string };
  labelSize?: number;
}> = ({ left, top, tile, gap, style, labelSize = tile * 0.27 }) => (
  <>
    {STATES.map((s, i) => {
      const t = style(s, i);
      if (t.opacity <= 0) return null;
      return (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: left + s.col * (tile + gap),
            top: top + s.row * (tile + gap),
            width: tile,
            height: tile,
            borderRadius: tile * 0.14,
            background: t.fill,
            overflow: "hidden",
            opacity: Math.min(1, t.opacity),
            transform: `scale(${t.scale ?? 1})`,
            boxShadow: t.ring ? `0 0 0 3px ${t.ring}` : "none",
            zIndex: (t.scale ?? 1) > 1.05 ? 2 : 1,
            fontFamily: FONT.mono,
            color: t.text,
          }}
        >
          {t.split && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${t.split.share * 100}%`, background: t.split.fill }} />}
          <div style={{ position: "absolute", left: 0, right: 0, top: tile * 0.14, textAlign: "center", fontWeight: 700, fontSize: labelSize, letterSpacing: 1 }}>{s.id}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: tile * 0.5, textAlign: "center", fontFamily: FONT.display, fontSize: labelSize * 1.15 }}>{s.ev}</div>
        </div>
      );
    })}
  </>
);
