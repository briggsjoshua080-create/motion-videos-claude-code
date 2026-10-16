import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { progress, rise } from "../../components/explainer/motion";
import { DOT, FIRST, MAJORITY, PALETTE as C, POSE, PT, REJECT_YES, RESULT_2025, ROWS, R_IN, R_OUT, TOTAL, at, sceneFrom } from "./constants";

const SEATS = hemicycleSeats(TOTAL, ROWS, R_IN, R_OUT);

type Pose = { cx: number; cy: number; s: number; o: number };
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  s: a.s + (b.s - a.s) * t,
  o: a.o + (b.o - a.o) * t,
});

/** First seat index of each party (left to right). */
const PARTY_FROM = RESULT_2025.map((_, i) => RESULT_2025.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2025[PARTY_FROM.filter((f) => i >= f).length - 1];

/**
 * The Assembly as one 230-seat half-circle that lives from the Parliament step to the end of the
 * Government step: it sweeps in green, fills with the 2025 result (the Democratic Alliance's 91
 * highlighted, short of the 116 mark), then shows the vote that could have thrown the government
 * out: only 10 MPs voted to reject its programme. Works in composition frames (`offset` = the
 * Sequence's start).
 */
export const AssemblyLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toGov = progress(g, sceneFrom("gov") - 2, sceneFrom("gov") + 16);
  const out = progress(g, sceneFrom("president") - 6, sceneFrom("president") + 4);
  const pose: Pose = [
    [POSE.result, toResult],
    [POSE.gov, toGov],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.parliament);
  const opacity = pose.o * (1 - out);

  // Parliament: the seats sweep in, in flag green.
  const build = progress(g, sceneFrom("parliament") + 2, at("parliament", "members", "end") + 2, Easing.inOut(Easing.cubic));
  // Result: grey, then every party fills left to right, then the Democratic Alliance stands out.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 12);
  const fill = progress(g, sceneFrom("result") + 6, at("result", "alliance") + 2, Easing.inOut(Easing.quad));
  const focus = progress(g, at("result", "alliance") - 4, at("result", "won") + 4);
  const firstCounter = rise(g, at("result", "91") - 6);
  const mark = rise(g, at("result", "short") - 4);
  // Government: the motion to reject the programme gets only 10 votes.
  const reject = progress(g, at("gov", "majority#2") - 4, at("gov", "votes", "end") + 4);
  const rejectCounter = rise(g, at("gov", "majority#2") + 2);

  const seatFill = (i: number) => {
    const p = partyOf(i);
    if (idle <= 0) return PT.green;
    if (reject > 0) {
      const target = p.reject === "yes" ? PT.red : p.reject === "abstain" ? PT.none : PT.faded;
      const before = p === FIRST ? p.color : PT.faded;
      return interpolateColors(reject, [0, 1], [before, target]);
    }
    const lit = i < TOTAL * fill;
    const color = p === FIRST ? p.color : interpolateColors(focus, [0, 1], [p.color, PT.faded]);
    return lit ? color : interpolateColors(idle, [0, 1], [PT.green, PT.seat]);
  };
  const seatVisible = (i: number) => build * (TOTAL + 1) - i;

  const s = pose.s;
  const counters = [
    { key: "first", p: firstCounter * (1 - rejectCounter), value: `${FIRST.seats}`, label: "Democratic Alliance", color: FIRST.color },
    { key: "reject", p: rejectCounter, value: `${REJECT_YES}`, label: `votes to throw him out`, color: PT.red },
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
