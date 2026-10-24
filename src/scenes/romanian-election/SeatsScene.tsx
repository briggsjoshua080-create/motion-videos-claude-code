import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CONSTITUENCIES, FONT, RO, SHARES, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD = { top: 640, height: 540 } as const;
const ROW = { top: 100, step: 66, h: 40 } as const;
const BAR = { left: 200, per: 12 } as const;
const IN = SHARES.filter((s) => s.share >= THRESHOLD);
const IN_TOTAL = IN.reduce((n, s) => n + s.share, 0);
/** Seat share of a party over the line: its votes as a share of all votes for parties over the line. */
const seatShare = (share: number) => (share >= THRESHOLD ? Math.round((100 * share) / IN_TOTAL) : 0);

/**
 * "Parties need 5%, then seats follow the vote." A made-up result as vote bars: the 5% line drops
 * in, the two parties under it fade and get a cross, then each remaining party's seat share
 * appears beside its bar (votes for parties under the line don't count). Footnotes: 43 voting
 * areas, 19 seats set aside for national minorities.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = rise(frame, 3);
  const aside = rise(frame, 8);
  const card = rise(frame, 2);
  const grow = progress(frame, 4, cue("seats", "5%") - 4, Easing.out(Easing.cubic));
  const line = pop(frame, cue("seats", "5%") - 3);
  const out = progress(frame, cue("seats", "5%") + 2, cue("seats", "5%") + 14);
  const seats = SHARES.map((_, i) => pop(frame, cue("seats", "seats") - 4 + i * 3));
  const header = rise(frame, cue("seats", "seats") - 6);
  const notes = rise(frame, cue("seats", "vote") - 2);

  const lineX = BAR.left + THRESHOLD * BAR.per;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={118} style={{ top: 362, ...riseStyle(head, exit, 50) }}>
        THE <Accent>{THRESHOLD}%</Accent> LINE
      </Headline>
      <Aside size={46} style={{ top: 520, ...riseStyle(aside, exit, 24) }}>
        Under it, a party wins no seats at all.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={RO.yellow} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={RO.textSoft} style={{ position: "absolute", left: 40, top: 40, letterSpacing: 3 }}>
          VOTES
        </Mono>
        <Mono size={19} color={RO.yellow} style={{ position: "absolute", right: 40, top: 40, letterSpacing: 3, opacity: Math.min(1, header) }}>
          SEATS
        </Mono>
        {SHARES.map((s, i) => {
          const under = s.share < THRESHOLD;
          const dim = under ? 1 - 0.6 * out : 1;
          const top = ROW.top + i * ROW.step;
          return (
            <div key={s.party} style={{ position: "absolute", left: 0, top, width: 840, height: ROW.h }}>
              <div style={{ position: "absolute", left: 40, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: RO.white, opacity: dim }}>{s.party}</div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left,
                  top: 0,
                  height: ROW.h,
                  width: s.share * BAR.per * grow,
                  borderRadius: 8,
                  background: RO.white,
                  opacity: 0.92 * dim,
                  boxShadow: "0 0 18px rgba(255,255,255,0.25)",
                }}
              />
              <div style={{ position: "absolute", left: BAR.left + s.share * BAR.per * grow + 14, top: 4, fontFamily: FONT.display, fontSize: 28, color: RO.white, opacity: Math.min(1, grow * 2) * dim }}>
                {s.share}%
              </div>
              {under ? (
                <div style={{ position: "absolute", right: 46, top: 0, opacity: out }}>
                  <Mark ok={false} size={40} p={out} color={RO.red} width={10} />
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    right: 40,
                    top: 0,
                    fontFamily: FONT.display,
                    fontSize: 34,
                    lineHeight: `${ROW.h}px`,
                    color: RO.yellow,
                    textShadow: "0 0 20px rgba(252,209,22,0.45)",
                    opacity: Math.min(1, Math.max(0, seats[i]) * 1.5),
                    transform: `scale(${0.6 + 0.4 * seats[i]})`,
                    transformOrigin: "right center",
                  }}
                >
                  {seatShare(s.share)}%
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
            height: SHARES.length * ROW.step + 24,
            borderRadius: 3,
            background: RO.yellow,
            boxShadow: "0 0 16px rgba(252,209,22,0.6)",
            transform: `scaleY(${Math.max(0, line)})`,
            transformOrigin: "50% 0",
          }}
        />
        <Mono size={19} color={RO.yellow} style={{ position: "absolute", left: lineX + 12, top: 40, opacity: Math.min(1, Math.max(0, line)) }}>
          {THRESHOLD}%
        </Mono>
        <div style={{ position: "absolute", left: 40, right: 40, top: 494, fontFamily: FONT.body, fontSize: 22, fontWeight: 500, color: RO.textSoft, opacity: Math.min(1, header) }}>
          Made-up example · votes for parties under the line don't count
        </div>
      </Glass>

      <Mono size={19} color={RO.textSoft} style={{ position: "absolute", left: 120, top: 1206, letterSpacing: 2.5, ...riseStyle(notes, exit, 20) }}>
        {CONSTITUENCIES} VOTING AREAS · 19 SEATS SET ASIDE FOR MINORITIES
      </Mono>
    </>
  );
};
