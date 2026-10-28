import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, COALITION_SEATS, ELECTION_DATE, FONT, PM_VOTES, RESULT_2026, SI, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 5, rIn: 128, rOut: 262, dot: 13 } as const;
const SEATS = hemicycleSeats(ASSEMBLY, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 870 } as const;
/** First seat index of each party (left to right). */
const PARTY_FROM = RESULT_2026.map((_, i) => RESULT_2026.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2026[PARTY_FROM.filter((f) => i >= f).length - 1];
const GOLOB = RESULT_2026.find((p) => p.key === "GS")!;
const JANSA = RESULT_2026.find((p) => p.key === "SDS")!;
/** Seats of the parties that step back while others are highlighted. */
const FADED = "#DCD5C6";
const LEGEND = { top: 912, row: 42, col: 430 } as const;

/**
 * "In March 2026, Golob's party won 29 seats, Janša's 28. But Janša built a coalition and became
 * prime minister." On paper so the colours read clearly: the new Assembly fills party by party,
 * the Freedom Movement stays lit with a big 29, then Janša's SDS with 28, then the three-party
 * coalition lights up with 43 seats (Resni.ca backs it from outside), and a red pill: PM Janša,
 * elected with 51 of 90 votes.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const build = progress(frame, 6, cue("result", "Golob's") - 2, Easing.inOut(Easing.quad));
  const golobOn = progress(frame, cue("result", "Golob's") - 2, cue("result", "party") + 2);
  const jansaOn = progress(frame, cue("result", "Janša's") - 4, cue("result", "Janša's") + 4);
  const coalitionOn = progress(frame, cue("result", "built") - 2, cue("result", "coalition") + 4);
  const bigGolob = pop(frame, cue("result", "29") - 4);
  const bigJansa = pop(frame, cue("result", "28") - 4);
  const bigCoalition = pop(frame, cue("result", "coalition") - 2);
  const legend = rise(frame, cue("result", "won") + 2);
  const support = pop(frame, cue("result", "coalition") + 8);
  const pm = pop(frame, cue("result", "prime") - 4);

  // How strongly each party is lit in the current phase (1 = its own colour, 0 = faded).
  const lit = (p: (typeof RESULT_2026)[number]) => {
    const g = p.key === GOLOB.key ? 1 : 0;
    const j = p.key === JANSA.key ? 1 : 0;
    const c = p.coalition ? 1 : p.key === "RES" ? 0.45 : 0;
    const phase1 = g + (j - g) * jansaOn;
    return phase1 + (c - phase1) * coalitionOn;
  };
  const focus = golobOn;
  const seatFill = (i: number) => {
    const p = partyOf(i);
    return interpolateColors(focus * (1 - lit(p)), [0, 1], [p.color, FADED]);
  };
  const seatVisible = (i: number) => build * (ASSEMBLY + 1) - i;
  const { cx, cy } = CHAMBER;
  const big = (label: string, sub: string, color: string, p: number, fade: number) => (
    <div style={{ position: "absolute", left: cx - 220, width: 440, top: cy - 110, textAlign: "center", opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - fade) }}>
      <div style={{ fontFamily: FONT.display, fontSize: 88, lineHeight: 1, color, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 80%" }}>{label}</div>
      <Mono size={17} color={SI.ink} style={{ marginTop: 10, letterSpacing: 2.2 }}>
        {sub}
      </Mono>
    </div>
  );
  const pill = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "12px 22px",
        borderRadius: 999,
        background: bg,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: 2.2,
        color,
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
        08 — ELECTION, {ELECTION_DATE}
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        The National Assembly — official count.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={seatVisible} />
        {big(String(GOLOB.seats), "FREEDOM MOVEMENT · 1ST", GOLOB.color, bigGolob, jansaOn)}
        {big(String(JANSA.seats), "SDS · 2ND", JANSA.color, bigJansa, coalitionOn)}
        {big(String(COALITION_SEATS), "COALITION SEATS", SI.blue, bigCoalition, 0)}
      </div>

      <div style={{ position: "absolute", left: 120, top: LEGEND.top, width: 840, height: LEGEND.row * 4, ...riseStyle(legend, exit, 30) }}>
        {RESULT_2026.map((p, i) => {
          const col = i < 4 ? 0 : 1;
          const row = i % 4;
          return (
            <div
              key={p.key}
              style={{
                position: "absolute",
                left: col * LEGEND.col,
                top: row * LEGEND.row,
                width: LEGEND.col - 30,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: FONT.body,
                opacity: 0.45 + 0.55 * (1 - focus * (1 - lit(p))),
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 9, background: p.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 21, fontWeight: 700, color: SI.ink, whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 23, fontWeight: 800, color: SI.ink }}>{p.seats}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 1100, width: 840, display: "flex", flexWrap: "wrap", gap: 14, opacity: 1 - exit }}>
        {pill(`COALITION ${COALITION_SEATS} + RESNI.CA'S 5 BACKING IT`, SI.blue, SI.white, support)}
        {pill(`PM: JANŠA · ${PM_VOTES} OF ${ASSEMBLY} VOTES`, SI.red, SI.white, pm)}
      </div>
    </>
  );
};
