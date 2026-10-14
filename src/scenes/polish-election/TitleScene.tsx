import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { POLAND as MAP_DATA } from "../../components/poland";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FIRST, PALETTE as C, PL, type SceneProps } from "./constants";
import { Badge, CabinetIcon, Card, CardTitle, PolandFlagMap, QuestionMark } from "./ui";

const MAP_H = 440;
const MAP_W = (MAP_H * MAP_DATA.width) / MAP_DATA.height;
const MAP = { left: 540 - MAP_W / 2, top: 452 } as const;
const STATS = { top: 926, height: 304 } as const;

/** One half of the card: a small caps heading over its content. */
const Half: React.FC<{ left: number; width: number; title: string; children: React.ReactNode }> = ({ left, width, title, children }) => (
  <div style={{ position: "absolute", left, top: 88, width, height: 190, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3, color: C.inkSoft, whiteSpace: "nowrap" }}>{title}</div>
    {children}
  </div>
);

/**
 * "In 2023, Poland's ruling party won the most votes, and still lost power. How?"
 * The title over Poland in the flag's colours, and the puzzle: Law and Justice got the most votes
 * (tick) but lost power (the government icon greys out with a cross).
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const mapIn = rise(frame, -18);
  const card = rise(frame, -14);
  const share = progress(frame, cue("hook", "most") - 8, cue("hook", "votes", "end"));
  const tick = pop(frame, cue("hook", "votes") - 2);
  const lost = progress(frame, cue("hook", "lost") - 2, cue("hook", "power") + 4);
  const cross = pop(frame, cue("hook", "lost"));
  const lostLabel = pop(frame, cue("hook", "power") - 2);
  const how = pop(frame, cue("hook", "How") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 300, textAlign: "center", fontFamily: theme.font }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 12, fontSize: 90, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", ...riseStyle(title, exit, 40) }}>
          Who runs Poland?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: MAP.left,
          top: MAP.top,
          opacity: Math.min(1, mapIn) * (1 - exit),
          transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})`,
          filter: "drop-shadow(0 18px 26px rgba(20,32,43,0.16))",
        }}
      >
        <PolandFlagMap width={MAP_W} id="title-map" />
      </div>

      <Card top={STATS.top} height={STATS.height} style={{ padding: "28px 40px", ...riseStyle(card, exit) }}>
        <CardTitle>THE 2023 ELECTION</CardTitle>
        {/* Most votes: Law and Justice */}
        <Half left={20} width={380} title="MOST VOTES">
          <div style={{ position: "relative", marginTop: 8, display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: FIRST.color, transform: `scale(${1 + 0.08 * Math.sin(Math.PI * share)})`, transformOrigin: "50% 80%" }}>
              {Math.round(FIRST.votes)}
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, color: FIRST.color }}>%</div>
            <Badge size={58} ok p={tick} style={{ position: "absolute", right: -62, top: 4 }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>Law and Justice (PiS)</div>
        </Half>
        {/* Arrow */}
        <svg width={60} height={40} viewBox="0 0 60 40" style={{ position: "absolute", left: 392, top: 152 }}>
          <path d="M4 20 H50 M38 8 L52 20 L38 32" fill="none" stroke={C.muted} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* In power? */}
        <Half left={440} width={360} title="IN POWER?">
          <div
            style={{
              position: "relative",
              marginTop: 12,
              width: 104,
              height: 104,
              borderRadius: 52,
              background: interpolateColors(lost, [0, 1], ["#E3E7F4", C.paperDeep]),
              border: `5px solid ${interpolateColors(lost, [0, 1], [FIRST.color, C.muted])}`,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CabinetIcon size={64} chairs={interpolateColors(lost, [0, 1], [FIRST.color, C.muted])} />
            <Badge size={52} ok={false} p={cross} style={{ position: "absolute", right: -22, top: -10 }} />
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 32,
              fontWeight: 800,
              color: PL.redDeep,
              whiteSpace: "nowrap",
              opacity: Math.min(1, lostLabel * 1.4),
              transform: `scale(${0.7 + 0.3 * lostLabel})`,
            }}
          >
            lost power
          </div>
        </Half>
        {/* How? */}
        <QuestionMark size={112} p={how} style={{ right: -18, top: -48, transform: `scale(${Math.max(0, how)}) rotate(${(1 - how) * -30 + 8}deg)` }} />
      </Card>
    </>
  );
};
