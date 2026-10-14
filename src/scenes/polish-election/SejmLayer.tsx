import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise } from "../../components/explainer/motion";
import {
  EXAMPLE,
  FIRST,
  GOVERNMENT_SEATS,
  GOVERNMENT_TODAY,
  OVERRIDE,
  PALETTE as C,
  PARTY,
  PL,
  RESULT_2023,
  SEJM_DOT,
  SEJM_MAJORITY,
  SEJM_POSE as POSE,
  SEJM_R_IN as R_IN,
  SEJM_R_OUT as R_OUT,
  SEJM_ROWS,
  SEJM_TOTAL,
  at,
  sceneFrom,
} from "./constants";

const SEATS = hemicycleSeats(SEJM_TOTAL, SEJM_ROWS, R_IN, R_OUT);

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
const PARTY_FROM = starts(RESULT_2023.map((p) => p.seats));
/** Law and Justice holds the right-hand end of the half-circle. */
const FIRST_FROM = SEJM_TOTAL - FIRST.seats;
const groupOf = (from: number[], i: number) => from.filter((f) => i >= f).length - 1;
/**
 * The governing side in October 2026 (about 240 MPs), in the 2023 order: the Left (21), KO (156) and
 * the parties that ran as Third Way in 2023 (PSL, Polska 2050, Centrum: 63).
 */
const GOVERNMENT_NOW = [
  { seats: 21, color: PARTY.left },
  { seats: 156, color: PARTY.ko },
  { seats: GOVERNMENT_TODAY - 21 - 156, color: PARTY.td },
];
const GOVERNMENT_NOW_FROM = starts(GOVERNMENT_NOW.map((p) => p.seats));

/** Angle (radians, from the right end) of the line after the first `seats` seats from the left. */
const lineAngle = (seats: number) => Math.PI * (1 - seats / SEJM_TOTAL);

/**
 * The Sejm as one 460-seat half-circle that lives from "Parties above 5% share the seats" to the veto:
 * it fills with the made-up parties A–D by their votes, turns red as the Sejm, steps to the bottom left
 * beside the Senate, returns for the 2023 result (Law and Justice from the right, short of the 231-seat
 * majority line, then everyone else), shrinks to the top for the government (the coalition's 248 seats
 * stay lit), fades out for the President, and comes back for the veto: the line swings from a majority
 * to three fifths (276) and the governing side (about 240) stops short of it.
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const SejmLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;
  const vetoPhase = g >= sceneFrom("veto");

  // Movement between scenes (the veto pose is reached while the layer is invisible).
  const toSejm = progress(g, sceneFrom("sejm") - 2, sceneFrom("sejm") + 20);
  const toSenate = progress(g, sceneFrom("senate") - 2, sceneFrom("senate") + 20);
  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toGovt = progress(g, sceneFrom("govt") - 2, sceneFrom("govt") + 20);
  const toPresident = progress(g, sceneFrom("president") - 2, sceneFrom("president") + 14);
  const vetoIn = progress(g, sceneFrom("veto") + 2, sceneFrom("veto") + 20);
  const vetoOut = progress(g, sceneFrom("question") - 8, sceneFrom("question") + 2);
  const pose: Pose = vetoPhase
    ? { ...POSE.veto, o: vetoIn * (1 - vetoOut) }
    : [
        [POSE.sejm, toSejm],
        [POSE.senate, toSenate],
        [POSE.result, toResult],
        [POSE.govt, toGovt],
        [POSE.president, toPresident],
      ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.seats);

  // Seats scene: parties A–D fill left to right as the votes are shared out.
  const build = progress(g, at("seats", "share") - 4, at("seats", "votes", "end") + 4, Easing.inOut(Easing.cubic));
  const shown = Math.round(SEJM_TOTAL * build);
  // Sejm: every seat in flag red.
  const sejmTint = progress(g, sceneFrom("sejm") + 4, sceneFrom("sejm") + 22);
  // Result: seats go grey, then Law and Justice fills from the right, then everyone else.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 16);
  const firstFill = progress(g, at("result", "Law") - 2, at("result", "first", "end") + 2, Easing.inOut(Easing.quad));
  const othersFill = progress(g, at("result", "without") - 4, at("result", "majority", "end"), Easing.inOut(Easing.quad));
  const majorityP = pop(g, at("result", "first") - 4);
  const line = progress(g, at("result", "first") - 4, at("result", "first") + 12);
  const firstCounter = rise(g, at("result", "Law") - 2) * (1 - progress(g, sceneFrom("govt") - 4, sceneFrom("govt") + 6));
  // Government: only the coalition's seats stay lit.
  const govOnly = progress(g, at("govt", "next") - 4, at("govt", "teamed") + 2);
  const govCounter = rise(g, at("govt", "teamed") - 2);
  // Veto: the line comes back as a majority, swings to three fifths; the governing side fills.
  const vetoLine = progress(g, at("veto", "overriding") - 4, at("veto", "overriding") + 12);
  const vetoLabel = pop(g, at("veto", "overriding") - 2);
  const swing = progress(g, at("veto", "three") - 4, at("veto", "fifths", "end") + 2, Easing.inOut(Easing.cubic));
  const vetoFill = progress(g, at("veto", "more") - 4, at("veto", "government", "end"), Easing.inOut(Easing.quad));
  const vetoCounter = rise(g, at("veto", "more") - 2);

  const firstCount = FIRST.seats * firstFill;
  const seatFill = (i: number) => {
    if (vetoPhase) {
      if (i < GOVERNMENT_TODAY * vetoFill) return GOVERNMENT_NOW[groupOf(GOVERNMENT_NOW_FROM, i)].color;
      return PL.seat;
    }
    const example = EXAMPLE[groupOf(EXAMPLE_FROM, i)].color;
    if (idle <= 0) return interpolateColors(sejmTint, [0, 1], [example, PL.red]);
    if (i >= SEJM_TOTAL - firstCount) return interpolateColors(govOnly, [0, 1], [FIRST.color, PL.faded]);
    const party = RESULT_2023[groupOf(PARTY_FROM, i)];
    if (i < FIRST_FROM * othersFill && party !== FIRST) return party.gov ? party.color : interpolateColors(govOnly, [0, 1], [party.color, PL.faded]);
    return interpolateColors(idle, [0, 1], [PL.red, PL.seat]);
  };

  const s = pose.s;
  // The majority line (and in the veto scene, the line that swings to three fifths).
  const lineP = vetoPhase ? vetoLine : line;
  const lineOn = vetoPhase ? 1 : toResult * (1 - toPresident);
  const theta = vetoPhase ? interpolate(swing, [0, 1], [lineAngle(SEJM_MAJORITY), lineAngle(OVERRIDE)]) : lineAngle(SEJM_MAJORITY);
  const outer = { x: pose.cx + (R_OUT + 16) * s * Math.cos(theta), y: pose.cy - (R_OUT + 16) * s * Math.sin(theta) };
  const inner = { x: pose.cx + (R_IN - 14) * s * Math.cos(theta), y: pose.cy - (R_IN - 14) * s * Math.sin(theta) };
  const lineEnd = { x: outer.x + (inner.x - outer.x) * lineP, y: outer.y + (inner.y - outer.y) * lineP };
  const labelP = vetoPhase ? vetoLabel : majorityP;
  const labelBg = vetoPhase ? interpolateColors(swing, [0, 1], [C.ink, PL.red]) : C.ink;
  const lineColor = vetoPhase ? interpolateColors(swing, [0, 1], [C.ink, PL.red]) : C.ink;

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
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={SEJM_DOT} fill={seatFill} visible={(i) => build * (SEJM_TOTAL + 1) - i} />
      </div>

      {/* Centre counter: seats filled (seats), PiS's 194 (result), the coalition's 248 (government), the governing side (veto). */}
      {[
        { key: "example", p: progress(g, at("seats", "share") - 4, at("seats", "share") + 6) * (1 - toSejm), value: `${shown}`, label: "seats", color: C.ink },
        { key: "first", p: firstCounter * (vetoPhase ? 0 : 1), value: `${Math.round(firstCount)}`, label: "PiS seats", color: FIRST.color },
        { key: "government", p: govCounter * (1 - toPresident) * (vetoPhase ? 0 : 1), value: `${GOVERNMENT_SEATS}`, label: "seats", color: C.ink },
        { key: "today", p: vetoPhase ? vetoCounter : 0, value: `~${GOVERNMENT_TODAY}`, label: "back the government", color: C.ink },
      ].map(({ key, p, value, label, color }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            left: pose.cx - 220,
            width: 440,
            top: pose.cy - 124 * s,
            textAlign: "center",
            fontFamily: theme.font,
            color: C.ink,
            opacity: p,
            transform: `scale(${s})`,
            transformOrigin: "50% 0",
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color }}>{value}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 2, whiteSpace: "nowrap" }}>{label}</div>
        </div>
      ))}

      {/* The line: crossing it takes 231 of 460 seats (or 276 to override a veto). */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: lineOn }}>
        <line
          x1={outer.x}
          y1={outer.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke={lineColor}
          strokeWidth={5}
          strokeDasharray="12 10"
          strokeLinecap="round"
          opacity={lineP > 0.01 ? 0.8 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: outer.x - 200,
          width: 400,
          top: outer.y - 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: Math.min(1, labelP * 1.4) * lineOn,
          transform: `scale(${0.7 + 0.3 * labelP})`,
          transformOrigin: "50% 100%",
        }}
      >
        <div
          style={{
            padding: "8px 22px",
            borderRadius: 12,
            background: labelBg,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          {vetoPhase && swing > 0.5 ? `3/5 · ${OVERRIDE}` : `MAJORITY · ${SEJM_MAJORITY}`}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={labelBg} />
        </svg>
      </div>
    </div>
  );
};
