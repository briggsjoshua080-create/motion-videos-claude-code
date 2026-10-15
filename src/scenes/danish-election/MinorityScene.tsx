import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, GOVERNMENT_SEATS, MAJORITY, OPPOSITION_SEATS, PALETTE as C, POSE, RESULT_2026, TOTAL, type SceneProps } from "./constants";
import { Badge, Card } from "./ui";

const P = POSE.minority;
const LEGEND_TOP = P.cy + 16;
const CARD = { top: LEGEND_TOP + 64, height: 300 } as const;
const NOTE_TOP = CARD.top + CARD.height + 22;
const BAR = { left: 36, width: 768, height: 34 } as const;
const perSeat = BAR.width / TOTAL;
const GOVERNMENT = RESULT_2026.filter((p) => p.side === "gov");

/** One side of the vote: a bar of seats against the 90-seat mark, and what it means. */
const Side: React.FC<{ top: number; label: string; seats: number; color: string; fill: number; p: number; verdict: string; verdictP: number; ok: boolean }> = ({
  top,
  label,
  seats,
  color,
  fill,
  p,
  verdict,
  verdictP,
  ok,
}) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, height: 120, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * 40}px)` }}>
    <div style={{ position: "absolute", left: BAR.left, right: 36, top: 0, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color }}>{seats}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 24, fontWeight: 800, color: ok ? C.ink : DK.redDeep, whiteSpace: "nowrap", opacity: Math.min(1, verdictP * 1.4) }}>{verdict}</div>
      <Badge size={44} ok={ok} p={verdictP} />
    </div>
    <div style={{ position: "absolute", left: BAR.left, top: 58, width: BAR.width, height: BAR.height, borderRadius: 10, background: C.paperDeep, overflow: "hidden" }}>
      <div style={{ width: perSeat * seats * fill, height: "100%", background: color }} />
    </div>
    <div style={{ position: "absolute", left: BAR.left + perSeat * MAJORITY - 2, top: 50, width: 4, height: BAR.height + 16, background: C.ink }} />
  </div>
);

/**
 * "It runs the country without a majority behind it, as long as no majority votes against it."
 * The half-circle (FolketingLayer) keeps only the government's 82 seats lit, then shows the
 * opposition's 77. The card compares both with the 90-seat majority: not enough to back it, and not
 * enough to vote it out, so it governs (negative parliamentarism, Constitution §15).
 */
export const MinorityScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const legend = rise(frame, cue("minority", "runs") - 4);
  const card = rise(frame, cue("minority", "without") - 8);
  const row1 = pop(frame, cue("minority", "without") - 6);
  const fill1 = progress(frame, cue("minority", "without") - 4, cue("minority", "majority") + 6);
  const verdict1 = pop(frame, cue("minority", "behind") - 2);
  const row2 = pop(frame, cue("minority", "no") - 6);
  const fill2 = progress(frame, cue("minority", "no") - 4, cue("minority", "votes") + 2);
  const verdict2 = pop(frame, cue("minority", "against") - 2);
  const mark = pop(frame, cue("minority", "without") - 2);
  const note = rise(frame, cue("minority", "against", "end"));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: LEGEND_TOP,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: theme.font,
          fontSize: 25,
          fontWeight: 800,
          color: C.ink,
          whiteSpace: "nowrap",
          ...riseStyle(legend, exit, 12),
        }}
      >
        {GOVERNMENT.map((p, k) => (
          <React.Fragment key={p.key}>
            {k > 0 ? <span style={{ color: C.muted }}>+</span> : null}
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: p.color }} />
              {p.key === "A" ? "Soc. Dem." : p.name}
            </span>
          </React.Fragment>
        ))}
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ padding: "22px 36px", ...riseStyle(card, exit) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted }}>THE RULE</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: C.ink, opacity: Math.min(1, mark * 1.4) }}>MAJORITY · {MAJORITY}</div>
        </div>
        <Side top={66} label="For the government" seats={GOVERNMENT_SEATS} color={DK.red} fill={fill1} p={row1} verdict="no majority" verdictP={verdict1} ok={false} />
        <Side top={176} label="Opposition" seats={OPPOSITION_SEATS} color={DK.against} fill={fill2} p={row2} verdict="can't vote it out" verdictP={verdict2} ok />
      </Card>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: NOTE_TOP,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 25,
          fontWeight: 600,
          color: C.inkSoft,
          lineHeight: 1.35,
          ...riseStyle(note, exit, 12),
        }}
      >
        It wins votes with help from other parties, deal by deal.
        <br />
        <span style={{ color: C.ink, fontWeight: 800 }}>Most Danish governments</span> have had no majority of their own.
      </div>
    </>
  );
};
