import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { progress, rise } from "../../components/explainer/motion";
import {
  DENMARK_SEATS,
  DK,
  DOT,
  EXAMPLE,
  FIRST,
  GOVERNMENT_SEATS,
  OPPOSITION_SEATS,
  PALETTE as C,
  POSE,
  RESULT_2026,
  ROWS,
  R_IN,
  R_OUT,
  TOTAL,
  at,
  sceneFrom,
} from "./constants";

const SEATS = hemicycleSeats(TOTAL, ROWS, R_IN, R_OUT);

type Pose = { cx: number; cy: number; s: number; o: number };
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  s: a.s + (b.s - a.s) * t,
  o: a.o + (b.o - a.o) * t,
});

/** First seat index of each group (left to right). */
const starts = (sizes: readonly number[]) => sizes.map((_, i) => sizes.slice(0, i).reduce((n, s) => n + s, 0));
const EXAMPLE_FROM = starts(EXAMPLE.map((p) => p.seats));
const PARTY_FROM = starts(RESULT_2026.map((p) => p.seats));
const groupOf = (from: number[], i: number) => from.filter((f) => i >= f).length - 1;

/**
 * The Folketing as one 179-seat half-circle that lives from "Parties above 2% share the seats" to the
 * minority-government step: it fills with the made-up parties A–D by their votes (the last 4 seats,
 * Greenland's and the Faroes', stay grey), turns red as the Folketing, fills with the 2026 result
 * (the Social Democrats' 38 highlighted), hides during the King's rounds, and comes back with only
 * the government's 82 seats lit, then the opposition's 77 in dark grey: neither side reaches 90.
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const FolketingLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  const toFolketing = progress(g, sceneFrom("folketing") - 2, sceneFrom("folketing") + 20);
  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toTalks = progress(g, sceneFrom("talks") - 2, sceneFrom("talks") + 12);
  const toMinority = progress(g, sceneFrom("minority") + 2, sceneFrom("minority") + 20);
  const out = progress(g, sceneFrom("king") - 6, sceneFrom("king") + 4);
  const pose: Pose = [
    [POSE.folketing, toFolketing],
    [POSE.result, toResult],
    [POSE.talks, toTalks],
    [POSE.minority, toMinority],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.seats);
  const opacity = pose.o * (1 - out);
  const minorityPhase = g >= sceneFrom("minority");

  // Seats scene: parties A–D fill left to right as the votes are shared out.
  const build = progress(g, at("seats", "share") - 4, at("seats", "votes", "end") + 4, Easing.inOut(Easing.cubic));
  const shown = Math.round(DENMARK_SEATS * build);
  const northAtlantic = progress(g, at("seats", "nationwide") - 2, at("seats", "nationwide") + 10);
  // Folketing: every seat in flag red.
  const red = progress(g, sceneFrom("folketing") + 4, sceneFrom("folketing") + 22);
  // Result: grey, then all twelve parties fill left to right, then the Social Democrats stand out.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 14);
  const fill = progress(g, at("result", "twelve") - 4, at("result", "in", "end") + 4, Easing.inOut(Easing.quad));
  const focus = progress(g, at("result", "Social") - 4, at("result", "Democrats", "end"));
  const firstCounter = rise(g, at("result", "38") - 6) * (1 - toTalks);
  // Minority: only the government's seats, then the opposition's.
  const govCounter = rise(g, at("minority", "runs") - 2);
  const against = progress(g, at("minority", "no") - 4, at("minority", "against", "end"), Easing.inOut(Easing.quad));
  const oppCounter = rise(g, at("minority", "majority#2") - 2);

  const seatFill = (i: number) => {
    const p = RESULT_2026[groupOf(PARTY_FROM, i)];
    if (minorityPhase) {
      if (p.side === "gov") return p.color;
      if (p.side === "opp") return interpolateColors(against, [0, 1], [DK.faded, DK.against]);
      return DK.faded;
    }
    if (idle <= 0) {
      const example = i < DENMARK_SEATS ? EXAMPLE[groupOf(EXAMPLE_FROM, i)].color : interpolateColors(northAtlantic, [0, 1], [DK.faded, DK.none]);
      return interpolateColors(red, [0, 1], [example, DK.red]);
    }
    const lit = i < TOTAL * fill;
    const color = p === FIRST ? p.color : interpolateColors(focus, [0, 1], [p.color, DK.faded]);
    return lit ? color : interpolateColors(idle, [0, 1], [DK.red, DK.seat]);
  };
  const seatVisible = (i: number) => (i < DENMARK_SEATS ? build * (DENMARK_SEATS + 1) - i : Math.max(northAtlantic, idle, red));

  const s = pose.s;
  const counters = [
    { key: "example", p: progress(g, at("seats", "share") - 4, at("seats", "share") + 6) * (1 - toFolketing), value: `${shown}`, label: "seats", color: C.ink },
    { key: "first", p: firstCounter, value: `${FIRST.seats}`, label: "Social Democrats", color: FIRST.color },
    { key: "gov", p: minorityPhase ? govCounter * (1 - against) : 0, value: `${GOVERNMENT_SEATS}`, label: "government", color: FIRST.color },
    { key: "opp", p: minorityPhase ? oppCounter * against : 0, value: `${OPPOSITION_SEATS}`, label: "opposition", color: DK.against },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transform: `translate(${pose.cx - 540}px, ${pose.cy - 830}px) scale(${s})`,
          transformOrigin: "540px 830px",
        }}
      >
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={DOT} fill={seatFill} visible={seatVisible} />
      </div>

      {counters.map(({ key, p, value, label, color }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            left: pose.cx - 220,
            width: 440,
            top: pose.cy - 128 * s,
            textAlign: "center",
            fontFamily: theme.font,
            opacity: p,
            transform: `scale(${s})`,
            transformOrigin: "50% 0",
          }}
        >
          <div style={{ fontSize: 100, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color }}>{value}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 2, whiteSpace: "nowrap" }}>{label}</div>
        </div>
      ))}
    </div>
  );
};
