import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, FONT, LEAD_POINTS, TERM_YEARS, WIN_OUTRIGHT, WIN_WITH_LEAD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, Stamp } from "./ui";

/** Made-up first round (no real people): 41% but only 7 points ahead, so the top two go on. */
const RACE = [
  { name: "CANDIDATE A", share: 41 },
  { name: "CANDIDATE B", share: 34 },
  { name: "CANDIDATE C", share: 25 },
] as const;
const RULES = { top: 690, height: 196 } as const;
const ROUNDS = { top: 904, height: 300 } as const;
const BAR = { left: 270, per: 10, top: 84, step: 58, h: 38 } as const;
const LINE45 = BAR.left + WIN_OUTRIGHT * BAR.per;

/**
 * "The president runs the government. 45% wins in round one, or 40% with a ten-point lead. If not,
 * there's a run-off." The two first-round rules pop in on "45%" and "40% … lead"; a made-up round
 * one grows (A 41%, B 34%): below the 45% line, and the bracket between A and B shows only 7 points
 * on "not", so a RUN-OFF stamp slams on "run-off". Footnote: four years, one re-election in a row.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("president", "runs") - 4);
  const rules = rise(frame, cue("president", "45%") - 8);
  const r1 = pop(frame, cue("president", "45%") - 3);
  const r2 = pop(frame, cue("president", "40%") - 3);
  const r2b = pop(frame, cue("president", "lead") - 3);
  const card = rise(frame, cue("president", "lead") - 4);
  const grow = progress(frame, cue("president", "lead"), cue("president", "If") + 4, Easing.out(Easing.cubic));
  const gap = progress(frame, cue("president", "If") - 2, cue("president", "not") + 6);
  const stamp = pop(frame, cue("president", "run-off") - 2);
  const note = rise(frame, cue("president", "run-off") + 4);
  const aX = BAR.left + RACE[0].share * BAR.per * grow;
  const bX = BAR.left + RACE[1].share * BAR.per * grow;

  const rule = (y: number, big: string, text: React.ReactNode, p: number) => (
    <div style={{ position: "absolute", left: 36, top: y, display: "flex", alignItems: "center", gap: 22, opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `translateX(${(1 - Math.min(1, p)) * -20}px)` }}>
      <div style={{ width: 170, height: 64, borderRadius: 12, background: AR.sun, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 40, color: AR.navy, boxShadow: "0 0 24px rgba(246,180,14,0.4)" }}>{big}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: AR.white, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRESIDENT</Eyebrow>
      <Headline size={108} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={108} style={{ top: 352 + 106, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <Aside size={42} style={{ top: 596, ...riseStyle(aside, exit, 24) }}>
        Head of state and of government — {TERM_YEARS} years.
      </Aside>

      <Glass top={RULES.top} height={RULES.height} tick={AR.sun} style={riseStyle(rules, exit, 30)}>
        <Mono size={18} color={AR.textSoft} style={{ position: "absolute", left: 36, top: 22, letterSpacing: 2.5 }}>
          WIN IN ROUND ONE WITH…
        </Mono>
        {rule(56, `${WIN_OUTRIGHT}%+`, "of the votes, or", r1)}
        {rule(
          126,
          `${WIN_WITH_LEAD}%+`,
          <>
            and{" "}
            <span style={{ color: AR.sun, opacity: Math.min(1, Math.max(0, r2b) * 1.5) }}>
              {LEAD_POINTS}+ points ahead
            </span>
          </>,
          r2,
        )}
      </Glass>

      <Glass top={ROUNDS.top} height={ROUNDS.height} tick={AR.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 28, letterSpacing: 3 }}>
          ROUND ONE · MADE-UP
        </Mono>
        {RACE.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: i === 2 ? 1 - 0.6 * gap : 1 }}>
            <div style={{ position: "absolute", left: 40, top: 8, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: AR.white }}>{c.name}</div>
            <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: c.share * BAR.per * grow, borderRadius: 8, background: i === 0 ? AR.sun : "rgba(255,255,255,0.78)" }} />
            <div style={{ position: "absolute", left: BAR.left + c.share * BAR.per * grow - 74, width: 64, textAlign: "right", top: 2, fontFamily: FONT.display, fontSize: 24, lineHeight: "36px", color: AR.navy, opacity: Math.min(1, grow * 2) }}>
              {c.share}%
            </div>
          </div>
        ))}
        {/* The 45% line, not reached. */}
        <div style={{ position: "absolute", left: LINE45 - 2, top: BAR.top - 18, width: 4, height: BAR.step * 3 + 6, borderRadius: 2, background: AR.white, opacity: Math.min(1, grow * 2) * 0.8 }} />
        <Mono size={16} color={AR.white} style={{ position: "absolute", left: LINE45 - 24, top: BAR.top - 46, letterSpacing: 1.5, opacity: Math.min(1, grow * 2) }}>
          {WIN_OUTRIGHT}%
        </Mono>
        {/* The gap between A and B: only 7 points. */}
        <div style={{ position: "absolute", left: bX, top: BAR.top + BAR.step + BAR.h / 2 - 2, width: Math.max(0, (aX - bX) * gap), height: 4, background: AR.sun, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 536, top: BAR.top + 2 * BAR.step + 6, opacity: gap, whiteSpace: "nowrap", fontFamily: FONT.display, fontSize: 24, lineHeight: 1, color: AR.sun }}>
          GAP: 7 &lt; {LEAD_POINTS}
        </div>
        <Stamp p={stamp} size={34} color={AR.navy} rotate={-6} style={{ left: 600, top: 240, background: AR.sun, borderColor: AR.white }}>
          RUN-OFF
        </Stamp>
        <div style={{ position: "absolute", left: 40, top: 258, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: AR.textSoft, opacity: Math.min(1, Math.max(0, note)) }}>
          Within 30 days: the top two, face to face.
        </div>
      </Glass>
      <Mono size={17} color={AR.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1222, textAlign: "center", letterSpacing: 1.6, ...riseStyle(note, exit, 14) }}>
        {TERM_YEARS}-YEAR TERM · ONE RE-ELECTION IN A ROW
      </Mono>
    </>
  );
};
