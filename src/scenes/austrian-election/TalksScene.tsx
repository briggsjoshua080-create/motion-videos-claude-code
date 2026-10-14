import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, DAYS, GOVERNMENT_SEATS, HAIR, PALETTE as C, partyColor, type SceneProps } from "./constants";
import { Badge, Card } from "./ui";

const TIMELINE = { top: 650, height: 318, row: 80 } as const;
/** The Chancellor's card; it stays on screen into the President scene. */
export const CHANCELLOR_CARD = { top: 986, height: 188 } as const;

type Party = Parameters<typeof partyColor>[0];
const NAMES: Record<Party, string> = { fpo: "FPÖ", ovp: "ÖVP", spo: "SPÖ", neos: "NEOS", greens: "Greens" };

/** The Chancellor as a generic cartoon (no likeness): grey hair, dark suit, red tie. */
export const Chancellor: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg={AT.redSoft} palette={C} clothes={AT.suit} tie={AT.red} hair={HAIR.grey} hairStyle="short" id={id} />
);

export const ChancellorCard: React.FC<{ cardP: number; nameP: number; id: string }> = ({ cardP, nameP, id }) => (
  <NameCard
    top={CHANCELLOR_CARD.top}
    height={CHANCELLOR_CARD.height}
    role="FEDERAL CHANCELLOR"
    name="Christian Stocker"
    sub="ÖVP · leads the government"
    cardP={cardP}
    nameP={nameP}
    palette={C}
    portrait={<Chancellor size={124} id={id} />}
  />
);

/** One round of talks: the parties, when, and how it ended. */
const Round: React.FC<{ parties: Party[]; when: string; ok: boolean; p: number; mark: number; extra?: string; i: number }> = ({ parties, when, ok, p, mark, extra, i }) => (
  <div
    style={{
      position: "absolute",
      left: 36,
      right: 36,
      top: 72 + i * TIMELINE.row,
      height: TIMELINE.row,
      display: "flex",
      alignItems: "center",
      gap: 18,
      borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
      opacity: Math.min(1, p * 1.4),
      transform: `translateX(${(1 - p) * 40}px)`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: 392 }}>
      {parties.map((party, k) => (
        <React.Fragment key={party}>
          {k > 0 ? <span style={{ fontSize: 28, fontWeight: 800, color: C.muted }}>+</span> : null}
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>
            <span style={{ width: 18, height: 18, borderRadius: 9, background: partyColor(party) }} />
            {NAMES[party]}
          </span>
        </React.Fragment>
      ))}
    </div>
    <div style={{ flex: 1, fontSize: 25, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>{when}</div>
    {extra ? <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", opacity: Math.min(1, mark * 1.4) }}>{extra}</div> : null}
    <Badge size={52} ok={ok} p={mark} />
  </div>
);

/**
 * "Two rounds of talks failed, then three other parties teamed up under Chancellor Christian Stocker."
 * The half-circle (CouncilLayer) shrinks to the top; the three rounds of talks (two fail); the new
 * government's 110 seats light up; the Chancellor's card comes in and stays for the President scene.
 */
export const TalksScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 2);
  const rounds = [pop(frame, cue("talks", "Two") - 4), pop(frame, cue("talks", "of") - 4), pop(frame, cue("talks", "then") - 2)];
  const marks = [pop(frame, cue("talks", "failed") - 6), pop(frame, cue("talks", "failed") + 2), pop(frame, cue("talks", "teamed") - 2)];
  const chancellor = pop(frame, cue("talks", "Chancellor") - 6);
  const name = progress(frame, cue("talks", "Christian") - 2, cue("talks", "Stocker", "end"));
  const note = rise(frame, cue("talks", "teamed") + 4);

  return (
    <>
      <Card top={TIMELINE.top} height={TIMELINE.height} style={{ padding: "26px 36px", ...riseStyle(card, exit) }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: C.muted }}>COALITION TALKS</div>
        <Round i={0} parties={["ovp", "spo", "neos"]} when="until Jan 2025" ok={false} p={rounds[0]} mark={marks[0]} />
        <Round i={1} parties={["fpo", "ovp"]} when="until Feb 2025" ok={false} p={rounds[1]} mark={marks[1]} />
        <Round i={2} parties={["ovp", "spo", "neos"]} when="Mar 2025" ok p={rounds[2]} mark={marks[2]} extra={`${GOVERNMENT_SEATS} seats`} />
      </Card>

      <ChancellorCard cardP={chancellor} nameP={name} id="chancellor-talks" />

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: CHANCELLOR_CARD.top + CHANCELLOR_CARD.height + 16,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 25,
          fontWeight: 600,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(note, exit, 12),
        }}
      >
        Day <span style={{ color: AT.red, fontWeight: 800 }}>{DAYS}</span>: a record · first 3-party government since 1947
      </div>
    </>
  );
};
