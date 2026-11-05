import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Aside, Headline } from "./ui";

const GRID = { left: 120, top: 760, cols: 13, rows: 4, cell: 52, gap: 13 } as const;
/** The week of the annual session (early March, the 10th week of the year). */
const SESSION_WEEK = 9;

/**
 * "It meets for about a week a year." A year as 52 week blocks; they fill in quickly, then every
 * block fades except one early-March week, which lights up yellow on "week". ONE WEEK / a year. (The
 * 2026 session ran 5–12 March; the full-time work in between is done by its standing committee, in
 * the fact sheet.)
 */
export const WeekScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 3)];
  const fade = progress(frame, cue("week", "week") - 8, cue("week", "week"));
  const lit = pop(frame, cue("week", "week") - 4);
  const aside = rise(frame, 6);

  return (
    <>
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        ONE
      </Headline>
      <Headline size={175} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>WEEK</Accent>
      </Headline>
      <Aside size={125} style={{ left: 530, top: 268, ...riseStyle(aside, exit, 30) }}>
        a year.
      </Aside>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {Array.from({ length: GRID.cols * GRID.rows }, (_, k) => {
          const c = k % GRID.cols;
          const r = Math.floor(k / GRID.cols);
          const on = k === SESSION_WEEK;
          const appear = progress(frame, 2 + k * 0.25, 6 + k * 0.25);
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: GRID.left + c * (GRID.cell + GRID.gap),
                top: GRID.top + r * (GRID.cell + GRID.gap),
                width: GRID.cell,
                height: GRID.cell,
                borderRadius: 10,
                boxSizing: "border-box",
                background: on ? `rgba(255,222,0,${Math.min(1, lit)})` : "rgba(255,255,255,0.14)",
                border: `3px solid ${on ? CN.yellow : `rgba(255,255,255,${0.6 - 0.4 * fade})`}`,
                opacity: appear,
                transform: on ? `scale(${1 + 0.35 * Math.max(0, Math.min(1.2, lit))})` : undefined,
                boxShadow: on && lit > 0 ? `0 0 ${40 * Math.min(1, lit)}px rgba(255,222,0,0.8)` : undefined,
              }}
            />
          );
        })}
      </div>
    </>
  );
};
