import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DENMARK as MAP_DATA } from "../../components/denmark";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, GOVERNMENT_SEATS, MAJORITY, PALETTE as C, TOTAL, type SceneProps } from "./constants";
import { Badge, Card, CardTitle, DenmarkFlagMap, QuestionMark } from "./ui";

const MAP_H = 380;
const MAP_W = (MAP_H * MAP_DATA.width) / MAP_DATA.height;
const MAP = { left: 540 - MAP_W / 2, top: 470 } as const;
const STATS = { top: 920, height: 320 } as const;
/** The seat bar inside the card. */
const BAR = { left: 40, width: 760, top: 182, height: 46 } as const;
const perSeat = BAR.width / TOTAL;

/**
 * "Denmark's government has just 82 of 179 seats. And that's normal. Why?"
 * The title over Denmark in the Dannebrog's colours, and the puzzle: the government's 82 seats fill a
 * 179-seat bar but stop short of the 90-seat majority mark; "normal" gets a tick, "Why?" the red "?".
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const mapIn = rise(frame, -18);
  const card = rise(frame, -14);
  const fill = progress(frame, cue("hook", "82") - 6, cue("hook", "seats") + 2);
  const count = Math.round(GOVERNMENT_SEATS * fill);
  const total = pop(frame, cue("hook", "179") - 2);
  const mark = pop(frame, cue("hook", "seats") - 2);
  const normal = pop(frame, cue("hook", "normal") - 3);
  const why = pop(frame, cue("hook", "Why") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 300, textAlign: "center", fontFamily: theme.font }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 12, fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", ...riseStyle(title, exit, 40) }}>
          Who runs Denmark?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: MAP.left,
          top: MAP.top,
          opacity: Math.min(1, mapIn) * (1 - exit),
          transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})`,
          filter: "drop-shadow(0 18px 26px rgba(20,32,43,0.16))",
        }}
      >
        <DenmarkFlagMap width={MAP_W} id="title-map" />
      </div>

      <Card top={STATS.top} height={STATS.height} style={{ padding: "28px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>THE GOVERNMENT'S SEATS</CardTitle>
        <div style={{ position: "absolute", left: 40, top: 76, display: "flex", alignItems: "baseline", gap: 14, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: DK.red }}>{count}</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, opacity: Math.min(1, total * 1.4) }}>of {TOTAL}</div>
        </div>

        {/* The 179-seat bar: the government's share, and the majority mark at 90 */}
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: C.paperDeep, overflow: "hidden" }}>
          <div style={{ width: perSeat * GOVERNMENT_SEATS * fill, height: "100%", background: DK.red }} />
        </div>
        <div style={{ position: "absolute", left: BAR.left + perSeat * MAJORITY - 2, top: BAR.top - 14, width: 4, height: BAR.height + 28, background: C.ink, opacity: Math.min(1, mark * 1.4) }} />
        <div
          style={{
            position: "absolute",
            left: BAR.left + perSeat * MAJORITY - 120,
            width: 240,
            top: BAR.top + BAR.height + 18,
            textAlign: "center",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 2,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: Math.min(1, mark * 1.4),
            transform: `scale(${0.7 + 0.3 * mark})`,
          }}
        >
          MAJORITY · {MAJORITY}
        </div>

        {/* "And that's normal." */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 84,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: Math.min(1, normal * 1.4),
            transform: `scale(${0.6 + 0.4 * normal})`,
            transformOrigin: "100% 50%",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>normal</div>
          <Badge size={56} ok p={normal} />
        </div>

        <QuestionMark size={112} p={why} style={{ right: -18, top: -52, transform: `scale(${Math.max(0, why)}) rotate(${(1 - why) * -30 + 8}deg)` }} />
      </Card>
    </>
  );
};
