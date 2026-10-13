import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter } from "../../lib/animation";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { DrawnPath, NL, SAFE, SceneFrame, SceneHeader, Stamp, countTo, pop, progress, type SceneProps } from "./ui";

const SENATE_SEATS = hemicycleSeats(75, 5, 130, 290);
const SENATE = { cx: 540, cy: 680, dot: 15 } as const;

/** The 12 provinces, as council-hall tiles in two rows of six. */
const TILE = { w: 112, h: 100, step: 140, firstX: 190, rowsY: [860, 985] } as const;
const TILES = TILE.rowsY.flatMap((y, row) => Array.from({ length: 6 }, (_, i) => ({ x: TILE.firstX + i * TILE.step, y, n: row * 6 + i })));
const ARROWS_X = [330, 540, 750];

const CouncilHall: React.FC = () => (
  <svg width={64} height={60} viewBox="0 0 64 60">
    <path d="M32 4 L60 20 L4 20 Z" fill={NL.white} />
    {[10, 22, 36, 48].map((x) => (
      <rect key={x} x={x} y={24} width={6} height={24} rx={2} fill={NL.white} />
    ))}
    <rect x={4} y={50} width={56} height={7} rx={3} fill={NL.white} />
    <path d="M32 4 L32 -8 L42 -4 L32 0" fill={NL.orange} />
  </svg>
);

/** "The 75 senators? Provincial councils choose them, not the people directly." */
export const SenateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const sweep = ease(frame, [cue("senate", "75") - 4, cue("senate", "senators", "end")]);
  const counter = enter(frame, cue("senate", "75") - 6);
  const tilesAt = cue("senate", "Provincial") - 4;
  const caption = enter(frame, tilesAt + 6);
  const arrows = progress(frame, cue("senate", "choose") - 4, cue("senate", "them") + 6);
  const stamp = enter(frame, cue("senate", "not") - 2, { damping: 10, stiffness: 220 });

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="PARLIAMENT" title="THE SENATE" />

      <Hemicycle
        seats={SENATE_SEATS}
        cx={SENATE.cx}
        cy={SENATE.cy}
        dot={SENATE.dot}
        fill={() => NL.sky}
        visible={(i) => sweep * (SENATE_SEATS.length + 1) - i}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: SENATE.cy - 112,
          textAlign: "center",
          fontFamily: theme.font,
          color: NL.white,
          opacity: counter,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>{countTo(75, sweep)}</div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 5, color: NL.mist }}>SEATS</div>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {ARROWS_X.map((x) => (
          <g key={x}>
            <DrawnPath d={`M${x} ${TILE.rowsY[0] - 70} L${x} ${SENATE.cy + 46}`} p={arrows} color={NL.orangeLight} width={10} />
            <path
              d={`M${x - 22} ${SENATE.cy + 66} L${x} ${SENATE.cy + 40} L${x + 22} ${SENATE.cy + 66}`}
              fill="none"
              stroke={NL.orangeLight}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={arrows > 0.95 ? 1 : 0}
            />
          </g>
        ))}
      </svg>

      {TILES.map(({ x, y, n }) => {
        const p = pop(frame, tilesAt + n * 2);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: x - TILE.w / 2,
              top: y - TILE.h / 2,
              width: TILE.w,
              height: TILE.h,
              borderRadius: 22,
              background: `linear-gradient(160deg, ${NL.blue}, ${NL.navy})`,
              border: `3px solid ${NL.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.min(1, p * 1.4),
              transform: `scale(${p})`,
              boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
            }}
          >
            <CouncilHall />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: TILE.rowsY[1] + 70,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 44,
          fontWeight: 900,
          color: NL.orangeLight,
          opacity: caption,
          transform: `translateY(${(1 - caption) * 20}px)`,
        }}
      >
        12 PROVINCIAL COUNCILS
      </div>

      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.width, top: SENATE.cy - 285, display: "flex", justifyContent: "center" }}>
        <Stamp text="NO DIRECT VOTE" p={stamp} size={66} rotate={-8} />
      </div>
    </SceneFrame>
  );
};
