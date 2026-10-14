import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { EXAMPLE, LIST_B, LIST_B_SEATS, PALETTE as C, PL, THRESHOLD, TINT, VOTED_CANDIDATE, type SceneProps } from "./constants";
import { Card, CardTitle } from "./ui";

const CARD = { top: 362, height: 384 } as const;
/** Bar geometry inside the card: px per percent, first bar row and row height. */
const BAR = { left: 106, perCent: 11, top: 92, row: 50, height: 30 } as const;
const thresholdX = BAR.left + BAR.perCent * THRESHOLD;
/** Candidate rows of party B's list (second half of the scene). */
const LIST = { top: 92, row: 50 } as const;
const SORTED = [...LIST_B].sort((a, b) => b.crosses - a.crosses);
const rankOf = (no: number) => SORTED.findIndex((c) => c.no === no);

/**
 * "Parties above 5% share the seats by votes, and their most popular candidates get them."
 * Vote bars for made-up parties A–E with the 5% line (E gets no seats); the 460-seat half-circle
 * (SejmLayer) fills below in the same colours. Then party B's list in one district: the candidates
 * re-sort by their crosses, and the two with the most get party B's two seats there.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const bars = progress(frame, 2, cue("seats", "above") + 2);
  const line = progress(frame, cue("seats", "5%") - 6, cue("seats", "5%") + 6);
  const lineLabel = pop(frame, cue("seats", "5%") - 4);
  const out = progress(frame, cue("seats", "5%") + 2, cue("seats", "share"));
  const noSeats = pop(frame, cue("seats", "5%") + 6);
  const seatLabels = rise(frame, cue("seats", "votes") - 2);
  const note = rise(frame, cue("seats", "share") + 4);

  // Second half: party B's list in one district.
  const swap = progress(frame, cue("seats", "and") - 6, cue("seats", "their") + 2);
  const resort = progress(frame, cue("seats", "most") - 4, cue("seats", "popular", "end"), Easing.inOut(Easing.cubic));
  const seat = (k: number) => pop(frame, cue("seats", "candidates") - 2 + k * 5);
  const caption = rise(frame, cue("seats", "candidates") + 8);

  const rowsHeight = EXAMPLE.length * BAR.row;

  return (
    <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 40px", overflow: "hidden", ...riseStyle(card, exit) }}>
      {/* First half: votes -> seats */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${-swap * 30}px)` }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <CardTitle>VOTES</CardTitle>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>→ seats below</div>
        </div>
        {EXAMPLE.map((party, i) => {
          const isOut = party.seats === 0;
          const fade = isOut ? out : 0;
          const color = interpolateColors(fade, [0, 1], [party.color, PL.none]);
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
                <span style={{ fontSize: 28, fontWeight: 800, color: interpolateColors(fade, [0, 1], [C.ink, C.muted]) }}>{party.votes}%</span>
                {isOut ? (
                  <span style={{ fontSize: 26, fontWeight: 800, color: PL.red, opacity: Math.min(1, noSeats * 1.4), display: "inline-block", transform: `scale(${0.6 + 0.4 * noSeats})` }}>
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
        {/* The 5% line */}
        <svg width={840} height={CARD.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line
            x1={thresholdX}
            y1={BAR.top - 8}
            x2={thresholdX}
            y2={BAR.top - 8 + (rowsHeight + 12) * line}
            stroke={PL.red}
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
            color: PL.red,
            opacity: Math.min(1, lineLabel * 1.4),
            transform: `scale(${0.6 + 0.4 * lineLabel})`,
          }}
        >
          5%
        </div>
        <div style={{ position: "absolute", left: thresholdX + 46, right: 40, top: BAR.top + rowsHeight + 9, fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(note, 0, 10) }}>
          Under 5%: no seats (alliances need 8%)
        </div>
      </div>

      {/* Second half: inside party B, the candidates with the most crosses get its seats */}
      <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `translateY(${(1 - swap) * 30}px)` }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <CardTitle color={TINT.bDeep}>PARTY B · ONE DISTRICT</CardTitle>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.inkSoft, marginRight: 128 }}>crosses</div>
        </div>
        {LIST_B.map((cand, i) => {
          const pos = i + (rankOf(cand.no) - i) * resort;
          const won = rankOf(cand.no) < LIST_B_SEATS;
          const p = won ? seat(rankOf(cand.no)) : 0;
          const isVoted = cand.no === VOTED_CANDIDATE;
          return (
            <div
              key={cand.no}
              style={{
                position: "absolute",
                left: 32,
                right: 32,
                top: LIST.top + pos * LIST.row,
                height: LIST.row - 6,
                borderRadius: 12,
                background: interpolateColors(Math.min(1, p), [0, 1], [isVoted ? "#FFF6E3" : C.paperDeep, TINT.bSoft]),
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 16px",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: C.muted, width: 30 }}>{cand.no}.</span>
              <span style={{ fontSize: 28, fontWeight: isVoted ? 800 : 700, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{cand.name}</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.inkSoft }}>{cand.crosses.toLocaleString("en-GB")}</span>
              <span
                style={{
                  width: 110,
                  textAlign: "center",
                  padding: "4px 0",
                  borderRadius: 999,
                  background: TINT.b,
                  color: C.white,
                  fontSize: 21,
                  fontWeight: 800,
                  letterSpacing: 1,
                  opacity: Math.min(1, p * 1.4),
                  transform: `scale(${0.6 + 0.4 * p})`,
                }}
              >
                SEAT ✓
              </span>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 40, right: 40, top: LIST.top + LIST_B.length * LIST.row + 8, fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(caption, 0, 10) }}>
          Party B won <span style={{ color: C.ink, fontWeight: 800 }}>2 seats</span> here: its <span style={{ color: C.ink, fontWeight: 800 }}>2 most-crossed</span> candidates get them
        </div>
      </div>
    </Card>
  );
};
