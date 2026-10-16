import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { BallotBoxIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTIONS, PALETTE as C, PT, type SceneProps } from "./constants";
import { Card, PortugalFlagMap, QuestionMark } from "./ui";

const MAP = { height: 380, top: 470 } as const;
const CARD = { top: 890, height: 350 } as const;
const COL_W = 240;

/**
 * "Portugal held three general elections in just over three years. Who keeps calling them?"
 * The title over mainland Portugal in the flag's colours, then three ballot boxes with the dates
 * (Jan 2022, Mar 2024, May 2025), a "3 years, 4 months" bracket, and a big "?".
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const mapIn = rise(frame, -18);
  const card = rise(frame, -14);
  const boxes = [cue("hook", "three") - 4, cue("hook", "general") - 2, cue("hook", "elections") - 2].map((t) => pop(frame, t));
  const span = progress(frame, cue("hook", "three#2") - 4, cue("hook", "years", "end"));
  const how = pop(frame, cue("hook", "calling") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 300, textAlign: "center", fontFamily: theme.font }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 12, fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", ...riseStyle(title, exit, 40) }}>
          Who runs Portugal?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - (MAP.height * 0.489) / 2,
          top: MAP.top,
          opacity: Math.min(1, mapIn) * (1 - exit),
          transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})`,
          filter: "drop-shadow(0 18px 26px rgba(20,32,43,0.16))",
        }}
      >
        <PortugalFlagMap height={MAP.height} id="title-map" />
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ ...riseStyle(card, exit) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted, whiteSpace: "nowrap" }}>GENERAL ELECTIONS</div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", justifyContent: "space-between" }}>
          {ELECTIONS.map((e, i) => {
            const p = boxes[i];
            return (
              <div
                key={e.date}
                style={{
                  width: COL_W,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: Math.min(1, Math.max(0, p) * 1.4),
                  transform: `translateY(${(1 - p) * 30}px) scale(${0.7 + 0.3 * p})`,
                }}
              >
                <BallotBoxIcon size={130} palette={C} mark={i === 2 ? PT.red : PT.green} />
                <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>{e.date}</div>
              </div>
            );
          })}
        </div>
        {/* The bracket: all three within 3 years and 4 months */}
        <svg width={840} height={60} style={{ position: "absolute", left: 0, top: 262, overflow: "visible" }}>
          <path d="M120 6 V22 H720 V6" fill="none" stroke={PT.red} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - span} opacity={span > 0.01 ? 1 : 0} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 292, textAlign: "center", fontSize: 30, fontWeight: 800, color: PT.red, opacity: Math.min(1, span * 1.6) }}>3 years and 4 months</div>

        <QuestionMark size={112} p={how} style={{ right: -18, top: -52, transform: `scale(${Math.max(0, how)}) rotate(${(1 - how) * -30 + 8}deg)` }} />
      </Card>
    </>
  );
};
