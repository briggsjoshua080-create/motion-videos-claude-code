import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CONSTITUENCIES, DISTRICTS, FONT, LIST_SEATS, MINORITY_SEATS, SI, SHARES, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD = { top: 690, height: 494 } as const;
const ROW = { top: 100, step: 60, h: 38 } as const;
const BAR = { left: 200, per: 15 } as const;

/**
 * "Parties above 4% share 88 seats. Two more are kept for the minorities." A made-up nationwide
 * result as vote bars: the 4% line drops in, the parties over it get an "IN" chip on "share", the
 * two small ones go "OUT"; then two pills: 88 seats shared by votes, and 2 more seats kept for the
 * Italian and Hungarian communities' MPs.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const card = rise(frame, cue("seats", "Parties") - 10);
  const grow = progress(frame, cue("seats", "Parties") - 6, cue("seats", "4%") - 2, Easing.out(Easing.cubic));
  const line = pop(frame, cue("seats", "4%") - 3);
  const out = progress(frame, cue("seats", "4%") + 4, cue("seats", "4%") + 14);
  const inChips = pop(frame, cue("seats", "share") - 3);
  const outChip = pop(frame, cue("seats", "4%") + 6);
  const seats = pop(frame, cue("seats", "88") - 3);
  const minority = pop(frame, cue("seats", "Two") - 3);

  const lineX = BAR.left + THRESHOLD * BAR.per;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={120} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE {THRESHOLD}%
      </Headline>
      <Headline size={120} style={{ top: 352 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>LINE</Accent>
      </Headline>
      <Aside size={44} style={{ top: 612, ...riseStyle(aside, exit, 24) }}>
        {CONSTITUENCIES} constituencies × {DISTRICTS} districts.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={SI.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={SI.textSoft} style={{ position: "absolute", left: 40, top: 40, letterSpacing: 3 }}>
          VOTES
        </Mono>
        {SHARES.map((s, i) => {
          const under = s.share < THRESHOLD;
          const dim = under ? 1 - 0.55 * out : 1;
          const top = ROW.top + i * ROW.step;
          const chip = under ? outChip : inChips;
          return (
            <div key={s.party} style={{ position: "absolute", left: 0, top, width: 840, height: ROW.h }}>
              <div style={{ position: "absolute", left: 40, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: SI.white, opacity: dim }}>{s.party}</div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left,
                  top: 0,
                  height: ROW.h,
                  width: s.share * BAR.per * grow,
                  borderRadius: 8,
                  background: SI.white,
                  opacity: 0.92 * dim,
                  boxShadow: "0 0 18px rgba(255,255,255,0.25)",
                }}
              />
              <div style={{ position: "absolute", left: Math.max(BAR.left + s.share * BAR.per * grow, lineX) + 14, top: 3, fontFamily: FONT.display, fontSize: 27, color: SI.white, opacity: Math.min(1, grow * 2) * dim }}>
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
                  background: under ? "transparent" : SI.white,
                  border: `2px solid ${under ? SI.textFaint : SI.white}`,
                  boxSizing: "border-box",
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: 2,
                  color: under ? SI.textFaint : SI.blue,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, Math.max(0, chip) * 1.5),
                  transform: `scale(${0.6 + 0.4 * chip})`,
                  transformOrigin: "right center",
                }}
              >
                {under ? "OUT" : "IN"}
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
            background: SI.red,
            boxShadow: `0 0 0 2px ${SI.white}, 0 0 16px rgba(255,255,255,0.5)`,
            transform: `scaleY(${Math.max(0, line)})`,
            transformOrigin: "50% 0",
          }}
        />
        <Mono size={19} color={SI.white} style={{ position: "absolute", left: lineX + 12, top: 40, opacity: Math.min(1, Math.max(0, line)) }}>
          {THRESHOLD}% LINE
        </Mono>
        <div style={{ position: "absolute", left: 40, right: 40, top: 452, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: SI.textSoft, opacity: Math.min(1, card) }}>
          Made-up example · seats are shared in proportion to votes
        </div>
      </Glass>

      <div style={{ position: "absolute", left: 120, top: 1202, width: 840, display: "flex", justifyContent: "center", gap: 16, opacity: 1 - exit }}>
        {[
          { text: `${LIST_SEATS} SEATS BY VOTES`, bg: SI.white, color: SI.blue, p: seats },
          { text: `+${MINORITY_SEATS} MINORITY SEATS`, bg: SI.red, color: SI.white, p: minority },
        ].map((c) => (
          <div
            key={c.text}
            style={{
              padding: "14px 26px",
              borderRadius: 999,
              background: c.bg,
              border: `2px solid ${SI.white}`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 23,
              letterSpacing: 3,
              color: c.color,
              whiteSpace: "nowrap",
              boxShadow: "0 0 34px rgba(255,255,255,0.3)",
              opacity: Math.min(1, Math.max(0, c.p) * 1.5),
              transform: `scale(${0.6 + 0.4 * c.p})`,
            }}
          >
            {c.text}
          </div>
        ))}
      </div>
    </>
  );
};
