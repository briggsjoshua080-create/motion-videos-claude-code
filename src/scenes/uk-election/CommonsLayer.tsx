import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise } from "../../components/explainer/motion";
import {
  COMMONS_DOT,
  COMMONS_POSE as POSE,
  COMMONS_R_OUT as R_OUT,
  COMMONS_TOTAL,
  MAJORITY,
  PALETTE as C,
  RESULT_2024,
  UK,
  WINNER,
  at,
  sceneFrom,
} from "./constants";

const SEATS = hemicycleSeats(COMMONS_TOTAL, 13, 140, R_OUT);

type Pose = { cx: number; cy: number; s: number; o: number };
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  s: a.s + (b.s - a.s) * t,
  o: a.o + (b.o - a.o) * t,
});

/** First seat index of each party in the 2024 result (seats fill from the left). */
const PARTY_FROM = RESULT_2024.map((_, i) => RESULT_2024.slice(0, i).reduce((n, p) => n + p.seats, 0));

/**
 * The House of Commons as one 650-seat half-circle that lives from "The winners form the House of
 * Commons" to the King: it fills green, shrinks to London as "the UK Parliament" for the nations,
 * steps left for the Lords, and returns for the 2024 result (against the 326-seat majority line).
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const CommonsLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  // Movement between scenes
  const toDevolved = progress(g, sceneFrom("devolved") - 2, sceneFrom("devolved") + 20);
  const toLords = progress(g, sceneFrom("lords") - 2, sceneFrom("lords") + 20);
  const toGov = progress(g, sceneFrom("government") - 2, sceneFrom("government") + 20);
  const toKing = progress(g, sceneFrom("king") - 2, sceneFrom("king") + 14);
  const pose = [
    [POSE.devolved, toDevolved],
    [POSE.lords, toLords],
    [POSE.government, toGov],
    [POSE.king, toKing],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.commons);

  // Commons scene: the winners sweep in on "The winners form the House of Commons", counter to 650.
  const build = progress(g, at("commons", "winners") - 2, at("commons", "Commons", "end") + 4, Easing.inOut(Easing.cubic));
  const commonsCounter = rise(g, at("commons", "winners") - 2) * (1 - toDevolved);

  // Government scene: seats go grey, then Labour fills past the majority, then everyone else.
  const idle = progress(g, sceneFrom("government") + 2, sceneFrom("government") + 16);
  const winnerFill = progress(g, at("result", "Labour") - 2, at("result", "seats") + 2, Easing.inOut(Easing.quad));
  const othersFill = progress(g, at("result", "seats") - 2, at("result", "so") + 10, Easing.inOut(Easing.quad));
  const majorityP = pop(g, at("result", "411") - 2);
  const line = progress(g, at("result", "411") - 2, at("result", "411") + 14);
  const govCounter = rise(g, at("result", "Labour") - 2);
  const govOverlays = 1 - toKing;

  const winnerCount = WINNER.seats * winnerFill;
  const base = interpolateColors(idle, [0, 1], [UK.commons, UK.seat]);
  const seatFill = (i: number) => {
    if (i < winnerCount) return WINNER.color;
    if (othersFill > 0) {
      const party = PARTY_FROM.filter((from) => i >= from).length - 1;
      if (party > 0 && i - PARTY_FROM[1] < (COMMONS_TOTAL - PARTY_FROM[1]) * othersFill) return RESULT_2024[party].color;
    }
    return base;
  };

  const s = pose.s;
  const top = pose.cy - (R_OUT + 24) * s;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: pose.o }}>
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
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={COMMONS_DOT} fill={seatFill} visible={(i) => build * (COMMONS_TOTAL + 1) - i} />
      </div>

      {/* Centre counter: 650 MPs (Commons scene), then Labour's 411 (Government scene). */}
      {[
        { p: commonsCounter, value: Math.round(COMMONS_TOTAL * build), label: "MPs", color: C.ink },
        { p: govCounter * govOverlays, value: Math.round(winnerCount), label: `${WINNER.name} seats`, color: WINNER.color },
      ].map(({ p, value, label, color }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: pose.cx - 200,
            width: 400,
            top: pose.cy - 132 * s,
            textAlign: "center",
            fontFamily: theme.font,
            color: C.ink,
            opacity: p,
            transform: `scale(${s})`,
            transformOrigin: "50% 0",
          }}
        >
          <div style={{ fontSize: 100, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color }}>{value}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 4 }}>{label}</div>
        </div>
      ))}

      {/* Majority line through the middle: crossing it takes 326 of 650 seats. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: govOverlays }}>
        <line
          x1={pose.cx}
          y1={top + 14}
          x2={pose.cx}
          y2={top + 14 + (pose.cy - top - 150 * s) * line}
          stroke={C.ink}
          strokeWidth={5}
          strokeDasharray="12 10"
          strokeLinecap="round"
          opacity={line > 0.01 ? 0.75 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: pose.cx - 200,
          width: 400,
          top: top - 50,
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
            background: C.ink,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          MAJORITY · {MAJORITY}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={C.ink} />
        </svg>
      </div>
    </div>
  );
};
