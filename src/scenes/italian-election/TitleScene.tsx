import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ITALY as MAP } from "../../components/italy";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { GOVERNMENTS, IT, PALETTE as C, type SceneProps } from "./constants";
import { GovernmentCount, GovernmentTiles } from "./GovernmentTiles";
import { Card, CardTitle } from "./ui";

const MAP_BOX = { left: 112, top: 334, height: 572 } as const;
const MAP_W = (MAP.width * MAP_BOX.height) / MAP.height;
const STATS = { top: 944, height: 300 } as const;

/**
 * "Italy has had 68 governments in 80 years. Who picks them?"
 * Italy in the tricolour, the title, and Italy's 68 governments since 1946 counting up as spoken.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const mapIn = rise(frame, -18);
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const card = rise(frame, -14);
  const count = progress(frame, cue("hook", "68") - 4, cue("hook", "governments", "end") + 6);
  const counter = rise(frame, cue("hook", "68") - 6);
  const years = rise(frame, cue("hook", "80") - 4);
  const today = progress(frame, cue("hook", "years") - 2, cue("hook", "years") + 10);
  const who = pop(frame, cue("hook", "Who") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: MAP_BOX.left, top: MAP_BOX.top, opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})` }}>
        <svg width={MAP_W} height={MAP_BOX.height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="italy-map">
              <path d={MAP.d} />
            </clipPath>
          </defs>
          <g clipPath="url(#italy-map)">
            {C.flag.map((color, i) => (
              <rect key={`${color}-${i}`} x={(i * MAP.width) / 3} y={0} width={MAP.width / 3 + 1} height={MAP.height} fill={color} />
            ))}
          </g>
          <path d={MAP.d} fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          {/* Rome */}
          <circle cx={MAP.rome[0]} cy={MAP.rome[1]} r={11} fill={C.ink} stroke={C.white} strokeWidth={5} />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 556, top: 470, width: 404, fontFamily: theme.font }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 14, fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, ...riseStyle(title, exit, 40) }}>
          Who runs Italy?
        </div>
      </div>

      <Card top={STATS.top} height={STATS.height} style={{ padding: "28px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>GOVERNMENTS SINCE 1946</CardTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22 }}>
          <div style={{ width: 200, opacity: Math.min(1, counter * 1.4), transform: `translateY(${(1 - counter) * 20}px)` }}>
            <GovernmentCount value={Math.round(GOVERNMENTS * count)} />
          </div>
          <div>
            {/* Placeholders first, then the governments fill in one by one */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
                <GovernmentTiles shown={GOVERNMENTS} />
              </div>
              <GovernmentTiles shown={count * (GOVERNMENTS + 1)} today={today} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 14,
                fontFamily: theme.font,
                fontSize: 26,
                fontWeight: 700,
                color: C.inkSoft,
                whiteSpace: "nowrap",
                ...riseStyle(years, exit, 14),
              }}
            >
              <span>1946</span>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.line }} />
              <span>2026</span>
              <span style={{ color: IT.greenDeep, fontWeight: 800 }}>· 80 years</span>
            </div>
          </div>
        </div>
        {/* "Who picks them?" */}
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
            opacity: Math.min(1, who * 1.4),
            transform: `scale(${who}) rotate(${(1 - who) * -30 + 8}deg)`,
          }}
        >
          ?
        </div>
      </Card>
    </>
  );
};
