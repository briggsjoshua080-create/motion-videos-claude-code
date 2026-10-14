import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FIRST, PALETTE as C, PL, RESULT_2023, SEJM_MAJORITY, SEJM_POSE, SEJM_TOTAL, type SceneProps } from "./constants";
import { Pill } from "./ui";

const POSE = SEJM_POSE.result;
const CALLBACK_TOP = POSE.cy + 26;
const TABLE = { top: CALLBACK_TOP + 84, height: 176 } as const;
const SHORT_TOP = TABLE.top + TABLE.height + 26;
/** Biggest first: Law and Justice, then the others as they fill in. */
const TABLE_ORDER = [...RESULT_2023].sort((a, b) => b.seats - a.seats);

/**
 * "In 2023, Law and Justice came first, but without a majority."
 * Seats, counter and majority line are in SejmLayer; this scene adds the election date, PiS's votes vs
 * seats, the full result and how far PiS is from a majority.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const date = pop(frame, cue("result", "2023") - 4);
  const dateOut = progress(frame, cue("result", "first") - 8, cue("result", "first") - 2);
  const callback = pop(frame, cue("result", "first") - 2);
  const table = rise(frame, cue("result", "Law") - 4);
  const firstCol = pop(frame, cue("result", "Law") + 2);
  const others = progress(frame, cue("result", "without") - 4, cue("result", "majority") + 2);
  const short = pop(frame, cue("result", "majority") - 4);

  return (
    <>
      {/* The election date, then PiS's votes vs seats */}
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - Math.max(dateOut, exit) }}>
        <Pill p={date} bg={C.ink} color={C.white} size={32}>
          Sejm election · 15 Oct 2023 · 74% turnout
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={callback} bg={C.card} color={C.ink} border={FIRST.color} size={32} style={{ boxShadow: "0 10px 26px rgba(20,32,43,0.12)" }}>
          PiS: <span style={{ color: FIRST.color }}>{Math.round(FIRST.votes)}% of votes</span> → <span style={{ color: FIRST.color }}>{FIRST.seats} of {SEJM_TOTAL} seats</span>
        </Pill>
      </div>

      {/* The full result: seats and votes per party */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: TABLE.top,
          height: TABLE.height,
          borderRadius: 24,
          background: C.card,
          boxShadow: "0 18px 44px rgba(20,32,43,0.12)",
          display: "flex",
          padding: "0 14px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          ...riseStyle(table, exit, 30),
        }}
      >
        {TABLE_ORDER.map((p, i) => {
          const v = p === FIRST ? firstCol : Math.min(1, Math.max(0, others * (TABLE_ORDER.length - 1) - (i - 1)));
          return (
            <div
              key={p.key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderLeft: i === 0 ? "none" : `2px solid ${C.line}`,
                opacity: Math.min(1, v * 1.4),
                transform: `translateY(${(1 - v) * 16}px)`,
              }}
            >
              <div style={{ width: 54, height: 10, borderRadius: 5, background: p.color, marginBottom: 8 }} />
              <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 50, fontWeight: 800, color: p.color, letterSpacing: -1.5, lineHeight: 1.05 }}>{p.seats}</div>
              <div style={{ fontSize: 23, fontWeight: 700, color: C.inkSoft }}>{p.votes.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>

      {/* Short of a majority */}
      <div style={{ position: "absolute", left: 120, width: 840, top: SHORT_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={short} bg={PL.redSoft} color={PL.redDeep} border={PL.red} size={32}>
          PiS: {SEJM_MAJORITY - FIRST.seats} seats short of a majority ({SEJM_MAJORITY})
        </Pill>
      </div>
    </>
  );
};
