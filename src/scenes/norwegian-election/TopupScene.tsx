import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, NO, SHARES, THRESHOLD, TOPUP_SEATS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD = { top: 640, height: 500 } as const;
const ROW = { top: 100, step: 62, h: 38 } as const;
const BAR = { left: 200, per: 12 } as const;

/**
 * "Parties above 4% get top-up seats to match the national vote." A made-up nationwide result as
 * vote bars: the 4% line drops in, the smaller parties over it get a "+ TOP-UP" chip (big parties
 * already win enough district seats), the party under it gets none, and a pill says the seats now
 * match the vote. Footnote: under 4% you can still win a district seat.
 */
export const TopupScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = rise(frame, 3);
  const aside = rise(frame, 8);
  const card = rise(frame, 2);
  const grow = progress(frame, 4, cue("topup", "4%") - 2, Easing.out(Easing.cubic));
  const line = pop(frame, cue("topup", "4%") - 3);
  const out = progress(frame, cue("topup", "4%") + 4, cue("topup", "4%") + 14);
  const chips = SHARES.map((_, i) => pop(frame, cue("topup", "top-up") - 4 + i * 2));
  const match = pop(frame, cue("topup", "match") - 2);

  const lineX = BAR.left + THRESHOLD * BAR.per;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={104} style={{ top: 376, ...riseStyle(head, exit, 50) }}>
        <Accent>TOP-UP</Accent> SEATS
      </Headline>
      <Aside size={46} style={{ top: 520, ...riseStyle(aside, exit, 24) }}>
        {TOPUP_SEATS} extra seats fix the gaps, nationwide.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={NO.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={NO.textSoft} style={{ position: "absolute", left: 40, top: 40, letterSpacing: 3 }}>
          VOTES
        </Mono>
        {SHARES.map((s, i) => {
          const under = s.share < THRESHOLD;
          const dim = under ? 1 - 0.55 * out : 1;
          const top = ROW.top + i * ROW.step;
          return (
            <div key={s.party} style={{ position: "absolute", left: 0, top, width: 840, height: ROW.h }}>
              <div style={{ position: "absolute", left: 40, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: NO.white, opacity: dim }}>{s.party}</div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left,
                  top: 0,
                  height: ROW.h,
                  width: s.share * BAR.per * grow,
                  borderRadius: 8,
                  background: NO.white,
                  opacity: 0.92 * dim,
                  boxShadow: "0 0 18px rgba(255,255,255,0.25)",
                }}
              />
              <div style={{ position: "absolute", left: BAR.left + s.share * BAR.per * grow + 14, top: 3, fontFamily: FONT.display, fontSize: 27, color: NO.white, opacity: Math.min(1, grow * 2) * dim }}>
                {s.share}%
              </div>
              {(s.topup || under) && (
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
                    background: under ? "transparent" : NO.blue,
                    border: under ? `2px solid ${NO.textFaint}` : `2px solid ${NO.white}`,
                    boxSizing: "border-box",
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 2,
                    color: under ? NO.textFaint : NO.white,
                    whiteSpace: "nowrap",
                    opacity: Math.min(1, Math.max(0, chips[i]) * 1.5),
                    transform: `scale(${0.6 + 0.4 * chips[i]})`,
                    transformOrigin: "right center",
                  }}
                >
                  {under ? "NO TOP-UP" : "+ TOP-UP"}
                </div>
              )}
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
            background: NO.white,
            boxShadow: "0 0 16px rgba(255,255,255,0.6)",
            transform: `scaleY(${Math.max(0, line)})`,
            transformOrigin: "50% 0",
          }}
        />
        <Mono size={19} color={NO.white} style={{ position: "absolute", left: lineX + 12, top: 40, opacity: Math.min(1, Math.max(0, line)) }}>
          {THRESHOLD}%
        </Mono>
        <div style={{ position: "absolute", left: 40, right: 40, top: 456, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: NO.textSoft, opacity: Math.min(1, card) }}>
          Made-up example · under {THRESHOLD}%, a party can still win a district seat
        </div>
      </Glass>

      <div style={{ position: "absolute", left: 120, top: 1166, width: 840, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            background: NO.white,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 3.5,
            color: NO.red,
            whiteSpace: "nowrap",
            boxShadow: "0 0 34px rgba(255,255,255,0.3)",
            opacity: Math.min(1, Math.max(0, match) * 1.5),
            transform: `scale(${0.6 + 0.4 * match})`,
          }}
        >
          SEATS ≈ VOTES NATIONWIDE
        </div>
      </div>
    </>
  );
};
