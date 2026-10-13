import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, UK, type SceneProps } from "./constants";
import { Card, CardTitle, Pill } from "./ui";

/** An example count in one area (made-up shares). Party B is the one "you" voted for on the ballot. */
const COUNT = [
  { party: "Party A", pct: 38, tint: "#C9D3EA" },
  { party: "Party B", pct: 31, tint: "#F4D9B0" },
  { party: "Party C", pct: 19, tint: "#CFE6D9" },
  { party: "Party D", pct: 12, tint: "#E8D1E4" },
];
const LOSERS_PCT = COUNT.slice(1).reduce((n, c) => n + c.pct, 0);
const CARD = { top: 450, height: 560 } as const;
const BAR_MAX = 300;

/**
 * "Whoever gets the most votes wins the seat. Votes for everyone else win nothing."
 * First past the post: the count in one area; the winner takes the seat, the rest gets 0 seats.
 */
export const CountScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = pop(frame, 2);
  const card = rise(frame, 0);
  const bars = progress(frame, cue("fptp", "gets") - 4, cue("fptp", "votes") + 6);
  const winner = pop(frame, cue("fptp", "wins") - 3);
  const seat = pop(frame, cue("fptp", "seat") - 2);
  const grey = progress(frame, cue("fptp", "everyone") - 4, cue("fptp", "else") + 4);
  const zero = pop(frame, cue("fptp", "nothing") - 4);
  const summary = rise(frame, cue("fptp", "nothing") - 2);

  return (
    <>
      <div style={{ position: "absolute", top: 352, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={label} bg={C.ink} color={C.white} size={34} style={{ letterSpacing: 3 }}>
          FIRST PAST THE POST
        </Pill>
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ padding: "32px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>THE COUNT IN YOUR AREA</CardTitle>
        {COUNT.map((c, i) => {
          const isWinner = i === 0;
          const fade = isWinner ? 0 : grey;
          return (
            <div key={c.party} style={{ position: "relative", display: "flex", alignItems: "center", height: 104, marginTop: i === 0 ? 22 : 0 }}>
              {/* Winner highlight */}
              {isWinner ? (
                <div
                  style={{
                    position: "absolute",
                    left: -18,
                    right: -18,
                    top: 6,
                    bottom: 6,
                    borderRadius: 18,
                    background: UK.goldSoft,
                    opacity: Math.min(1, winner * 1.2),
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: interpolateColors(fade, [0, 1], [c.tint, C.paperDeep]),
                  border: `3px solid ${interpolateColors(fade, [0, 1], [C.ink, C.muted])}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  color: interpolateColors(fade, [0, 1], [C.ink, C.muted]),
                }}
              >
                {c.party.slice(-1)}
              </div>
              <div style={{ position: "relative", width: 150, marginLeft: 18, fontSize: 32, fontWeight: 800, color: interpolateColors(fade, [0, 1], [C.ink, C.muted]) }}>
                {c.party}
              </div>
              <div
                style={{
                  position: "relative",
                  width: (BAR_MAX * c.pct * bars) / COUNT[0].pct,
                  height: 42,
                  borderRadius: 10,
                  background: interpolateColors(fade, [0, 1], [isWinner ? UK.blue : "#7D8AA8", UK.none]),
                }}
              />
              <div
                style={{
                  position: "relative",
                  marginLeft: 14,
                  fontSize: 34,
                  fontWeight: 800,
                  color: interpolateColors(fade, [0, 1], [C.ink, C.muted]),
                  opacity: Math.min(1, bars * 2),
                }}
              >
                {Math.round(c.pct * bars)}%
              </div>
              {/* Seats won */}
              <div style={{ position: "absolute", right: 0, top: 26 }}>
                {isWinner ? (
                  <Pill p={seat} bg={C.ink} color={C.white} size={28}>
                    1 SEAT
                  </Pill>
                ) : (
                  <Pill p={zero} bg={C.paperDeep} color={C.alert} border={C.alert} size={28}>
                    0 SEATS
                  </Pill>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: CARD.top + CARD.height + 34,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.25,
          color: C.ink,
          ...riseStyle(summary, exit, 20),
        }}
      >
        <span style={{ color: C.alert }}>{LOSERS_PCT}% of the votes</span> here
        <br />
        win no seat at all
      </div>
    </>
  );
};
