import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, PRESIDENT, RS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

/** Made-up first round (no real people): nobody passes half, so the top two meet again. */
const ROUND1 = [
  { name: "CANDIDATE A", share: 44 },
  { name: "CANDIDATE B", share: 35 },
  { name: "CANDIDATE C", share: 21 },
] as const;
const ROUNDS = { top: 690, height: 300 } as const;
const BAR = { left: 270, per: 7, top: 92, step: 58, h: 36 } as const;
const ROWS = [
  { ok: true, text: "Can send a law back", sub: "parliament votes on it again" },
  { ok: false, text: "Can't block it", sub: "a majority passes it for good" },
] as const;
const ROW = { top: 1010, height: 100, gap: 12 } as const;

/**
 * "The president is elected directly, with a run-off if no one gets half, and can send laws back,
 * but not block them." THE PRESIDENT with the aside that the people elect them; a made-up first
 * round where no one reaches the 50% line, so the top two get a ROUND 2 chip on "run-off"; then a
 * ticked row (sends laws back) and a crossed row (can't block them). Footnote: who is acting
 * president now and when the next election is due.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("president", "directly") - 4);
  const card = rise(frame, cue("president", "with") - 8);
  const grow = progress(frame, cue("president", "with") - 4, cue("president", "run-off") + 4, Easing.out(Easing.cubic));
  const line = pop(frame, cue("president", "half") - 6);
  const chips = [0, 1].map((i) => pop(frame, cue("president", "half") + i * 3));
  const out = progress(frame, cue("president", "half"), cue("president", "half") + 10);
  const rows = [cue("president", "send") - 6, cue("president", "block") - 8].map((t) => rise(frame, t));
  const marks = [cue("president", "back"), cue("president", "block")].map((t) => progress(frame, t - 2, t + 8));
  const note = rise(frame, cue("president", "block") + 4);

  const lineX = BAR.left + 50 * BAR.per;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — THE PRESIDENT</Eyebrow>
      <Headline size={108} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={108} style={{ top: 352 + 106, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <Aside size={44} style={{ top: 594, ...riseStyle(aside, exit, 24) }}>
        Head of state — chosen by the people, {PRESIDENT.term} years.
      </Aside>

      <Glass top={ROUNDS.top} height={ROUNDS.height} tick={RS.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={RS.textSoft} style={{ position: "absolute", left: 40, top: 36, letterSpacing: 3 }}>
          ROUND 1 · MADE-UP
        </Mono>
        {ROUND1.map((c, i) => {
          const top = BAR.top + i * BAR.step;
          const dim = i === 2 ? 1 - 0.55 * out : 1;
          return (
            <div key={c.name} style={{ position: "absolute", left: 0, top, width: 840, height: BAR.h, opacity: dim }}>
              <div style={{ position: "absolute", left: 40, top: 7, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: RS.white }}>{c.name}</div>
              <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: c.share * BAR.per * grow, borderRadius: 8, background: RS.white, boxShadow: "0 0 18px rgba(255,255,255,0.25)" }} />
              <div style={{ position: "absolute", left: BAR.left + c.share * BAR.per * grow - 74, width: 64, textAlign: "right", top: 2, fontFamily: FONT.display, fontSize: 24, lineHeight: "34px", color: RS.blue, opacity: Math.min(1, grow * 2) }}>
                {c.share}%
              </div>
              {i < 2 && (
                <div
                  style={{
                    position: "absolute",
                    right: 30,
                    top: 0,
                    height: BAR.h,
                    padding: "0 14px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    background: RS.red,
                    border: `2px solid ${RS.white}`,
                    boxSizing: "border-box",
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: 2,
                    color: RS.white,
                    whiteSpace: "nowrap",
                    opacity: Math.min(1, Math.max(0, chips[i]) * 1.5),
                    transform: `scale(${0.6 + 0.4 * chips[i]})`,
                    transformOrigin: "right center",
                  }}
                >
                  ROUND 2
                </div>
              )}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 18,
            width: 6,
            height: ROUND1.length * BAR.step + 8,
            borderRadius: 3,
            background: RS.red,
            boxShadow: `0 0 0 2px ${RS.white}`,
            transform: `scaleY(${Math.max(0, line)})`,
            transformOrigin: "50% 0",
          }}
        />
        <Mono size={19} color={RS.white} style={{ position: "absolute", left: lineX + 12, top: 36, opacity: Math.min(1, Math.max(0, line)) }}>
          50%
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 262, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: RS.textSoft, opacity: Math.min(1, card) }}>
          No one over half? The top two meet in a run-off.
        </div>
      </Glass>

      {ROWS.map((r, i) => (
        <Glass key={r.text} top={ROW.top + i * (ROW.height + ROW.gap)} height={ROW.height} tick={i === 1 ? RS.red : undefined} style={riseStyle(rows[i], exit, 30)}>
          <div style={{ position: "absolute", left: 34, top: 24 }}>
            <Mark ok={r.ok} size={50} p={marks[i]} color={r.ok ? RS.white : RS.red} />
          </div>
          <div style={{ position: "absolute", left: 116, top: 14 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: RS.white }}>{r.text}</div>
            <div style={{ marginTop: 2, fontSize: 24, fontWeight: 500, color: RS.textSoft }}>{r.sub}</div>
          </div>
        </Glass>
      ))}

      <Mono size={18} color={RS.textSoft} style={{ position: "absolute", left: 120, top: 1240, letterSpacing: 2, ...riseStyle(note, exit, 16) }}>
        NOW: ACTING PRESIDENT {PRESIDENT.acting} · VOTE DUE BY {PRESIDENT.electionBy}
      </Mono>
    </>
  );
};
