import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { UK as MAP } from "../../components/uk";
import { DrawnCross, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_TOTAL, PALETTE as C, UK, type SceneProps } from "./constants";
import { AREA_DOTS } from "./areas";
import { Card, UkMap, mapScale } from "./ui";

/** The map: big while the 650 areas appear, then small in the top-left corner beside the ballot. */
const BIG = { height: 800, left: 404, top: 386 } as const;
const SMALL = { height: 330, left: 132, top: 372 } as const;

/** "Your area": the dot closest to the middle of England. */
const [MID_X, MID_Y] = MAP.regions.find((r) => r.name === "England")!.centre;
const YOURS = AREA_DOTS.reduce((best, d, i) => (Math.hypot(d.x - MID_X, d.y - MID_Y) < Math.hypot(AREA_DOTS[best].x - MID_X, AREA_DOTS[best].y - MID_Y) ? i : best), 0);

const BALLOT = { left: 120, top: 736, width: 840, height: 500, header: 84 } as const;
const ROW_H = 102;
const ROWS = [
  { party: "Party A", tint: "#C9D3EA", name: 230 },
  { party: "Party B", tint: "#F4D9B0", name: 190 },
  { party: "Party C", tint: "#CFE6D9", name: 250 },
  { party: "Party D", tint: "#E8D1E4", name: 205 },
];
const CHOSEN = 1;
const BOX = { x: 700, size: 70 } as const;
const boxCentre = {
  x: BALLOT.left + BOX.x + BOX.size / 2,
  y: BALLOT.top + BALLOT.header + 14 + CHOSEN * ROW_H + ROW_H / 2,
};
/** Polling station pencils hang on a string: it is tied off-card on the right. */
const STRING_ANCHOR = { x: 1010, y: 640 } as const;
const PENCIL_LENGTH = 300;

/**
 * "The UK has 650 areas. In each, you put one cross next to one candidate."
 * 650 dots fill the map (by population: dense in England, sparse in Scotland); then one area's
 * ballot paper, and a polling-station pencil on a string draws the cross.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const dots = progress(frame, cue("ballot", "has") - 4, cue("ballot", "areas", "end"));
  const counter = rise(frame, cue("ballot", "650") - 6);
  const shrink = progress(frame, cue("ballot", "In") - 6, cue("ballot", "In") + 12);
  const yours = pop(frame, cue("ballot", "each") - 2);
  const ballot = rise(frame, cue("ballot", "In") + 2);

  const reach = progress(frame, cue("ballot", "put") - 8, cue("ballot", "cross") - 1);
  const mark = progress(frame, cue("ballot", "cross"), cue("ballot", "next", "end") + 2);
  const leave = progress(frame, cue("ballot", "one#2"), cue("ballot", "candidate", "end"));
  const chosen = pop(frame, cue("ballot", "candidate") - 4);

  const h = interpolate(shrink, [0, 1], [BIG.height, SMALL.height]);
  const left = interpolate(shrink, [0, 1], [BIG.left, SMALL.left]);
  const top = interpolate(shrink, [0, 1], [BIG.top, SMALL.top]);
  const k = mapScale(h);
  const shown = dots * (COMMONS_TOTAL + 1);
  const you = AREA_DOTS[YOURS];

  const tipX = interpolate(reach, [0, 1], [1040, boxCentre.x - 6]) + leave * 260;
  const tipY = interpolate(reach, [0, 1], [1180, boxCentre.y + 8]) + leave * 160 + Math.sin(mark * Math.PI * 8) * 5 * (1 - leave);
  const endX = tipX + PENCIL_LENGTH * Math.cos((38 * Math.PI) / 180);
  const endY = tipY - PENCIL_LENGTH * Math.sin((38 * Math.PI) / 180);
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  return (
    <>
      {/* The map with one dot per area */}
      <div style={{ position: "absolute", left, top, opacity: Math.min(1, mapIn * 1.4) * (1 - exit), transform: `translateY(${(1 - mapIn) * 40}px)` }}>
        <UkMap height={h} fill={() => C.paperDeep} stroke={C.white} strokeWidth={4}>
          {AREA_DOTS.map((d, i) => {
            const v = Math.min(1, Math.max(0, shown - i));
            if (v <= 0) return null;
            const isYours = i === YOURS && yours > 0;
            return <circle key={i} cx={d.x} cy={d.y} r={(4.6 + 1.6 * shrink) * v} fill={isYours ? UK.gold : UK.commons} opacity={isYours ? 1 : 1 - 0.55 * yours} />;
          })}
          {/* Pulse around "your area" */}
          <circle cx={you.x} cy={you.y} r={14 + 26 * yours} fill="none" stroke={UK.goldDeep} strokeWidth={5} opacity={Math.min(1, yours) * (1 - exit)} />
        </UkMap>
      </div>

      {/* 650 areas */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 380,
          fontFamily: theme.font,
          color: C.ink,
          opacity: Math.min(1, counter * 1.4) * (1 - shrink) * (1 - exit),
          transform: `translateY(${(1 - counter) * 30}px)`,
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: UK.commons }}>{Math.round(COMMONS_TOTAL * dots)}</div>
        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>areas</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft, marginTop: 4 }}>called constituencies</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1146,
          width: 340,
          fontFamily: theme.font,
          fontSize: 27,
          fontWeight: 600,
          lineHeight: 1.3,
          color: C.inkSoft,
          opacity: Math.min(1, counter) * (1 - shrink) * (1 - exit),
        }}
      >
        Each has about the same number of voters
      </div>

      {/* Your area: one seat */}
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 452,
          width: 600,
          fontFamily: theme.font,
          opacity: Math.min(1, yours * 1.4) * (1 - exit),
          transform: `translateX(${(1 - yours) * 40}px)`,
        }}
      >
        <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 12, background: UK.gold, color: C.ink, fontSize: 30, fontWeight: 800, letterSpacing: 3 }}>
          YOUR AREA
        </div>
        <div style={{ marginTop: 14, fontSize: 46, fontWeight: 800, letterSpacing: -1, color: C.ink, lineHeight: 1.1 }}>1 area = 1 seat</div>
        <div style={{ marginTop: 8, fontSize: 30, fontWeight: 600, color: C.inkSoft }}>in the House of Commons</div>
      </div>

      {/* The ballot paper */}
      <Card left={BALLOT.left} top={BALLOT.top} width={BALLOT.width} height={BALLOT.height} style={{ overflow: "hidden", ...riseStyle(ballot, exit) }}>
        <div
          style={{
            height: BALLOT.header,
            background: C.ink,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 34px",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          <div style={{ letterSpacing: 4 }}>BALLOT PAPER</div>
          <div>
            Vote for <span style={{ color: UK.gold }}>ONE</span> candidate
          </div>
        </div>
        {ROWS.map((row, i) => {
          const y = BALLOT.header + 14 + i * ROW_H;
          const isChosen = i === CHOSEN;
          return (
            <div key={row.party} style={{ position: "absolute", left: 0, top: y, width: BALLOT.width, height: ROW_H }}>
              {i > 0 ? <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 2, background: C.line }} /> : null}
              <div style={{ position: "absolute", left: 36, top: 24, width: row.name, height: 18, borderRadius: 9, background: C.ink, opacity: 0.75 }} />
              <div style={{ position: "absolute", left: 36, top: 52, fontSize: 28, fontWeight: 700, color: C.inkSoft }}>{row.party}</div>
              <div
                style={{
                  position: "absolute",
                  left: 560,
                  top: 20,
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  background: row.tint,
                  border: `3px solid ${C.ink}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 800,
                  color: C.ink,
                }}
              >
                {row.party.slice(-1)}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: BOX.x,
                  top: (ROW_H - BOX.size) / 2,
                  width: BOX.size,
                  height: BOX.size,
                  borderRadius: 8,
                  border: `4px solid ${C.ink}`,
                  boxSizing: "border-box",
                  background: C.card,
                }}
              >
                {isChosen ? (
                  <div style={{ position: "absolute", left: 3, top: 3 }}>
                    <DrawnCross size={56} p={mark} color={C.ink} stroke={6} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {/* Highlight on the chosen candidate */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: BALLOT.header + 14 + CHOSEN * ROW_H + 6,
            width: BALLOT.width - 36,
            height: ROW_H - 12,
            borderRadius: 16,
            border: `5px solid ${UK.gold}`,
            boxSizing: "border-box",
            opacity: Math.min(1, chosen * 1.4),
            transform: `scale(${0.94 + 0.06 * chosen})`,
          }}
        />
      </Card>

      {/* The pencil, on its string */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: pencilOn }}>
        <path
          d={`M${endX} ${endY} Q${(endX + STRING_ANCHOR.x) / 2} ${Math.max(endY, STRING_ANCHOR.y) + 90} ${STRING_ANCHOR.x} ${STRING_ANCHOR.y}`}
          fill="none"
          stroke={C.inkSoft}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: pencilOn }}>
        <RedPencil length={PENCIL_LENGTH} palette={C} color={UK.gold} lead={C.ink} />
      </div>
    </>
  );
};
