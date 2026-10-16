import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FIRST, MAJORITY, PALETTE as C, POSE, PT, RESULT_2025, TOTAL, type PartyKey, type SceneProps } from "./constants";
import { Pill } from "./ui";

const P = POSE.result;
const PILL_TOP = P.cy + 24;
const GRID = { top: PILL_TOP + 78, row: 52 } as const;
const SHORT_TOP = GRID.top + GRID.row * 3 + 30;
/** Short names for the result grid. */
const SHORT: Record<PartyKey, string> = {
  AD: "Dem. Alliance",
  CH: "Chega",
  PS: "Socialists",
  IL: "Liberal Init.",
  LIVRE: "Livre",
  CDU: "CDU",
  BE: "Left Bloc",
  PAN: "PAN",
  JPP: "JPP",
};
const GRID_ORDER = [...RESULT_2025].sort((a, b) => b.seats - a.seats);

/**
 * "In 2025, Prime Minister Montenegro's alliance won 91 seats, far short of a majority."
 * Seats, the 91 counter and the majority mark are in AssemblyLayer; this scene adds the election
 * date, the nine parties with their seats, and how far the winner is from 116.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const date = pop(frame, 2);
  const grid = progress(frame, 4, cue("result", "alliance") + 6);
  const focus = progress(frame, cue("result", "alliance") - 4, cue("result", "won") + 4);
  const short = rise(frame, cue("result", "short") - 2);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={date} bg={C.ink} color={C.white} size={30}>
          Election · 18 May 2025 · {RESULT_2025.length} parties got in
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
                background: p === FIRST ? "#FDE7D2" : C.card,
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
          First, but <span style={{ color: PT.red }}>{MAJORITY - FIRST.seats} seats short</span> of {MAJORITY}
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 4, whiteSpace: "nowrap" }}>
          AD = Social Democrats (PSD) + CDS · {MAJORITY} of {TOTAL} is a majority
        </div>
      </div>
    </>
  );
};
