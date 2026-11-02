import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, CHAMBER, DISTRICTS, FONT, PROVINCE, THRESHOLD, UP_2025, UP_2027, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD = { top: 690, height: 384 } as const;
const HALF = { top: 1092, height: 152 } as const;
const BAR = { left: 200, per: 9, top: 82, step: 56, h: 40 } as const;
const LINE_X = BAR.left + THRESHOLD * BAR.per;

/**
 * "Deputies are shared out by vote share in each province, above a 3% line. Half are elected every
 * two years." A made-up province with 10 seats up: five lists' vote shares grow as bars on "shared
 * out by vote share", their seats (D'Hondt: 5, 2, 2, 1) pop in on "province", the 3% line flashes on
 * "3%" and list E (2.4%) fades OUT on "line". A second card splits the 257 seats in two halves
 * (127 elected in 2025, 130 in 2027) on "Half … two years".
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const card = rise(frame, cue("seats", "Deputies") - 6);
  const grow = progress(frame, cue("seats", "shared") - 4, cue("seats", "share") + 6, Easing.out(Easing.cubic));
  const seats = PROVINCE.map((_, i) => pop(frame, cue("seats", "province") - 4 + i * 3));
  const line = progress(frame, cue("seats", "3%") - 4, cue("seats", "3%") + 4);
  const flash = line > 0 && line < 1 ? 1 : line >= 1 ? 0.85 : 0;
  const out = pop(frame, cue("seats", "line") - 2);
  const halfCard = rise(frame, cue("seats", "Half") - 6);
  const halves = [pop(frame, cue("seats", "elected") - 2), pop(frame, cue("seats", "two") - 2)];

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        SEATS BY
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PROVINCE</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        {DISTRICTS} districts: 23 provinces + Buenos Aires city.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={AR.sun} style={riseStyle(card, exit, 40)}>
        <Mono size={18} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 2.5 }}>
          ONE PROVINCE · 10 SEATS UP · MADE-UP
        </Mono>
        {PROVINCE.map((l, i) => {
          const w = l.share * BAR.per * grow;
          const isOut = l.seats === 0;
          return (
            <div key={l.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: isOut ? 1 - 0.5 * Math.min(1, Math.max(0, out)) : 1 }}>
              <div style={{ position: "absolute", left: 40, top: 8, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: AR.white }}>{l.name}</div>
              <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: Math.max(2, w), borderRadius: 7, background: i === 0 ? AR.sun : "rgba(255,255,255,0.78)" }} />
              <div style={{ position: "absolute", left: BAR.left + w + 10, top: 0, fontFamily: FONT.display, fontSize: 21, lineHeight: `${BAR.h}px`, color: AR.white, opacity: Math.min(1, grow * 2) }}>
                {l.share}%
              </div>
              {/* Seats won. */}
              <div style={{ position: "absolute", right: 30, top: 6, display: "flex", gap: 5 }}>
                {isOut ? (
                  <div
                    style={{
                      padding: "2px 12px",
                      borderRadius: 999,
                      background: AR.sun,
                      fontFamily: FONT.mono,
                      fontWeight: 700,
                      fontSize: 18,
                      letterSpacing: 2,
                      color: AR.navy,
                      opacity: Math.min(1, Math.max(0, out) * 1.5),
                      transform: `scale(${0.6 + 0.4 * out})`,
                    }}
                  >
                    OUT · 0 SEATS
                  </div>
                ) : (
                  Array.from({ length: l.seats }, (_, k) => (
                    <div
                      key={k}
                      style={{
                        width: 24,
                        height: 24,
                        marginTop: 2,
                        borderRadius: 12,
                        background: i === 0 ? AR.sun : AR.white,
                        boxShadow: "0 0 12px rgba(255,255,255,0.35)",
                        opacity: Math.min(1, Math.max(0, seats[i]) * 1.5),
                        transform: `scale(${0.4 + 0.6 * seats[i]})`,
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
        {/* The 3% line. */}
        <div style={{ position: "absolute", left: LINE_X - 2, top: BAR.top - 16, width: 4, height: BAR.step * PROVINCE.length, borderRadius: 2, background: AR.sun, opacity: flash, boxShadow: line > 0 ? "0 0 18px rgba(246,180,14,0.9)" : "none" }} />
        <Mono size={16} color={AR.sun} style={{ position: "absolute", left: LINE_X + 8, top: BAR.top + BAR.step * PROVINCE.length - 14, letterSpacing: 1.5, opacity: flash }}>
          {THRESHOLD}%
        </Mono>
      </Glass>

      <Glass top={HALF.top} height={HALF.height} tick={AR.white} style={riseStyle(halfCard, exit, 30)}>
        <Mono size={18} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 26, letterSpacing: 2.5 }}>
          {CHAMBER} DEPUTIES · 4-YEAR TERMS · HALF EVERY 2 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 66, width: 760, height: 60, display: "flex", gap: 8 }}>
          {[
            { n: UP_2025, label: "ELECTED 2025", p: halves[0], fill: AR.sun, color: AR.navy },
            { n: UP_2027, label: "UP IN 2027", p: halves[1], fill: AR.white, color: AR.blueDeep },
          ].map((h) => (
            <div
              key={h.label}
              style={{
                flex: h.n,
                height: 60,
                borderRadius: 10,
                background: h.fill,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                color: h.color,
                opacity: Math.min(1, Math.max(0, h.p) * 1.5),
                transform: `scaleX(${0.5 + 0.5 * Math.min(1, h.p)})`,
              }}
            >
              <span style={{ fontFamily: FONT.display, fontSize: 32 }}>{h.n}</span>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 17, letterSpacing: 2 }}>{h.label}</span>
            </div>
          ))}
        </div>
      </Glass>
      <Mono size={16} color={AR.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1258, textAlign: "center", letterSpacing: 1.4, ...riseStyle(card, exit, 14) }}>
        THE LINE: 3% OF A PROVINCE'S REGISTERED VOTERS · SEATS BY THE D'HONDT METHOD
      </Mono>
    </>
  );
};
