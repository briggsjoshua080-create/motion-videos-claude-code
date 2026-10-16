import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ES, FIRST, MAJORITY, PALETTE as C, POSE, RESULT_2023, TOTAL, type PartyKey, type SceneProps } from "./constants";
import { Pill } from "./ui";

const P = POSE.result;
const PILL_TOP = P.cy + 24;
const GRID = { top: PILL_TOP + 78, row: 52 } as const;
const SHORT_TOP = GRID.top + GRID.row * 4 + 30;
/** Short names for the result grid. */
const SHORT: Record<PartyKey, string> = {
  PP: "People's Party",
  PSOE: "Socialists",
  VOX: "Vox",
  SUMAR: "Sumar",
  ERC: "ERC",
  JUNTS: "Junts",
  BILDU: "EH Bildu",
  PNV: "PNV",
  BNG: "BNG",
  CC: "Canarian Coal.",
  UPN: "UPN",
};
const GRID_ORDER = [...RESULT_2023].sort((a, b) => b.seats - a.seats);

/**
 * "The People's Party won 137 seats, short of the 176 needed."
 * Seats, the 137 counter and the majority mark are in CongressLayer; this scene adds the election
 * date, the eleven parties with their seats, and how far the winner is from 176.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const date = pop(frame, 2);
  const grid = progress(frame, 4, cue("result", "won") + 6);
  const focus = progress(frame, cue("result", "People's") - 4, cue("result", "Party", "end"));
  const short = rise(frame, cue("result", "short") - 2);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={date} bg={C.ink} color={C.white} size={30}>
          Election · 23 July 2023 · {RESULT_2023.length} parties got in
        </Pill>
      </div>

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
                background: p === FIRST ? "#E3F0FA" : C.card,
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

      <div style={{ position: "absolute", left: 120, width: 840, top: SHORT_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(short, exit, 16) }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.8, whiteSpace: "nowrap" }}>
          First, but <span style={{ color: ES.red }}>{MAJORITY - FIRST.seats} seats short</span> of {MAJORITY}
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 4, whiteSpace: "nowrap" }}>
          {MAJORITY} of {TOTAL} is a majority: more than half of Congress
        </div>
      </div>
    </>
  );
};
