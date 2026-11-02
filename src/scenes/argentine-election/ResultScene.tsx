import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, CHAMBER, CHAMBER_2025, DATES, FONT, LLA_2025, LLA_SENATE, MAJORITY, ROUND_1, RUN_OFF, SENATE, type SceneProps } from "./constants";
import { Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 8, rIn: 150, rOut: 290, dot: 7.4 } as const;
const SEATS = hemicycleSeats(CHAMBER, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CENTER = { cx: 540, cy: 1150 } as const;
const PRES = { top: 466, height: 318 } as const;
const PBAR = { left: 220, per: 8.6, h: 30 } as const;
/** First seat index of each group (left to right). */
const GROUP_FROM = CHAMBER_2025.map((_, i) => CHAMBER_2025.slice(0, i).reduce((n, p) => n + p.seats, 0));
const groupOf = (i: number) => CHAMBER_2025[GROUP_FROM.filter((f) => i >= f).length - 1];
/** Seats that step back while Milei's bloc is highlighted. */
const FADED = "#D8D1C2";
const LLA = CHAMBER_2025.find((g) => g.party)!;

/**
 * "In 2023, Javier Milei won the run-off with 55.7%. In 2025, his party won the midterms, but still
 * has no majority." On paper so the colours read clearly: a presidential card where the round-one
 * bars grow on "2023" (Massa 36.8, Milei 30.0, Bullrich 23.8), the run-off bars on "won the
 * run-off" (Milei 55.7, Massa 44.3) with a WINS chip on "55.7%"; then the 257-seat Chamber fills on
 * "2025", Milei's La Libertad Avanza lights up (95, the biggest bloc) with a 40.8% · 1ST chip on
 * "midterms", and NO MAJORITY (129 needed) plus the Senate (21 of 72) pop on "majority".
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const pres = rise(frame, cue("result", "2023") - 10);
  const grow1 = progress(frame, cue("result", "2023") - 4, cue("result", "Milei") + 4, Easing.out(Easing.cubic));
  const grow2 = progress(frame, cue("result", "won") - 4, cue("result", "run-off") + 8, Easing.out(Easing.cubic));
  const win = pop(frame, cue("result", "55.7%") - 2);
  const legend = rise(frame, cue("result", "2025") - 8);
  const build = progress(frame, cue("result", "2025") - 10, cue("result", "party") + 4, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "won#2") - 4, cue("result", "midterms") + 2);
  const big = pop(frame, cue("result", "won#2") - 3);
  const first = pop(frame, cue("result", "midterms") - 2);
  const none = pop(frame, cue("result", "majority") - 3);

  const seatFill = (i: number) => {
    const g = groupOf(i);
    return g.party ? g.color : interpolateColors(focus, [0, 1], [g.color, FADED]);
  };
  const { cx, cy } = CENTER;

  const race = (label: string, rows: readonly { name: string; share: number; color: string }[], top: number, grow: number, winner: boolean) => (
    <>
      <Mono size={16} color={AR.inkSoft} style={{ position: "absolute", left: 30, top, letterSpacing: 2.5, opacity: Math.min(1, grow * 3) }}>
        {label}
      </Mono>
      {rows.map((c, i) => (
        <div key={c.name} style={{ position: "absolute", left: 0, top: top + 30 + i * 38, width: 840, height: PBAR.h, opacity: Math.min(1, grow * 3) }}>
          <div style={{ position: "absolute", left: 30, top: 4, fontFamily: FONT.mono, fontWeight: 700, fontSize: 19, letterSpacing: 1.2, color: AR.ink }}>{c.name}</div>
          <div style={{ position: "absolute", left: PBAR.left, top: 0, height: PBAR.h, width: c.share * PBAR.per * grow, borderRadius: 7, background: c.color }} />
          <div style={{ position: "absolute", left: PBAR.left + c.share * PBAR.per * grow + 12, top: 0, fontFamily: FONT.display, fontSize: 22, lineHeight: `${PBAR.h}px`, color: AR.ink }}>
            {(c.share * Math.min(1, grow)).toFixed(1)}%
          </div>
          {winner && i === 0 && (
            <div
              style={{
                position: "absolute",
                right: 24,
                top: -36,
                height: PBAR.h + 2,
                padding: "0 14px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                background: AR.blue,
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1.5,
                color: AR.white,
                whiteSpace: "nowrap",
                opacity: Math.min(1, Math.max(0, win) * 1.5),
                transform: `scale(${0.6 + 0.4 * win}) rotate(-3deg)`,
                transformOrigin: "left center",
              }}
            >
              PRESIDENT
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        07 — ELECTIONS 2023 & 2025
      </Eyebrow>
      <Headline light size={120} style={{ top: 344, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>

      {/* The presidential race of 2023, both rounds. */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: PRES.top,
          width: 840,
          height: PRES.height,
          borderRadius: 24,
          background: AR.card,
          border: `3px solid ${AR.celeste}`,
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,30,60,0.14)",
          fontFamily: FONT.body,
          ...riseStyle(pres, exit, 40),
        }}
      >
        {race(`ROUND ONE · ${DATES.round1}`, ROUND_1, 20, grow1, false)}
        {race(`RUN-OFF · ${DATES.runOff}`, RUN_OFF, 190, grow2, true)}
      </div>

      {/* The Chamber of Deputies after the 2025 midterms. */}
      <div style={{ position: "absolute", left: 120, top: 806, width: 840, display: "flex", justifyContent: "space-between", alignItems: "center", ...riseStyle(legend, exit, 20) }}>
        <Mono size={16} color={AR.inkSoft} style={{ letterSpacing: 2 }}>
          MIDTERMS · {DATES.midterms}
        </Mono>
        <div style={{ display: "flex", gap: 22 }}>
          {CHAMBER_2025.map((g) => (
            <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 19, fontWeight: 700, color: AR.ink, whiteSpace: "nowrap", opacity: g.party ? 1 : 1 - 0.45 * focus }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: g.color }} />
              {g.name} {g.seats}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={(i) => build * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - 118, textAlign: "center", opacity: Math.min(1, Math.max(0, big) * 1.5) }}>
          <div style={{ fontFamily: FONT.display, fontSize: 86, lineHeight: 1, color: LLA.color, transform: `scale(${0.6 + 0.4 * big})`, transformOrigin: "50% 80%" }}>{LLA.seats}</div>
          <Mono size={15} color={AR.inkSoft} style={{ marginTop: 6, letterSpacing: 2 }}>
            OF {CHAMBER} · BIGGEST BLOC
          </Mono>
        </div>
        {/* Milei's party first in the 2025 vote. */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 862,
            padding: "10px 16px",
            borderRadius: 14,
            background: LLA.color,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1.5,
            color: AR.white,
            whiteSpace: "nowrap",
            boxShadow: "0 12px 24px rgba(40,20,60,0.25)",
            opacity: Math.min(1, Math.max(0, first) * 1.5),
            transform: `scale(${0.6 + 0.4 * first}) rotate(3deg)`,
          }}
        >
          LLA {LLA_2025} · 1ST
        </div>
        <div style={{ position: "absolute", left: 120, top: 1190, width: 840, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: Math.min(1, Math.max(0, none) * 1.5) }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: AR.sun,
              fontFamily: FONT.display,
              fontSize: 26,
              color: AR.navy,
              whiteSpace: "nowrap",
              boxShadow: "0 12px 24px rgba(10,30,60,0.2)",
              transform: `scale(${0.6 + 0.4 * none}) rotate(-2deg)`,
            }}
          >
            NO MAJORITY: {MAJORITY} NEEDED
          </div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 17, letterSpacing: 1.5, color: AR.inkSoft, whiteSpace: "nowrap" }}>
            SENATE: {LLA_SENATE} OF {SENATE}
          </div>
        </div>
      </div>
    </>
  );
};
