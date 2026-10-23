import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, COMMONS_SEATS, FONT, HEMI, RESULT_2025, TWIST, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, Stamp } from "./ui";

const LINE_TOP = HEMI.cy - 352;
const CARD = { top: 690, width: 408, height: 128 } as const;
const START = RESULT_2025.seats[0].seats;

/**
 * "Then five MPs switched to them, and by-elections did the rest: a majority, with no new
 * election." Back on red, the same half-circle with the Liberal seats in white: on "five MPs" the
 * count climbs to 171 (+5 who switched, minus 3 Liberal seats that fell empty, as the card says), on "by-elections"
 * to 174, past the majority line; a MAJORITY stamp and the next election date close it.
 */
export const TwistScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("twist", "no") - 6);
  const cards = [pop(frame, cue("twist", "five") - 4), pop(frame, cue("twist", "by-elections") - 4)];
  const step1 = progress(frame, cue("twist", "five") - 2, cue("twist", "them", "end") + 4, Easing.inOut(Easing.cubic));
  const step2 = progress(frame, cue("twist", "by-elections") - 2, cue("twist", "rest", "end") + 2, Easing.inOut(Easing.cubic));
  const stamp = pop(frame, cue("twist", "majority") - 4);
  const note = rise(frame, cue("twist", "five") - 4);

  const libSeats = START + (TWIST.before - START) * step1 + (TWIST.after - TWIST.before) * step2;
  const newSeat = (i: number) => i >= START;

  const card = (i: number, big: string, title: string, sub: string) => (
    <Glass left={120 + i * (CARD.width + 24)} top={CARD.top} width={CARD.width} height={CARD.height} tick={CA.white} style={{ opacity: Math.min(1, Math.max(0, cards[i]) * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * cards[i]})` }}>
      <div style={{ position: "absolute", left: 26, top: 26, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: CA.white }}>{big}</div>
      <div style={{ position: "absolute", left: 128, top: 24, width: 270 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: CA.white, lineHeight: 1.1 }}>{title}</div>
        <Mono size={14} color={CA.rose} style={{ marginTop: 10, letterSpacing: 1.6 }}>
          {sub}
        </Mono>
      </div>
    </Glass>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>09 — THEN, IN 2026</Eyebrow>
      <Headline size={128} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE 2026
      </Headline>
      <Headline size={128} style={{ top: 352 + 126, ...riseStyle(head[1], exit, 50) }}>
        <Accent>TWIST</Accent>
      </Headline>
      <Aside size={42} style={{ top: 618, ...riseStyle(aside, exit, 24) }}>
        A majority — and nobody voted for it.
      </Aside>

      {card(0, `+${TWIST.switched}`, "MPs switched", TWIST.switchedFrom)}
      {card(1, `+${TWIST.byElections}`, "by-election wins", `${TWIST.byElectionDate} · 3 EMPTY SEATS`)}

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Hemicycle
          seats={COMMONS_SEATS}
          cx={HEMI.cx}
          cy={HEMI.cy}
          dot={HEMI.dot}
          fill={(i) => (i < libSeats ? (newSeat(i) ? CA.rose : CA.white) : "rgba(255,255,255,0.24)")}
        />
        <div style={{ position: "absolute", left: HEMI.cx - 3, top: LINE_TOP, width: 6, height: HEMI.cy - LINE_TOP - 140, borderRadius: 3, background: CA.white, boxShadow: "0 0 18px rgba(255,255,255,0.6)" }} />
        <Mono size={16} color={CA.white} style={{ position: "absolute", left: HEMI.cx + 14, top: LINE_TOP - 4 }}>
          {COMMONS.majority}
        </Mono>
        <div style={{ position: "absolute", left: HEMI.cx - 200, width: 400, top: HEMI.cy - 104, textAlign: "center", fontFamily: FONT.display, fontSize: 100, lineHeight: 1, color: CA.white, textShadow: "0 0 30px rgba(255,255,255,0.35)" }}>
          {Math.round(libSeats)}
        </div>
        <Stamp p={stamp} size={40} rotate={-4} style={{ left: HEMI.cx - 150, top: HEMI.cy - 240, background: CA.bgDeep, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
          MAJORITY
        </Stamp>
      </div>
      <Mono size={21} style={{ position: "absolute", left: 120, width: 840, textAlign: "center", top: HEMI.cy + 18, ...riseStyle(note, exit, 12) }}>
        LIBERAL SEATS · NEXT ELECTION SET FOR <span style={{ color: CA.white }}>{TWIST.nextElection}</span>
      </Mono>
    </>
  );
};
