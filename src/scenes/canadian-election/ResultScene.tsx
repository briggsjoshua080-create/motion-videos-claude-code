import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, COMMONS_SEATS, FONT, HEMI, PARTY, RESULT_2025, type PartyId, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer, Stamp } from "./ui";

const EMPTY = "#DCCFC4";
const SCORE = { top: 580 } as const;
const LINE_TOP = HEMI.cy - 352;

/** Each seat's party, in hemicycle order (Liberals from the left). */
const SEAT_PARTY: PartyId[] = RESULT_2025.seats.flatMap((s) => Array.from({ length: s.seats }, () => s.party));
const seatsOf = (party: PartyId) => RESULT_2025.seats.find((s) => s.party === party)?.seats ?? 0;

/**
 * "In 2025, Mark Carney's Liberals won 169 seats, three short of a majority." On paper, so the
 * parties' own colours read clearly: the score (Carney's Liberals vs Poilievre's Conservatives,
 * the other parties underneath), the House of Commons half-circle filling in party colours, and on
 * "three short" the majority line with the 3-seat gap and a MINORITY stamp.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const score = rise(frame, cue("result", "Mark") - 8);
  const fill = progress(frame, cue("result", "Liberals") - 4, cue("result", "seats") + 6, Easing.inOut(Easing.cubic));
  const lib = progress(frame, cue("result", "169") - 4, cue("result", "169", "end"), Easing.out(Easing.cubic));
  const others = rise(frame, cue("result", "seats") - 2);
  const opp2 = progress(frame, cue("result", "seats") - 2, cue("result", "three"), Easing.out(Easing.cubic));
  const line = pop(frame, cue("result", "three") - 6);
  const gap = progress(frame, cue("result", "three") - 2, cue("result", "short") + 6);
  const stamp = pop(frame, cue("result", "majority") - 4);

  const pm = RESULT_2025.pm;
  const opp = RESULT_2025.opposition;
  const gapSeats = COMMONS.majority - seatsOf(pm.party);

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        09 — ELECTION OF {RESULT_2025.date}
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24) }}>
        {COMMONS.seats} seats — {COMMONS.majority} for a majority.
      </Aside>

      {/* The score: Liberals left, Conservatives right, the rest underneath. */}
      <div style={{ position: "absolute", inset: 0, ...riseStyle(score, exit, 30) }}>
        {[
          { p: pm, value: Math.round(seatsOf(pm.party) * lib), left: true },
          { p: opp, value: Math.round(seatsOf(opp.party) * opp2), left: false },
        ].map(({ p, value, left }) => (
          <div key={p.name} style={{ position: "absolute", top: SCORE.top, ...(left ? { left: 120 } : { right: 120 }), textAlign: left ? "left" : "right" }}>
            <Mono size={18} color={CA.inkSoft} style={{ letterSpacing: 2.6 }}>
              {p.name.toUpperCase()} · {PARTY[p.party].name.toUpperCase()}
            </Mono>
            <div style={{ marginTop: 6, fontFamily: FONT.display, fontSize: 88, lineHeight: 1, color: PARTY[p.party].color, opacity: value > 0 ? 1 : 0 }}>{value}</div>
            <Mono size={16} color={CA.inkSoft} style={{ marginTop: 6, letterSpacing: 2.2 }}>
              {p.votes} OF THE VOTE
            </Mono>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: SCORE.top + 170, display: "flex", justifyContent: "center", gap: 26, ...riseStyle(others, exit, 16) }}>
        {(["BQ", "NDP", "GPC"] as const).map((id) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: PARTY[id].color }} />
            <Mono size={18} color={CA.ink} style={{ letterSpacing: 2.2 }}>
              {PARTY[id].short} {seatsOf(id)}
            </Mono>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Hemicycle
          seats={COMMONS_SEATS}
          cx={HEMI.cx}
          cy={HEMI.cy}
          dot={HEMI.dot}
          fill={(i) => {
            if (i >= SEAT_PARTY.length * fill) return EMPTY;
            const isGap = i >= seatsOf(pm.party) && i < COMMONS.majority;
            return isGap && gap > 0.3 ? CA.ink : PARTY[SEAT_PARTY[i]].color;
          }}
        />
        <div style={{ position: "absolute", left: HEMI.cx - 3, top: LINE_TOP, width: 6, height: HEMI.cy - LINE_TOP - 140, borderRadius: 3, background: CA.ink, opacity: Math.min(1, Math.max(0, line)), transform: `scaleY(${Math.max(0, Math.min(1, line))})`, transformOrigin: "top" }} />
        <Mono size={16} color={CA.ink} style={{ position: "absolute", left: HEMI.cx + 14, top: LINE_TOP - 4, opacity: Math.min(1, Math.max(0, line)) }}>
          {COMMONS.majority}
        </Mono>
        <div style={{ position: "absolute", left: HEMI.cx - 220, width: 440, top: HEMI.cy - 74, textAlign: "center", opacity: gap }}>
          <div style={{ fontFamily: FONT.display, fontSize: 44, lineHeight: 1, color: CA.ink }}>{gapSeats} SHORT</div>
        </div>
        <Stamp p={stamp} size={28} color={CA.red} rotate={-4} style={{ left: HEMI.cx - 120, top: HEMI.cy + 18, background: CA.paper, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
          MINORITY
        </Stamp>
      </div>
    </>
  );
};
