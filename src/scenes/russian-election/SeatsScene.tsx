import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DISTRICT_SEATS, DUMA, DUMA_YEARS, FONT, LIST_SEATS, LIST_VOTE, RU, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const SPLIT = { top: 676, height: 92 } as const;
const CARD = { top: 786, height: 300 } as const;
const DIST = { top: 1104, height: 150 } as const;
const BAR = { left: 200, per: 9.5, top: 66, step: 44, h: 32 } as const;
const LINE_X = BAR.left + THRESHOLD * BAR.per;
/** A made-up district race: most votes wins, no run-off. */
const RACE = [
  { name: "B", share: 38 },
  { name: "A", share: 31 },
  { name: "C", share: 19 },
] as const;

/**
 * "Half of the 450 seats go to parties above 5%. The other half go to district winners." A split bar
 * (225 | 225) builds on "Half of the 450"; the list half lights up on "parties": made-up party bars
 * grow, the 5% line flashes on "5%" and party E (3.2%) is OUT; the district half lights up on
 * "other half": a made-up three-way race where the leader wins the seat on "winners".
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const split = rise(frame, cue("seats", "Half") - 6);
  const halves = [pop(frame, cue("seats", "450") - 2), pop(frame, cue("seats", "450") + 3)];
  const focus = [progress(frame, cue("seats", "parties") - 4, cue("seats", "parties") + 4), progress(frame, cue("seats", "other") - 4, cue("seats", "other") + 4)];
  const card = rise(frame, cue("seats", "parties") - 8);
  const grow = progress(frame, cue("seats", "parties") - 4, cue("seats", "above") + 6, Easing.out(Easing.cubic));
  const line = progress(frame, cue("seats", "5%") - 4, cue("seats", "5%") + 4);
  const out = pop(frame, cue("seats", "5%") + 4);
  const dist = rise(frame, cue("seats", "other") - 6);
  const race = progress(frame, cue("seats", "half#2") - 2, cue("seats", "district") + 4, Easing.out(Easing.cubic));
  const win = pop(frame, cue("seats", "winners") - 3);
  const activeHalf = focus[1] > 0.5 ? 1 : 0;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        HALF AND
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>HALF</Accent>
      </Headline>
      <Aside size={44} style={{ top: 616, ...riseStyle(aside, exit, 24) }}>
        {DUMA} seats, elected every {DUMA_YEARS} years.
      </Aside>

      {/* 225 | 225 */}
      <div style={{ position: "absolute", left: 120, top: SPLIT.top, width: 840, height: SPLIT.height, display: "flex", gap: 10, ...riseStyle(split, exit, 30) }}>
        {[
          { n: LIST_SEATS, label: "PARTY LISTS" },
          { n: DISTRICT_SEATS, label: "DISTRICTS" },
        ].map((h, i) => {
          const on = focus[0] > 0.5 ? (activeHalf === i ? 1 : 0.35) : 1;
          return (
            <div
              key={h.label}
              style={{
                flex: 1,
                borderRadius: 14,
                background: i === 0 ? RU.white : RU.red,
                color: i === 0 ? RU.blueDeep : RU.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                opacity: Math.min(1, Math.max(0, halves[i]) * 1.5) * on,
                transform: `scaleX(${0.5 + 0.5 * Math.min(1, halves[i])})`,
                boxShadow: on === 1 && focus[0] > 0.5 ? "0 0 30px rgba(255,255,255,0.35)" : "none",
              }}
            >
              <span style={{ fontFamily: FONT.display, fontSize: 44 }}>{h.n}</span>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 19, letterSpacing: 2 }}>{h.label}</span>
            </div>
          );
        })}
      </div>

      <Glass top={CARD.top} height={CARD.height} tick={RU.white} style={riseStyle(card, exit, 40)}>
        <Mono size={17} color={RU.textSoft} style={{ position: "absolute", left: 40, top: 24, letterSpacing: 2.5 }}>
          NATIONWIDE PARTY VOTE · MADE-UP
        </Mono>
        {LIST_VOTE.map((l, i) => {
          const w = l.share * BAR.per * grow;
          const isOut = l.share < THRESHOLD;
          return (
            <div key={l.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: isOut ? 1 - 0.5 * Math.min(1, Math.max(0, out)) : 1 }}>
              <div style={{ position: "absolute", left: 40, top: 5, fontFamily: FONT.mono, fontWeight: 700, fontSize: 19, letterSpacing: 1.5, color: RU.white }}>{l.name}</div>
              <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: Math.max(2, w), borderRadius: 7, background: i === 0 ? RU.white : "rgba(255,255,255,0.6)" }} />
              <div style={{ position: "absolute", left: BAR.left + Math.max(w, THRESHOLD * BAR.per) + 12, top: 0, fontFamily: FONT.display, fontSize: 20, lineHeight: `${BAR.h}px`, color: RU.white, opacity: Math.min(1, grow * 2) }}>
                {l.share}%
              </div>
              {isOut && (
                <div
                  style={{
                    position: "absolute",
                    left: 420,
                    top: 0,
                    padding: "2px 12px",
                    borderRadius: 999,
                    background: RU.red,
                    border: `2px solid ${RU.white}`,
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: 2,
                    color: RU.white,
                    whiteSpace: "nowrap",
                    opacity: Math.min(1, Math.max(0, out) * 1.5),
                    transform: `scale(${0.6 + 0.4 * out})`,
                  }}
                >
                  UNDER 5% · NO LIST SEATS
                </div>
              )}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: LINE_X - 2, top: BAR.top - 10, width: 4, height: BAR.step * LIST_VOTE.length, borderRadius: 2, background: RU.red, opacity: line, boxShadow: line > 0 ? `0 0 18px ${RU.redGlow}` : "none" }} />
        <Mono size={16} color={RU.white} style={{ position: "absolute", left: LINE_X - 20, top: BAR.top + BAR.step * LIST_VOTE.length, letterSpacing: 1.5, opacity: line }}>
          {THRESHOLD}% LINE
        </Mono>
      </Glass>

      <Glass top={DIST.top} height={DIST.height} tick={RU.red} style={riseStyle(dist, exit, 30)}>
        <Mono size={17} color={RU.textSoft} style={{ position: "absolute", left: 40, top: 22, letterSpacing: 2.5 }}>
          ONE DISTRICT · MOST VOTES WINS · NO RUN-OFF
        </Mono>
        {RACE.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: 40, top: 60 + i * 28, width: 520, height: 22 }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: RU.white }}>CANDIDATE {c.name}</div>
            <div style={{ position: "absolute", left: 170, top: 2, height: 18, width: c.share * 8 * race, borderRadius: 5, background: i === 0 ? RU.red : "rgba(255,255,255,0.55)" }} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 62,
            padding: "10px 18px",
            borderRadius: 14,
            background: RU.red,
            border: `2px solid ${RU.white}`,
            fontFamily: FONT.display,
            fontSize: 24,
            color: RU.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, win) * 1.5),
            transform: `scale(${0.6 + 0.4 * win}) rotate(-3deg)`,
          }}
        >
          B WINS THE SEAT
        </div>
      </Glass>
    </>
  );
};
