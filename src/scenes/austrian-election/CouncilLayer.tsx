import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise } from "../../components/explainer/motion";
import {
  AT,
  COUNCIL_DOT,
  COUNCIL_MAJORITY,
  COUNCIL_POSE as POSE,
  COUNCIL_R_OUT as R_OUT,
  COUNCIL_TOTAL,
  EXAMPLE,
  FIRST,
  GOVERNMENT_SEATS,
  PALETTE as C,
  RESULT_2024,
  at,
  sceneFrom,
} from "./constants";

const R_IN = 190;
const SEATS = hemicycleSeats(COUNCIL_TOTAL, 7, R_IN, R_OUT);
/** Seats that fade when only the new government is highlighted. */
const FADED = "#E4E8ED";

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
const PARTY_FROM = starts(RESULT_2024.map((p) => p.seats));
/** The FPÖ holds the right-hand end of the half-circle. */
const FIRST_FROM = COUNCIL_TOTAL - FIRST.seats;
const groupOf = (from: number[], i: number) => from.filter((f) => i >= f).length - 1;

/**
 * The National Council as one 183-seat half-circle that lives from "Seats are shared out by votes"
 * to the end of the talks: it fills with the made-up parties A–D by their votes, turns red as the
 * National Council, steps left beside the Federal Council, returns for the 2024 result (the FPÖ from
 * the right, short of the 92-seat majority line, then everyone else), shrinks to the top for the talks
 * (the new government's 110 seats stay lit) and fades out when the President comes in.
 * Works in composition frames (`offset` = the Sequence's start frame).
 */
export const CouncilLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  // Movement between scenes
  const toCouncil = progress(g, sceneFrom("council") - 2, sceneFrom("council") + 20);
  const toFederal = progress(g, sceneFrom("federal") - 2, sceneFrom("federal") + 20);
  const toResult = progress(g, sceneFrom("result") - 2, sceneFrom("result") + 20);
  const toTalks = progress(g, sceneFrom("talks") - 2, sceneFrom("talks") + 20);
  const toPresident = progress(g, sceneFrom("president") - 2, sceneFrom("president") + 14);
  const pose = [
    [POSE.council, toCouncil],
    [POSE.federal, toFederal],
    [POSE.result, toResult],
    [POSE.talks, toTalks],
    [POSE.president, toPresident],
  ].reduce<Pose>((p, [next, t]) => blend(p, next as Pose, t as number), POSE.seats);

  // Seats scene: parties A–D fill left to right as the votes are shared out.
  const build = progress(g, at("seats", "shared") - 4, at("seats", "votes", "end") + 6, Easing.inOut(Easing.cubic));
  const shown = Math.round(COUNCIL_TOTAL * build);
  // National Council: every seat in flag red.
  const councilTint = progress(g, sceneFrom("council") + 4, sceneFrom("council") + 22);
  // Result: seats go grey, then the FPÖ fills from the right, then everyone else.
  const idle = progress(g, sceneFrom("result") + 2, sceneFrom("result") + 16);
  const firstFill = progress(g, at("result", "Freedom") - 2, at("result", "first", "end") + 2, Easing.inOut(Easing.quad));
  const othersFill = progress(g, at("result", "far") - 4, at("result", "majority", "end"), Easing.inOut(Easing.quad));
  const majorityP = pop(g, at("result", "first") - 4);
  const line = progress(g, at("result", "first") - 4, at("result", "first") + 12);
  const firstCounter = rise(g, at("result", "Freedom") - 2) * (1 - progress(g, sceneFrom("talks") - 4, sceneFrom("talks") + 6));
  // Talks: only the new government's seats stay lit.
  const govOnly = progress(g, at("talks", "three") - 4, at("talks", "teamed") + 2);
  const govCounter = rise(g, at("talks", "teamed") - 2);

  const firstCount = FIRST.seats * firstFill;
  const seatFill = (i: number) => {
    const example = EXAMPLE[groupOf(EXAMPLE_FROM, i)].color;
    if (idle <= 0) return interpolateColors(councilTint, [0, 1], [example, AT.red]);
    if (i >= COUNCIL_TOTAL - firstCount) return interpolateColors(govOnly, [0, 1], [FIRST.color, FADED]);
    const party = RESULT_2024[groupOf(PARTY_FROM, i)];
    if (i < FIRST_FROM * othersFill && party !== FIRST) return party.gov ? party.color : interpolateColors(govOnly, [0, 1], [party.color, FADED]);
    return interpolateColors(idle, [0, 1], [AT.red, AT.seat]);
  };

  const s = pose.s;
  const top = pose.cy - (R_OUT + 24) * s;
  const overlays = toResult * (1 - toPresident);

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
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={COUNCIL_DOT} fill={seatFill} visible={(i) => build * (COUNCIL_TOTAL + 1) - i} />
      </div>

      {/* Centre counter: seats filled (seats scene), the FPÖ's 57 (result), the government's 110 (talks). */}
      {[
        { key: "example", p: progress(g, at("seats", "shared") - 4, at("seats", "shared") + 6) * (1 - toCouncil), value: shown, label: "seats", color: C.ink },
        { key: "first", p: firstCounter, value: Math.round(firstCount), label: "FPÖ seats", color: FIRST.color },
        { key: "government", p: govCounter * (1 - toPresident), value: GOVERNMENT_SEATS, label: "seats", color: C.ink },
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

      {/* Majority line through the middle: crossing it takes 92 of 183 seats. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: overlays }}>
        <line
          x1={pose.cx}
          y1={top + 14}
          x2={pose.cx}
          y2={top + 14 + (pose.cy - top - (R_IN - 14) * s) * line}
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
          opacity: Math.min(1, majorityP * 1.4) * overlays,
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
          MAJORITY · {COUNCIL_MAJORITY}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={C.ink} />
        </svg>
      </div>
    </div>
  );
};
