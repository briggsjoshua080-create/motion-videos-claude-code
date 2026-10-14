import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise } from "../../components/explainer/motion";
import {
  CHAMBER_DOT,
  CHAMBER_MAJORITY,
  CHAMBER_POSE as POSE,
  CHAMBER_R_OUT as R_OUT,
  CHAMBER_SPLIT,
  CHAMBER_TOTAL,
  IT,
  PALETTE as C,
  RESULT_2022,
  WINNER,
  at,
  sceneFrom,
} from "./constants";

const SEATS = hemicycleSeats(CHAMBER_TOTAL, 10, 150, R_OUT);

type Pose = { cx: number; cy: number; s: number; o: number };
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  s: a.s + (b.s - a.s) * t,
  o: a.o + (b.o - a.o) * t,
});

/** First seat index of each group (left to right). */
const starts = (sizes: readonly number[]) => sizes.map((_, i) => sizes.slice(0, i).reduce((n, s) => n + s, 0));
const SPLIT_FROM = starts(CHAMBER_SPLIT.map((g) => g.seats));
const PARTY_FROM = starts(RESULT_2022.map((p) => p.seats));
/** The centre-right holds the right-hand end of the half-circle. */
const WINNER_FROM = CHAMBER_TOTAL - WINNER.seats;

/**
 * The Chamber of Deputies as one 400-seat half-circle that lives from "Each area's winner takes a
 * seat" to the President: it fills with the three kinds of seats (area winners, shared by party
 * votes, Italians abroad), steps left beside the Senate, returns for the 2022 result (against the
 * 201-seat majority line), shrinks to the top left for "Both houses must back her" and fades out
 * when the 68 governments come back.
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const ChamberLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  // Movement between scenes
  const toHouses = progress(g, sceneFrom("houses") - 2, sceneFrom("houses") + 20);
  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toSupport = progress(g, sceneFrom("support") - 2, sceneFrom("support") + 20);
  const toPresident = progress(g, sceneFrom("president") - 2, sceneFrom("president") + 14);
  const pose = [
    [POSE.houses, toHouses],
    [POSE.result, toResult],
    [POSE.support, toSupport],
    [POSE.president, toPresident],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.seats);

  // Seats scene: area winners on "winner", shared seats on "shared", the 8 abroad seats last.
  const build = [
    progress(g, at("seats", "winner") - 4, at("seats", "seat", "end") + 2, Easing.inOut(Easing.cubic)),
    progress(g, at("seats", "shared") - 4, at("seats", "votes") + 4, Easing.inOut(Easing.cubic)),
    progress(g, at("seats", "votes") - 2, at("seats", "votes", "end") + 6),
  ];
  const groupOf = (i: number) => SPLIT_FROM.filter((from) => i >= from).length - 1;
  const visible = (i: number) => {
    const k = groupOf(i);
    return build[k] * (CHAMBER_SPLIT[k].seats + 1) - (i - SPLIT_FROM[k]);
  };
  const shown = build.reduce((n, b, k) => n + Math.round(b * CHAMBER_SPLIT[k].seats), 0);

  // Houses scene: every seat in the Chamber's colour.
  const chamberTint = progress(g, sceneFrom("houses") + 4, sceneFrom("houses") + 22);
  // Result scene: seats go grey, then the centre-right fills past the majority, then everyone else.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 16);
  const winnerFill = progress(g, at("result", "centre-right") - 2, at("result", "alliance", "end") + 2, Easing.inOut(Easing.quad));
  const othersFill = progress(g, at("result", "both") - 4, at("result", "with") + 4, Easing.inOut(Easing.quad));
  const majorityP = pop(g, at("result", "won") - 4);
  const line = progress(g, at("result", "won") - 4, at("result", "won") + 12);
  const counter = rise(g, at("result", "centre-right") - 2);
  const resultOverlays = 1 - toSupport;
  // Support scene: the houses make way for the 68 governments on "That's how Italy got to 68".
  const supportOut = progress(g, at("support", "That's") - 8, at("support", "That's"));

  const winnerCount = WINNER.seats * winnerFill;
  const seatFill = (i: number) => {
    const split = CHAMBER_SPLIT[groupOf(i)].color;
    if (idle <= 0) return interpolateColors(chamberTint, [0, 1], [split, IT.chamber]);
    if (i >= CHAMBER_TOTAL - winnerCount) return WINNER.color;
    const party = PARTY_FROM.filter((from) => i >= from).length - 1;
    if (party < RESULT_2022.length - 1 && i < WINNER_FROM * othersFill) return RESULT_2022[party].color;
    return interpolateColors(idle, [0, 1], [IT.chamber, IT.seat]);
  };

  const s = pose.s;
  const top = pose.cy - (R_OUT + 24) * s;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: pose.o * (1 - supportOut) }}>
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
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={CHAMBER_DOT} fill={seatFill} visible={visible} />
      </div>

      {/* Centre counter: seats filled (seats scene), then the centre-right's 237 (result scene). */}
      {[
        { p: progress(g, at("seats", "winner") - 4, at("seats", "winner") + 6) * (1 - toHouses), value: shown, label: "seats", color: C.ink },
        { p: counter * resultOverlays, value: Math.round(winnerCount), label: "centre-right seats", color: WINNER.color },
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
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 4, whiteSpace: "nowrap" }}>{label}</div>
        </div>
      ))}

      {/* Majority line through the middle: crossing it takes 201 of 400 seats. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: resultOverlays }}>
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
          opacity: Math.min(1, majorityP * 1.4) * resultOverlays,
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
          MAJORITY · {CHAMBER_MAJORITY}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={C.ink} />
        </svg>
      </div>
    </div>
  );
};
