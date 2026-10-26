import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AREA_POINTS, DISTRICTS, DISTRICT_SEATS, FONT, NO, WEIGHT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, Stamp } from "./ui";

const CARD = { top: 676, height: 230 } as const;
const GAP = 22;
/** Voters-per-seat bars: 26,000 voters fill this width. */
const BAR = { left: 40, top: 150, width: 470, h: 34 } as const;

/** One district: name, area, its seats as dots, and a bar of how many voters share each seat. */
const District: React.FC<{
  top: number;
  d: (typeof WEIGHT)["finnmark"] | (typeof WEIGHT)["oslo"];
  card: number;
  dots: number;
  bar: number;
  count: number;
  strong?: boolean;
}> = ({ top, d, card, dots, bar, count, strong }) => (
  <Glass top={top} height={CARD.height} tick={strong ? NO.white : NO.blue} style={riseStyle(card, 0, 40)}>
    <div style={{ position: "absolute", left: 40, top: 30, fontFamily: FONT.display, fontSize: 48, lineHeight: 1, color: NO.white }}>{d.name}</div>
    <Mono size={18} color={NO.textSoft} style={{ position: "absolute", left: 42, top: 94, letterSpacing: 2.5 }}>
      {d.area} · {d.voters.toLocaleString("en-US")} VOTERS
    </Mono>
    {/* The district's seats, one dot each. */}
    <div style={{ position: "absolute", right: 40, top: 34, width: 300, display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 }}>
      {Array.from({ length: d.seats }, (_, i) => {
        const v = Math.min(1, Math.max(0, dots * (d.seats + 2) - i));
        return <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: NO.white, opacity: v, transform: `scale(${0.4 + 0.6 * v})` }} />;
      })}
    </div>
    <Mono size={18} color={NO.white} style={{ position: "absolute", right: 40, top: 94, opacity: Math.min(1, dots * 2) }}>
      {d.seats} SEATS
    </Mono>
    <div
      style={{
        position: "absolute",
        left: BAR.left,
        top: BAR.top,
        height: BAR.h,
        width: ((BAR.width * d.perSeat) / WEIGHT.oslo.perSeat) * bar,
        borderRadius: 8,
        background: strong ? NO.white : "rgba(255,255,255,0.55)",
        boxShadow: strong ? "0 0 18px rgba(255,255,255,0.3)" : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: BAR.left + ((BAR.width * d.perSeat) / WEIGHT.oslo.perSeat) * bar + 16,
        top: BAR.top - 4,
        fontFamily: FONT.display,
        fontSize: 34,
        lineHeight: `${BAR.h + 8}px`,
        color: NO.white,
        whiteSpace: "nowrap",
        opacity: Math.min(1, Math.max(0, count) * 1.5),
      }}
    >
      {Math.round((d.perSeat * Math.min(1, Math.max(0, count))) / 1000)},000 <span style={{ fontFamily: FONT.body, fontSize: 22, fontWeight: 600 }}>per seat</span>
    </div>
  </Glass>
);

/**
 * "Seats go to 19 districts by people and land: Finnmark gets a seat per 14,000 voters, Oslo per
 * 26,000." The 150 district seats are shared by points (1 per resident, 1.8 per km²); then
 * Finnmark (huge, empty: 4 seats) and Oslo (tiny, crowded: 20 seats) as two cards with their seat
 * dots and a voters-per-seat bar each, and a ×1.9 stamp on the difference.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("seats", "land") - 4);
  const cardA = rise(frame, cue("seats", "Finnmark") - 8);
  const dotsA = progress(frame, cue("seats", "Finnmark") - 2, cue("seats", "gets") + 6);
  const barA = progress(frame, cue("seats", "seat") - 2, cue("seats", "14,000") + 6, Easing.out(Easing.cubic));
  const countA = progress(frame, cue("seats", "per") - 2, cue("seats", "14,000") + 8);
  const cardB = rise(frame, cue("seats", "Oslo") - 8);
  const dotsB = progress(frame, cue("seats", "Oslo") - 4, cue("seats", "Oslo") + 16);
  const barB = progress(frame, cue("seats", "per#2") - 4, cue("seats", "26,000") + 8, Easing.out(Easing.cubic));
  const countB = progress(frame, cue("seats", "per#2") - 2, cue("seats", "26,000") + 10);
  const stamp = pop(frame, cue("seats", "26,000") + 10);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Eyebrow style={{ top: 300, ...riseStyle(kicker, 0, 24) }}>04 — THE SEATS</Eyebrow>
        <Headline size={124} style={{ top: 352, ...riseStyle(head[0], 0, 50) }}>
          PEOPLE
        </Headline>
        <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], 0, 50) }}>
          + <Accent>LAND</Accent>
        </Headline>
        <Aside size={44} style={{ top: 612, width: 860, ...riseStyle(aside, 0, 24) }}>
          {DISTRICT_SEATS} seats, {DISTRICTS} districts: each km² counts like {AREA_POINTS} people.
        </Aside>

        <District top={CARD.top + 40} d={WEIGHT.finnmark} card={cardA} dots={dotsA} bar={barA} count={countA} strong />
        <District top={CARD.top + 40 + CARD.height + GAP} d={WEIGHT.oslo} card={cardB} dots={dotsB} bar={barB} count={countB} />
        <Stamp p={stamp} size={36} rotate={-6} style={{ left: 704, top: CARD.top + 40 + 146 }}>
          ×{WEIGHT.ratio} WEIGHT
        </Stamp>
      </div>
    </>
  );
};
