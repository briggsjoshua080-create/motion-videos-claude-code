import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { BallotBoxIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, DAYS, PALETTE as C, type SceneProps } from "./constants";
import { AustriaFlagMap, Card, CardTitle, CabinetIcon } from "./ui";

const MAP = { left: 120, top: 486, width: 840 } as const;
const STATS = { top: 948, height: 296 } as const;
/** The timeline inside the card: from the election to the new government. */
const LINE = { left: 318, width: 400, y: 152 } as const;

/** One end of the timeline: an icon in a circle, a date and what happened. */
const Stop: React.FC<{ x: number; p: number; on: number; icon: React.ReactNode; date: string; label: string }> = ({ x, p, on, icon, date, label }) => (
  <div
    style={{
      position: "absolute",
      left: x - 90,
      top: LINE.y - 44,
      width: 180,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: Math.min(1, p * 1.4),
      transform: `scale(${0.7 + 0.3 * p})`,
    }}
  >
    <div
      style={{
        width: 88,
        height: 88,
        borderRadius: 44,
        background: interpolateColors(on, [0, 1], [C.paperDeep, AT.redSoft]),
        border: `4px solid ${interpolateColors(on, [0, 1], [C.line, AT.red])}`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div style={{ marginTop: 10, fontSize: 25, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>{date}</div>
    <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

/**
 * "It took Austria 155 days to get a government. Why?"
 * The title over Austria in the flag's stripes, and a counter running from the election
 * (29 Sep 2024) to the new government (3 Mar 2025).
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const mapIn = rise(frame, -18);
  const card = rise(frame, -14);
  const count = progress(frame, cue("hook", "155") - 4, cue("hook", "days", "end") + 4);
  const counter = rise(frame, cue("hook", "155") - 6);
  const govt = pop(frame, cue("hook", "government") - 3);
  const why = pop(frame, cue("hook", "Why") - 3);

  const fill = LINE.width * count;

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 300, textAlign: "center", fontFamily: theme.font }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 12, fontSize: 90, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", ...riseStyle(title, exit, 40) }}>
          Who runs Austria?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: MAP.left,
          top: MAP.top,
          opacity: Math.min(1, mapIn) * (1 - exit),
          transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})`,
          filter: "drop-shadow(0 18px 26px rgba(20,32,43,0.14))",
        }}
      >
        <AustriaFlagMap width={MAP.width} id="title-map" />
      </div>

      <Card top={STATS.top} height={STATS.height} style={{ padding: "28px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>FROM ELECTION TO GOVERNMENT</CardTitle>
        {/* The day counter */}
        <div style={{ position: "absolute", left: 40, top: 86, width: 230, color: C.ink, transform: `scale(${0.92 + 0.08 * counter})`, transformOrigin: "0 50%" }}>
          <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95, color: AT.red }}>{Math.round(DAYS * count)}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.inkSoft, marginTop: 2 }}>days</div>
        </div>
        {/* Election -> government */}
        <div style={{ position: "absolute", left: LINE.left, top: LINE.y - 4, width: LINE.width, height: 8, borderRadius: 4, background: C.line }} />
        <div style={{ position: "absolute", left: LINE.left, top: LINE.y - 4, width: fill, height: 8, borderRadius: 4, background: AT.red }} />
        <Stop x={LINE.left} p={1} on={Math.min(1, count * 8)} icon={<BallotBoxIcon size={58} palette={C} />} date="29 Sep 2024" label="election" />
        <Stop x={LINE.left + LINE.width} p={Math.max(govt, 0.35)} on={govt} icon={<CabinetIcon size={54} />} date="3 Mar 2025" label="new government" />
        {/* Why? */}
        <div
          style={{
            position: "absolute",
            right: -18,
            top: -48,
            width: 112,
            height: 112,
            borderRadius: 56,
            background: C.alert,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 84,
            fontWeight: 800,
            boxShadow: "0 14px 34px rgba(20,32,43,0.25)",
            opacity: Math.min(1, why * 1.4),
            transform: `scale(${why}) rotate(${(1 - why) * -30 + 8}deg)`,
          }}
        >
          ?
        </div>
      </Card>
    </>
  );
};
