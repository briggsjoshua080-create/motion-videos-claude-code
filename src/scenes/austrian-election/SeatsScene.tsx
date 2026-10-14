import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, EXAMPLE, PALETTE as C, THRESHOLD, type SceneProps } from "./constants";
import { Card, CardTitle } from "./ui";

const CARD = { top: 362, height: 476 } as const;
/** Bar geometry inside the card: px per percent, first bar row and row height. */
const BAR = { left: 106, perCent: 11, top: 96, row: 60, height: 34 } as const;
const thresholdX = BAR.left + BAR.perCent * THRESHOLD;

/**
 * "Seats are shared out by votes, but a party needs 4% to get in."
 * Vote bars for made-up parties A–E; the 183-seat half-circle (CouncilLayer) fills below in the same
 * colours; then the 4% line: party E (3%) gets no seats.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const bars = progress(frame, cue("seats", "Seats") - 4, cue("seats", "out", "end"));
  const seatLabels = rise(frame, cue("seats", "votes") + 2);
  const line = progress(frame, cue("seats", "4%") - 6, cue("seats", "4%") + 6);
  const lineLabel = pop(frame, cue("seats", "4%") - 4);
  const out = progress(frame, cue("seats", "4%") + 2, cue("seats", "to") + 2);
  const noSeats = pop(frame, cue("seats", "to"));
  const note = rise(frame, cue("seats", "in") - 2);

  const rowsHeight = EXAMPLE.length * BAR.row;

  return (
    <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 40px", ...riseStyle(card, exit) }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <CardTitle>VOTES</CardTitle>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>→ seats below</div>
      </div>

      {EXAMPLE.map((party, i) => {
        const isOut = party.seats === 0;
        const fade = isOut ? out : 0;
        const color = interpolateColors(fade, [0, 1], [party.color, AT.none]);
        const width = BAR.perCent * party.votes * bars;
        const top = BAR.top + i * BAR.row;
        return (
          <div key={party.id} style={{ position: "absolute", left: 40, right: 40, top, height: BAR.row }}>
            {/* Party chip */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: (BAR.row - 46) / 2,
                width: 46,
                height: 46,
                borderRadius: 23,
                background: color,
                color: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {party.id}
            </div>
            {/* The bar, its share of the votes and its seats */}
            <div style={{ position: "absolute", left: BAR.left - 40, top: (BAR.row - BAR.height) / 2, width, height: BAR.height, borderRadius: 8, background: color }} />
            <div
              style={{
                position: "absolute",
                left: BAR.left - 40 + width + 14,
                top: 0,
                height: BAR.row,
                display: "flex",
                alignItems: "center",
                gap: 16,
                whiteSpace: "nowrap",
                opacity: Math.min(1, bars * 2),
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 800, color: interpolateColors(fade, [0, 1], [C.ink, C.muted]) }}>{party.votes}%</span>
              {isOut ? (
                <span style={{ fontSize: 27, fontWeight: 800, color: AT.red, opacity: Math.min(1, noSeats * 1.4), display: "inline-block", transform: `scale(${0.6 + 0.4 * noSeats})` }}>
                  ✕ no seats
                </span>
              ) : (
                <span style={{ fontSize: 27, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>
                  → <span style={{ color: party.color, fontWeight: 800 }}>{party.seats}</span> seats
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* The 4% line */}
      <svg width={840} height={CARD.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line
          x1={thresholdX}
          y1={BAR.top - 8}
          x2={thresholdX}
          y2={BAR.top - 8 + (rowsHeight + 12) * line}
          stroke={AT.red}
          strokeWidth={4}
          strokeDasharray="10 8"
          strokeLinecap="round"
          opacity={line > 0.01 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: thresholdX - 34,
          top: BAR.top + rowsHeight + 8,
          width: 68,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 900,
          color: AT.red,
          opacity: Math.min(1, lineLabel * 1.4),
          transform: `scale(${0.6 + 0.4 * lineLabel})`,
        }}
      >
        4%
      </div>
      <div style={{ position: "absolute", left: thresholdX + 46, right: 40, top: BAR.top + rowsHeight + 11, fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(note, 0, 10) }}>
        Under 4%: no seats, unless it wins one in a region
      </div>
    </Card>
  );
};
