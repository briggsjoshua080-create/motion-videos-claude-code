import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { Character } from "../../../components/explainer/Character";
import { DrawnArrow } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { CARD_SHADOW, EU, HAIR, PALETTE as C, type SceneProps } from "../constants";
import { Pill } from "../ui";
import { PeopleGrid } from "./people";

const GRID = { top: 446, size: 84, gap: 10 } as const;
const CANDIDATE = { left: 160, top: 940, width: 760, height: 190 } as const;

const CompassIcon: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 44 44">
    <circle cx={22} cy={22} r={19} fill={C.card} stroke={C.ink} strokeWidth={3.5} />
    <path d="M22 7 L27 22 L22 37 L17 22 Z" fill={EU.yellow} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M22 22 L27 22 L22 37 L17 22 Z" fill={EU.blue} />
    <circle cx={22} cy={22} r={3} fill={C.ink} />
  </svg>
);

/** The candidate for Commission President, as a generic cartoon politician (no real likeness). */
export const CandidatePortrait: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character
    id={id}
    size={size}
    bg={EU.bluePale}
    palette={C}
    outfit="suit"
    clothes={EU.navy}
    tie={EU.yellow}
    hair={HAIR.light}
    hairStyle="bob"
  />
);

/**
 * "Its President is proposed by the leaders of the 27 countries, who set the EU's direction."
 * 27 national leaders (the European Council) propose a candidate for Commission President.
 */
export const LeadersScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const candidate = pop(frame, cue("leaders", "President") - 4);
  const title = rise(frame, cue("leaders", "leaders") - 8);
  const wave = (i: number) => pop(frame, cue("leaders", "leaders") - 6 + (i % 9) * 1.5 + Math.floor(i / 9) * 3);
  const arrow = progress(frame, cue("leaders", "27") - 2, cue("leaders", "countries") + 6);
  const propose = pop(frame, cue("leaders", "countries"));
  const direction = pop(frame, cue("leaders", "who") - 4);

  return (
    <>
      <div style={{ position: "absolute", top: 352, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, ...riseStyle(title, exit, 24) }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 4, color: C.ink }}>THE 27 NATIONAL LEADERS</div>
        <div style={{ fontSize: 27, fontWeight: 600, color: C.inkSoft, marginTop: 4 }}>presidents and prime ministers · the "European Council"</div>
      </div>

      <div style={{ position: "absolute", top: GRID.top, left: 540 - (9 * GRID.size + 8 * GRID.gap) / 2, opacity: 1 - exit }}>
        <PeopleGrid seed="leader" size={GRID.size} gap={GRID.gap} p={wave} />
      </div>

      <div style={{ position: "absolute", top: 744, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={direction} bg={C.card} border={C.line} size={32} style={{ boxShadow: CARD_SHADOW, display: "flex", alignItems: "center", gap: 14 }}>
          <CompassIcon />
          <span>
            They set the <span style={{ color: EU.blue }}>EU's direction</span>
          </span>
        </Pill>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <DrawnArrow x1={540} y1={830} x2={540} y2={CANDIDATE.top - 16} p={arrow} color={C.ink} width={6} />
      </svg>
      <div style={{ position: "absolute", left: 572, top: 846, opacity: 1 - exit }}>
        <Pill p={propose} bg={EU.yellow} color={C.ink} size={30}>
          propose
        </Pill>
      </div>

      <div
        style={{
          position: "absolute",
          left: CANDIDATE.left,
          top: CANDIDATE.top,
          width: CANDIDATE.width,
          height: CANDIDATE.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "0 34px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, candidate * 1.4) * (1 - exit),
          transform: `translateY(${(1 - candidate) * 40 - exit * 40}px) scale(${0.92 + 0.08 * candidate})`,
        }}
      >
        <CandidatePortrait size={130} id="candidate-leaders" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft }}>Candidate for</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: -1 }}>Commission President</div>
        </div>
      </div>
    </>
  );
};
