import React from "react";
import { useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono, SealIcon } from "./ui";

const ROWS = [
  { word: "government", text: "Leads the government", sub: "picks the ministers (the Cabinet)" },
  { word: "army", text: "Commands the army", sub: "commander in chief" },
  { word: "veto", text: "Can veto laws", sub: "Congress can override with ⅔" },
] as const;
const ROW = { top: 752, height: 122, gap: 14 } as const;

/**
 * "The president leads the government and the army, and can veto laws." A glowing seal, THE
 * PRESIDENT, the aside that the office is head of state and head of government at once, and three
 * ticked rows that light up on their words; the two-term limit underneath.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const seal = pop(frame, 2);
  const head = [rise(frame, 4), rise(frame, 8)];
  const aside = rise(frame, 10);
  const rows = ROWS.map((r) => rise(frame, cue("president", r.word) - 8));
  const marks = ROWS.map((r) => progress(frame, cue("president", r.word) - 2, cue("president", r.word) + 8));
  const limit = rise(frame, cue("president", "army"));

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRESIDENT</Eyebrow>
      <div
        style={{
          position: "absolute",
          left: 430,
          top: 350 + float(frame, 4, 60),
          transform: `scale(${0.5 + 0.5 * Math.max(0, seal)})`,
          opacity: Math.min(1, Math.max(0, seal) * 1.5) * (1 - exit),
          filter: "drop-shadow(0 0 22px rgba(240,71,94,0.55))",
        }}
      >
        <SealIcon size={104} />
      </div>
      <Headline size={116} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={116} style={{ top: 352 + 114, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <Aside size={44} style={{ top: 620, ...riseStyle(aside, exit, 24) }}>
        Head of state <i>and</i> head of government.
      </Aside>

      {ROWS.map((r, i) => (
        <Glass key={r.text} top={ROW.top + i * (ROW.height + ROW.gap)} height={ROW.height} style={riseStyle(rows[i], exit, 30)}>
          <div style={{ position: "absolute", left: 34, top: 32 }}>
            <Mark ok size={56} p={marks[i]} color={US.redBright} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 22 }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: US.white }}>{r.text}</div>
            <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, color: US.textSoft }}>{r.sub}</div>
          </div>
        </Glass>
      ))}
      <Mono size={20} color={US.textSoft} style={{ position: "absolute", left: 120, top: 1180, letterSpacing: 3, ...riseStyle(limit, exit, 20) }}>
        ELECTED FOR 4 YEARS · <span style={{ color: US.redBright }}>2 TERMS MAX</span>
      </Mono>
    </>
  );
};
