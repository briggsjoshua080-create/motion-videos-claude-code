import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { PORTUGAL as MAP_DATA } from "../../components/portugal";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { EXAMPLE, EXAMPLE_SEATS, PALETTE as C, PT, type SceneProps } from "./constants";
import { Card, CardTitle, PortugalFlagMap } from "./ui";

const MAP_H = 400;
const k = MAP_H / MAP_DATA.height;
const MAP = { left: 250, top: 316 } as const;
/** Seats per district in 2025: Lisbon the most, Portalegre the fewest. */
const CITIES = [
  { key: "lisbon", label: "Lisbon", seats: 48, at: MAP_DATA.lisbon, dx: 22, dy: -6, word: "Lisbon" },
  { key: "portalegre", label: "Portalegre", seats: 2, at: MAP_DATA.portalegre, dx: -70, dy: -52, word: "Portalegre" },
] as const;

const CARD = { top: 760, height: 430 } as const;
const BAR = { left: 106, perCent: 9.5, top: 92, row: 52, height: 30 } as const;

/**
 * "Each of the 22 districts shares its seats by vote share. Lisbon 48, Portalegre just two."
 * Mainland Portugal with Lisbon (48 seats) and Portalegre (2); the 22 districts (18 mainland, the
 * Azores, Madeira, Europe and the rest of the world). Below, one made-up district with 6 seats:
 * seats follow the votes (D'Hondt, no threshold), but with so few seats 9% still wins nothing.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const districts = pop(frame, cue("seats", "22") - 4);
  const card = rise(frame, cue("seats", "districts") - 4);
  const bars = progress(frame, cue("seats", "shares") - 4, cue("seats", "seats") + 6);
  const seatLabels = rise(frame, cue("seats", "vote") - 2);

  return (
    <>
      {/* Portugal, with seats per district */}
      <div style={{ position: "absolute", left: MAP.left, top: MAP.top, ...riseStyle(mapIn, exit, 30) }}>
        <div style={{ filter: "drop-shadow(0 14px 20px rgba(20,32,43,0.12))" }}>
          <PortugalFlagMap height={MAP_H} id="seats-map" fill="plain" stroke={5} capital={false} />
        </div>
        {CITIES.map((c) => {
          const p = pop(frame, cue("seats", c.word) - 4);
          const x = c.at[0] * k;
          const y = c.at[1] * k;
          return (
            <React.Fragment key={c.key}>
              <div style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: PT.red, border: `4px solid ${C.white}`, boxSizing: "border-box", opacity: Math.min(1, p * 1.4) }} />
              <div
                style={{
                  position: "absolute",
                  left: x + c.dx,
                  top: y + c.dy,
                  padding: "4px 14px",
                  borderRadius: 10,
                  background: C.ink,
                  color: C.white,
                  fontFamily: theme.font,
                  fontSize: 26,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, p * 1.4),
                  transform: `scale(${0.6 + 0.4 * p})`,
                  transformOrigin: "0 50%",
                }}
              >
                {c.label} · {c.seats} seats
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 600,
          top: MAP.top + 20,
          width: 330,
          fontFamily: theme.font,
          opacity: Math.min(1, districts * 1.4) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * districts})`,
          transformOrigin: "0 50%",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, color: PT.green, letterSpacing: -3, lineHeight: 1 }}>22</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, lineHeight: 1.15 }}>districts</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.inkSoft, lineHeight: 1.3, marginTop: 10 }}>
          18 on the mainland,
          <br />
          the Azores, Madeira,
          <br />
          and 2 for voters abroad
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: PT.green, lineHeight: 1.3, marginTop: 10 }}>More people, more seats</div>
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 40px", overflow: "hidden", ...riseStyle(card, exit) }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <CardTitle>ONE DISTRICT · {EXAMPLE_SEATS} SEATS</CardTitle>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>votes → seats</div>
        </div>
        {EXAMPLE.map((p, i) => {
          const noSeat = p.seats === 0;
          const width = BAR.perCent * p.votes * bars;
          const top = BAR.top + i * BAR.row;
          return (
            <div key={p.id} style={{ position: "absolute", left: 40, right: 40, top, height: BAR.row }}>
              <div style={{ position: "absolute", left: 0, top: (BAR.row - 42) / 2, width: 42, height: 42, borderRadius: 21, background: p.color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>
                {p.id}
              </div>
              <div style={{ position: "absolute", left: BAR.left - 40, top: (BAR.row - BAR.height) / 2, width, height: BAR.height, borderRadius: 8, background: p.color }} />
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
                <span style={{ fontSize: 28, fontWeight: 800, color: C.ink }}>{p.votes}%</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, opacity: seatLabels }}>
                  → <span style={{ color: noSeat ? C.muted : p.color, fontWeight: 800 }}>{p.seats}</span> {p.seats === 1 ? "seat" : "seats"}
                </span>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 40, right: 40, top: BAR.top + EXAMPLE.length * BAR.row + 16, fontSize: 24, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", opacity: seatLabels }}>
          D'Hondt method, <span style={{ color: C.ink, fontWeight: 800 }}>no minimum %</span>, but 9% can still win nothing
        </div>
      </Card>
    </>
  );
};
