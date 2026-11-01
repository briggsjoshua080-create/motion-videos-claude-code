import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, FONT, LIST_SEATS_WON, PARTY_LIST, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD = { top: 690, height: 490 } as const;
const BAR = { left: 290, max: 420, top: 92, step: 76, h: 46 } as const;
const MAX_VOTES = Math.max(...PARTY_LIST.map((c) => c.votes));
const TOTAL = PARTY_LIST.reduce((n, c) => n + c.votes, 0);

/** A five-pointed star. */
const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 6 L61 38 H95 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 H39 Z" fill={color} />
  </svg>
);

/**
 * "Deputies' seats are shared by party votes in each state. So one star candidate can pull others
 * in with them." A made-up party list in one state: each candidate's own votes grow as bars on
 * "shared by party votes", they pour into one party total (1,500 → 3 seats) on "each state", the
 * star's huge bar glows on "star", and IN ticks land on two candidates with few votes of their own
 * on "pull others in". Footnote: the 10% rule that limits this.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const card = rise(frame, cue("seats", "Deputies") - 6);
  const grow = progress(frame, cue("seats", "shared") - 4, cue("seats", "votes") + 6, Easing.out(Easing.cubic));
  const pool = progress(frame, cue("seats", "each") - 4, cue("seats", "state", "end") + 4);
  const seats = Array.from({ length: LIST_SEATS_WON }, (_, i) => pop(frame, cue("seats", "state") + i * 4));
  const star = pop(frame, cue("seats", "star") - 3);
  const pulled = [pop(frame, cue("seats", "pull") - 2), pop(frame, cue("seats", "others") - 2)];
  const note = rise(frame, cue("seats", "with"));

  const inChip = (p: number) => (
    <div
      style={{
        position: "absolute",
        right: 34,
        top: 4,
        height: 38,
        padding: "0 14px",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: BR.yellow,
        border: `2px solid ${BR.white}`,
        boxSizing: "border-box",
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: 2,
        color: BR.blue,
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
        transformOrigin: "right center",
      }}
    >
      <Mark ok size={18} p={Math.min(1, Math.max(0, p))} color={BR.blue} width={12} />
      IN
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        PARTY
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>VOTES POOL</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        Vote for a person or a party.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={BR.yellow} style={riseStyle(card, exit, 40)}>
        <Mono size={18} color={BR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 2.5 }}>
          ONE STATE · ONE PARTY'S LIST · MADE-UP
        </Mono>
        {PARTY_LIST.map((c, i) => {
          const w = Math.max(8, (c.votes / MAX_VOTES) * BAR.max) * grow;
          const isStar = i === 0;
          const fade = !c.elected ? 1 - 0.45 * pulled[1] : 1;
          return (
            <div key={c.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: fade }}>
              <div style={{ position: "absolute", left: 40, top: 10, display: "flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: BR.white }}>
                {isStar && (
                  <span style={{ display: "inline-block", transform: `scale(${0.4 + 0.6 * Math.min(1.2, Math.max(0, star))}) rotate(${(1 - Math.min(1, star)) * -40}deg)` }}>
                    <Star size={26} color={BR.yellow} />
                  </span>
                )}
                {c.name}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: BAR.left,
                  top: 0,
                  height: BAR.h,
                  width: w,
                  borderRadius: 8,
                  background: isStar ? BR.yellow : "rgba(255,255,255,0.75)",
                  boxShadow: isStar ? `0 0 ${10 + 30 * Math.min(1, Math.max(0, star))}px rgba(255,223,0,0.6)` : "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: BAR.left + w + 10,
                  top: 0,
                  fontFamily: FONT.display,
                  fontSize: 22,
                  lineHeight: `${BAR.h}px`,
                  color: BR.white,
                  opacity: Math.min(1, grow * 2) * (isStar ? 0 : 1),
                }}
              >
                {c.votes.toLocaleString("en-US")}
              </div>
              {isStar && (
                <div style={{ position: "absolute", left: BAR.left + 18, top: 0, fontFamily: FONT.display, fontSize: 24, lineHeight: `${BAR.h}px`, color: BR.blue, opacity: Math.min(1, grow * 2) }}>
                  {c.votes.toLocaleString("en-US")} VOTES
                </div>
              )}
              {i === 1 && inChip(pulled[0])}
              {i === 2 && inChip(pulled[1])}
            </div>
          );
        })}

        {/* The party total and its seats. */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 384, height: 2, background: BR.line, opacity: pool }} />
        <div style={{ position: "absolute", left: 40, top: 400, opacity: Math.min(1, pool * 1.5), transform: `translateY(${(1 - pool) * 16}px)` }}>
          <Mono size={17} color={BR.textSoft} style={{ letterSpacing: 2.5 }}>
            PARTY TOTAL
          </Mono>
          <div style={{ marginTop: 6, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: BR.white }}>{Math.round(TOTAL * pool).toLocaleString("en-US")}</div>
        </div>
        <div style={{ position: "absolute", left: 330, top: 418, fontFamily: FONT.display, fontSize: 46, color: BR.yellow, opacity: pool }}>→</div>
        <div style={{ position: "absolute", left: 420, top: 400, display: "flex", alignItems: "center", gap: 14 }}>
          {seats.map((p, i) => (
            <div
              key={i}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
                background: BR.yellow,
                border: `3px solid ${BR.white}`,
                boxSizing: "border-box",
                boxShadow: "0 0 24px rgba(255,223,0,0.5)",
                opacity: Math.min(1, Math.max(0, p) * 1.5),
                transform: `scale(${0.5 + 0.5 * p})`,
              }}
            />
          ))}
          <div style={{ marginLeft: 8, fontFamily: FONT.display, fontSize: 40, color: BR.white, opacity: Math.min(1, Math.max(0, seats[LIST_SEATS_WON - 1]) * 1.5) }}>
            {LIST_SEATS_WON} SEATS
          </div>
        </div>
      </Glass>
      <Mono size={17} color={BR.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1200, textAlign: "center", letterSpacing: 1.6, ...riseStyle(note, exit, 14) }}>
        LIMIT: EACH WINNER NEEDS 10% OF THE VOTES ONE SEAT COSTS
      </Mono>
    </>
  );
};
