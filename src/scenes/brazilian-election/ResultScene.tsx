import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, CHAMBER, DATES, FONT, PL_SENATE, RESULT_2026, ROUND_1, RUN_OFF, SENATE, type SceneProps } from "./constants";
import { Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 10, rIn: 150, rOut: 290, dot: 5.3 } as const;
const SEATS = hemicycleSeats(CHAMBER, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CENTER = { cx: 540, cy: 1110 } as const;
const PRES = { top: 478, height: 290 } as const;
const PBAR = { left: 250, per: 8.6, h: 32 } as const;
/** First seat index of each group (left to right). */
const GROUP_FROM = RESULT_2026.map((_, i) => RESULT_2026.slice(0, i).reduce((n, p) => n + p.seats, 0));
const groupOf = (i: number) => RESULT_2026[GROUP_FROM.filter((f) => i >= f).length - 1];
/** Seats that step back while the PL is highlighted. */
const FADED = "#D8D1C2";
const PL = RESULT_2026.find((g) => g.party)!;

/**
 * "In 2026, Lula trailed Flávio Bolsonaro in round one, then won the run-off with 51.8%. But
 * Bolsonaro's party won the most seats in both houses." On paper so the colours read clearly: a
 * presidential card where the round-one bars grow on "trailed" (Bolsonaro 47.0, Lula 45.2), the
 * run-off bars on "won the run-off" (Lula 51.8, Bolsonaro 48.2) with a 4TH TERM chip on "51.8%";
 * then the new 513-seat Chamber fills, the PL lights up with 121 on "most seats", and a SENATE
 * chip (28 of 81) pops on "both houses".
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const pres = rise(frame, cue("result", "Lula") - 10);
  const grow1 = progress(frame, cue("result", "trailed") - 4, cue("result", "one") + 4, Easing.out(Easing.cubic));
  const grow2 = progress(frame, cue("result", "won") - 4, cue("result", "run-off") + 8, Easing.out(Easing.cubic));
  const win = pop(frame, cue("result", "51.8%") - 2);
  const build = progress(frame, cue("result", "But") - 14, cue("result", "party") + 6, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "most") - 4, cue("result", "seats") + 4);
  const big = pop(frame, cue("result", "most") - 3);
  const legend = rise(frame, cue("result", "But") - 8);
  const senate = pop(frame, cue("result", "both") - 2);

  const seatFill = (i: number) => {
    const g = groupOf(i);
    return g.party ? g.color : interpolateColors(focus, [0, 1], [g.color, FADED]);
  };
  const { cx, cy } = CENTER;

  const race = (label: string, rows: readonly { name: string; share: number; color: string }[], top: number, grow: number, winner: boolean) => (
    <>
      <Mono size={16} color={BR.inkSoft} style={{ position: "absolute", left: 30, top, letterSpacing: 2.5, opacity: Math.min(1, grow * 3) }}>
        {label}
      </Mono>
      {rows.map((c, i) => (
        <div key={c.name} style={{ position: "absolute", left: 0, top: top + 30 + i * 42, width: 840, height: PBAR.h, opacity: Math.min(1, grow * 3) }}>
          <div style={{ position: "absolute", left: 30, top: 5, fontFamily: FONT.mono, fontWeight: 700, fontSize: 19, letterSpacing: 1.2, color: BR.ink }}>{c.name}</div>
          <div style={{ position: "absolute", left: PBAR.left, top: 0, height: PBAR.h, width: c.share * PBAR.per * grow, borderRadius: 7, background: c.color }} />
          <div style={{ position: "absolute", left: PBAR.left + c.share * PBAR.per * grow + 12, top: 0, fontFamily: FONT.display, fontSize: 23, lineHeight: `${PBAR.h}px`, color: BR.ink }}>
            {(c.share * Math.min(1, grow)).toFixed(1)}%
          </div>
          {winner && i === 0 && (
            <div
              style={{
                position: "absolute",
                right: 24,
                top: -40,
                height: PBAR.h + 4,
                padding: "0 14px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                background: BR.green,
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1.5,
                color: BR.white,
                whiteSpace: "nowrap",
                opacity: Math.min(1, Math.max(0, win) * 1.5),
                transform: `scale(${0.6 + 0.4 * win}) rotate(-3deg)`,
                transformOrigin: "left center",
              }}
            >
              WINS · 4TH TERM
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
        07 — ELECTION, OCT 2026
      </Eyebrow>
      <Headline light size={120} style={{ top: 344, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>

      {/* The presidential race, both rounds. */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: PRES.top,
          width: 840,
          height: PRES.height,
          borderRadius: 24,
          background: BR.card,
          border: `3px solid ${BR.green}`,
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,40,26,0.14)",
          fontFamily: FONT.body,
          ...riseStyle(pres, exit, 40),
        }}
      >
        {race(`ROUND ONE · ${DATES.round1}`, ROUND_1, 22, grow1, false)}
        {race(`RUN-OFF · ${DATES.runOff}`, RUN_OFF, 152, grow2, true)}
      </div>

      {/* The Chamber of Deputies. */}
      <div style={{ position: "absolute", left: 120, top: 790, width: 840, display: "flex", justifyContent: "space-between", ...riseStyle(legend, exit, 20) }}>
        {RESULT_2026.map((g) => (
          <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 19, fontWeight: 700, color: BR.ink, whiteSpace: "nowrap", opacity: g.party ? 1 : 1 - 0.45 * focus }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: g.color }} />
            {g.name} {g.seats}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={(i) => build * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - 112, textAlign: "center", opacity: Math.min(1, Math.max(0, big) * 1.5) }}>
          <div style={{ fontFamily: FONT.display, fontSize: 86, lineHeight: 1, color: PL.color, transform: `scale(${0.6 + 0.4 * big})`, transformOrigin: "50% 80%" }}>{PL.seats}</div>
          <Mono size={15} color={BR.inkSoft} style={{ marginTop: 6, letterSpacing: 2 }}>
            OF {CHAMBER} DEPUTIES · PL
          </Mono>
        </div>
        <div style={{ position: "absolute", left: 120, top: 1136, width: 840, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: Math.min(1, Math.max(0, senate) * 1.5) }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: PL.color,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: 1.5,
              color: BR.white,
              whiteSpace: "nowrap",
              boxShadow: "0 12px 24px rgba(10,30,60,0.25)",
              transform: `scale(${0.6 + 0.4 * senate}) rotate(-2deg)`,
            }}
          >
            SENATE: {PL_SENATE} OF {SENATE}
          </div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 17, letterSpacing: 1.5, color: BR.inkSoft, whiteSpace: "nowrap" }}>BIGGEST IN BOTH · NO MAJORITY</div>
        </div>
      </div>
    </>
  );
};
