import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, FIRST, MAJORITY, PALETTE as C, PARTIES_IN, POSE, RESULT_2026, TOTAL, type PartyKey, type SceneProps } from "./constants";
import { Pill } from "./ui";

const P = POSE.result;
const PILL_TOP = P.cy + 26;
const GRID = { top: PILL_TOP + 80, row: 54 } as const;
const FIRST_TOP = GRID.top + GRID.row * 4 + 40;
/** Short names for the result grid. */
const SHORT: Partial<Record<PartyKey, string>> = {
  A: "Soc. Democrats",
  F: "SF (Green Left)",
  V: "Venstre",
  I: "Liberal All.",
  DF: "Danish People's",
  M: "Moderates",
  C: "Conservatives",
  O: "Red–Green",
  B: "Social Liberals",
  AE: "Denmark Dem.",
  AA: "Alternative",
  H: "Citizens' Party",
};
/** Biggest first (Denmark's 175 seats; the 4 North Atlantic seats are not parties of this vote). */
const GRID_ORDER = RESULT_2026.filter((p) => p.key !== "NA").sort((a, b) => b.seats - a.seats);

/**
 * "In 2026, twelve parties got in. The Social Democrats came first, with 38 seats."
 * Seats and the 38 counter are in FolketingLayer; this scene adds the election date, the twelve
 * parties with their seats, and how far the winner is from a 90-seat majority.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const date = pop(frame, cue("result", "2026") - 4);
  const dateOut = progress(frame, cue("result", "twelve") - 8, cue("result", "twelve") - 2);
  const twelve = pop(frame, cue("result", "twelve") - 2);
  const grid = progress(frame, cue("result", "twelve") - 2, cue("result", "in", "end") + 8);
  const focus = progress(frame, cue("result", "Social") - 4, cue("result", "Democrats", "end"));
  const first = pop(frame, cue("result", "38") - 2);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - Math.max(dateOut, exit) }}>
        <Pill p={date} bg={C.ink} color={C.white} size={32}>
          Election · 24 March 2026 · 84% turnout
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={twelve} bg={C.card} color={C.ink} border={C.ink} size={32} style={{ boxShadow: "0 10px 26px rgba(20,32,43,0.12)" }}>
          {PARTIES_IN} parties got in
        </Pill>
      </div>

      {/* The twelve parties and their seats */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: GRID.top,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: 12,
          rowGap: 8,
          fontFamily: theme.font,
          opacity: 1 - exit,
        }}
      >
        {GRID_ORDER.map((p, i) => {
          const v = Math.min(1, Math.max(0, grid * GRID_ORDER.length - i));
          const dim = p === FIRST ? 0 : focus;
          return (
            <div
              key={p.key}
              style={{
                height: GRID.row - 8,
                borderRadius: 12,
                background: p === FIRST ? DK.redSoft : C.card,
                boxShadow: "0 8px 20px rgba(20,32,43,0.10)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 14px",
                boxSizing: "border-box",
                opacity: Math.min(1, v * 1.4) * (1 - 0.55 * dim),
                transform: `translateY(${(1 - v) * 14}px)`,
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 8, background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{SHORT[p.key]}</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.ink }}>{p.seats}</span>
            </div>
          );
        })}
      </div>

      {/* First, but far from a majority */}
      <div style={{ position: "absolute", left: 120, width: 840, top: FIRST_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={first} bg={DK.redSoft} color={DK.redDeep} border={DK.red} size={30}>
          First with {FIRST.votes}% · {FIRST.seats} of {TOTAL} seats · majority: {MAJORITY}
        </Pill>
      </div>
    </>
  );
};
