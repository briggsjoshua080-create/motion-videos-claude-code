import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { SPAIN as MAP_DATA } from "../../components/spain";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ES, FIRST, PALETTE as C, PSOE, type SceneProps } from "./constants";
import { PrimeMinister } from "./characters";
import { Card, QuestionMark, SpainFlagMap } from "./ui";

const MAP_H = 330;
const MAP_W = (MAP_H * MAP_DATA.width) / MAP_DATA.height;
const MAP = { left: 540 - MAP_W / 2, top: 470 } as const;
const CARD = { top: 860, height: 380 } as const;

/**
 * "In 2023, this party came first in Spain. But this man became prime minister. How?"
 * The title over Spain in the flag's colours, and the puzzle: the People's Party with its "1st" badge
 * on the left, a man from another party (the Socialists) as prime minister on the right, then "?".
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The map, title and card are already on screen at frame 0, so the thumbnail is never empty.
  const kicker = rise(frame, -26);
  const title = rise(frame, -22);
  const mapIn = rise(frame, -18);
  const card = rise(frame, cue("hook", "party") - 10);
  const partyIn = pop(frame, cue("hook", "party") - 4);
  const first = pop(frame, cue("hook", "first") - 3);
  const man = pop(frame, cue("hook", "man") - 4);
  const pm = pop(frame, cue("hook", "prime") - 3);
  const how = pop(frame, cue("hook", "How") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 300, textAlign: "center", fontFamily: theme.font }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.alert, whiteSpace: "nowrap", ...riseStyle(kicker, exit, 30) }}>
          EXPLAINED IN ONE MINUTE
        </div>
        <div style={{ marginTop: 12, fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", ...riseStyle(title, exit, 40) }}>
          Who runs Spain?
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
        <SpainFlagMap width={MAP_W} id="title-map" />
      </div>

      <Card top={CARD.top} height={CARD.height} style={{ padding: "28px 36px", ...riseStyle(card, exit) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted, whiteSpace: "nowrap" }}>ELECTION · 2023</div>

        {/* Left: the party that came first */}
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 84,
            width: 360,
            height: 250,
            borderRadius: 22,
            background: "#E3F0FA",
            border: `4px solid ${FIRST.color}`,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: Math.min(1, partyIn * 1.4),
            transform: `scale(${0.7 + 0.3 * partyIn})`,
          }}
        >
          <div style={{ width: 96, height: 96, borderRadius: 24, background: FIRST.color, color: C.white, fontSize: 46, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
            PP
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>People's Party</div>
          <div
            style={{
              position: "absolute",
              right: -22,
              top: -26,
              padding: "8px 18px",
              borderRadius: 999,
              background: ES.yellow,
              color: C.ink,
              fontSize: 30,
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(20,32,43,0.2)",
              opacity: Math.min(1, first * 1.4),
              transform: `scale(${Math.max(0, first)}) rotate(8deg)`,
            }}
          >
            1st
          </div>
        </div>

        {/* Arrow */}
        <svg width={60} height={40} viewBox="0 0 60 40" style={{ position: "absolute", left: 410, top: 190, opacity: Math.min(1, man * 1.4) }}>
          <path d="M4 20 H50 M38 8 L52 20 L38 32" fill="none" stroke={C.muted} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Right: the prime minister, from another party */}
        <div
          style={{
            position: "absolute",
            right: 36,
            top: 84,
            width: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: Math.min(1, man * 1.4),
            transform: `scale(${0.7 + 0.3 * man})`,
          }}
        >
          <PrimeMinister size={170} id="pm-title" />
          <div
            style={{
              padding: "6px 18px",
              borderRadius: 12,
              background: PSOE.color,
              color: C.white,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 2,
              whiteSpace: "nowrap",
              opacity: Math.min(1, pm * 1.4),
              transform: `scale(${0.6 + 0.4 * pm})`,
            }}
          >
            PRIME MINISTER
          </div>
        </div>

        <QuestionMark size={112} p={how} style={{ right: -18, top: -52, transform: `scale(${Math.max(0, how)}) rotate(${(1 - how) * -30 + 8}deg)` }} />
      </Card>
    </>
  );
};
