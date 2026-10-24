import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, PRESIDENCY, RO, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mark, Mono, Stamp } from "./ui";

const ROWS = { top: 640, step: 92 } as const;
const TIMELINE = { top: 930, height: 290 } as const;
const STEP_W = 252;

/**
 * "The president, elected directly, leads defence and foreign policy. The court cited foreign
 * interference, and Nicușor Dan won the rerun." Three ticked rows (elected directly with a
 * run-off, defence and foreign policy, can send a law back once), then the story of the cancelled
 * election as a three-step timeline: first round, ANNULLED by the court, the 2025 rerun won by
 * Nicușor Dan.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const rows = [cue("president", "elected") - 6, cue("president", "defence") - 6, cue("president", "policy") - 2].map((t) => rise(frame, t));
  const ticks = [cue("president", "elected"), cue("president", "defence"), cue("president", "policy") + 4].map((t) => progress(frame, t - 2, t + 10));
  const timeline = rise(frame, cue("president", "court") - 8);
  const steps = [cue("president", "court") - 4, cue("president", "cited") - 2, cue("president", "Nicușor") - 4].map((t) => rise(frame, t));
  const annulled = pop(frame, cue("president", "interference") - 2);
  const winner = pop(frame, cue("president", "won") - 4);

  const ROW_ITEMS = [
    { title: "Elected directly", sub: `run-off between the top two · ${PRESIDENCY.term}-year term` },
    { title: "Leads defence & foreign policy", sub: "head of state, commands the army" },
    { title: "Can send a law back — once", sub: "and names the prime minister" },
  ];

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — THE PRESIDENT</Eyebrow>
      <Headline size={120} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={120} style={{ top: 350 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>

      {ROW_ITEMS.map((r, i) => (
        <div key={r.title} style={{ position: "absolute", left: 120, top: ROWS.top + i * ROWS.step, width: 840, display: "flex", gap: 20, alignItems: "flex-start", ...riseStyle(rows[i], exit, 30) }}>
          <div style={{ marginTop: 2 }}>
            <Mark ok size={40} p={ticks[i]} color={RO.yellow} />
          </div>
          <div style={{ fontFamily: FONT.body }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: RO.white, lineHeight: 1.1 }}>{r.title}</div>
            <div style={{ marginTop: 4, fontSize: 24, fontWeight: 500, color: RO.textSoft }}>{r.sub}</div>
          </div>
        </div>
      ))}

      <Glass top={TIMELINE.top} height={TIMELINE.height} tick={RO.red} style={riseStyle(timeline, exit, 40)}>
        <Mono size={20} color={RO.textSoft} style={{ position: "absolute", left: 40, top: 32, letterSpacing: 3 }}>
          THE CANCELLED ELECTION
        </Mono>
        <div style={{ position: "absolute", left: 40, right: 40, top: 98, height: 2, background: RO.line }} />
        {[
          { date: PRESIDENCY.firstRound, title: "1st round", sub: "an outsider leads" },
          { date: PRESIDENCY.annulled, title: "", sub: "court: foreign interference" },
          { date: PRESIDENCY.rerun, title: PRESIDENCY.winner, sub: `wins the rerun · ${PRESIDENCY.share}` },
        ].map((s, i) => (
          <div key={s.date} style={{ position: "absolute", left: 40 + i * (STEP_W + 18), top: 84, width: STEP_W, ...riseStyle(steps[i], 0, 20) }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: i === 1 ? RO.red : i === 2 ? RO.yellow : RO.white, boxShadow: "0 0 0 6px rgba(0,14,48,0.6)" }} />
            <Mono size={18} color={RO.textSoft} style={{ marginTop: 18, letterSpacing: 2 }}>
              {s.date}
            </Mono>
            {s.title && (
              <div style={{ marginTop: 10, fontFamily: FONT.display, fontSize: i === 2 ? 30 : 34, lineHeight: 1.05, color: i === 2 ? RO.yellow : RO.white, whiteSpace: "nowrap", transform: i === 2 ? `scale(${0.7 + 0.3 * Math.min(1.05, Math.max(0, winner))})` : undefined, transformOrigin: "left center" }}>
                {s.title}
              </div>
            )}
            <div style={{ marginTop: s.title ? 6 : 64, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, lineHeight: 1.2, color: RO.textSoft }}>{s.sub}</div>
          </div>
        ))}
        <Stamp p={annulled} size={32} color={RO.red} rotate={-8} style={{ left: 40 + STEP_W + 18, top: 158, background: "rgba(255,255,255,0.92)" }}>
          ANNULLED
        </Stamp>
      </Glass>
    </>
  );
};
