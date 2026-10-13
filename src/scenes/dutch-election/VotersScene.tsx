import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter, float } from "../../lib/animation";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { NL, SAFE, SceneFrame, SceneHeader, countTo, pop, progress, type SceneProps } from "./ui";

/** House of Representatives: 150 seats. Shared with the 2025 result scene. */
export const HOUSE_SEATS = hemicycleSeats(150, 7, 170, 390);
export const HOUSE = { cx: 540, cy: 1110, dot: 14 } as const;

const BALLOT = { left: 150, top: 390, width: 340, height: 300 } as const;
const ROWS_Y = [92, 160, 228];
const CHOSEN = 1;

/** Dutch voters mark their ballot with a red pencil. Tip at (0, 0). */
const RedPencil: React.FC = () => (
  <svg width={1} height={1} style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
    <g transform="rotate(-38)">
      <path d="M0 0 L40 -15 L40 15 Z" fill={NL.paper} />
      <path d="M0 0 L14 -5 L14 5 Z" fill={NL.redBright} />
      <rect x={40} y={-15} width={190} height={30} rx={4} fill={NL.red} />
      <rect x={40} y={-15} width={190} height={10} rx={4} fill={NL.redBright} />
      <rect x={230} y={-15} width={26} height={30} rx={5} fill={NL.mist} />
    </g>
  </svg>
);

/** "Voters fill all 150 seats in the House of Representatives, at least every four years." */
export const VotersScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const ballot = enter(frame, 0);
  const fillAt = cue("voters", "fill");
  const reach = ease(frame, [2, fillAt - 2]);
  const mark = progress(frame, fillAt - 2, fillAt + 8);
  const leave = ease(frame, [fillAt + 14, fillAt + 34]);
  const sweep = ease(frame, [cue("voters", "150") - 4, cue("voters", "seats") + 18]);
  const counter = enter(frame, cue("voters", "150") - 6);
  const house = enter(frame, cue("voters", "House") - 4);
  const years = pop(frame, cue("voters", "least") - 4);

  const target = { x: BALLOT.left + 46, y: BALLOT.top + ROWS_Y[CHOSEN] };
  const tipX = interpolate(reach, [0, 1], [BALLOT.left + 420, target.x]) + leave * 260 + Math.sin(mark * Math.PI * 6) * 6 * (1 - leave);
  const tipY = interpolate(reach, [0, 1], [BALLOT.top + 330, target.y]) + leave * 120;

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="PARLIAMENT" title="THE VOTERS DECIDE" />

      <div
        style={{
          position: "absolute",
          left: BALLOT.left,
          top: BALLOT.top + float(frame, 5, 100),
          width: BALLOT.width,
          height: BALLOT.height,
          borderRadius: 26,
          background: NL.paper,
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          opacity: ballot,
          transform: `rotate(-3deg) translateY(${(1 - ballot) * 40}px)`,
          fontFamily: theme.font,
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 32, fontWeight: 900, letterSpacing: 4, color: NL.ink }}>BALLOT</div>
        {ROWS_Y.map((y, i) => (
          <div key={y} style={{ position: "absolute", left: 28, top: y - 18, display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `5px solid ${NL.ink}`,
                background: i === CHOSEN ? `rgba(229,64,75,${mark})` : "transparent",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ width: 200 - i * 30, height: 14, borderRadius: 7, background: NL.inkSoft, opacity: 0.45 }} />
              <div style={{ width: 120 + i * 20, height: 10, borderRadius: 5, background: NL.inkSoft, opacity: 0.25 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: ballot * (1 - leave) }}>
        <RedPencil />
      </div>

      {/* "At least every four years" calendar */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 410,
          width: 380,
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontFamily: theme.font,
          opacity: Math.min(1, years * 1.4),
          transform: `scale(${0.6 + 0.4 * years})`,
        }}
      >
        <div style={{ width: 150, height: 160, borderRadius: 26, background: NL.white, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.35)", flexShrink: 0 }}>
          <div style={{ height: 40, background: NL.red }} />
          <div style={{ fontSize: 96, fontWeight: 900, color: NL.ink, textAlign: "center", lineHeight: "116px" }}>4</div>
        </div>
        <div style={{ color: NL.white, fontSize: 40, fontWeight: 900, lineHeight: 1.1 }}>
          AT LEAST
          <br />
          EVERY 4
          <br />
          YEARS
        </div>
      </div>

      <Hemicycle
        seats={HOUSE_SEATS}
        cx={HOUSE.cx}
        cy={HOUSE.cy}
        dot={HOUSE.dot}
        fill={() => NL.white}
        visible={(i) => sweep * (HOUSE_SEATS.length + 1) - i}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: HOUSE.cy - 120,
          textAlign: "center",
          fontFamily: theme.font,
          color: NL.white,
          opacity: counter,
        }}
      >
        <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>{countTo(150, sweep)}</div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, color: NL.mist }}>SEATS</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: HOUSE.cy + 34,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 46,
          fontWeight: 900,
          color: NL.orangeLight,
          letterSpacing: 1,
          opacity: house,
          transform: `translateY(${(1 - house) * 20}px)`,
        }}
      >
        HOUSE OF REPRESENTATIVES
      </div>
    </SceneFrame>
  );
};
