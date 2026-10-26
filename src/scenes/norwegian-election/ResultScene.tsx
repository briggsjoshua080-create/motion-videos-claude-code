import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTION_DATE, FONT, LABOUR_SHARE, NO, PM, PROGRESS_SHARE, RESULT_2025, STORTING, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const LAYOUT = { rows: 7, rIn: 135, rOut: 300, dot: 9 } as const;
const SEATS = hemicycleSeats(STORTING, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 900 } as const;
/** First seat index of each party (left to right). */
const PARTY_FROM = RESULT_2025.map((_, i) => RESULT_2025.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2025[PARTY_FROM.filter((f) => i >= f).length - 1];
const LABOUR = RESULT_2025.find((p) => p.key === "AP")!;
const PROGRESS = RESULT_2025.find((p) => p.key === "FRP")!;
/** Seats of the parties that step back while one party is highlighted. */
const FADED = "#DCD5C6";
const LEGEND = { top: 960, row: 44 } as const;
/** The legend in two columns, biggest first. */
const BY_SIZE = [...RESULT_2025].sort((a, b) => b.seats - a.seats);

/**
 * "In 2025, Labour won 53 seats, Progress 47, and Jonas Gahr Støre stayed on, governing alone."
 * On paper so the parties' colours read clearly: the 2025 Storting fills party by party, Labour
 * stays lit with a big 53, then Progress with 47, then every party comes back with the legend and
 * a pill: Støre stays prime minister with a Labour-only government.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const build = progress(frame, 6, cue("result", "Labour") - 2, Easing.inOut(Easing.quad));
  const labourOn = progress(frame, cue("result", "Labour") - 2, cue("result", "won") + 2);
  const progressOn = progress(frame, cue("result", "Progress") - 4, cue("result", "Progress") + 4);
  const allBack = progress(frame, cue("result", "Jonas") - 4, cue("result", "Jonas") + 6);
  const bigLabour = pop(frame, cue("result", "53") - 4);
  const bigProgress = pop(frame, cue("result", "47") - 4);
  const legend = rise(frame, cue("result", "Jonas") - 6);
  const pmPill = pop(frame, cue("result", "stayed") - 2);
  const alone = pop(frame, cue("result", "alone") - 4);

  const lit = (key: string) => (key === LABOUR.key ? 1 - progressOn : key === PROGRESS.key ? progressOn : 0);
  const seatFill = (i: number) => {
    const p = partyOf(i);
    const focus = Math.max(labourOn, progressOn) * (1 - allBack);
    const keep = Math.max(lit(p.key), allBack);
    return interpolateColors(focus * (1 - keep), [0, 1], [p.color, FADED]);
  };
  const seatVisible = (i: number) => build * (STORTING + 1) - i;
  const { cx, cy } = CHAMBER;
  const big = (label: string, share: string, color: string, p: number, fade: number) => (
    <div style={{ position: "absolute", left: cx - 220, width: 440, top: cy - 112, textAlign: "center", opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - fade) }}>
      <div style={{ fontFamily: FONT.display, fontSize: 92, lineHeight: 1, color, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 80%" }}>{label}</div>
      <Mono size={18} color={NO.ink} style={{ marginTop: 10, letterSpacing: 2.5 }}>
        {share} OF THE VOTE
      </Mono>
    </div>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        08 — ELECTION OF {ELECTION_DATE}
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        The Storting — {STORTING} seats, 9 parties.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={seatFill} visible={seatVisible} />
        {big(String(LABOUR.seats), LABOUR_SHARE, LABOUR.color, bigLabour, progressOn)}
        {big(String(PROGRESS.seats), PROGRESS_SHARE, PROGRESS.color, bigProgress, allBack)}
      </div>

      <div style={{ position: "absolute", left: 120, top: LEGEND.top, width: 840, ...riseStyle(legend, exit, 30) }}>
        {BY_SIZE.map((p, i) => (
          <div
            key={p.key}
            style={{
              position: "absolute",
              left: i < 5 ? 0 : 450,
              top: (i % 5) * LEGEND.row,
              width: 390,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: FONT.body,
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 10, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 25, fontWeight: 700, color: NO.ink, whiteSpace: "nowrap" }}>{p.name}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: NO.ink }}>{p.seats}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 1196, width: 840, display: "flex", gap: 16, opacity: 1 - exit }}>
        <div
          style={{
            padding: "12px 22px",
            borderRadius: 999,
            background: NO.red,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: 2.5,
            color: NO.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, pmPill) * 1.5),
            transform: `scale(${0.6 + 0.4 * pmPill})`,
            transformOrigin: "left center",
          }}
        >
          PM: {PM.toUpperCase()}
        </div>
        <div
          style={{
            padding: "12px 22px",
            borderRadius: 999,
            background: NO.blue,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: 2.5,
            color: NO.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, alone) * 1.5),
            transform: `scale(${0.6 + 0.4 * alone})`,
            transformOrigin: "left center",
          }}
        >
          LABOUR ALONE
        </div>
      </div>
    </>
  );
};
