import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, ELECTION_DATE, FONT, MAJORITY, RESULT_2026, RS, VOTERS, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 8, rIn: 130, rOut: 300, dot: 7.6 } as const;
const SEATS = hemicycleSeats(ASSEMBLY, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 900 } as const;
/** First seat index of each list (left to right). */
const LIST_FROM = RESULT_2026.map((_, i) => RESULT_2026.slice(0, i).reduce((n, p) => n + p.seats, 0));
const listOf = (i: number) => RESULT_2026[LIST_FROM.filter((f) => i >= f).length - 1];
const STUDENTS = RESULT_2026.find((p) => p.key === "SL")!;
const UNITED = RESULT_2026.find((p) => p.key === "US")!;
/** Seats of the lists that step back while one list is highlighted. */
const FADED = "#DCD5C6";
const LEGEND = { top: 966, row: 46 } as const;

/**
 * "In October 2026, the Student List won 140 seats, and Vučić's list 104." On paper so the
 * colours read clearly: the new Assembly fills list by list, the Student List stays lit with a
 * big 140, then Vučić's United Serbia with 104, then all come back with the legend and two pills:
 * a majority on its own (126 needed) and the highest turnout in over 30 years.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const build = progress(frame, 6, cue("result", "Student") - 2, Easing.inOut(Easing.quad));
  const studentsOn = progress(frame, cue("result", "Student") - 2, cue("result", "won") + 2);
  const unitedOn = progress(frame, cue("result", "Vučić's") - 4, cue("result", "Vučić's") + 4);
  const allBack = progress(frame, cue("result", "104", "end") - 2, cue("result", "104", "end") + 8);
  const bigStudents = pop(frame, cue("result", "140") - 4);
  const bigUnited = pop(frame, cue("result", "104") - 4);
  const legend = rise(frame, cue("result", "seats") + 2);
  const majority = pop(frame, cue("result", "seats") + 6);
  const turnout = pop(frame, cue("result", "104") - 2);

  const lit = (key: string) => (key === STUDENTS.key ? 1 - unitedOn : key === UNITED.key ? unitedOn : 0);
  const seatFill = (i: number) => {
    const p = listOf(i);
    const focus = Math.max(studentsOn, unitedOn) * (1 - allBack);
    const keep = Math.max(lit(p.key), allBack);
    return interpolateColors(focus * (1 - keep), [0, 1], [p.color, FADED]);
  };
  const seatVisible = (i: number) => build * (ASSEMBLY + 1) - i;
  const { cx, cy } = CHAMBER;
  const big = (label: string, share: string, color: string, p: number, fade: number) => (
    <div style={{ position: "absolute", left: cx - 220, width: 440, top: cy - 112, textAlign: "center", opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - fade) }}>
      <div style={{ fontFamily: FONT.display, fontSize: 92, lineHeight: 1, color, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 80%" }}>{label}</div>
      <Mono size={18} color={RS.ink} style={{ marginTop: 10, letterSpacing: 2.5 }}>
        {share} OF THE VOTE
      </Mono>
    </div>
  );
  const pill = (text: string, bg: string, p: number) => (
    <div
      style={{
        padding: "12px 22px",
        borderRadius: 999,
        background: bg,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: 2.2,
        color: RS.white,
        whiteSpace: "nowrap",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
        transformOrigin: "left center",
      }}
    >
      {text}
    </div>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        08 — SNAP ELECTION, {ELECTION_DATE}
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        The new Assembly — preliminary official count.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={seatVisible} />
        {big(String(STUDENTS.seats), STUDENTS.share, STUDENTS.color, bigStudents, unitedOn)}
        {big(String(UNITED.seats), UNITED.share, UNITED.color, bigUnited, allBack)}
      </div>

      <div style={{ position: "absolute", left: 120, top: LEGEND.top, width: 840, ...riseStyle(legend, exit, 30) }}>
        {[STUDENTS, UNITED, RESULT_2026.find((p) => p.key === "MIN")!].map((p, i) => (
          <div key={p.key} style={{ position: "absolute", left: 0, top: i * LEGEND.row, width: 840, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.body }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 26, fontWeight: 700, color: RS.ink, whiteSpace: "nowrap" }}>{p.name}</div>
            <div style={{ fontSize: 27, fontWeight: 800, color: RS.ink }}>{p.seats}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 1124, width: 840, display: "flex", flexWrap: "wrap", gap: 14, opacity: 1 - exit }}>
        {pill(`MAJORITY ON ITS OWN (${MAJORITY} NEEDED)`, RS.red, majority)}
        {pill(`TURNOUT ${VOTERS.turnout} · HIGHEST IN 30+ YEARS`, RS.blue, turnout)}
      </div>
    </>
  );
};
