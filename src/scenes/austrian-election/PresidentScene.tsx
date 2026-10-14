import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { BallotBoxIcon, DrawnArrow, VoteOutIcon } from "../../components/explainer/icons";
import { pop, progress, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, HAIR, PALETTE as C, type SceneProps } from "./constants";
import { CHANCELLOR_CARD, ChancellorCard } from "./TalksScene";
import { Badge, CalendarIcon, Pill } from "./ui";

const PRESIDENT = { left: 124, top: 362, size: 236 } as const;
const FACTS = { left: 404, top: 362 } as const;
const CARD = { top: 640, height: 176 } as const;
/** The arrow from the President down to the Chancellor, and the labels beside it. */
const ARROW = { x: 250, from: CARD.top + CARD.height + 8, to: CHANCELLOR_CARD.top - 10 } as const;

const Fact: React.FC<{ top: number; p: number; exit: number; children: React.ReactNode }> = ({ top, p, exit, children }) => (
  <div
    style={{
      position: "absolute",
      left: FACTS.left,
      top,
      width: 550,
      display: "flex",
      alignItems: "center",
      gap: 18,
      fontFamily: theme.font,
      ...riseStyle(p, exit, 24),
    }}
  >
    {children}
  </div>
);

/**
 * "And the President? Elected by the people for six years, with a run-off if needed. Alexander Van der
 * Bellen appoints the Chancellor, and can even dismiss the government."
 * Cartoon President (no likeness), how he is elected, his name card, and his two big powers over the
 * government: appointing the Chancellor (card carried over from the talks) and dismissing it.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const president = pop(frame, cue("president", "And") - 4);
  const elected = pop(frame, cue("president", "Elected") - 4);
  const years = pop(frame, cue("president", "six") - 4);
  const runoff = pop(frame, cue("president", "run-off") - 4);
  const card = pop(frame, cue("president", "Alexander") - 6);
  const name = progress(frame, cue("president", "Alexander") - 2, cue("president", "Bellen", "end") + 2);
  const arrow = progress(frame, cue("president", "appoints") - 4, cue("president", "Chancellor") + 4);
  const appoints = pop(frame, cue("president", "appoints") - 2);
  const dismiss = pop(frame, cue("president", "dismiss") - 4);

  return (
    <>
      {/* The President: white hair, dark suit, a red-white-red pin (no real likeness) */}
      <div
        style={{
          position: "absolute",
          left: PRESIDENT.left,
          top: PRESIDENT.top,
          opacity: Math.min(1, president * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * president})`,
          filter: "drop-shadow(0 18px 30px rgba(20,32,43,0.18))",
        }}
      >
        <Character size={PRESIDENT.size} bg={AT.redSoft} palette={C} clothes={AT.suit} tie={AT.navy} hair={HAIR.white} hairStyle="side" id="president" />
        <div style={{ position: "absolute", left: PRESIDENT.size * 0.66, top: PRESIDENT.size * 0.79, width: 28, height: 18, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden", boxShadow: `0 0 0 2px ${C.white}` }}>
          {C.flag.map((color, i) => (
            <div key={`${color}-${i}`} style={{ flex: 1, background: color }} />
          ))}
        </div>
        <Badge size={64} ok p={elected} style={{ position: "absolute", right: -4, top: 2 }} />
      </div>

      {/* How he gets the job */}
      <Fact top={FACTS.top} p={elected} exit={exit}>
        <BallotBoxIcon size={76} palette={C} />
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8, lineHeight: 1.1 }}>
          Elected by
          <br />
          the people
        </div>
      </Fact>
      <Fact top={FACTS.top + 96} p={years} exit={exit}>
        <CalendarIcon size={70} label="6" />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>6 years</div>
          <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft }}>at most 2 terms in a row</div>
        </div>
      </Fact>
      <Fact top={FACTS.top + 180} p={runoff} exit={exit}>
        <div
          style={{
            width: 76,
            height: 70,
            borderRadius: 16,
            background: AT.red,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
            fontWeight: 900,
            letterSpacing: -0.5,
            flexShrink: 0,
          }}
        >
          50%
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, letterSpacing: -0.6 }}>More than half to win</div>
          <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft }}>or a run-off between the top two</div>
        </div>
      </Fact>

      <NameCard
        top={CARD.top}
        height={CARD.height}
        role="FEDERAL PRESIDENT"
        name="Alexander Van der Bellen"
        sub="head of state · re-elected in 2022"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
      />

      {/* He appoints the Chancellor, and can dismiss the government */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <DrawnArrow x1={ARROW.x} y1={ARROW.from} x2={ARROW.x} y2={ARROW.to} p={arrow} color={C.ink} width={6} />
      </svg>
      <div style={{ position: "absolute", left: ARROW.x + 36, top: ARROW.from + 14, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, opacity: 1 - exit }}>
        <Pill p={appoints} bg={C.ink} color={C.white} size={28} style={{ transformOrigin: "0 50%" }}>
          appoints the Chancellor ✓
        </Pill>
        <Pill p={dismiss} bg={AT.redSoft} color={AT.redDeep} border={AT.red} size={28} style={{ display: "flex", alignItems: "center", gap: 10, transformOrigin: "0 50%" }}>
          <VoteOutIcon size={32} palette={C} />
          can dismiss the government
        </Pill>
      </div>

      {/* Carried over from the talks: the Chancellor */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <ChancellorCard cardP={1} nameP={1} id="chancellor-president" />
      </div>
    </>
  );
};
