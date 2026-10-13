import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { UK as MAP } from "../../components/uk";
import { UnionFlag } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_TOTAL, PALETTE as C, UK, WINNER, type SceneProps } from "./constants";
import { Card, CardTitle } from "./ui";

const MAP_BOX = { left: 124, top: 336, height: 590 } as const;
const MAP_W = (MAP.width * MAP_BOX.height) / MAP.height;
const STATS = { top: 950, height: 290 } as const;
const SEAT_SHARE = Math.round((100 * WINNER.seats) / COMMONS_TOTAL);
const VOTE_SHARE = Math.round(WINNER.votes);

/** One share bar: label, track with fill, and a counting percentage. */
const ShareRow: React.FC<{ label: string; value: number; p: number; color: string }> = ({ label, value, p, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, height: 84 }}>
    <div style={{ width: 230, fontSize: 36, fontWeight: 800, color: C.ink }}>{label}</div>
    <div style={{ position: "relative", flex: 1, height: 46, borderRadius: 12, background: C.paperDeep }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${value * p}%`, borderRadius: 12, background: color }} />
    </div>
    <div style={{ width: 150, textAlign: "right", fontSize: 64, fontWeight: 800, letterSpacing: -2, color: C.ink, opacity: Math.min(1, p * 4) }}>
      {Math.round(value * p)}%
    </div>
  </div>
);

/**
 * "One party won almost two-thirds of the seats with a third of the votes. How?"
 * The UK in the Union flag, the title, and the two shares counting up as they are spoken.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const mapIn = rise(frame, -18);
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const card = rise(frame, -14);
  const seats = progress(frame, cue("hook", "two-thirds") - 4, cue("hook", "seats", "end") + 4);
  const votes = progress(frame, cue("hook", "third") - 4, cue("hook", "votes", "end") + 4);
  const how = pop(frame, cue("hook", "How") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: MAP_BOX.left, top: MAP_BOX.top, opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})` }}>
        <svg width={MAP_W} height={MAP_BOX.height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="uk-map">
              <path d={MAP.d} />
            </clipPath>
          </defs>
          <g clipPath="url(#uk-map)">
            <UnionFlag x={0} y={0} width={MAP.width} height={MAP.height} blue={UK.blue} white={C.white} red={UK.red} id="title-map" />
          </g>
          <path d={MAP.d} fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 472, top: 470, width: 488, fontFamily: theme.font }}>
        <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>EXPLAINED IN ONE MINUTE</div>
        <div style={{ marginTop: 14, fontSize: 96, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: C.ink, ...riseStyle(title, exit, 40) }}>
          UK election system
        </div>
      </div>

      <Card top={STATS.top} height={STATS.height} style={{ padding: "30px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>ONE PARTY · JULY 2024</CardTitle>
        <div style={{ marginTop: 18 }}>
          <ShareRow label="Seats" value={SEAT_SHARE} p={seats} color={UK.blue} />
          <ShareRow label="Votes" value={VOTE_SHARE} p={votes} color={UK.gold} />
        </div>
        {/* "How?" */}
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
            boxShadow: "0 14px 34px rgba(14,26,58,0.25)",
            opacity: Math.min(1, how * 1.4),
            transform: `scale(${how}) rotate(${(1 - how) * -30 + 8}deg)`,
          }}
        >
          ?
        </div>
      </Card>
    </>
  );
};
