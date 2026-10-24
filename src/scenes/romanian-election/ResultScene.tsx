import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER_LAYOUT, DEPUTIES, FONT, RESULT_2024, RO, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const SEATS = hemicycleSeats(DEPUTIES, CHAMBER_LAYOUT.rows, CHAMBER_LAYOUT.rIn, CHAMBER_LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 930, s: 0.92 } as const;
/** First seat index of each group (left to right). */
const PARTY_FROM = RESULT_2024.map((_, i) => RESULT_2024.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2024[PARTY_FROM.filter((f) => i >= f).length - 1];
const WINNER = RESULT_2024[0];
const PARTIES_IN = RESULT_2024.filter((p) => p.key !== "MIN").length;
/** Seats of the groups that step back while the Social Democrats are highlighted. */
const FADED = "#DCD5C6";
const LEGEND = { top: 1000, row: 46 } as const;
/** The legend in two columns, biggest first. */
const BY_SIZE = [...RESULT_2024].sort((a, b) => b.seats - a.seats);

/**
 * "In 2024, the Social Democrats came first with 22%, and seven parties got in." On paper so the
 * parties' colours read clearly: the 2024 Chamber of Deputies fills party by party, the Social
 * Democrats stay lit with a big 22%, then every group comes back and the legend shows the seven
 * parties (plus the 19 minority seats).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const build = progress(frame, 6, cue("result", "Social") - 2, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "Social") - 2, cue("result", "Democrats") + 6) * (1 - progress(frame, cue("result", "seven") - 4, cue("result", "seven") + 6));
  const big = pop(frame, cue("result", "22%") - 4);
  const legend = rise(frame, cue("result", "seven") - 6);
  const count = pop(frame, cue("result", "seven") - 2);

  const seatFill = (i: number) => {
    const p = partyOf(i);
    return p.key === WINNER.key ? p.color : interpolateColors(focus, [0, 1], [p.color, FADED]);
  };
  const seatVisible = (i: number) => build * (DEPUTIES + 1) - i;
  const { cx, cy, s } = CHAMBER;

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        08 — ELECTION OF 1 DEC 2024
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        Chamber of Deputies — {DEPUTIES} seats.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
          <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={CHAMBER_LAYOUT.dot} fill={seatFill} visible={seatVisible} />
        </div>
        <div
          style={{
            position: "absolute",
            left: cx - 220,
            width: 440,
            top: cy - 96,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 84,
            lineHeight: 1,
            color: WINNER.color,
            opacity: Math.min(1, Math.max(0, big) * 1.5),
            transform: `scale(${0.6 + 0.4 * big})`,
            transformOrigin: "50% 80%",
          }}
        >
          22%
        </div>
        <Mono size={19} color={RO.ink} style={{ position: "absolute", left: cx - 220, width: 440, top: cy + 10, textAlign: "center", letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, big)) }}>
          SOCIAL DEMOCRATS · {WINNER.seats} SEATS
        </Mono>
      </div>

      <div style={{ position: "absolute", left: 120, top: LEGEND.top, width: 840, ...riseStyle(legend, exit, 30) }}>
        {BY_SIZE.map((p, i) => (
          <div
            key={p.key}
            style={{
              position: "absolute",
              left: i < 4 ? 0 : 450,
              top: (i % 4) * LEGEND.row,
              width: 390,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: FONT.body,
              opacity: p.key === "MIN" ? 0.7 : 1,
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 10, background: p.color, boxShadow: "inset 0 0 0 1.5px rgba(11,24,56,0.18)", flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 26, fontWeight: 700, color: RO.ink, whiteSpace: "nowrap" }}>{p.name}</div>
            <div style={{ fontSize: 27, fontWeight: 800, color: RO.ink }}>{p.seats}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 520,
          padding: "10px 20px",
          borderRadius: 999,
          background: RO.blue,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 3,
          color: RO.white,
          opacity: Math.min(1, Math.max(0, count) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * count})`,
        }}
      >
        {PARTIES_IN} PARTIES IN
      </div>
    </>
  );
};
