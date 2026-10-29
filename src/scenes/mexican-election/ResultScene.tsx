import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ALLIANCE, CHAMBER, ELECTION_DATE, FONT, MX, PRESIDENT_2024, RESULT_2024, type SceneProps } from "./constants";
import { Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 10, rIn: 150, rOut: 290, dot: 5.4 } as const;
const SEATS = hemicycleSeats(CHAMBER, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CENTER = { cx: 540, cy: 1068 } as const;
const PRES = { top: 486, height: 238 } as const;
const PBAR = { left: 230, per: 8.4, top: 74, step: 50, h: 34 } as const;
const COMPARE = { top: 1094, step: 74, left: 250, width: 600 } as const;
/** First seat index of each group (left to right). */
const GROUP_FROM = RESULT_2024.map((_, i) => RESULT_2024.slice(0, i).reduce((n, p) => n + p.seats, 0));
const groupOf = (i: number) => RESULT_2024[GROUP_FROM.filter((f) => i >= f).length - 1];
/** Seats that step back while the alliance is highlighted. */
const FADED = "#D8D1C2";

/**
 * "In 2024, Claudia Sheinbaum became the first woman president. Her alliance won 54% of the votes,
 * but 73% of the deputies." On paper so the colours read clearly: a presidential card where the
 * three candidates' bars grow and a red FIRST WOMAN PRESIDENT pill pops on "first woman"; then the
 * new 500-seat Chamber fills group by group, the alliance (Morena, PT, Greens) lights up with 364
 * on "alliance", and two bars compare its 54.7% of the votes with its 72.8% of the seats.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const pres = rise(frame, cue("result", "Claudia") - 8);
  const grow = progress(frame, cue("result", "Claudia") - 4, cue("result", "became") + 6, Easing.out(Easing.cubic));
  const first = pop(frame, cue("result", "first") - 3);
  const build = progress(frame, cue("result", "Her") - 14, cue("result", "alliance") + 4, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "alliance") - 2, cue("result", "won") + 4);
  const big = pop(frame, cue("result", "alliance") - 2);
  const votes = progress(frame, cue("result", "54%") - 4, cue("result", "votes") + 2, Easing.out(Easing.cubic));
  const seats = progress(frame, cue("result", "73%") - 4, cue("result", "deputies") + 2, Easing.out(Easing.cubic));
  const legend = rise(frame, cue("result", "Her") - 8);

  const seatFill = (i: number) => {
    const g = groupOf(i);
    return g.alliance ? g.color : interpolateColors(focus, [0, 1], [g.color, FADED]);
  };
  const { cx, cy } = CENTER;

  const compare = (label: string, share: number, p: number, i: number) => (
    <div key={label} style={{ position: "absolute", left: 120, top: COMPARE.top + i * COMPARE.step, width: 840, height: 56, opacity: Math.min(1, p * 3) * (1 - exit) }}>
      <Mono size={20} color={MX.ink} style={{ position: "absolute", left: 0, top: 16, letterSpacing: 2.5 }}>
        {label}
      </Mono>
      <div style={{ position: "absolute", left: COMPARE.left - 120, top: 0, width: COMPARE.width, height: 56, borderRadius: 12, background: "rgba(14,31,24,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${share * p}%`, height: "100%", background: i === 0 ? MX.green : MX.red }} />
      </div>
      {/* The halfway mark. */}
      <div style={{ position: "absolute", left: COMPARE.left - 120 + COMPARE.width / 2 - 1, top: -6, width: 2, height: 68, background: MX.inkFaint }} />
      <div style={{ position: "absolute", left: Math.max(COMPARE.left - 120, COMPARE.left - 120 + (COMPARE.width * share * p) / 100 - 150), width: 136, textAlign: "right", top: 8, fontFamily: FONT.display, fontSize: 34, lineHeight: "40px", color: MX.white }}>
        {(share * p).toFixed(1)}%
      </div>
    </div>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        07 — ELECTION, {ELECTION_DATE}
      </Eyebrow>
      <Headline light size={120} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>

      {/* The presidential race. */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: PRES.top,
          width: 840,
          height: PRES.height,
          borderRadius: 24,
          background: MX.card,
          border: `3px solid ${MX.green}`,
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,40,26,0.14)",
          fontFamily: FONT.body,
          ...riseStyle(pres, exit, 40),
        }}
      >
        <Mono size={17} color={MX.inkSoft} style={{ position: "absolute", left: 30, top: 24, letterSpacing: 2.5 }}>
          PRESIDENT · OFFICIAL COUNT
        </Mono>
        {PRESIDENT_2024.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: 0, top: PBAR.top + i * PBAR.step, width: 840, height: PBAR.h }}>
            <div style={{ position: "absolute", left: 30, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: MX.ink }}>{c.name}</div>
            <div style={{ position: "absolute", left: PBAR.left, top: 0, height: PBAR.h, width: c.share * PBAR.per * grow, borderRadius: 8, background: c.color }} />
            <div style={{ position: "absolute", left: PBAR.left + c.share * PBAR.per * grow + 12, top: 0, fontFamily: FONT.display, fontSize: 24, lineHeight: "34px", color: MX.ink, opacity: Math.min(1, grow * 2) }}>
              {c.share}%
            </div>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            right: 26,
            top: 14,
            padding: "10px 18px",
            borderRadius: 999,
            background: MX.red,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 2,
            color: MX.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, first) * 1.5),
            transform: `scale(${0.6 + 0.4 * first}) rotate(-3deg)`,
            transformOrigin: "right center",
          }}
        >
          FIRST WOMAN PRESIDENT
        </div>
      </div>

      {/* The Chamber of Deputies. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={(i) => build * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - 112, textAlign: "center", opacity: Math.min(1, Math.max(0, big) * 1.5) }}>
          <div style={{ fontFamily: FONT.display, fontSize: 86, lineHeight: 1, color: MX.ink, transform: `scale(${0.6 + 0.4 * big})`, transformOrigin: "50% 80%" }}>{ALLIANCE.seats}</div>
          <Mono size={15} color={MX.inkSoft} style={{ marginTop: 6, letterSpacing: 2 }}>
            OF {CHAMBER} DEPUTIES
          </Mono>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 744, width: 840, display: "flex", justifyContent: "space-between", ...riseStyle(legend, exit, 20) }}>
        {RESULT_2024.map((g) => (
          <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT.body, fontSize: 19, fontWeight: 700, color: MX.ink, whiteSpace: "nowrap", opacity: g.alliance ? 1 : 1 - 0.45 * focus }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: g.color }} />
            {g.key === "OPP" ? "Opposition" : g.name} {g.seats}
          </div>
        ))}
      </div>

      {compare("VOTES", ALLIANCE.votes, votes, 0)}
      {compare("SEATS", ALLIANCE.seatShare, seats, 1)}
    </>
  );
};
