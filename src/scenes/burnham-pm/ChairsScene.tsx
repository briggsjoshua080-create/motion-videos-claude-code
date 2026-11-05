import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { hemicycleSeats } from "../../components/Hemicycle";
import { COMMONS, LABOUR_SEATS, UK, type SceneProps } from "./constants";
import { Accent, Door, Headline, SectionNumeral } from "./ui";

const HEMI = { cx: 540, cy: 1110, rows: 12, rIn: 170, rOut: 410, dot: 6.2 } as const;
const SEATS = hemicycleSeats(COMMONS, HEMI.rows, HEMI.rIn, HEMI.rOut);
/** Seats ordered left to right by angle, so the biggest party fills from the left. */
const ORDER = SEATS.map((s, i) => ({ i, a: Math.atan2(s.y, s.x) })).sort((p, q) => p.a - q.a).map((s) => s.i);
const RANK = new Map(ORDER.map((seatIndex, rank) => [seatIndex, rank]));

/**
 * "Britons never vote for a PM. They elect MPs. The biggest party's leader gets the job." Section 01
 * sets the premise (musical chairs): NO VOTE / FOR PM on top; on "MPs" the 650 green seats of the
 * Commons build as a hemicycle (one chair each); on "biggest" the majority side turns red; on
 * "leader" No. 10's black door pops up in the middle: the chair at the top.
 */
export const ChairsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 4)];
  const build = progress(frame, cue("chairs", "elect") - 2, cue("chairs", "MPs", "end") + 4);
  const red = progress(frame, cue("chairs", "biggest") - 4, cue("chairs", "party's", "end"));
  const door = pop(frame, cue("chairs", "leader") - 3);

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 270, ...riseStyle(head[0], exit, 50) }}>
        NO VOTE
      </Headline>
      <Headline size={150} style={{ top: 270 + 152, ...riseStyle(head[1], exit, 50) }}>
        <Accent>FOR PM</Accent>
      </Headline>

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit, overflow: "visible" }}>
        {SEATS.map((s, i) => {
          const rank = RANK.get(i) ?? 0;
          const v = Math.min(1, Math.max(0, build * (COMMONS + 60) - rank) / 60);
          if (v <= 0) return null;
          const isLabour = rank < LABOUR_SEATS;
          const turn = isLabour ? Math.min(1, Math.max(0, red * (LABOUR_SEATS + 80) - rank) / 80) : 0;
          return (
            <circle
              key={i}
              cx={HEMI.cx + s.x}
              cy={HEMI.cy + s.y + (1 - v) * 16}
              r={HEMI.dot * (0.4 + 0.6 * v)}
              fill={turn > 0.5 ? UK.red : UK.greenLight}
              stroke={turn > 0.5 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)"}
              strokeWidth={1.2}
              opacity={v}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: Math.min(1, Math.max(0, door) * 1.6) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, door)) * 60}px) scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, door))})`,
          transformOrigin: "540px 1110px",
        }}
      >
        <Door width={180} number style={{ left: 450, top: 1110 - 288 }} />
      </div>
    </>
  );
};
