import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { SPAIN as MAP_DATA } from "../../components/spain";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ES, EXAMPLE, EXAMPLE_SEATS, PALETTE as C, THRESHOLD, type SceneProps } from "./constants";
import { Card, CardTitle } from "./ui";

const MAP_H = 300;
const MAP_W = (MAP_H * MAP_DATA.width) / MAP_DATA.height;
const MAP = { left: 540 - MAP_W / 2 - 40, top: 330 } as const;
const k = MAP_H / MAP_DATA.height;
/** Seats per province in 2023 (Madrid and Barcelona the most, Soria among the fewest). */
const CITIES = [
  { key: "madrid", label: "Madrid", seats: 37, at: MAP_DATA.madrid, dx: -70, dy: 18 },
  { key: "barcelona", label: "Barcelona", seats: 32, at: MAP_DATA.barcelona, dx: -120, dy: -52 },
  { key: "soria", label: "Soria", seats: 2, at: MAP_DATA.soria, dx: -150, dy: -20 },
] as const;

const CARD = { top: 710, height: 420 } as const;
const BAR = { left: 106, perCent: 13, top: 92, row: 52, height: 30 } as const;
const thresholdX = BAR.left + BAR.perCent * THRESHOLD;
const rowsHeight = EXAMPLE.length * BAR.row;

/**
 * "Each province shares its seats among parties above 3%."
 * Spain's provinces are the districts (52 with Ceuta and Melilla), big ones elect many MPs, small
 * ones few. Below, one made-up province with 6 seats: parties under 3% get nothing, and with so few
 * seats even 9% (party D) wins none.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const districts = pop(frame, cue("seats", "province") - 4);
  const card = rise(frame, 2);
  const bars = progress(frame, 4, cue("seats", "shares") + 4);
  const line = progress(frame, cue("seats", "3%") - 6, cue("seats", "3%") + 6);
  const lineLabel = pop(frame, cue("seats", "3%") - 4);
  const out = progress(frame, cue("seats", "3%") + 2, cue("seats", "3%") + 12);
  const seatLabels = rise(frame, cue("seats", "among") - 2);

  return (
    <>
      {/* Spain, with seats per province */}
      <div style={{ position: "absolute", left: MAP.left, top: MAP.top, ...riseStyle(mapIn, exit, 30) }}>
        <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_DATA.width} ${MAP_DATA.height}`} style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 14px 20px rgba(20,32,43,0.12))" }}>
          <path d={MAP_DATA.d} fill={ES.yellowSoft} stroke={C.ink} strokeWidth={5 / k} strokeLinejoin="round" />
        </svg>
        {CITIES.map((c, i) => {
          const p = pop(frame, cue("seats", "province") + i * 4);
          const x = c.at[0] * k;
          const y = c.at[1] * k;
          return (
            <React.Fragment key={c.key}>
              <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: ES.red, border: `4px solid ${C.white}`, boxSizing: "border-box", opacity: Math.min(1, p * 1.4) }} />
              <div
                style={{
                  position: "absolute",
                  left: x + c.dx,
                  top: y + c.dy,
                  padding: "4px 12px",
                  borderRadius: 10,
                  background: C.ink,
                  color: C.white,
                  fontFamily: theme.font,
                  fontSize: 22,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, p * 1.4),
                  transform: `scale(${0.6 + 0.4 * p})`,
                }}
              >
                {c.label} · {c.seats}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: MAP.left + MAP_W + 6,
          top: MAP.top + 40,
          width: 210,
          fontFamily: theme.font,
          opacity: Math.min(1, districts * 1.4) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * districts})`,
          transformOrigin: "0 50%",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: ES.red, letterSpacing: -2, lineHeight: 1 }}>52</div>
        <div style={{ fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>districts: 50 provinces + Ceuta & Melilla</div>
        <div style={{ fontSize: 21, fontWeight: 600, color: C.inkSoft, lineHeight: 1.2, marginTop: 6 }}>at least 2 seats each, the rest by population</div>
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 40px", overflow: "hidden", ...riseStyle(card, exit) }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <CardTitle>ONE PROVINCE · {EXAMPLE_SEATS} SEATS</CardTitle>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>votes → seats</div>
        </div>
        {EXAMPLE.map((party, i) => {
          const isOut = party.votes < THRESHOLD;
          const noSeat = party.seats === 0;
          const fade = isOut ? out : 0;
          const color = interpolateColors(fade, [0, 1], [party.color, ES.none]);
          const width = BAR.perCent * party.votes * bars;
          const top = BAR.top + i * BAR.row;
          return (
            <div key={party.id} style={{ position: "absolute", left: 40, right: 40, top, height: BAR.row }}>
              <div style={{ position: "absolute", left: 0, top: (BAR.row - 42) / 2, width: 42, height: 42, borderRadius: 21, background: color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>
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
                  <span style={{ fontSize: 26, fontWeight: 800, color: ES.red, opacity: Math.min(1, out * 1.4) }}>✕ under 3%</span>
                ) : (
                  <span style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>
                    → <span style={{ color: noSeat ? C.muted : party.color, fontWeight: 800 }}>{party.seats}</span> {party.seats === 1 ? "seat" : "seats"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <svg width={840} height={CARD.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line
            x1={thresholdX}
            y1={BAR.top - 8}
            x2={thresholdX}
            y2={BAR.top - 8 + (rowsHeight + 12) * line}
            stroke={ES.red}
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
            color: ES.red,
            opacity: Math.min(1, lineLabel * 1.4),
            transform: `scale(${0.6 + 0.4 * lineLabel})`,
          }}
        >
          3%
        </div>
        <div style={{ position: "absolute", left: thresholdX + 46, right: 40, top: BAR.top + rowsHeight + 9, fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", opacity: seatLabels }}>
          D'Hondt method: even 9% can win nothing
        </div>
      </Card>
    </>
  );
};
