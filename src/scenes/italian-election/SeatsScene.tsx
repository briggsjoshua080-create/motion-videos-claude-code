import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AREA_SEATS, CHAMBER_POSE, CHAMBER_SPLIT, IT, PALETTE as C, type SceneProps } from "./constants";
import { AREA_DOTS } from "./areas";
import { ItalyMap, mapScale } from "./ui";

const MAP_BOX = { left: 150, top: 352, height: 450 } as const;
/** "Your area" (from the ballot): the dot closest to Rome's latitude in the middle of the mainland. */
const YOURS = AREA_DOTS.reduce((best, d, i) => (Math.hypot(d.x - 380, d.y - 420) < Math.hypot(AREA_DOTS[best].x - 380, AREA_DOTS[best].y - 420) ? i : best), 0);
const LEGEND_TOP = CHAMBER_POSE.seats.cy + 18;

/**
 * "Each area's winner takes a seat. The rest are shared out by party votes."
 * 147 area dots fill the map; the 400-seat half-circle (ChamberLayer) builds below: the area winners,
 * then the seats shared out by party votes, then the 8 seats of Italians abroad.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const dots = progress(frame, cue("seats", "Each") - 6, cue("seats", "winner") + 2);
  const counter = rise(frame, cue("seats", "Each") - 4);
  const yours = pop(frame, cue("seats", "winner") - 2);
  const rule = rise(frame, cue("seats", "takes") - 4);
  const threshold = rise(frame, cue("seats", "party") - 4);
  const legend = [cue("seats", "winner") + 2, cue("seats", "shared") + 2, cue("seats", "votes") + 4].map((f) => pop(frame, f));

  const k = mapScale(MAP_BOX.height);
  const shown = dots * (AREA_SEATS + 1);
  const you = AREA_DOTS[YOURS];

  return (
    <>
      {/* The map with one dot per area */}
      <div style={{ position: "absolute", left: MAP_BOX.left, top: MAP_BOX.top, opacity: Math.min(1, mapIn * 1.4) * (1 - exit), transform: `translateY(${(1 - mapIn) * 40}px)` }}>
        <ItalyMap height={MAP_BOX.height} fill={C.line} stroke={C.white} strokeWidth={4}>
          {AREA_DOTS.map((d, i) => {
            const v = Math.min(1, Math.max(0, shown - i));
            if (v <= 0) return null;
            const isYours = i === YOURS && yours > 0;
            return <circle key={i} cx={d.x} cy={d.y} r={(4.6 / k) * v} fill={isYours ? IT.gold : IT.green} />;
          })}
          {/* Pulse around "your area" */}
          <circle cx={you.x} cy={you.y} r={(10 + 14 * yours) / k} fill="none" stroke={IT.goldDeep} strokeWidth={3 / k} opacity={Math.min(1, yours) * (1 - exit)} />
        </ItalyMap>
      </div>

      {/* 147 areas, the most votes wins */}
      <div style={{ position: "absolute", left: 540, top: 384, width: 420, fontFamily: theme.font, color: C.ink, ...riseStyle(counter, exit, 30) }}>
        <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: IT.green }}>{Math.round(AREA_SEATS * dots)}</div>
        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>voting areas</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 560, width: 420, fontFamily: theme.font, ...riseStyle(rule, exit, 20) }}>
        <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 12, background: IT.gold, color: C.ink, fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>IN EACH AREA</div>
        <div style={{ marginTop: 12, fontSize: 36, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.15, color: C.ink }}>most votes = 1 seat</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 704, width: 420, fontFamily: theme.font, fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: C.inkSoft, ...riseStyle(threshold, exit, 16) }}>
        Shared seats: a party needs <span style={{ color: C.ink, fontWeight: 800 }}>3%</span> of the votes (an alliance 10%)
      </div>

      {/* Legend under the half-circle */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: LEGEND_TOP,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          fontFamily: theme.font,
          fontSize: 27,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          opacity: 1 - exit,
        }}
      >
        {CHAMBER_SPLIT.map((g, i) => (
          <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 9, opacity: Math.min(1, legend[i] * 1.4), transform: `scale(${0.7 + 0.3 * legend[i]})` }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: g.color }} />
            <span style={{ color: C.ink, fontWeight: 800 }}>{g.seats}</span> {g.label}
          </div>
        ))}
      </div>
    </>
  );
};
