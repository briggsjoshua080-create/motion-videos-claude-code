import React from "react";
import { Easing, interpolateColors, random, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { Hemicycle, hemicycleSeats } from "../../../components/Hemicycle";
import { BudgetIcon, LawIcon, ParliamentIcon } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import {
  COUNTRY_SEATS,
  EP_MAJORITY,
  EP_SEATS,
  EU,
  GROUPS_2024,
  PALETTE as C,
  groupOfSeat,
  type SceneProps,
} from "../constants";
import { IconTile, JobCard, Pill } from "../ui";

const CX = 540;
const CY = 838;
const R_IN = 150;
const R_OUT = 400;
const DOT = 6.4;
const SEATS = hemicycleSeats(EP_SEATS, 14, R_IN, R_OUT);

/** Country of each seat in the "seated by country" pattern (largest countries first). */
const COUNTRY_OF_SEAT: number[] = COUNTRY_SEATS.flatMap(([, n], c) => Array.from({ length: n }, () => c));
/** Labels for the five largest countries, at the middle of their wedge. */
const COUNTRY_LABELS = COUNTRY_SEATS.slice(0, 5).map(([code], c) => {
  const idx = COUNTRY_OF_SEAT.map((cc, i) => (cc === c ? i : -1)).filter((i) => i >= 0);
  const theta = idx.reduce((sum, i) => sum + SEATS[i].theta, 0) / idx.length;
  return { code, x: CX + (R_OUT + 40) * Math.cos(theta), y: CY - (R_OUT + 40) * Math.sin(theta) };
});
const EPP = GROUPS_2024.findIndex((g) => g.key === "epp");
/** Seat-specific delay (frames) so the seats re-sort in a ripple, not all at once. */
const SHUFFLE = SEATS.map((_, i) => Math.floor(random(`eu-seat-${i}`) * 16));

/**
 * "Together, that's 720 MEPs: members of the European Parliament. They sit in political groups, not
 * by country. Parliament votes on EU laws and the EU budget. In June 2024, the centre-right EPP won
 * the most seats: 188. But a majority needs 361, so groups team up."
 */
export const ParliamentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);

  // 720 seats sweep in, still "by country".
  const build = progress(frame, cue("meps", "Together") - 2, cue("meps", "MEPs") + 4, Easing.inOut(Easing.cubic));
  const counter = rise(frame, cue("meps", "Together") - 2);
  const label = rise(frame, cue("meps", "European") - 6);
  const countryLabels = rise(frame, cue("meps", "720")) * (1 - progress(frame, cue("groups", "political") - 4, cue("groups", "political") + 6));

  // Re-sorted into political groups.
  const groupsAt = cue("groups", "political") - 4;
  const groupChip = pop(frame, cue("groups", "not") - 4);
  const groupChipOut = progress(frame, cue("result", "June") - 6, cue("result", "June") + 4);

  // What Parliament does.
  const laws = pop(frame, cue("job", "laws") - 4);
  const budget = pop(frame, cue("job", "budget") - 4);
  const jobsOut = progress(frame, cue("result", "June") - 6, cue("result", "June") + 4);

  // 2024 result.
  const legend = rise(frame, cue("result", "2024") - 6);
  const epp = progress(frame, cue("result", "EPP") - 4, cue("result", "EPP") + 8);
  const eppNum = pop(frame, cue("result", "188") - 4);
  const majorityP = pop(frame, cue("result", "majority") - 4);
  const line = progress(frame, cue("result", "majority") - 2, cue("result", "361") + 6);
  const team = pop(frame, cue("result", "team") - 4);
  const undim = progress(frame, cue("result", "team") - 2, cue("result", "up") + 8);
  const labelOut = progress(frame, cue("result", "team") - 8, cue("result", "team") - 2);

  const seatFill = (i: number) => {
    const g = groupOfSeat(i);
    const byCountry = COUNTRY_OF_SEAT[i] % 2 === 0 ? EU.seat : EU.seatAlt;
    const sorted = progress(frame, groupsAt + SHUFFLE[i], groupsAt + SHUFFLE[i] + 6);
    let color = interpolateColors(sorted, [0, 1], [byCountry, GROUPS_2024[g].color]);
    if (g === EPP) color = interpolateColors(epp, [0, 1], [color, EU.yellow]);
    else color = interpolateColors(epp * (1 - undim) * 0.75, [0, 1], [color, EU.seat]);
    return color;
  };

  // Centre: the seat counter, then "2024 · election result", then the EPP's 188 seats.
  const phase = frame < cue("result", "June") - 4 ? "count" : epp < 0.5 ? "year" : "epp";
  const centreValue = phase === "count" ? Math.round(EP_SEATS * build) : phase === "year" ? 2024 : GROUPS_2024[EPP].seats;
  const centreLabel = phase === "count" ? "MEPs" : phase === "year" ? "election result" : "EPP seats";
  const centrePulse = 1 + 0.12 * Math.sin(Math.PI * Math.min(1, Math.max(0, eppNum)));
  const top = CY - R_OUT - DOT * 2;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
      <Hemicycle seats={SEATS} cx={CX} cy={CY} dot={DOT} fill={seatFill} visible={(i) => build * (EP_SEATS + 30) - i} />

      {COUNTRY_LABELS.map((l) => (
        <div
          key={l.code}
          style={{
            position: "absolute",
            left: l.x - 34,
            top: l.y - 22,
            width: 68,
            textAlign: "center",
            fontFamily: theme.font,
            fontSize: 30,
            fontWeight: 800,
            color: C.inkSoft,
            opacity: countryLabels,
          }}
        >
          {l.code}
        </div>
      ))}

      {/* Centre number */}
      <div
        style={{
          position: "absolute",
          left: CX - 160,
          width: 320,
          top: CY - 138,
          textAlign: "center",
          fontFamily: theme.font,
          color: C.ink,
          opacity: counter,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -3,
            color: phase === "epp" ? EU.yellowDeep : C.ink,
            transform: `scale(${phase === "epp" ? centrePulse : 1})`,
          }}
        >
          {centreValue}
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 6 }}>{centreLabel}</div>
      </div>

      {/* Majority line and tag */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={CX}
          y1={top + 10}
          x2={CX}
          y2={top + 10 + (R_OUT - R_IN + 16) * line}
          stroke={EU.blue}
          strokeWidth={6}
          strokeDasharray="14 10"
          strokeLinecap="round"
          opacity={line > 0.01 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: CX - 200,
          width: 400,
          top: top - 52,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: Math.min(1, majorityP * 1.4),
          transform: `scale(${0.7 + 0.3 * majorityP})`,
        }}
      >
        <div
          style={{
            padding: "8px 22px",
            borderRadius: 12,
            background: EU.blue,
            color: C.white,
            fontFamily: theme.font,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          MAJORITY · {EP_MAJORITY}
        </div>
        <svg width={28} height={14} viewBox="0 0 28 14">
          <path d="M0 0 L28 0 L14 14 Z" fill={EU.blue} />
        </svg>
      </div>

      {/* "By political group, not by country" */}
      <div style={{ position: "absolute", top: 346, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - groupChipOut }}>
        <Pill p={groupChip} bg={C.card} border={C.line} size={30} style={{ boxShadow: "0 12px 30px rgba(15,27,61,0.12)" }}>
          Seated by <span style={{ color: EU.blue }}>political group</span>, not by country
        </Pill>
      </div>

      {/* European Parliament label */}
      <div
        style={{
          position: "absolute",
          top: CY + 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          fontFamily: theme.font,
          ...riseStyle(label, labelOut, 24),
        }}
      >
        <ParliamentIcon width={96} palette={C} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.ink, letterSpacing: -1 }}>European Parliament</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>720 MEPs · elected every 5 years</div>
        </div>
      </div>

      {/* EPP 188 + other groups -> 361 */}
      <div
        style={{
          position: "absolute",
          top: CY + 44,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: theme.font,
          fontSize: 34,
          fontWeight: 800,
          color: C.inkSoft,
        }}
      >
        <Pill p={team} bg={EU.yellow} color={C.ink} size={32}>
          EPP 188
        </Pill>
        <span style={{ opacity: Math.min(1, team * 1.4) }}>+</span>
        <Pill p={team} bg={C.paperDeep} border={C.line} size={32}>
          other groups
        </Pill>
        <span style={{ opacity: Math.min(1, team * 1.4) }}>→</span>
        <Pill p={team} bg={EU.blue} color={C.white} size={32}>
          {EP_MAJORITY}
        </Pill>
      </div>

      {/* What Parliament does */}
      <JobCard
        left={120}
        top={CY + 168}
        width={408}
        p={laws}
        out={jobsOut}
        icon={
          <IconTile size={84}>
            <LawIcon size={62} palette={C} />
          </IconTile>
        }
        label={
          <>
            Votes on
            <br />
            EU laws
          </>
        }
      />
      <JobCard
        left={552}
        top={CY + 168}
        width={408}
        p={budget}
        out={jobsOut}
        icon={
          <IconTile size={84}>
            <BudgetIcon size={62} palette={C} />
          </IconTile>
        }
        label={
          <>
            Votes on the
            <br />
            EU budget
          </>
        }
      />

      {/* 2024 result legend */}
      <div
        style={{
          position: "absolute",
          top: CY + 150,
          left: 120,
          width: 840,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          rowGap: 12,
          columnGap: 10,
          fontFamily: theme.font,
          ...riseStyle(legend, 0, 24),
        }}
      >
        {GROUPS_2024.map((g, i) => {
          const isEpp = i === EPP;
          return (
            <div
              key={g.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px",
                borderRadius: 14,
                background: isEpp ? interpolateColors(epp, [0, 1], ["rgba(255,229,138,0)", EU.yellowSoft]) : "transparent",
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 12, background: isEpp ? interpolateColors(epp, [0, 1], [g.color, EU.yellow]) : g.color, flexShrink: 0 }} />
              <div style={{ fontSize: 28, fontWeight: isEpp ? 800 : 700, color: C.ink, whiteSpace: "nowrap" }}>
                {g.name} <span style={{ color: C.inkSoft, fontWeight: 600 }}>{g.seats}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: CY + 330,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 26,
          fontWeight: 600,
          color: C.inkSoft,
          ...riseStyle(legend, 0, 24),
        }}
      >
        Seats after the June 2024 election · EPP = European People's Party
      </div>
    </div>
  );
};
