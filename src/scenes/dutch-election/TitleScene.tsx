import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { NETHERLANDS } from "../../components/netherlands";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, type SceneProps } from "./constants";

const MAP = { height: 560, top: 300 } as const;
const MAP_W = (MAP.height * NETHERLANDS.width) / NETHERLANDS.height;
const MAP_LEFT = 540 - MAP_W / 2;
const k = MAP.height / NETHERLANDS.height;

/** "How do the Dutch choose who runs their country?" — map in the flag colours plus the title. */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map and title are already on screen at frame 0, so the thumbnail is never empty.
  const mapIn = rise(frame, -18);
  const pin = pop(frame, cue("hook", "Dutch") - 2);
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const [hx, hy] = NETHERLANDS.theHague;

  return (
    <>
      <div style={{ position: "absolute", left: MAP_LEFT, top: MAP.top, opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})` }}>
        <svg width={MAP_W} height={MAP.height} viewBox={`0 0 ${NETHERLANDS.width} ${NETHERLANDS.height}`} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="nl-map">
              <path d={NETHERLANDS.d} />
            </clipPath>
          </defs>
          <g clipPath="url(#nl-map)">
            {C.flag.map((color, i) => (
              <rect
                key={`${color}-${i}`}
                x={0}
                y={(i * NETHERLANDS.height) / 3}
                width={NETHERLANDS.width}
                height={NETHERLANDS.height / 3 + 1}
                fill={color}
              />
            ))}
          </g>
          <path d={NETHERLANDS.d} fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        </svg>
      </div>

      {/* The Hague: seat of parliament and government */}
      <div
        style={{
          position: "absolute",
          left: MAP_LEFT + hx * k - 14,
          top: MAP.top + hy * k - 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: Math.min(1, pin * 1.4) * (1 - exit),
          transform: `scale(${pin})`,
          transformOrigin: "14px 14px",
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 14, background: C.accent, border: `5px solid ${C.ink}`, boxSizing: "border-box" }} />
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 12,
            background: C.card,
            boxShadow: "0 8px 20px rgba(20,33,61,0.18)",
            fontFamily: theme.font,
            fontSize: 32,
            fontWeight: 800,
            color: C.ink,
            whiteSpace: "nowrap",
          }}
        >
          The Hague
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 910,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 6,
          color: C.alert,
          ...riseStyle(kicker, exit, 30),
        }}
      >
        EXPLAINED IN ONE MINUTE
      </div>
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 120,
          width: 840,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: -2.5,
          lineHeight: 1.02,
          color: C.ink,
          ...riseStyle(title, exit, 40),
        }}
      >
        Dutch election system
      </div>
    </>
  );
};
