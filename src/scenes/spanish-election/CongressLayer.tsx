import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { progress, rise } from "../../components/explainer/motion";
import {
  DOT,
  ES,
  FEIJOO_YES,
  FIRST,
  MAJORITY,
  PALETTE as C,
  POSE,
  RESULT_2023,
  ROWS,
  R_IN,
  R_OUT,
  SANCHEZ_YES,
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

/** First seat index of each party (left to right). */
const PARTY_FROM = RESULT_2023.map((_, i) => RESULT_2023.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2023[PARTY_FROM.filter((f) => i >= f).length - 1];

/**
 * Congress as one 350-seat half-circle that lives from the Congress step to the end of the
 * Government step: it sweeps in red as the Congress of Deputies, fills with the 2023 result (the
 * People's Party's 137 highlighted, short of the 176 mark), then shows the two investiture votes: the
 * 172 who backed Feijóo (from the right, stopping short of the middle), then the 179 who backed
 * Sánchez (from the left, past it). Works in composition frames (`offset` = the Sequence's start).
 */
export const CongressLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toTalks = progress(g, sceneFrom("talks") - 2, sceneFrom("talks") + 16);
  const out = progress(g, sceneFrom("king") - 6, sceneFrom("king") + 4);
  const pose: Pose = [
    [POSE.result, toResult],
    [POSE.talks, toTalks],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.congress);
  const opacity = pose.o * (1 - out);

  // Congress: the seats sweep in, in flag red.
  const build = progress(g, sceneFrom("congress") + 2, at("congress", "Congress", "end") + 2, Easing.inOut(Easing.cubic));
  // Result: grey, then every party fills left to right, then the People's Party stands out.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 12);
  const fill = progress(g, sceneFrom("result") + 6, at("result", "won") + 2, Easing.inOut(Easing.quad));
  const focus = progress(g, at("result", "People's") - 4, at("result", "Party", "end"));
  const firstCounter = rise(g, at("result", "137") - 6) * (1 - toTalks);
  const mark = rise(g, at("result", "short") - 4);
  // Talks: Feijóo's yes votes, then Sánchez's.
  const talksPhase = g >= sceneFrom("talks");
  const feijoo = progress(g, at("talks", "Feijóo") - 6, at("talks", "Feijóo", "end") + 4);
  const sanchez = progress(g, at("talks", "Pedro") - 4, at("talks", "Sánchez", "end") + 4);
  const feijooCounter = rise(g, at("talks", "Feijóo") - 2) * (1 - sanchez);
  const sanchezCounter = sanchez;

  const seatFill = (i: number) => {
    const p = partyOf(i);
    if (talksPhase) {
      const f = p.feijoo ? p.color : ES.faded;
      const s = p.sanchez ? p.color : ES.faded;
      return interpolateColors(sanchez, [0, 1], [interpolateColors(feijoo, [0, 1], [ES.faded, f]), s]);
    }
    if (idle <= 0) return ES.red;
    const lit = i < TOTAL * fill;
    const color = p === FIRST ? p.color : interpolateColors(focus, [0, 1], [p.color, ES.faded]);
    return lit ? color : interpolateColors(idle, [0, 1], [ES.red, ES.seat]);
  };
  const seatVisible = (i: number) => build * (TOTAL + 1) - i;

  const s = pose.s;
  const counters = [
    { key: "first", p: firstCounter, value: `${FIRST.seats}`, label: "People's Party", color: FIRST.color },
    { key: "feijoo", p: talksPhase ? feijooCounter : 0, value: `${FEIJOO_YES}`, label: "yes for Feijóo", color: FIRST.color },
    { key: "sanchez", p: talksPhase ? sanchezCounter : 0, value: `${SANCHEZ_YES}`, label: "yes for Sánchez", color: ES.red },
  ];
  const outer = (R_OUT + DOT * 2) * s;

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

      {/* The majority mark: the middle of the half-circle */}
      <div style={{ position: "absolute", left: pose.cx - 2, top: pose.cy - outer - 18, width: 4, height: outer - R_IN * s + 8, background: C.ink, opacity: mark * 0.9 }} />
      <div
        style={{
          position: "absolute",
          left: pose.cx + 14,
          top: pose.cy - outer - 30,
          padding: "4px 12px",
          borderRadius: 10,
          background: C.ink,
          color: C.white,
          fontFamily: theme.font,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 1.5,
          whiteSpace: "nowrap",
          opacity: mark,
        }}
      >
        MAJORITY · {MAJORITY}
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
