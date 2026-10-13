import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise } from "../../components/explainer/motion";
import { COALITION, HOUSE_TOTAL, MAJORITY, NL, PALETTE as C, RESULT_2025, SENATE_POSE, at, sceneFrom } from "./constants";

const SEATS = hemicycleSeats(HOUSE_TOTAL, 8, 170, 400);
const R_OUT = 400;
const DOT = 13;

/** Where the half-circle sits in each scene: centre of its base line, scale and opacity. */
const POSE = {
  house: { cx: 540, cy: 790, s: 1, o: 1 },
  senate: { cx: SENATE_POSE.houseX, cy: SENATE_POSE.baseY, s: SENATE_POSE.houseScale, o: 1 },
  government: { cx: 540, cy: 790, s: 1, o: 1 },
  king: { cx: 540, cy: 560, s: 0.55, o: 0 },
} as const;
type Pose = { cx: number; cy: number; s: number; o: number };
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  s: a.s + (b.s - a.s) * t,
  o: a.o + (b.o - a.o) * t,
});

const COALITION_SEATS = COALITION.reduce((n, p) => n + p.seats, 0);
/** First seat index of each coalition party (seats fill from the left). */
const COALITION_FROM = COALITION.map((_, i) => COALITION.slice(0, i).reduce((n, p) => n + p.seats, 0));

/**
 * The House of Representatives as one half-circle that lives from "Together, they fill the 150
 * seats" to the King: it sweeps in, steps aside for the Senate, returns for the 2025 result and the
 * coalition (against the 76-seat majority line), and fades when the King appears.
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const HouseLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  // Movement between scenes
  const toSenate = progress(g, sceneFrom("senate") - 4, sceneFrom("senate") + 18);
  const toGov = progress(g, sceneFrom("government") - 4, sceneFrom("government") + 18);
  const toKing = progress(g, sceneFrom("king") - 2, sceneFrom("king") + 14);
  const pose = blend(blend(blend(POSE.house, POSE.senate, toSenate), POSE.government, toGov), POSE.king, toKing);

  // House scene: seats sweep in on "Together, they fill the 150 seats" while the counter runs to 150.
  const build = progress(g, at("house", "Together") - 2, at("house", "seats") + 6, Easing.inOut(Easing.cubic));
  const houseCounter = rise(g, at("house", "Together") - 2) * (1 - toSenate);

  // Government scene
  const idle = progress(g, sceneFrom("government") + 4, sceneFrom("government") + 18);
  const majorityP = pop(g, at("coalition", "76") - 4);
  const line = progress(g, at("coalition", "76") - 2, at("coalition", "seats") + 6);
  const firstP = progress(g, at("coalition", "D66") - 2, at("coalition", "D66") + 14);
  const secondP = progress(g, at("coalition", "PVV") - 2, at("coalition", "PVV") + 14);
  const secondOut = progress(g, at("cabinet", "three") - 2, at("cabinet", "three") + 10);
  const fill = progress(g, at("cabinet", "parties") - 4, at("cabinet", "up") + 6, Easing.inOut(Easing.quad));
  const govCounter = rise(g, at("cabinet", "parties") - 4);
  const govOverlays = 1 - toKing;

  const firstCount = RESULT_2025.first.seats * firstP;
  const secondCount = RESULT_2025.second.seats * secondP * (1 - secondOut);
  const coalitionCount = RESULT_2025.first.seats + (COALITION_SEATS - RESULT_2025.first.seats) * fill;
  const base = interpolateColors(idle, [0, 1], [NL.blue, NL.seat]);

  const seatFill = (i: number) => {
    if (i < firstCount) return NL.orange;
    if (fill > 0 && i < coalitionCount) {
      const party = COALITION_FROM.filter((from) => i >= from).length - 1;
      return COALITION[party].color;
    }
    if (i >= HOUSE_TOTAL - secondCount) return NL.blue;
    return base;
  };

  const s = pose.s;
  const top = pose.cy - (R_OUT + 30) * s;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: pose.o }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transform: `translate(${pose.cx - 540}px, ${pose.cy - 790}px) scale(${s})`,
          transformOrigin: "540px 790px",
        }}
      >
        <Hemicycle seats={SEATS} cx={540} cy={790} dot={DOT} fill={seatFill} visible={(i) => build * (HOUSE_TOTAL + 1) - i} />
      </div>

      {/* Centre counter: 150 seats (House scene), then the coalition's 66 (Government scene). */}
      {[
        { p: houseCounter, value: Math.round(HOUSE_TOTAL * build), label: "seats" },
        { p: govCounter * govOverlays, value: Math.round(coalitionCount), label: "coalition seats" },
      ].map(({ p, value, label }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: pose.cx - 200,
            width: 400,
            top: pose.cy - 128 * s,
            textAlign: "center",
            fontFamily: theme.font,
            color: C.ink,
            opacity: p,
            transform: `scale(${s})`,
            transformOrigin: "50% 0",
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>{value}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 4 }}>{label}</div>
        </div>
      ))}

      {/* Majority line through the middle: crossing it takes 76 of 150 seats. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: govOverlays }}>
        <line
          x1={pose.cx}
          y1={top + 18}
          x2={pose.cx}
          y2={top + 18 + (pose.cy - top - 150 * s) * line}
          stroke={C.alert}
          strokeWidth={6}
          strokeDasharray="14 10"
          strokeLinecap="round"
          opacity={line > 0.01 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: pose.cx - 200,
          width: 400,
          top: top - 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: Math.min(1, majorityP * 1.4) * govOverlays,
          transform: `scale(${0.7 + 0.3 * majorityP})`,
        }}
      >
        <div
          style={{
            padding: "8px 22px",
            borderRadius: 12,
            background: C.alert,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          MAJORITY · {MAJORITY}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={C.alert} />
        </svg>
      </div>
    </div>
  );
};
