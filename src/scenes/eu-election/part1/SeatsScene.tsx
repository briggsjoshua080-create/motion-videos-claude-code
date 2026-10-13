import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "../constants";
import { Card, CardTitle, MiniFlag } from "../ui";

/** Example country with 10 seats: vote shares and the seats they give. */
const SHARES = [
  { name: "Party A", pct: 40, seats: 4, color: EU.blueMid },
  { name: "Party B", pct: 30, seats: 3, color: EU.yellow },
  { name: "Party C", pct: 20, seats: 2, color: EU.blueSoft },
  { name: "Party D", pct: 10, seats: 1, color: EU.slate },
] as const;

const DOT = 18;
const GAP = 22;

/** A grid of seat dots that fill in order as `p` goes 0 -> 1. */
const SeatGrid: React.FC<{ seats: number; cols: number; p: number; color: string }> = ({ seats, cols, p, color }) => {
  const rows = Math.ceil(seats / cols);
  return (
    <svg width={cols * GAP} height={rows * GAP} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: seats }, (_, i) => {
        const v = Math.min(1, Math.max(0, p * (seats + 4) - i));
        const x = (i % cols) * GAP + GAP / 2;
        const y = Math.floor(i / cols) * GAP + GAP / 2;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={DOT / 2} fill={C.paperDeep} />
            <circle cx={x} cy={y} r={(DOT / 2) * v} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * "Each party then wins seats in line with its votes. Big countries have more seats: Germany 96,
 * Malta just 6." Votes -> seats in an example country, then the seats of Germany and Malta.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card1 = rise(frame, 0);
  const bars = progress(frame, cue("seats", "party") - 4, cue("seats", "wins") + 6);
  const seats = progress(frame, cue("seats", "seats") - 2, cue("seats", "votes") + 8);

  const card2 = rise(frame, cue("big", "Big") - 8);
  const de = progress(frame, cue("big", "Germany") - 4, cue("big", "96") + 10);
  const deNum = pop(frame, cue("big", "96") - 3);
  const mt = progress(frame, cue("big", "Malta") - 2, cue("big", "6") + 2);
  const mtNum = pop(frame, cue("big", "6") - 3);
  const note = rise(frame, cue("big", "6") + 6);

  return (
    <>
      <Card top={352} height={450} style={{ padding: "30px 36px", ...riseStyle(card1, exit) }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <CardTitle>VOTES → SEATS</CardTitle>
          <CardTitle color={C.inkSoft} style={{ letterSpacing: 2 }}>
            example: 10 seats
          </CardTitle>
        </div>
        {SHARES.map((s, i) => (
          <div key={s.name} style={{ position: "absolute", left: 36, right: 36, top: 100 + i * 82, height: 60, display: "flex", alignItems: "center" }}>
            <div style={{ width: 160, fontSize: 34, fontWeight: 800, color: C.ink }}>{s.name}</div>
            <div style={{ width: (240 * s.pct * bars) / 40, height: 40, borderRadius: 10, background: s.color }} />
            <div style={{ marginLeft: 12, fontSize: 32, fontWeight: 800, color: C.ink, opacity: bars }}>{s.pct}%</div>
            <svg width={50} height={30} viewBox="0 0 54 30" style={{ position: "absolute", left: 520, opacity: seats }}>
              <path d="M4 15 H44 M32 4 L46 15 L32 26" fill="none" stroke={C.inkSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: "absolute", left: 590, display: "flex", gap: 8 }}>
              {Array.from({ length: s.seats }, (_, k) => {
                const v = Math.min(1, Math.max(0, seats * (s.seats + 1) - k));
                return (
                  <div
                    key={k}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      background: s.color,
                      border: `3px solid ${C.ink}`,
                      boxSizing: "border-box",
                      opacity: v,
                      transform: `scale(${0.4 + 0.6 * v})`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </Card>

      <Card top={836} height={452} style={{ padding: "30px 36px", ...riseStyle(card2, exit) }}>
        <CardTitle>SEATS PER COUNTRY</CardTitle>
        {[
          { country: "germany" as const, name: "Germany", seats: 96, cols: 16, p: de, num: deNum, top: 92 },
          { country: "malta" as const, name: "Malta", seats: 6, cols: 3, p: mt, num: mtNum, top: 268 },
        ].map((row) => (
          <div key={row.name} style={{ position: "absolute", left: 36, right: 36, top: row.top, display: "flex", alignItems: "center" }}>
            <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 10 }}>
              <MiniFlag country={row.country} width={78} />
              <div style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>{row.name}</div>
            </div>
            <div
              style={{
                width: 140,
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: -3,
                color: EU.blue,
                opacity: Math.min(1, row.num * 1.4),
                transform: `scale(${0.6 + 0.4 * row.num})`,
                transformOrigin: "0 50%",
              }}
            >
              {row.seats}
            </div>
            <SeatGrid seats={row.seats} cols={row.cols} p={row.p} color={EU.blue} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            bottom: 26,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 600,
            color: C.inkSoft,
            ...riseStyle(note, 0, 16),
          }}
        >
          Every country gets between 6 and 96 seats
        </div>
      </Card>
    </>
  );
};
