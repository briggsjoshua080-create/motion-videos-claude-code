import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, FONT, RS, SHARES, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD = { top: 690, height: 494 } as const;
const ROW = { top: 100, step: 60, h: 38 } as const;
const BAR = { left: 200, per: 12 } as const;

/**
 * "The whole country is one district: lists above 3% share 250 seats. Minority parties don't need
 * the 3%." A made-up nationwide result as vote bars: the 3% line drops in, the lists over it get an
 * "IN" chip on "share", the small minority list gets a red "MINORITY: IN" chip on "Minority" while
 * the other small list stays out, and a pill says 250 seats are shared by votes.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("seats", "district") - 6);
  const card = rise(frame, cue("seats", "lists") - 10);
  const grow = progress(frame, cue("seats", "lists") - 6, cue("seats", "3%") - 2, Easing.out(Easing.cubic));
  const line = pop(frame, cue("seats", "3%") - 3);
  const out = progress(frame, cue("seats", "3%") + 4, cue("seats", "3%") + 14);
  const inChips = pop(frame, cue("seats", "share") - 3);
  const outChip = pop(frame, cue("seats", "3%") + 6);
  const minority = pop(frame, cue("seats", "Minority") - 3);
  const back = progress(frame, cue("seats", "Minority") - 2, cue("seats", "Minority") + 8);
  const seats = pop(frame, cue("seats", "seats") - 3);

  const lineX = BAR.left + THRESHOLD * BAR.per;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={120} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        ONE
      </Headline>
      <Headline size={120} style={{ top: 352 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>DISTRICT</Accent>
      </Headline>
      <Aside size={44} style={{ top: 612, ...riseStyle(aside, exit, 24) }}>
        All of Serbia votes on the same lists.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={RS.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={RS.textSoft} style={{ position: "absolute", left: 40, top: 40, letterSpacing: 3 }}>
          VOTES
        </Mono>
        {SHARES.map((s, i) => {
          const under = s.share < THRESHOLD;
          const saved = under && s.minority;
          const dim = under ? 1 - 0.55 * out * (saved ? 1 - back : 1) : 1;
          const top = ROW.top + i * ROW.step;
          const chip = saved ? minority : under ? outChip : inChips;
          return (
            <div key={s.party} style={{ position: "absolute", left: 0, top, width: 840, height: ROW.h }}>
              <div style={{ position: "absolute", left: 40, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: RS.white, opacity: dim }}>{s.party}</div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left,
                  top: 0,
                  height: ROW.h,
                  width: s.share * BAR.per * grow,
                  borderRadius: 8,
                  background: saved && back > 0.5 ? RS.red : RS.white,
                  opacity: 0.92 * dim,
                  boxShadow: "0 0 18px rgba(255,255,255,0.25)",
                }}
              />
              <div style={{ position: "absolute", left: Math.max(BAR.left + s.share * BAR.per * grow, lineX) + 14, top: 3, fontFamily: FONT.display, fontSize: 27, color: RS.white, opacity: Math.min(1, grow * 2) * dim }}>
                {s.share}%
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 36,
                  top: 0,
                  height: ROW.h,
                  padding: "0 16px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  background: saved ? RS.red : under ? "transparent" : RS.white,
                  border: saved ? `2px solid ${RS.white}` : under ? `2px solid ${RS.textFaint}` : `2px solid ${RS.white}`,
                  boxSizing: "border-box",
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: 2,
                  color: saved ? RS.white : under ? RS.textFaint : RS.blue,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, Math.max(0, chip) * 1.5),
                  transform: `scale(${0.6 + 0.4 * chip})`,
                  transformOrigin: "right center",
                }}
              >
                {saved ? "MINORITY: IN" : under ? "OUT" : "IN"}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: ROW.top - 22,
            width: 6,
            height: SHARES.length * ROW.step - 8,
            borderRadius: 3,
            background: RS.red,
            boxShadow: `0 0 0 2px ${RS.white}, 0 0 16px rgba(255,255,255,0.5)`,
            transform: `scaleY(${Math.max(0, line)})`,
            transformOrigin: "50% 0",
          }}
        />
        <Mono size={19} color={RS.white} style={{ position: "absolute", left: lineX + 12, top: 40, opacity: Math.min(1, Math.max(0, line)) }}>
          {THRESHOLD}% LINE
        </Mono>
        <div style={{ position: "absolute", left: 40, right: 40, top: 452, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: RS.textSoft, opacity: Math.min(1, card) }}>
          Made-up example · seats are shared in proportion to votes
        </div>
      </Glass>

      <div style={{ position: "absolute", left: 120, top: 1206, width: 840, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            background: RS.white,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 3.5,
            color: RS.red,
            whiteSpace: "nowrap",
            boxShadow: "0 0 34px rgba(255,255,255,0.3)",
            opacity: Math.min(1, Math.max(0, seats) * 1.5),
            transform: `scale(${0.6 + 0.4 * seats})`,
          }}
        >
          {ASSEMBLY} SEATS · SHARED BY VOTES
        </div>
      </div>
    </>
  );
};
