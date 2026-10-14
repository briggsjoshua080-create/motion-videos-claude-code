import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle } from "../../components/Hemicycle";
import { NameCard } from "../../components/explainer/NameCard";
import { BallotBoxIcon, DrawnCross } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, CHAMBER_DOT, CHAMBER_POSE, GOVERNMENTS, IT, PALETTE as C, SENATE_TOTAL, SENATE_WINNER_SEATS, WINNER, type SceneProps } from "./constants";
import { GovernmentCount, GovernmentTiles, TILES_WIDTH } from "./GovernmentTiles";
import { SENATE_SEATS } from "./HousesScene";
import { PM_CARD, PrimeMinister } from "./ResultScene";
import { Badge, Pill } from "./ui";

const CHAMBER = CHAMBER_POSE.support;
const SENATE = { cx: 780, cy: CHAMBER.cy, s: CHAMBER.s } as const;
/** The links from each house down to the government. */
const LINK_Y = { from: CHAMBER.cy + 62, to: PM_CARD.top - 10 } as const;
const linkPath = (x: number) => `M${x} ${LINK_Y.from} C${x} ${LINK_Y.from + 120} ${540} ${LINK_Y.to - 120} ${540} ${LINK_Y.to}`;

/**
 * "Both houses must back her. If that breaks, the President can name a new one, with no new vote.
 * That's how Italy got to 68." The Chamber (ChamberLayer) and the Senate each back the prime
 * minister; the backing breaks, a new prime minister comes in without an election, and the 68
 * governments come back.
 */
export const SupportScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const houses = rise(frame, 4);
  const links = progress(frame, cue("support", "Both") - 2, cue("support", "back") + 2);
  const ticks = pop(frame, cue("support", "back") - 2);
  const breaks = progress(frame, cue("support", "breaks") - 2, cue("support", "breaks") + 8);
  const snapped = pop(frame, cue("support", "breaks") + 2);
  const fall = progress(frame, cue("support", "breaks") + 2, cue("support", "President") + 2);
  const newPm = pop(frame, cue("support", "new") - 4);
  const newName = progress(frame, cue("support", "new") - 2, cue("support", "one") + 6);
  const ballot = pop(frame, cue("support", "no") - 6);
  const cross = progress(frame, cue("support", "no") - 2, cue("support", "vote", "end") + 2);
  const recap = rise(frame, cue("support", "That's") - 4);
  const housesOut = progress(frame, cue("support", "That's") - 8, cue("support", "That's"));

  const linkColor = interpolateColors(breaks, [0, 1], [IT.green, IT.red]);
  const top = Math.max(housesOut, exit);

  return (
    <>
      {/* The Senate (the Chamber is ChamberLayer): the centre-right's 115 seats in blue */}
      <div style={{ position: "absolute", inset: 0, opacity: houses * (1 - top) }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${SENATE.cx - 540}px, ${SENATE.cy - 830}px) scale(${SENATE.s})`,
            transformOrigin: "540px 830px",
          }}
        >
          <Hemicycle seats={SENATE_SEATS} cx={540} cy={830} dot={CHAMBER_DOT * 1.15} fill={(i) => (i >= SENATE_TOTAL - SENATE_WINNER_SEATS ? WINNER.color : IT.seat)} />
        </div>
      </div>
      {[
        { cx: CHAMBER.cx, name: "Chamber", color: IT.chamber },
        { cx: SENATE.cx, name: "Senate", color: IT.senate },
      ].map((h) => (
        <div key={h.name} style={{ position: "absolute", left: h.cx - 150, width: 300, top: CHAMBER.cy + 10, textAlign: "center", fontFamily: theme.font, fontSize: 34, fontWeight: 800, color: h.color, ...riseStyle(houses, top, 16) }}>
          {h.name}
        </div>
      ))}

      {/* Each house backs the government: green links that snap red when the backing breaks */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - top }}>
        {[CHAMBER.cx, SENATE.cx].map((x) => (
          <path
            key={x}
            d={linkPath(x)}
            pathLength={1}
            fill="none"
            stroke={linkColor}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={breaks > 0 ? `${0.42 - 0.1 * breaks} ${0.16 + 0.2 * breaks} 1` : "1 2"}
            strokeDashoffset={breaks > 0 ? 0 : 1 - links}
            opacity={links > 0.01 ? 1 : 0}
          />
        ))}
      </svg>
      {/* A badge halfway down each link (the middle of the curve) */}
      {[CHAMBER.cx, SENATE.cx].map((x) => (
        <div key={x} style={{ position: "absolute", left: (x + 540) / 2 - 33, top: (LINK_Y.from + LINK_Y.to) / 2 - 33 }}>
          <Badge size={66} ok={breaks < 0.5} p={(breaks < 0.5 ? ticks : snapped) * (1 - top)} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 120, width: 840, top: LINK_Y.from + 26, display: "flex", justifyContent: "center", opacity: 1 - top }}>
        <Pill p={ticks * (1 - breaks)} bg={IT.greenSoft} color={IT.greenDeep} size={28} style={{ letterSpacing: 2 }}>
          CONFIDENCE VOTE
        </Pill>
      </div>

      {/* The prime minister falls; the President names a new one */}
      <NameCard
        top={PM_CARD.top}
        height={PM_CARD.height}
        role="PRIME MINISTER"
        name="Giorgia Meloni"
        sub="since October 2022"
        cardP={1}
        nameP={1}
        exitP={fall}
        palette={C}
        portrait={<PrimeMinister size={130} bg={IT.greenSoft} id="pm-support" />}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          top: PM_CARD.top,
          width: 800,
          height: PM_CARD.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "0 40px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, newPm * 1.4) * (1 - exit),
          transform: `translateX(${(1 - newPm) * 120}px) scale(${0.92 + 0.08 * newPm})`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 26, bottom: 26, width: 10, borderRadius: "0 6px 6px 0", background: C.alert }} />
        {/* A new face: a silhouette with a question mark */}
        <div style={{ width: 130, height: 130, borderRadius: 65, background: C.paperDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 80, fontWeight: 800, color: C.muted }}>?</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: C.alert }}>NEW PRIME MINISTER</div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1, color: C.ink, whiteSpace: "nowrap", opacity: newName, clipPath: `inset(0 ${(1 - newName) * 100}% 0 0)` }}>
            named by the President
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>backed by the same parliament</div>
        </div>
      </div>

      {/* With no new vote */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: PM_CARD.top + PM_CARD.height + 18,
          display: "flex",
          justifyContent: "center",
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "8px 30px 8px 12px",
            borderRadius: 999,
            background: C.card,
            boxShadow: "0 10px 26px rgba(20,32,43,0.12)",
            border: `3px solid ${C.alert}`,
            fontFamily: theme.font,
            fontSize: 32,
            fontWeight: 800,
            color: C.alert,
            whiteSpace: "nowrap",
            opacity: Math.min(1, ballot * 1.4),
            transform: `scale(${0.6 + 0.4 * ballot})`,
          }}
        >
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <BallotBoxIcon size={64} palette={C} />
            <div style={{ position: "absolute", left: 2, top: 2 }}>
              <DrawnCross size={60} p={cross} color={C.alert} stroke={6} />
            </div>
          </div>
          NO NEW ELECTION
        </div>
      </div>

      {/* That's how Italy got to 68 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 560,
          width: 840,
          height: 268,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          padding: "26px 40px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          ...riseStyle(recap, exit, 40),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 200 }}>
            <GovernmentCount value={GOVERNMENTS} />
          </div>
          <div style={{ width: TILES_WIDTH }}>
            <GovernmentTiles shown={GOVERNMENTS} today={1} />
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 28, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>
          e.g. 2018–2022: <span style={{ color: C.ink, fontWeight: 800 }}>one parliament, 3 governments</span>
        </div>
      </div>
    </>
  );
};
