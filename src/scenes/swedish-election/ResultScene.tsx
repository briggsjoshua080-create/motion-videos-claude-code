import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DOT, FONT, MAJORITY, PM_2022, R_IN, R_OUT, RESULT_2022, RIGHT_SEATS, ROWS, SE, TOTAL, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

const SEATS = hemicycleSeats(TOTAL, ROWS, R_IN, R_OUT);
const CHAMBER = { cx: 540, cy: 930, s: 0.9 } as const;
/** First seat index of each party (left to right). */
const PARTY_FROM = RESULT_2022.map((_, i) => RESULT_2022.slice(0, i).reduce((n, p) => n + p.seats, 0));
const partyOf = (i: number) => RESULT_2022[PARTY_FROM.filter((f) => i >= f).length - 1];
/** Seats of the parties that step back while the right's 176 are highlighted. */
const FADED = "#DCD5C6";
const LEGEND = { top: 992, row: 46 } as const;

/**
 * "In 2022, four parties on the right won 176 seats, and Ulf Kristersson got the job." On paper,
 * like the reference's ballot scene so the parties' own colours read clearly: the 2022 Riksdag
 * fills party by party, the four parties on the right stay lit with a big 176, then the legend
 * makes way for Ulf Kristersson's card (approved 176 to 173).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const build = progress(frame, 6, cue("result", "four") - 4, Easing.inOut(Easing.quad));
  const focus = progress(frame, cue("result", "four") - 2, cue("result", "right") + 6);
  const big = pop(frame, cue("result", "176") - 4);
  const legend = rise(frame, 14);
  const toCard = progress(frame, cue("result", "Ulf") - 10, cue("result", "Ulf") + 2);
  const card = rise(frame, cue("result", "Ulf") - 6);

  const seatFill = (i: number) => {
    const p = partyOf(i);
    return p.right ? p.color : interpolateColors(focus, [0, 1], [p.color, FADED]);
  };
  const seatVisible = (i: number) => build * (TOTAL + 1) - i;
  const { cx, cy, s } = CHAMBER;

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        07 — ELECTION OF 11 SEPT 2022
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        349 seats — {MAJORITY} make a majority.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
          <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={DOT} fill={seatFill} visible={seatVisible} />
        </div>
        <div
          style={{
            position: "absolute",
            left: cx - 220,
            width: 440,
            top: cy - 124 * s,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 130 * s,
            lineHeight: 1,
            color: SE.ink,
            opacity: Math.min(1, Math.max(0, big) * 1.5),
            transform: `scale(${0.6 + 0.4 * big})`,
            transformOrigin: "50% 80%",
          }}
        >
          {RIGHT_SEATS}
        </div>
        <Mono size={21} color={SE.blue} style={{ position: "absolute", left: cx - 220, width: 440, top: cy + 16, textAlign: "center", opacity: Math.min(1, Math.max(0, big)) }}>
          SEATS ON THE RIGHT
        </Mono>
      </div>

      {/* Two columns: the four parties on the left, the four on the right. */}
      <div style={{ position: "absolute", left: 120, top: LEGEND.top, width: 840, ...riseStyle(legend, 0, 30), opacity: Math.min(1, legend) * (1 - toCard) * (1 - exit) }}>
        {[false, true].map((right) => (
          <div key={String(right)} style={{ position: "absolute", left: right ? 450 : 0, top: 0, width: 390, opacity: right ? 1 : 1 - 0.55 * focus }}>
            {RESULT_2022.filter((p) => p.right === right).map((p, i) => (
              <div key={p.key} style={{ position: "absolute", left: 0, top: i * LEGEND.row, width: 390, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.body }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: p.color, boxShadow: "inset 0 0 0 1.5px rgba(10,34,56,0.18)", flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 27, fontWeight: 700, color: SE.ink, whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: SE.ink }}>{p.seats}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 984,
          width: 840,
          height: 242,
          borderRadius: 24,
          background: SE.card,
          boxShadow: "0 24px 56px rgba(10,34,56,0.16)",
          fontFamily: FONT.body,
          overflow: "hidden",
          ...riseStyle(card, exit, 40),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: SE.blue }} />
        <Mono size={20} color={SE.inkSoft} style={{ position: "absolute", left: 44, top: 28, letterSpacing: 4 }}>
          PRIME MINISTER · {PM_2022.date.toUpperCase()}
        </Mono>
        <div style={{ position: "absolute", left: 42, top: 64, fontFamily: FONT.display, fontSize: 60, lineHeight: 1, color: SE.ink }}>{PM_2022.name.toUpperCase()}</div>
        <div style={{ position: "absolute", left: 44, top: 136, fontSize: 28, fontWeight: 800, color: SE.blue }}>
          {PM_2022.party} · approved {PM_2022.yes} to {PM_2022.no}
        </div>
        <div style={{ position: "absolute", left: 44, top: 178, width: 770, fontSize: 22, fontWeight: 500, lineHeight: 1.25, color: SE.inkSoft }}>
          Government: Moderates, Christian Democrats and Liberals, backed by the Sweden Democrats
        </div>
      </div>
    </>
  );
};
