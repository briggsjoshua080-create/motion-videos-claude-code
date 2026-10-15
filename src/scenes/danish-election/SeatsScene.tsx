import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, EXAMPLE, PALETTE as C, POSE, R_OUT, THRESHOLD, type SceneProps } from "./constants";
import { Card, CardTitle } from "./ui";

const CARD = { top: 330, height: 490 } as const;
/** Bar geometry inside the card: px per percent, first bar row and row height. */
const BAR = { left: 106, perCent: 12, top: 92, row: 50, height: 30 } as const;
const thresholdX = BAR.left + BAR.perCent * THRESHOLD;
const rowsHeight = EXAMPLE.length * BAR.row;

/**
 * "Parties above 2% share the seats by votes nationwide."
 * Vote bars for made-up parties A–E with the 2% line (E gets no seats); the 179-seat half-circle
 * (FolketingLayer) fills below in the same colours, its last 4 seats for Greenland and the Faroes.
 * The card notes how: 135 seats in 10 regions, then 40 top-up seats make the total fair nationwide.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const bars = progress(frame, 2, cue("seats", "above") + 2);
  const line = progress(frame, cue("seats", "2%") - 6, cue("seats", "2%") + 6);
  const lineLabel = pop(frame, cue("seats", "2%") - 4);
  const out = progress(frame, cue("seats", "2%") + 2, cue("seats", "share"));
  const noSeats = pop(frame, cue("seats", "2%") + 6);
  const seatLabels = rise(frame, cue("seats", "votes") - 2);
  const note = rise(frame, cue("seats", "share") + 2);
  const topUp = rise(frame, cue("seats", "nationwide") - 2);
  const northAtlantic = rise(frame, cue("seats", "nationwide") + 4);

  return (
    <>
      <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 40px", overflow: "hidden", ...riseStyle(card, exit) }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <CardTitle>VOTES IN ALL OF DENMARK</CardTitle>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>→ seats</div>
        </div>
        {EXAMPLE.map((party, i) => {
          const isOut = party.seats === 0;
          const fade = isOut ? out : 0;
          const color = interpolateColors(fade, [0, 1], [party.color, DK.none]);
          const width = BAR.perCent * party.votes * bars;
          const top = BAR.top + i * BAR.row;
          return (
            <div key={party.id} style={{ position: "absolute", left: 40, right: 40, top, height: BAR.row }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: (BAR.row - 42) / 2,
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  background: color,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {party.id}
              </div>
              <div style={{ position: "absolute", left: BAR.left - 40, top: (BAR.row - BAR.height) / 2, width, height: BAR.height, borderRadius: 8, background: color }} />
              <div
                style={{
                  position: "absolute",
                  left: BAR.left - 40 + Math.max(width, BAR.perCent * THRESHOLD + 6) + 14,
                  top: 0,
                  height: BAR.row,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, bars * 2),
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: interpolateColors(fade, [0, 1], [C.ink, C.muted]) }}>{party.votes}%</span>
                {isOut ? (
                  <span style={{ fontSize: 26, fontWeight: 800, color: DK.red, opacity: Math.min(1, noSeats * 1.4), display: "inline-block", transform: `scale(${0.6 + 0.4 * noSeats})` }}>
                    ✕ no seats
                  </span>
                ) : (
                  <span style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>
                    → <span style={{ color: party.color, fontWeight: 800 }}>{party.seats}</span> seats
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {/* The 2% line */}
        <svg width={840} height={CARD.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line
            x1={thresholdX}
            y1={BAR.top - 8}
            x2={thresholdX}
            y2={BAR.top - 8 + (rowsHeight + 12) * line}
            stroke={DK.red}
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
            top: BAR.top + rowsHeight + 6,
            width: 68,
            textAlign: "center",
            fontSize: 26,
            fontWeight: 900,
            color: DK.red,
            opacity: Math.min(1, lineLabel * 1.4),
            transform: `scale(${0.6 + 0.4 * lineLabel})`,
          }}
        >
          2%
        </div>
        <div style={{ position: "absolute", left: thresholdX + 46, right: 40, top: BAR.top + rowsHeight + 9, fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(note, 0, 10) }}>
          Under 2%: no seats
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: BAR.top + rowsHeight + 58,
            padding: "10px 16px",
            borderRadius: 14,
            background: C.paperDeep,
            fontSize: 23,
            fontWeight: 600,
            color: C.inkSoft,
            lineHeight: 1.3,
            ...riseStyle(topUp, 0, 10),
          }}
        >
          <span style={{ color: C.ink, fontWeight: 800 }}>135 seats</span> are won in 10 regions, then <span style={{ color: C.ink, fontWeight: 800 }}>40 top-up seats</span> make each
          party's total match its share of the national vote
        </div>
      </Card>

      {/* The 4 grey seats on the right of the half-circle */}
      <div
        style={{
          position: "absolute",
          left: POSE.seats.cx + R_OUT * POSE.seats.s - 250,
          width: 330,
          top: POSE.seats.cy + 24,
          textAlign: "right",
          fontFamily: theme.font,
          fontSize: 23,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(northAtlantic, exit, 10),
        }}
      >
        + 2 Greenland · 2 Faroe Islands
      </div>
    </>
  );
};
