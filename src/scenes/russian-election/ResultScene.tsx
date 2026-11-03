import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DATES, DUMA, DUMA_2026, FONT, PRES_2024, RU, TURNOUT_2024, TURNOUT_2026, TWO_THIRDS, UR_LIST_2026, type SceneProps } from "./constants";
import { Eyebrow, Headline, Mono, PaperLayer, Stamp } from "./ui";

const LAYOUT = { rows: 10, rIn: 130, rOut: 280, dot: 6.2 } as const;
const SEATS = hemicycleSeats(DUMA, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CENTER = { cx: 540, cy: 1166 } as const;
const PRES = { top: 466, height: 236 } as const;
const PBAR = { left: 240, per: 5.6, h: 28 } as const;
/** First seat index of each group (left to right). */
const GROUP_FROM = DUMA_2026.map((_, i) => DUMA_2026.slice(0, i).reduce((n, p) => n + p.seats, 0));
const groupOf = (i: number) => DUMA_2026[GROUP_FROM.filter((f) => i >= f).length - 1];
/** Seats that step back while United Russia is highlighted. */
const FADED = "#D8D1C2";
const UR = DUMA_2026.find((g) => g.ruling)!;

/**
 * "In 2024, Putin won with 87%. In 2026, United Russia took 349 of 450 seats, with the main liberal
 * party barred." On paper so the colours read clearly: the 2024 presidential bars grow on "2024"
 * (Putin 87.3, Kharitonov 4.3, Davankov 3.9, Slutsky 3.2) with a WINS chip on "87%"; then the
 * 450-seat Duma fills on "2026", United Russia lights up on "United Russia" with 349 popping on
 * "349" and an OVER TWO-THIRDS chip on "450"; a BARRED stamp (Yabloko) slams on "barred".
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const pres = rise(frame, cue("result", "2024") - 10);
  const grow = progress(frame, cue("result", "2024") - 4, cue("result", "87%") + 4, Easing.out(Easing.cubic));
  const win = pop(frame, cue("result", "87%") - 2);
  const legend = rise(frame, cue("result", "2026") - 8);
  const build = progress(frame, cue("result", "2026") - 10, cue("result", "Russia") + 4, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "United") - 2, cue("result", "took") + 2);
  const big = pop(frame, cue("result", "349") - 3);
  const third = pop(frame, cue("result", "450") - 2);
  const barred = pop(frame, cue("result", "barred") - 3);
  const note = rise(frame, cue("result", "barred") + 6);

  const seatFill = (i: number) => {
    const g = groupOf(i);
    return g.ruling ? g.color : interpolateColors(focus, [0, 1], [g.color, FADED]);
  };
  const { cx, cy } = CENTER;

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        07 — ELECTIONS 2024 & 2026
      </Eyebrow>
      <Headline light size={120} style={{ top: 344, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>

      {/* The presidential election of 2024. */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: PRES.top,
          width: 840,
          height: PRES.height,
          borderRadius: 24,
          background: RU.card,
          border: `3px solid ${RU.blue}`,
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,30,60,0.14)",
          fontFamily: FONT.body,
          ...riseStyle(pres, exit, 40),
        }}
      >
        <Mono size={16} color={RU.inkSoft} style={{ position: "absolute", left: 30, top: 20, letterSpacing: 2.5 }}>
          PRESIDENT · {DATES.pres} · TURNOUT {TURNOUT_2024}
        </Mono>
        {PRES_2024.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: 0, top: 56 + i * 40, width: 840, height: PBAR.h, opacity: Math.min(1, grow * 3) }}>
            <div style={{ position: "absolute", left: 30, top: 4, fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, letterSpacing: 1.2, color: RU.ink }}>{c.name}</div>
            <div style={{ position: "absolute", left: PBAR.left, top: 0, height: PBAR.h, width: c.share * PBAR.per * grow, borderRadius: 7, background: c.color }} />
            <div style={{ position: "absolute", left: PBAR.left + c.share * PBAR.per * grow + 12, top: 0, fontFamily: FONT.display, fontSize: 21, lineHeight: `${PBAR.h}px`, color: RU.ink, whiteSpace: "nowrap" }}>
              {(c.share * Math.min(1, grow)).toFixed(1)}%
            </div>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 98,
            padding: "6px 14px",
            borderRadius: 999,
            background: RU.red,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 1.5,
            color: RU.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, win) * 1.5),
            transform: `scale(${0.6 + 0.4 * win}) rotate(-3deg)`,
          }}
        >
          5TH TERM
        </div>
      </div>

      {/* The State Duma after the 2026 election. */}
      <div style={{ position: "absolute", left: 120, top: 724, width: 840, ...riseStyle(legend, exit, 20) }}>
        <Mono size={16} color={RU.inkSoft} style={{ letterSpacing: 2 }}>
          STATE DUMA · {DATES.duma} · TURNOUT {TURNOUT_2026}
        </Mono>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
          {DUMA_2026.map((g) => (
            <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT.body, fontSize: 18, fontWeight: 700, color: RU.ink, whiteSpace: "nowrap", opacity: g.ruling ? 1 : 1 - 0.45 * focus }}>
              <div style={{ width: 15, height: 15, borderRadius: 8, background: g.color }} />
              {g.name} {g.seats}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={(i) => build * (DUMA + 1) - i} />
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - 112, textAlign: "center", opacity: Math.min(1, Math.max(0, big) * 1.5) }}>
          <div style={{ fontFamily: FONT.display, fontSize: 86, lineHeight: 1, color: UR.color, transform: `scale(${0.6 + 0.4 * big})`, transformOrigin: "50% 80%" }}>{UR.seats}</div>
          <Mono size={15} color={RU.inkSoft} style={{ marginTop: 6, letterSpacing: 2 }}>
            OF {DUMA} · UNITED RUSSIA
          </Mono>
        </div>
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 826,
            padding: "10px 16px",
            borderRadius: 14,
            background: UR.color,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 1.5,
            color: RU.white,
            whiteSpace: "nowrap",
            boxShadow: "0 12px 24px rgba(10,20,60,0.25)",
            opacity: Math.min(1, Math.max(0, third) * 1.5),
            transform: `scale(${0.6 + 0.4 * third}) rotate(3deg)`,
          }}
        >
          OVER 2/3 ({TWO_THIRDS}) · LIST VOTE {UR_LIST_2026}
        </div>
        <Stamp p={barred} size={34} color={RU.white} rotate={-5} style={{ left: 150, top: 1180, background: RU.red, borderColor: RU.white }}>
          LIBERAL YABLOKO: BARRED
        </Stamp>
        <Mono size={15} color={RU.inkSoft} style={{ position: "absolute", left: 120, width: 840, top: 1244, textAlign: "center", letterSpacing: 1.3, ...riseStyle(note, 0, 10) }}>
          NO OSCE OBSERVERS INVITED · CRITICS CALL IT NOT FREE
        </Mono>
      </div>
    </>
  );
};
