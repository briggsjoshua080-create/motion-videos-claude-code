import React from "react";
import { theme } from "../../theme";
import { GOVERNMENTS, IT, PALETTE as C } from "./constants";

const COLS = 17;
const TILE = 24;
const GAP = 8;
export const TILES_WIDTH = COLS * TILE + (COLS - 1) * GAP;
export const TILES_HEIGHT = Math.ceil(GOVERNMENTS / COLS) * (TILE + GAP) - GAP;

/**
 * Italy's 68 governments since 1946 as small tiles in order, the last one (today's) in green.
 * `shown` is how many tiles are in (fractional = the next one is popping in).
 */
export const GovernmentTiles: React.FC<{ shown: number; today?: number }> = ({ shown, today = 0 }) => (
  <div style={{ position: "relative", width: TILES_WIDTH, height: TILES_HEIGHT }}>
    {Array.from({ length: GOVERNMENTS }, (_, i) => {
      const v = Math.min(1, Math.max(0, shown - i));
      const last = i === GOVERNMENTS - 1;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i % COLS) * (TILE + GAP),
            top: Math.floor(i / COLS) * (TILE + GAP),
            width: TILE,
            height: TILE,
            borderRadius: 7,
            background: last && today > 0 ? IT.green : C.ink,
            opacity: v * (last ? 1 : 0.82 - 0.4 * today),
            transform: `scale(${0.4 + 0.6 * v + (last ? 0.25 * today : 0)})`,
            boxShadow: last && today > 0 ? `0 0 0 ${4 * today}px ${IT.greenSoft}` : undefined,
          }}
        />
      );
    })}
  </div>
);

/** The big counter next to the tiles. */
export const GovernmentCount: React.FC<{ value: number; label?: string }> = ({ value, label = "governments" }) => (
  <div style={{ fontFamily: theme.font, color: C.ink }}>
    <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95 }}>{value}</div>
    <div style={{ fontSize: 32, fontWeight: 800, color: C.inkSoft, marginTop: 4 }}>{label}</div>
  </div>
);
