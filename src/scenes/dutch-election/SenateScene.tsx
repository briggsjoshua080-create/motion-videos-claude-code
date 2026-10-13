import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { BallotBoxIcon, CouncilIcon, DrawnArrow, DrawnCross, LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { NL, PALETTE as C, SENATE_POSE, type SceneProps } from "./constants";

const SENATE_SEATS = hemicycleSeats(75, 4, 95, 180);
const TILE = { w: 88, h: 80, step: 104, left: 352, rowsTop: [880, 975] } as const;
const TILES = TILE.rowsTop.flatMap((top, row) => Array.from({ length: 6 }, (_, i) => ({ x: TILE.left + i * TILE.step, top, n: row * 6 + i })));
const ARROWS = [
  { x1: 500, x2: 712 },
  { x1: 656, x2: 760 },
  { x1: 812, x2: 808 },
];

const Label: React.FC<{ x: number; name: string; count: number; p: number; exit: number }> = ({ x, name, count, p, exit }) => (
  <div
    style={{
      position: "absolute",
      left: x - 200,
      width: 400,
      top: SENATE_POSE.baseY + 22,
      textAlign: "center",
      fontFamily: theme.font,
      fontSize: 38,
      fontWeight: 800,
      color: C.ink,
      ...riseStyle(p, exit, 24),
    }}
  >
    {name} <span style={{ color: C.accentDeep }}>· {count}</span>
  </div>
);

/** "Then the 75 senators check every law, but they can only say yes or no. Provincial councils choose them, not you directly." */
export const SenateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const houseLabel = rise(frame, 12);
  const sweep = progress(frame, cue("senate", "75") - 4, cue("senate", "senators") + 8, Easing.inOut(Easing.cubic));
  const senateLabel = rise(frame, cue("senate", "senators") - 4);
  const fly = progress(frame, cue("senate", "check") - 4, cue("senate", "law") + 8);
  const yes = pop(frame, cue("senate", "yes") - 3);
  const no = pop(frame, cue("senate", "no") - 3);
  const note = rise(frame, cue("senate", "only") - 2);
  const decisionOut = progress(frame, cue("senateHow", "Provincial") - 8, cue("senateHow", "Provincial") + 2);
  const tilesAt = cue("senateHow", "Provincial") - 4;
  const arrows = progress(frame, cue("senateHow", "choose") - 6, cue("senateHow", "them") + 4);
  const ballot = pop(frame, cue("senateHow", "not") - 4);
  const cross = progress(frame, cue("senateHow", "not") - 1, cue("senateHow", "directly") + 4);

  const lawX = interpolate(fly, [0, 1], [SENATE_POSE.houseX, SENATE_POSE.senateX]);
  const lawY = 345 - Math.sin(fly * Math.PI) * 40;

  return (
    <>
      <Label x={SENATE_POSE.houseX} name="House" count={150} p={houseLabel} exit={exit} />

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Hemicycle
          seats={SENATE_SEATS}
          cx={SENATE_POSE.senateX}
          cy={SENATE_POSE.baseY}
          dot={11}
          fill={() => NL.red}
          visible={(i) => sweep * (SENATE_SEATS.length + 1) - i}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: SENATE_POSE.senateX - 100,
          width: 200,
          top: SENATE_POSE.baseY - 92,
          textAlign: "center",
          fontFamily: theme.font,
          color: C.ink,
          opacity: Math.min(1, sweep * 2) * (1 - exit),
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{Math.round(75 * sweep)}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft }}>senators</div>
      </div>
      <Label x={SENATE_POSE.senateX} name="Senate" count={75} p={senateLabel} exit={exit} />

      {/* A law travels from the House to the Senate */}
      <div
        style={{
          position: "absolute",
          left: lawX - 45,
          top: lawY - 45,
          opacity: Math.min(1, fly * 4) * (1 - exit),
          transform: `rotate(${(1 - fly) * -8}deg)`,
          filter: "drop-shadow(0 10px 16px rgba(20,33,61,0.2))",
        }}
      >
        <LawIcon size={90} palette={C} />
      </div>

      {/* Yes or no: the Senate can't change the law */}
      <div
        style={{
          position: "absolute",
          left: SENATE_POSE.senateX - 190,
          width: 380,
          top: SENATE_POSE.baseY + 96,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          fontFamily: theme.font,
          opacity: 1 - Math.max(decisionOut, exit),
        }}
      >
        {[
          { text: "YES ✓", bg: NL.blue, p: yes },
          { text: "NO ✗", bg: NL.red, p: no },
        ].map(({ text, bg, p }) => (
          <div
            key={text}
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              background: bg,
              color: C.white,
              fontSize: 36,
              fontWeight: 800,
              opacity: Math.min(1, p * 1.4),
              transform: `scale(${p})`,
            }}
          >
            {text}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: SENATE_POSE.senateX - 200,
          width: 400,
          top: SENATE_POSE.baseY + 186,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 600,
          color: C.inkSoft,
          opacity: note * (1 - Math.max(decisionOut, exit)),
        }}
      >
        but can't change it
      </div>

      {/* Provincial councils choose the senators */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        {ARROWS.map(({ x1, x2 }) => (
          <DrawnArrow key={x1} x1={x1} y1={TILE.rowsTop[0] - 16} x2={x2} y2={SENATE_POSE.baseY + 84} bend={(x2 - x1) * -0.2} p={arrows} color={C.accentDeep} width={6} />
        ))}
      </svg>
      {TILES.map(({ x, top, n }) => {
        const p = pop(frame, tilesAt + n * 2);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: x,
              top,
              width: TILE.w,
              height: TILE.h,
              borderRadius: 18,
              background: C.card,
              border: `2.5px solid ${C.line}`,
              boxShadow: "0 8px 20px rgba(20,33,61,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.min(1, p * 1.4) * (1 - exit),
              transform: `scale(${p})`,
            }}
          >
            <CouncilIcon size={56} palette={C} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: TILE.left - 20,
          width: 6 * TILE.step,
          top: TILE.rowsTop[1] + TILE.h + 24,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 40,
          fontWeight: 800,
          color: C.ink,
          ...riseStyle(rise(frame, tilesAt + 8), exit, 20),
        }}
      >
        12 provincial councils
      </div>

      {/* Not you directly */}
      <div
        style={{
          position: "absolute",
          left: 128,
          top: 880,
          width: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: theme.font,
          opacity: Math.min(1, ballot * 1.4) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * ballot})`,
        }}
      >
        <div style={{ position: "relative", width: 150, height: 150 }}>
          <BallotBoxIcon size={150} palette={C} />
          <div style={{ position: "absolute", left: 5, top: 5 }}>
            <DrawnCross size={140} p={cross} color={C.alert} stroke={5} />
          </div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.alert, textAlign: "center", lineHeight: 1.1 }}>
          No direct
          <br />
          vote
        </div>
      </div>
    </>
  );
};
